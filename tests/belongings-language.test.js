import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const inventory = await readAudioInventory("data/audio");

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const words = read("data/library/content/words/belongings-001.json");
const examples = read("data/library/content/sentences/belongings-001.json");

test("personal belongings preserve native inputs and voiced compound reading", () => {
    const watch = words.find(({ id }) => id === "ja:word:belongings-watch");
    assert.deepEqual(watch.fields.pronunciation, ["うでどけい"]);
    const reference = watch.referenceGroups["pronunciation-readings"][0][0];
    const reading = words.find(({ id }) => id === reference.entryId);
    assert.equal(
        reading.referenceGroups["reading-kana"][0][2].entryId,
        "ja:char:do",
    );
    const audio = inventory.recordings.filter(({ entries }) =>
        words.some(({ id, hidden }) => !hidden && entries.includes(id)),
    );
    assert.equal(
        audio.find(({ entries }) => entries.includes(watch.id)).request.text,
        "腕時計",
    );
    assert.ok(
        audio.every(
            ({ voiceId, request }) =>
                voiceId === "xya0RvcJtofTcFTOdX4E" &&
                request.language_code === "ja",
        ),
    );
    const question = examples.find(
        ({ label }) => label === "さいふはどこですか",
    );
    assert.deepEqual(
        question.references
            .filter(({ relation }) => relation !== "definitions")
            .map(({ entryId }) => entryId),
        [
            "ja:word:belongings-wallet",
            "ja:particle:wa",
            "ja:word:doko",
            "ja:word:desu",
            "ja:particle:ka",
        ],
    );
    assert.ok(
        question.references.every(({ transformation }) => !transformation),
    );
});
