import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const PROVIDER_ID = "study-language-ja:stroke-patterns";
const SCHEMA_ID = "japanese-core";
const SUPPORTED_LAYERS = new Set(["characters", "alt-characters"]);

async function loadPatterns(contentRoot) {
    const patterns = new Map();
    for (const layer of SUPPORTED_LAYERS) {
        const directory = path.join(contentRoot, layer);
        const files = (await readdir(directory))
            .filter((name) => name.endsWith(".json"))
            .sort();
        for (const name of files) {
            const records = JSON.parse(
                await readFile(path.join(directory, name), "utf8"),
            );
            for (const record of records) {
                const pattern = record.fields?.stroke_pattern;
                if (!pattern) continue;
                patterns.set(`${layer}\u0000${record.label.normalize()}`, {
                    entryId: record.id,
                    pattern,
                });
            }
        }
    }
    return patterns;
}

export function createStrokePatternProvider({ contentRoot, log }) {
    let patternsPromise;

    async function patterns() {
        patternsPromise ??= loadPatterns(contentRoot).catch((error) => {
            patternsPromise = undefined;
            log?.("error", "Japanese stroke pattern lookup failed.", {
                component: "study-language-ja",
                operation: "load_stroke_patterns",
                errorName: error?.name ?? "Error",
            });
            throw new Error("Japanese stroke pattern lookup failed.");
        });
        return patternsPromise;
    }

    return Object.freeze({
        id: PROVIDER_ID,
        supports(schema, layer) {
            return (
                schema?.id === SCHEMA_ID &&
                schema?.language === "ja" &&
                SUPPORTED_LAYERS.has(layer?.id) &&
                layer.fields?.some(
                    ({ id, type }) =>
                        id === "stroke_pattern" && type === "strokePattern",
                )
            );
        },
        async lookup({ layer, label }) {
            const normalizedLabel = String(label ?? "")
                .trim()
                .normalize();
            if (!normalizedLabel || !SUPPORTED_LAYERS.has(layer?.id)) return [];
            const result = (await patterns()).get(
                `${layer.id}\u0000${normalizedLabel}`,
            );
            if (!result) return [];
            return [
                {
                    provider: PROVIDER_ID,
                    fields: {
                        stroke_pattern: structuredClone(result.pattern),
                    },
                    provenance: `kanjivg:${result.entryId}`,
                    confidence: 1,
                },
            ];
        },
    });
}
