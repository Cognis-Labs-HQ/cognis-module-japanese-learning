import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

function readJson(path) {
    return JSON.parse(
        readFileSync(new URL(`../${path}`, import.meta.url), "utf8"),
    );
}

const schema = readJson("data/library/schema.json");
function readLayer(layer) {
    const directory = new URL(
        `../data/library/content/${layer}/`,
        import.meta.url,
    );
    return readdirSync(directory)
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) => readJson(`data/library/content/${layer}/${name}`));
}

const words = readLayer("words");
const kanji = readLayer("alt-characters");
const characters = readLayer("characters");
const particles = readLayer("particles");
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
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    const pronunciation = wordLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.equal(
        pronunciation.input.linkRelationship,
        "pronunciation-readings",
    );
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
    assert.equal(labelsFor(nihon, ["pronunciation-readings"]), "にほん");
    assert.equal(labelsFor(nihongo, ["pronunciation-readings"]), "にほんご");
    assert.deepEqual(
        nihongo.references
            .filter(({ relation }) => relation === "pronunciation-readings")
            .map(({ entryId }) => entryId),
        ["ja:word:reading-nihon", "ja:word:reading-go"],
    );
    assert.equal(
        labelsFor(recordsById.get("ja:word:reading-nihon"), [
            "word-spelling",
            "kana-spelling",
        ]),
        "にほん",
    );
});

test("reading vocabulary owns explicit definitions", () => {
    for (const reading of words.filter(({ hidden }) => hidden === true)) {
        const definitionReferences = reading.references.filter(
            ({ relation }) => relation === "definitions",
        );
        assert.ok(definitionReferences.length > 0);
    }
});

test("only Kanji reading vocabulary is hidden from browsing", () => {
    const readingVocabulary = words.filter(({ id }) =>
        id.startsWith("ja:word:reading-"),
    );
    assert.ok(readingVocabulary.length > 0);
    assert.ok(readingVocabulary.every(({ hidden }) => hidden === true));
    assert.ok(
        words
            .filter(
                ({ class: entryClass }) => !entryClass.startsWith("reading:"),
            )
            .every(({ hidden }) => hidden !== true),
    );
});

test("Kanji readings and particles resolve through authored Kana links", () => {
    const altCharacters = schema.layers.find(
        ({ id }) => id === "alt-characters",
    );
    const pronunciation = altCharacters.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.equal(pronunciation.input.linkRelationship, "readings");

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
            assert.equal(reading.hidden, true);
            assert.equal(labelsFor(reading, ["kana-spelling"]), reading.label);
        }
    }
    const ga = recordsById.get("ja:particle:ga");
    assert.equal(labelsFor(ga, ["kana-spelling"]), "が");
});
