import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));

test("expansion summary separates distinct base vocabulary, examples, forms and total records", async () => {
    const summary = await load("authoring/reviews/expansion-summary.json");
    const records = new Map();
    for (const layer of await readdir("data/library/content")) {
        for (const file of await readdir(`data/library/content/${layer}`)) {
            if (!file.endsWith(".json")) continue;
            for (const record of await load(
                `data/library/content/${layer}/${file}`,
            )) {
                records.set(record.id, record);
            }
        }
    }
    const inventory = await readAudioInventory("data/audio");
    const baseIds = new Set();
    const exampleIds = new Set();
    let formCount = 0;
    assert.equal(summary.schemaVersion, 2);
    const themes = (await Promise.all(summary.themeFiles.map(load))).flat();
    assert.equal(
        new Set(themes.map((theme) => theme.theme)).size,
        themes.length,
    );
    for (const theme of themes) {
        assert.equal(theme.newDistinctVocabularyCount, theme.vocabulary.length);
        assert.equal(theme.newExampleCount, theme.exampleIds.length);
        for (const entry of theme.vocabulary) {
            const record = records.get(entry.entryId);
            assert.ok(record.class.startsWith("lexical:"));
            assert.ok(!record.hidden);
            assert.equal(record.label, entry.label);
            assert.ok(!baseIds.has(entry.entryId));
            baseIds.add(entry.entryId);
        }
        for (const id of theme.exampleIds) {
            assert.equal(records.get(id).class, "composite");
            assert.ok(id.includes(":sentence:"));
            assert.ok(!exampleIds.has(id));
            exampleIds.add(id);
        }
        const ids = new Set(theme.vocabulary.map((entry) => entry.entryId));
        const variants = new Set(
            inventory.recordings.flatMap((clip) =>
                (clip.variants ?? [])
                    .filter(
                        (variant) =>
                            ids.has(variant.entryId) && variant.path.length,
                    )
                    .map((variant) =>
                        JSON.stringify([
                            variant.entryId,
                            variant.setId,
                            variant.path,
                        ]),
                    ),
            ),
        );
        assert.equal(theme.recordedGrammaticalFormCount, variants.size);
        formCount += variants.size;
    }
    for (const file of await readdir("authoring/reviews")) {
        if (!file.endsWith("-vocabulary.json") || file.includes("-forms-"))
            continue;
        for (const entry of await load(`authoring/reviews/${file}`)) {
            if (!records.get(entry.entryId).hidden)
                assert.ok(baseIds.has(entry.entryId));
        }
    }
    assert.deepEqual(summary.totals, {
        newDistinctVocabulary: baseIds.size,
        newExamples: exampleIds.size,
        recordedGrammaticalForms: formCount,
    });
    assert.equal(summary.currentLibrary.totalRecords, records.size);
    assert.equal(
        summary.currentLibrary.starterDecks,
        (await load("data/starter-decks.json")).length,
    );
    assert.equal(
        summary.currentLibrary.illustrations,
        (await load("data/library/assets/images/catalog.json")).images.length,
    );
});
