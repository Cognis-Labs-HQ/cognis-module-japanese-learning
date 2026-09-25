import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { svgPathProperties } from "svg-path-properties";

const PROVIDER_ID = "study-language-ja:stroke-patterns";
const SCHEMA_ID = "japanese-core";
const SUPPORTED_LAYERS = new Set(["characters", "alt-characters"]);
const JAPANESE_WRITING_PATTERN =
    /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々〆ヶ]+$/u;
const DEFAULT_SOURCE_BASE_URL =
    "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";

function roundedCoordinate(value) {
    return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

function patternFromSvg(svg, characterIndex, characterCount) {
    const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(
        ([, pathData]) => pathData,
    );
    if (!paths.length || paths.length > 128)
        throw new Error("stroke_paths_invalid");
    return paths.map((pathData) => {
        const properties = new svgPathProperties(pathData);
        const length = properties.getTotalLength();
        const sampleCount = Math.max(4, Math.min(32, Math.ceil(length / 6)));
        return {
            points: Array.from({ length: sampleCount }, (_, pointIndex) => {
                const point = properties.getPointAtLength(
                    (length * pointIndex) / (sampleCount - 1),
                );
                return {
                    x: roundedCoordinate(
                        (characterIndex + point.x / 109) / characterCount,
                    ),
                    y: roundedCoordinate(point.y / 109),
                    time: pointIndex * 40,
                };
            }),
        };
    });
}

async function fetchPattern(label, fetchImplementation, sourceBaseUrl) {
    const characters = [...label];
    const strokes = [];
    const sourceUrls = [];
    for (const [characterIndex, character] of characters.entries()) {
        const codePoint = character
            .codePointAt(0)
            .toString(16)
            .padStart(5, "0");
        const sourceUrl = `${sourceBaseUrl}/${codePoint}.svg`;
        const response = await fetchImplementation(sourceUrl, {
            headers: { accept: "image/svg+xml" },
            signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error("stroke_source_request_failed");
        }
        const svg = await response.text();
        if (svg.length > 1_000_000) throw new Error("stroke_source_too_large");
        strokes.push(...patternFromSvg(svg, characterIndex, characters.length));
        sourceUrls.push(sourceUrl);
    }
    return {
        pattern: { coordinateSystem: "normalized", tolerance: 60, strokes },
        provenance: `kanjivg:${sourceUrls.join(",")}`,
    };
}

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

export function createStrokePatternProvider({
    contentRoot,
    log,
    fetchImplementation = globalThis.fetch,
    sourceBaseUrl = DEFAULT_SOURCE_BASE_URL,
}) {
    let patternsPromise;
    const remotePatterns = new Map();

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
            const packagedResult = (await patterns()).get(
                `${layer.id}\u0000${normalizedLabel}`,
            );
            if (packagedResult) {
                return [
                    {
                        provider: PROVIDER_ID,
                        fields: {
                            stroke_pattern: structuredClone(
                                packagedResult.pattern,
                            ),
                        },
                        provenance: `kanjivg:${packagedResult.entryId}`,
                        confidence: 1,
                    },
                ];
            }
            if (
                !JAPANESE_WRITING_PATTERN.test(normalizedLabel) ||
                typeof fetchImplementation !== "function"
            ) {
                return [];
            }
            let result;
            try {
                if (!remotePatterns.has(normalizedLabel)) {
                    remotePatterns.set(
                        normalizedLabel,
                        fetchPattern(
                            normalizedLabel,
                            fetchImplementation,
                            sourceBaseUrl,
                        ),
                    );
                }
                result = await remotePatterns.get(normalizedLabel);
            } catch (error) {
                remotePatterns.delete(normalizedLabel);
                log?.("error", "Japanese stroke source request failed.", {
                    component: "study-language-ja",
                    operation: "fetch_stroke_pattern",
                    label: normalizedLabel,
                    errorName: error?.name ?? "Error",
                });
                return [];
            }
            if (!result) return [];
            return [
                {
                    provider: PROVIDER_ID,
                    fields: {
                        stroke_pattern: structuredClone(result.pattern),
                    },
                    provenance: result.provenance,
                    confidence: 1,
                },
            ];
        },
    });
}
