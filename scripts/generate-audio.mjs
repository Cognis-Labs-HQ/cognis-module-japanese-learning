import { format, resolveConfig } from "prettier";
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { speechText } from "../api/audio/index.js";

const root = new URL("../", import.meta.url);
const voice = JSON.parse(
    await readFile(new URL("data/audio/voice.json", root), "utf8"),
);
const schema = JSON.parse(
    await readFile(new URL("data/library/schema.json", root), "utf8"),
);
const recordings = new Map();
for (const layer of schema.layers) {
    if (
        ![
            "atomicWritingUnit",
            "compoundWritingUnit",
            "lexicalUnit",
            "particle",
        ].includes(layer.semanticRole)
    )
        continue;
    const directory = new URL(`data/library/content/${layer.id}/`, root);
    for (const name of (await readdir(directory))
        .filter((name) => name.endsWith(".json"))
        .sort()) {
        const url = new URL(name, directory);
        const records = JSON.parse(await readFile(url, "utf8"));
        for (const record of records) {
            if (record.tags?.includes("punctuation")) continue;
            const readings = record.fields?.pronunciation;
            const text = speechText(
                {
                    language: voice.language,
                    label: record.label,
                    semanticRole: layer.semanticRole,
                    readings: Array.isArray(readings)
                        ? readings
                        : typeof readings === "string"
                          ? [readings]
                          : [],
                },
                voice,
            );
            const phonemes =
                voice.phonemeReadings &&
                ["compoundWritingUnit", "lexicalUnit"].includes(
                    layer.semanticRole,
                ) &&
                /^\/[^/]+\/$/u.test(readings?.[0] ?? "")
                    ? readings[0].slice(1, -1)
                    : undefined;
            const digest = createHash("sha256")
                .update(
                    `${voice.language}\0${text}${phonemes ? `\0${phonemes}` : ""}`,
                )
                .digest("hex");
            const path = `audio/${digest}.mp3`;
            record.fields = { ...record.fields, audio: path };
            const recording = recordings.get(path) ?? {
                path,
                language: voice.language,
                text,
                entries: [],
            };
            if (phonemes) recording.phonemes = phonemes;
            recording.entries.push(record.id);
            recordings.set(path, recording);
        }
        await writeFile(
            url,
            await format(JSON.stringify(records, null, 4), {
                ...(await resolveConfig(url.pathname)),
                parser: "json",
            }),
        );
    }
}
await mkdir(new URL("data/audio/", root), { recursive: true });
await writeFile(
    new URL("data/audio/recordings.json", root),
    JSON.stringify(
        {
            source: "pending-synthesis",
            format: "audio/mpeg",
            recordings: [...recordings.values()],
        },
        null,
        4,
    ) + "\n",
);
console.log(
    JSON.stringify({
        event: "audio_inventory_generated",
        recordings: recordings.size,
    }),
);
