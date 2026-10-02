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

test("vocabulary pronunciation links through Kanji segments and atomic Kana", () => {
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
            "reading-kana",
        ]),
        "にほんご",
    );
});

test("whole-word Kana pronunciation shims are not Vocabulary records", () => {
    assert.ok(words.length > 0);
    const shims = words.filter(
        ({ class: contentClass, hidden }) =>
            hidden === true && contentClass === "reading:pronunciation",
    );
    assert.equal(shims.length, 0);
    assert.ok(words.every(({ fields }) => fields.pronunciation?.length === 1));
});

test("Kanji readings and particles terminate at Kana", () => {
    const altCharacters = schema.layers.find(
        ({ id }) => id === "alt-characters",
    );
    const pronunciation = altCharacters.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, [
        "readings",
        "single-readings",
    ]);
    for (const entry of kanji) {
        const relationship =
            entry.fields.pronunciation.length > 1
                ? "readings"
                : "single-readings";
        const groups = entry.referenceGroups[relationship];
        assert.deepEqual(
            groups.map((group) =>
                group
                    .map(({ entryId }) => recordsById.get(entryId).label)
                    .join(""),
            ),
            entry.fields.pronunciation,
        );
        for (const group of groups)
            for (const { entryId } of group) {
                const target = recordsById.get(entryId);
                if (relationship === "single-readings")
                    assert.ok(target.fields.character_class, entry.id);
                else assert.equal(target.class, "reading:kanji", entry.id);
            }
    }
    const ga = recordsById.get("ja:particle:ga");
    assert.equal(labelsFor(ga, ["kana-spelling"]), "が");
});

test("sentence pronunciations link only to visible constituent cards", () => {
    const sentenceLayer = schema.layers.find(({ id }) => id === "sentences");
    const pronunciation = sentenceLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, [
        "words",
        "particles",
    ]);
    assert.equal(
        sentenceLayer.relationships.some(
            ({ id }) => id === "pronunciation-readings",
        ),
        false,
    );

    const sentences = readLayer("sentences");
    for (const sentence of sentences) {
        assert.equal(
            sentence.referenceGroups?.["pronunciation-readings"],
            undefined,
            sentence.id,
        );
        const constituentPronunciation = sentence.references
            .filter(({ relation }) => ["words", "particles"].includes(relation))
            .sort((left, right) => left.position - right.position)
            .map(
                ({ entryId }) =>
                    recordsById.get(entryId).fields.pronunciation[0],
            )
            .join("");
        assert.equal(
            constituentPronunciation,
            sentence.fields.pronunciation[0],
            sentence.id,
        );
    }
});

test("Kanji reading Vocabulary belongs only to multi-reading Kanji", () => {
    const readings = words.filter(
        ({ class: contentClass }) => contentClass === "reading:kanji",
    );
    assert.equal(readings.length, 139);
    for (const reading of readings) {
        assert.equal(reading.hidden, true, reading.id);
        const spelling = reading.references.filter(
            ({ relation }) => relation === "spelling",
        );
        assert.equal(spelling.length, 1, reading.id);
        const source = recordsById.get(spelling[0].entryId);
        assert.equal(source.fields.pronunciation.length > 1, true, reading.id);
        assert.ok(source.fields.pronunciation.includes(reading.label));
        assert.equal(labelsFor(reading, ["reading-kana"]), reading.label);
        const readingDefinitions = reading.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => entryId)
            .sort();
        assert.ok(readingDefinitions.length > 0, reading.id);
    }

    const compoundPronunciations = new Set(
        words
            .filter(
                ({ hidden, references }) =>
                    hidden !== true &&
                    references.filter(({ relation }) => relation === "spelling")
                        .length > 1,
            )
            .flatMap(({ fields }) => fields.pronunciation ?? []),
    );
    assert.ok(!readings.some(({ label }) => compoundPronunciations.has(label)));
    assert.ok(!readings.some(({ label }) => label === "せんせい"));

    const hana = readings.find(({ label }) => label === "はな");
    const hanaSource = recordsById.get(
        hana.references.find(({ relation }) => relation === "spelling").entryId,
    );
    assert.deepEqual(
        hana.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => entryId),
        hanaSource.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => entryId),
    );
});

test("multi-Kana titles compose only from atomic Kana", () => {
    const characterLayer = schema.layers.find(({ id }) => id === "characters");
    const titleRelationship = characterLayer.relationships.find(
        ({ id }) => id === "character-title",
    );
    assert.equal(titleRelationship.targetLayer, "characters");
    assert.equal(titleRelationship.presentationRole, "composition");

    for (const character of characters.filter(
        ({ label }) => [...label].length > 1,
    )) {
        const titleReferences = character.references
            .filter(({ relation }) => relation === "character-title")
            .sort((left, right) => left.position - right.position);
        assert.equal(
            titleReferences
                .map(({ entryId }) => recordsById.get(entryId).label)
                .join(""),
            character.label,
            character.id,
        );
        assert.ok(
            titleReferences.every(
                ({ entryId }) =>
                    recordsById.get(entryId).fields.character_class,
            ),
            character.id,
        );
    }
});
