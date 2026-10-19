import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/core-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    read: [
        ["polite", "よみます", "よみます"],
        ["negative", "よまない", "よまない"],
        ["past", "よんだ", "よんだ"],
        ["te-form", "よんで", "よんで"],
        ["polite-past", "よみました", "よみました"],
        ["polite-negative", "よみません", "よみません"],
        ["negative-past", "よまなかった", "よまなかった"],
        ["potential", "よめる", "よめる"],
    ],
    write: [
        ["polite", "かきます", "かきます"],
        ["negative", "かかない", "かかない"],
        ["past", "かいた", "かいた"],
        ["te-form", "かいて", "かいて"],
        ["polite-past", "かきました", "かきました"],
        ["polite-negative", "かきません", "かきません"],
        ["negative-past", "かかなかった", "かかなかった"],
        ["potential", "かける", "かける"],
    ],
    speak: [
        ["polite", "はなします", "はなします"],
        ["negative", "はなさない", "はなさない"],
        ["past", "はなした", "はなした"],
        ["te-form", "はなして", "はなして"],
        ["polite-past", "はなしました", "はなしました"],
        ["polite-negative", "はなしません", "はなしません"],
        ["negative-past", "はなさなかった", "はなさなかった"],
        ["potential", "はなせる", "はなせる"],
    ],
    sleep: [
        ["polite", "ねます", "ねます"],
        ["negative", "ねない", "ねない"],
        ["past", "ねた", "ねた"],
        ["te-form", "ねて", "ねて"],
        ["polite-past", "ねました", "ねました"],
        ["polite-negative", "ねません", "ねません"],
        ["negative-past", "ねなかった", "ねなかった"],
        ["potential", "ねられる", "ねられる"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`core ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:core-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `core-${key}-forms`,
        );
        assert.equal(word.class, "lexical:verb");
        assert.ok(transform.matchTags.every((tag) => word.tags.includes(tag)));
        assert.equal(transform.rules.length, variants.length);
        for (const [ruleId, label, reading] of variants) {
            const rule = transform.rules.find(({ id }) => id === ruleId);
            assert.equal(rule.removeSuffix, word.label);
            assert.equal(rule.append, label);
            assert.equal(
                rule.pronunciation.removeSuffix,
                word.fields.pronunciation[0],
            );
            assert.equal(rule.pronunciation.append, reading);
            assert.deepEqual(
                Object.keys(rule.definitionTransform.template.labels).sort(),
                ["de", "en", "id", "ja"],
            );
            const clip = inventory.recordings.find(({ variants: bindings }) =>
                bindings.some(
                    (binding) =>
                        binding.entryId === word.id &&
                        binding.setId === transform.id &&
                        JSON.stringify(binding.path) ===
                            JSON.stringify([ruleId]),
                ),
            );
            assert.ok(clip, `${key}/${ruleId}`);
            assert.equal(clip.text, label);
            assert.equal(clip.voiceId, "xya0RvcJtofTcFTOdX4E");
            assert.ok(
                clip.inputs.some(
                    (input) =>
                        input.label === label && input.readings[0] === reading,
                ),
            );
            assert.equal(clip.request.text, label);
        }
    });
}
