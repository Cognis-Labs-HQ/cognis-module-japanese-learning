import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("mealtime audit binds all six composed clips and source bytes without claiming listening review", async () => {
    const review = await load("authoring/reviews/mealtime.json");
    const inventory = await readAudioInventory("data/audio");
    const decks = await load("data/starter-decks.json");
    assert.equal(review.length, 6);
    assert.deepEqual(
        decks.find(({ key }) => key === "mealtime-sentences").sourceRecordIds,
        review.map(({ entryId }) => entryId),
    );
    for (const item of review) {
        assert.equal(item.listening, "unverified-not-performed");
        assert.deepEqual(Object.keys(item.meanings).sort(), [
            "de",
            "en",
            "id",
            "ja",
        ]);
        const composition = inventory.compositions.find(
            ({ entryId }) => entryId === item.entryId,
        );
        assert.equal(composition.label, item.label);
        assert.equal(composition.metadata.listening, item.listening);
        assert.equal(composition.path, item.audioPath);
        assert.equal(
            digest(await readFile(`data/library/assets/${item.audioPath}`)),
            item.sha256,
        );
        assert.deepEqual(
            composition.segments.map(({ entryId }) => entryId),
            item.constituents.map(({ entryId }) => entryId),
        );
        for (const source of item.constituents) {
            assert.equal(
                digest(await readFile(`data/library/assets/${source.path}`)),
                source.sha256,
            );
        }
    }
});
