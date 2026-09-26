import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { sampleSvgPath } from "../api/svg-path-sampler.js";

const SOURCE_SIZE = 109;
const contentRoot = path.resolve("data/library/content");
const sourceRoot = path.resolve(process.argv[2] ?? "");

if (!process.argv[2]) {
    throw new Error(
        "Usage: node scripts/update-stroke-patterns.js <kanjivg/kanji>",
    );
}

function roundedCoordinate(value) {
    return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

async function characterStrokes(character, characterIndex, characterCount) {
    const codePoint = character.codePointAt(0).toString(16).padStart(5, "0");
    const svg = await readFile(
        path.join(sourceRoot, `${codePoint}.svg`),
        "utf8",
    );
    const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(
        ([, pathData]) => pathData,
    );
    if (!paths.length) throw new Error(`No strokes for U+${codePoint}`);
    return paths.map((pathData) => ({
        points: sampleSvgPath(pathData).map(({ x, y }, pointIndex) => ({
            x: roundedCoordinate(
                (characterIndex + x / SOURCE_SIZE) / characterCount,
            ),
            y: roundedCoordinate(y / SOURCE_SIZE),
            time: pointIndex * 40,
        })),
    }));
}

async function strokePattern(label) {
    const characters = [...label];
    const strokes = [];
    for (const [characterIndex, character] of characters.entries()) {
        strokes.push(
            ...(await characterStrokes(
                character,
                characterIndex,
                characters.length,
            )),
        );
    }
    return {
        coordinateSystem: "normalized",
        tolerance: 60,
        strokes,
    };
}

for (const layer of ["characters", "alt-characters"]) {
    const directory = path.join(contentRoot, layer);
    for (const file of (await readdir(directory))
        .filter((name) => name.endsWith(".json"))
        .sort()) {
        const filePath = path.join(directory, file);
        const records = JSON.parse(await readFile(filePath, "utf8"));
        for (const record of records) {
            record.fields.stroke_pattern = await strokePattern(record.label);
        }
        await writeFile(filePath, `${JSON.stringify(records, null, 4)}\n`);
    }
}
