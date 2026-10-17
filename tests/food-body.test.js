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
const decks = JSON.parse(await readFile("data/starter-decks.json", "utf8"));

test("food and body decks each contain sixteen distinct illustrated visible nouns with localized meanings", () => {
    const seen = new Set();
    for (const group of ["food", "body"]) {
        const deck = decks.find(({ key }) => key === `${group}-essentials`);
        assert.equal(deck.schemaId, schema.id);
        assert.equal(deck.sourceRecordIds.length, 16);
        for (const locale of ["en", "de", "id", "ja"])
            assert.ok(deck.name[locale]);
        for (const id of deck.sourceRecordIds) {
            assert.equal(seen.has(id), false, id);
            seen.add(id);
            const entry = entries.get(id);
            assert.ok(entry && !entry.hidden, id);
            assert.equal(entry.class, "lexical:noun");
            assert.ok(entry.tags.includes(group), id);
            assert.equal(entry.fields.reference_images.length, 1, id);
            const definitions = entry.references
                .filter(({ relation }) => relation === "definitions")
                .map(({ entryId }) => entries.get(entryId));
            assert.ok(definitions.length, id);
            for (const definition of definitions)
                for (const locale of ["en", "de", "id", "ja"])
                    assert.ok(definition.fields.translations[locale], id);
        }
    }
});

test("new noun senses preserve mass food, irregular plurals and the Japanese foot/leg distinction", () => {
    if (schema.language === "en") {
        for (const slug of [
            "soup",
            "cheese",
            "meat",
            "chicken",
            "beef",
            "butter",
            "skin",
        ]) {
            const word = entries.get(`en:word:${slug}`);
            assert.ok(!word.tags.includes("plural"), slug);
            assert.equal(
                schema.transformSets.some((set) =>
                    set.matchTags.every((tag) => word.tags.includes(tag)),
                ),
                false,
                slug,
            );
        }
        for (const [slug, plural, pronunciation] of [
            ["foot", "feet", "/fiːt/"],
            ["tooth", "teeth", "/tiːθ/"],
            ["potato", "potatoes", "/pəˈteɪtəʊz/"],
            ["mouth", "mouths", "/maʊðz/"],
        ]) {
            const rule = schema.transformSets.find(
                ({ id }) => id === `noun-${slug}`,
            ).rules[0];
            assert.equal(rule.append, plural);
            assert.equal(rule.pronunciation.append, pronunciation);
        }
        return;
    }
    const foot = entries.get("ja:word:foot");
    const meanings = foot.references
        .filter(({ relation }) => relation === "definitions")
        .map(({ entryId }) => entries.get(entryId).fields.translations.en);
    assert.deepEqual(new Set(meanings), new Set(["foot", "leg"]));
    assert.equal(foot.label, "あし");
    for (const [slug, reading] of [
        ["cucumber", "きゅうり"],
        ["beef", "ぎゅうにく"],
        ["potato", "じゃがいも"],
        ["soup", "すーぷ"],
    ]) {
        const word = entries.get(`ja:word:${slug}`);
        assert.equal(word.fields.pronunciation[0], reading);
        const complete = entries.get(
            word.referenceGroups["pronunciation-readings"][0][0].entryId,
        );
        assert.equal(
            complete.referenceGroups["reading-kana"][0]
                .map(({ entryId }) => entries.get(entryId).label)
                .join(""),
            reading,
        );
    }
});
