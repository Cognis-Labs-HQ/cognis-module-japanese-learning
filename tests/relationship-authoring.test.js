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
                    (groups) => groups.flat(),
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

test("vocabulary pronunciation links through complete hidden readings", () => {
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    const pronunciation = wordLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, [
        "pronunciation-readings",
        "reading-kana",
        "kana-spelling",
    ]);
    for (const word of words.filter(({ hidden }) => hidden !== true)) {
        const references = word.references.filter(
            ({ relation }) => relation !== "definitions",
        );
        assert.ok(references.length > 0, word.id);
        assert.ok(
            references
                .filter(({ relation }) => relation !== "spelling")
                .every(
                    ({ entryId, relation }) =>
                        (relation === "reading-kana" &&
                            recordsById.get(entryId)?.fields.character_class) ||
                        (relation === "pronunciation-readings" &&
                            recordsById.get(entryId)?.hidden === true),
                ),
            word.id,
        );
    }
    assert.equal(
        labelsFor(recordsById.get("ja:word:nihongo"), [
            "pronunciation-readings",
        ]),
        "にほんご",
    );
});

test("vocabulary shims are hidden structural records", () => {
    assert.ok(words.length > 0);
    const shims = words.filter(
        ({ class: contentClass, hidden }) =>
            hidden === true && contentClass === "reading:pronunciation",
    );
    assert.equal(shims.length, 56);
    assert.ok(
        shims.every(
            ({ class: contentClass }) =>
                contentClass === "reading:pronunciation",
        ),
    );
    assert.ok(
        shims.every((entry) =>
            entry.references.every(
                ({ relation }) => relation !== "definitions",
            ),
        ),
    );
    assert.ok(words.every(({ fields }) => fields.pronunciation?.length === 1));
});

test("Kanji readings and particles terminate at Kana", () => {
    const altCharacters = schema.layers.find(
        ({ id }) => id === "alt-characters",
    );
    const pronunciation = altCharacters.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, ["readings"]);
    for (const entry of kanji) {
        const groups = entry.referenceGroups.readings;
        assert.deepEqual(
            groups.map(
                ([reference]) => recordsById.get(reference.entryId).label,
            ),
            entry.fields.pronunciation,
        );
        for (const [reference] of groups) {
            const reading = recordsById.get(reference.entryId);
            assert.equal(reading.hidden, true);
            assert.equal(reading.class, "reading:kanji");
            assert.equal(
                labelsFor(reading, ["kana-spelling"]),
                reading.label,
                reading.id,
            );
        }
    }
    const ga = recordsById.get("ja:particle:ga");
    assert.equal(labelsFor(ga, ["kana-spelling"]), "が");
});
