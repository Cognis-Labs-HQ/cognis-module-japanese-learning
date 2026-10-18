import { readAudioInventory } from "../api/audio/inventory.js";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const entries = new Map(
    [...layers.values()].flat().map((entry) => [entry.id, entry]),
);
const inventory = await readAudioInventory("data/audio");
const decks = JSON.parse(await readFile("data/starter-decks.json", "utf8"));
const slugs = [
    "table",
    "chair",
    "bed",
    "bag",
    "shoe",
    "hat",
    "coat",
    "key",
    "phone",
    "computer",
    "clock",
    "umbrella",
    "egg",
    "rice",
    "fish",
];

test("household deck publishes fifteen fully illustrated, localized and recorded nouns", () => {
    const deck = decks.find(({ key }) => key === "household-essentials");
    assert.equal(deck.schemaId, schema.id);
    assert.deepEqual(
        deck.sourceRecordIds,
        slugs.map((slug) => `${schema.language}:word:${slug}`),
    );
    for (const locale of ["en", "de", "id", "ja"]) assert.ok(deck.name[locale]);
    for (const id of deck.sourceRecordIds) {
        const entry = entries.get(id);
        assert.equal(entry.class, "lexical:noun");
        assert.ok(!entry.hidden);
        assert.ok(entry.fields.reference_images.length);
        assert.ok(entry.fields.pronunciation.length);
        assert.ok(
            inventory.recordings.some(
                (recording) =>
                    recording.path === entry.fields.audio &&
                    recording.entries.includes(id),
            ),
            id,
        );
        const definition = entries.get(
            entry.references.find(({ relation }) => relation === "definitions")
                .entryId,
        );
        for (const locale of ["en", "de", "id", "ja"])
            assert.ok(definition.fields.translations[locale]);
    }
});

test("household number forms and Japanese long vowels retain playable exact-form readings", () => {
    if (schema.language === "en") {
        assert.equal(
            schema.transformSets.some(({ id }) => id === "noun-rice"),
            false,
        );
        for (const slug of slugs.filter((slug) => slug !== "rice")) {
            const set = schema.transformSets.find(
                ({ id }) => id === `noun-${slug}`,
            );
            assert.ok(set, slug);
            assert.ok(
                inventory.recordings.some((recording) =>
                    recording.variants.some(
                        (variant) =>
                            variant.entryId === `en:word:${slug}` &&
                            variant.setId === set.id &&
                            variant.path.join() === "plural",
                    ),
                ),
                slug,
            );
        }
        assert.equal(
            schema.transformSets.find(({ id }) => id === "noun-fish").rules[0]
                .append,
            "fish",
        );
        return;
    }
    const mark = entries.get("ja:char:long-vowel-mark");
    assert.equal(mark.label, "ー");
    assert.ok(mark.fields.audio);
    for (const slug of ["table", "bed", "coat", "computer"]) {
        const word = entries.get(`ja:word:${slug}`);
        const shim = entries.get(
            word.referenceGroups["pronunciation-readings"][0][0].entryId,
        );
        assert.equal(shim.hidden, true);
        assert.equal(
            shim.referenceGroups["reading-kana"][0]
                .map(({ entryId }) => entries.get(entryId).label)
                .join(""),
            word.fields.pronunciation[0],
        );
    }
    for (const slug of ["table", "coat"])
        assert.ok(
            entries
                .get(`ja:word:complete-pronunciation-${slug}`)
                .referenceGroups["reading-kana"][0].some(
                    ({ entryId }) => entryId === mark.id,
                ),
        );
});
