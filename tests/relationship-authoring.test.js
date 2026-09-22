import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readJson(path) {
    return JSON.parse(
        readFileSync(new URL(`../${path}`, import.meta.url), "utf8"),
    );
}

const schema = readJson("data/library/schema.json");
const words = readJson("data/library/content/words/common.json");
const kanji = readJson("data/library/content/alt-characters/kanji.json");
const characters = [
    ...readJson("data/library/content/characters/hiragana.json"),
    ...readJson("data/library/content/characters/hiragana-variants.json"),
];
const particles = readJson("data/library/content/particles/common.json");
const recordsById = new Map(
    [...words, ...kanji, ...characters, ...particles].map((entry) => [
        entry.id,
        entry,
    ]),
);

function labelsFor(entry, relations) {
    return entry.references
        .filter(({ relation }) => relations.includes(relation))
        .sort((left, right) => left.position - right.position)
        .map(({ entryId }) => recordsById.get(entryId).label)
        .join("");
}

test("fields publish provider-owned editor controls", () => {
    for (const layer of schema.layers) {
        const relationshipIds = new Set(
            (layer.relationships ?? []).map(({ id }) => id),
        );
        for (const field of layer.fields ?? []) {
            assert.ok(field.input?.control, `${layer.id}.${field.id} input`);
            if (field.input.linkRelationship) {
                assert.ok(relationshipIds.has(field.input.linkRelationship));
            }
            for (const option of field.input.options ?? []) {
                assert.deepEqual(Object.keys(option.metadata.labels).sort(), [
                    "de",
                    "en",
                    "id",
                    "ja",
                ]);
            }
        }
    }
});

test("vocabulary compositions use the closest structural records", () => {
    const nihon = recordsById.get("ja:word:nihon");
    const nihongo = recordsById.get("ja:word:nihongo");
    assert.equal(labelsFor(nihon, ["word-spelling", "spelling"]), "日本");
    assert.equal(labelsFor(nihongo, ["word-spelling", "spelling"]), "日本語");
    assert.deepEqual(
        nihongo.references
            .filter(({ relation }) =>
                ["word-spelling", "spelling"].includes(relation),
            )
            .map(({ entryId }) => entryId),
        ["ja:word:nihon", "ja:kanji:go"],
    );
    assert.equal(labelsFor(nihon, ["kana-spelling"]), "にほん");
    assert.equal(labelsFor(nihongo, ["kana-spelling"]), "にほんご");
});

test("Kanji readings and particles resolve through authored Kana links", () => {
    for (const entry of kanji) {
        const readingLabels = entry.references
            .filter(({ relation }) => relation === "readings")
            .sort((left, right) => left.position - right.position)
            .map(({ entryId }) => recordsById.get(entryId).label);
        assert.deepEqual(readingLabels, entry.fields.pronunciation);
        for (const reference of entry.references.filter(
            ({ relation }) => relation === "readings",
        )) {
            const reading = recordsById.get(reference.entryId);
            assert.equal(labelsFor(reading, ["kana-spelling"]), reading.label);
        }
    }
    const ga = recordsById.get("ja:particle:ga");
    assert.equal(labelsFor(ga, ["kana-spelling"]), "が");
});
