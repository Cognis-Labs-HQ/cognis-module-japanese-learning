import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
    const audit = read("authoring/reviews/social-audio.json").find(
        ({ entryId }) => entryId === greeting.id,
    );
    assert.equal(audit.request.text, "こんにちは");
    assert.equal(audit.listening, "unverified-not-performed");
});
