import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";
import { readContentLayers } from "../api/reuse/content.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const records = new Map(
    [...layers.values()].flat().map((entry) => [entry.id, entry]),
);
const auditIndex = await load("authoring/index.json");
const audio = await readAudioInventory("data/audio");
const unavailable = await load("data/audio/unavailable.json");
const decks = await load("data/starter-decks.json");

for (const theme of [
    "daily",
    "shopping",
    "study-habits",
    "plans",
    "home-practice",
].filter((theme) => auditIndex[theme + "Publication"])) {
    test(`${theme} practice preserves reviewed meanings and distinguishes missing from unverified audio`, async () => {
        const review = await load(auditIndex[theme + "Publication"]);
        assert.equal(review.length, theme === "home-practice" ? 4 : 6);
        assert.deepEqual(
            decks.find(({ key }) => key === theme + "-practice")
                .sourceRecordIds,
            review.map(({ entryId }) => entryId),
        );
        for (const item of review) {
            const entry = records.get(item.entryId);
            assert.equal(entry.label, item.label);
            assert.equal(
                layers
                    .get("sentences")
                    .filter(({ label }) => label === item.label).length,
                1,
            );
            const refs = entry.references
                .filter(({ relation }) =>
                    ["words", "particles"].includes(relation),
                )
                .sort((left, right) => left.position - right.position);
            assert.deepEqual(
                refs.map(({ entryId }) => entryId),
                item.constituentIds,
            );
            const definition = records.get(
                entry.references.find(
                    ({ relation }) => relation === "definitions",
                ).entryId,
            );
            assert.deepEqual(definition.fields.translations, item.meanings);
            if (item.audioAvailability === "missing-constituents") {
                assert.equal(entry.fields.audio, undefined);
                assert.equal(item.listening, "not-applicable-no-audio");
                const missing = refs
                    .filter(
                        ({ entryId }) =>
                            !records.get(entryId).fields.audio &&
                            !records.get(entryId).tags?.includes("punctuation"),
                    )
                    .map(({ entryId }) => entryId);
                assert.deepEqual(missing, item.missingConstituentIds);
                assert.deepEqual(
                    unavailable.entries.find(
                        ({ entryId }) => entryId === item.entryId,
                    ).missingConstituentIds,
                    missing,
                );
            } else {
                assert.equal(item.audioAvailability, "bundled-composition");
                assert.equal(item.listening, "unverified-not-performed");
                assert.equal(entry.fields.audio, item.audioPath);
                const bytes = await readFile(
                    `data/library/assets/${item.audioPath}`,
                );
                assert.equal(
                    createHash("sha256").update(bytes).digest("hex"),
                    item.sha256,
                );
                assert.equal(
                    audio.compositions.find(
                        ({ entryId }) => entryId === item.entryId,
                    ).path,
                    item.audioPath,
                );
            }
        }
    });
}
