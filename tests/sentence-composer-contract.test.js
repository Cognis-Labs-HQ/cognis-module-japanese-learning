import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const libraryRoot = path.resolve(import.meta.dirname, "..", "data", "library");
const schema = JSON.parse(
    readFileSync(path.join(libraryRoot, "schema.json"), "utf8"),
);

function loadLayerRecords(layer) {
    const directory = path.join(libraryRoot, "content", layer);
    return readdirSync(directory)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .flatMap((name) =>
            JSON.parse(readFileSync(path.join(directory, name), "utf8")),
        );
}

test("sentence cards declare structure and punctuation carousels", () => {
    const sentenceLayer = schema.layers.find(({ id }) => id === "sentences");
    const constructor = sentenceLayer.cardConstructor;

    assert.deepEqual(constructor.input_carousels, ["words", "particles"]);
    assert.deepEqual(constructor.pronunciation_carousels, []);
    assert.deepEqual(constructor.tag_carousels, [
        {
            id: "sentence-structure",
            metadata: {
                labels: {
                    de: "Satzstruktur",
                    en: "Sentence Structure",
                    id: "Struktur Kalimat",
                    ja: "文の構造",
                },
            },
            relationship: "words",
            tag: "sentence-structure",
        },
    ]);
    assert.deepEqual(constructor.literal_carousels[0].values, [
        "。",
        "、",
        "？",
        "！",
    ]);
});

test("sentence-structure vocabulary is meaningful and used by sentences", () => {
    const words = loadLayerRecords("words");
    const sentences = loadLayerRecords("sentences");
    const structureWords = words.filter(({ tags = [] }) =>
        tags.includes("sentence-structure"),
    );

    assert.deepEqual(
        structureWords.map(({ label }) => label),
        ["です"],
    );
    for (const word of structureWords) {
        assert.equal(word.hidden, undefined);
        assert.equal(word.class, "lexical:copula");
        assert.ok(
            sentences.some(({ references }) =>
                references.some(
                    ({ entryId, relation }) =>
                        entryId === word.id && relation === "words",
                ),
            ),
            `${word.id} must be used by an authored sentence`,
        );
    }
});
