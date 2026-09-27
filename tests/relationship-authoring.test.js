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
        .flatMap((name) => readJson(`data/library/content/${layer}/${name}`))
        .map((entry) => ({
            ...entry,
            references: [
                ...(entry.references ?? []),
                ...Object.values(entry.referenceGroups ?? {}).flatMap(
                    (groups) => groups[0] ?? [],
                ),
            ],
        }));
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
            assert.equal(
                field.input.linkRelationship,
                undefined,
                `${layer.id}.${field.id} must not retain the legacy singular link contract`,
            );
            for (const relationship of field.input.linkRelationships ?? []) {
                assert.ok(relationshipIds.has(relationship));
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

test("vocabulary pronunciation links directly to atomic Kana", () => {
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    const pronunciation = wordLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, ["reading-kana"]);
    for (const word of words) {
        const references = word.references.filter(
            ({ relation }) => relation !== "definitions",
        );
        assert.ok(references.length > 0, word.id);
        assert.ok(
            references.every(
                ({ entryId, relation }) =>
                    relation === "reading-kana" &&
                    recordsById.get(entryId)?.fields.character_class,
            ),
            word.id,
        );
    }
    assert.equal(
        labelsFor(recordsById.get("ja:word:nihongo"), ["reading-kana"]),
        "にほんご",
    );
});

test("vocabulary contains no hidden pronunciation duplicates", () => {
    assert.ok(words.length > 0);
    assert.ok(words.every(({ hidden }) => hidden !== true));
    assert.ok(words.every(({ fields }) => fields.pronunciation?.length === 1));
});

test("Kanji and particles terminate directly at Kana", () => {
    const altCharacters = schema.layers.find(
        ({ id }) => id === "alt-characters",
    );
    const pronunciation = altCharacters.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, ["readings"]);
    for (const entry of kanji) {
        assert.equal(
            labelsFor(entry, ["readings"]),
            entry.fields.pronunciation[0],
            entry.id,
        );
        assert.ok(
            entry.references
                .filter(({ relation }) => relation === "readings")
                .every(
                    ({ entryId }) =>
                        recordsById.get(entryId)?.fields.character_class,
                ),
        );
    }
    const ga = recordsById.get("ja:particle:ga");
    assert.equal(labelsFor(ga, ["kana-spelling"]), "が");
});
