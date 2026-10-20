import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const inventory = await readAudioInventory("data/audio");

const read = (path) => JSON.parse(readFileSync(path, "utf8"));

test("daytime greeting preserves written ha and spoken wa without changing native TTS input", () => {
    const words = read("data/library/content/words/social-001.json");
    const greeting = words.find(({ id }) => id === "ja:word:social-greeting");
    assert.equal(greeting.label, "こんにちは");
    assert.deepEqual(greeting.fields.pronunciation, ["こんにちわ"]);
    const reference = greeting.referenceGroups["pronunciation-readings"][0][0];
    const reading = words.find(({ id }) => id === reference.entryId);
    assert.equal(reading.label, "こんにちわ");
    assert.equal(
        reading.referenceGroups["reading-kana"][0].at(-1).entryId,
        "ja:char:wa",
    );
    const recording = inventory.recordings.find(({ entries }) =>
        entries.includes(greeting.id),
    );
    assert.equal(recording.request.text, "こんにちは");
    assert.equal(recording.metadata.listening, "unverified-not-performed");
});

test("evening greeting keeps written ha, spoken wa and native synthesis text", () => {
    const words = read("data/library/content/words/greetings-001.json");
    const greeting = words.find(({ id }) => id === "ja:word:greetings-evening");
    assert.equal(greeting.label, "こんばんは");
    assert.deepEqual(greeting.fields.pronunciation, ["こんばんわ"]);
    const reference = greeting.referenceGroups["pronunciation-readings"][0][0];
    const reading = words.find(({ id }) => id === reference.entryId);
    assert.equal(
        reading.referenceGroups["reading-kana"][0].at(-1).entryId,
        "ja:char:wa",
    );
    const recording = inventory.recordings.find(({ entries }) =>
        entries.includes(greeting.id),
    );
    assert.equal(recording.request.text, "こんばんは");
});
