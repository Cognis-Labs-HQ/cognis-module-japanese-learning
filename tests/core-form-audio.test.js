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
        ["polite", "読みます", "よみます", "よみます"],
        ["negative", "読まない", "よまない", "よまない"],
        ["past", "読んだ", "よんだ", "よんだ"],
        ["te-form", "読んで", "よんで", "よんで"],
        ["polite-past", "読みました", "よみました", "よみました"],
        ["polite-negative", "読みません", "よみません", "よみません"],
        ["negative-past", "読まなかった", "よまなかった", "よまなかった"],
        ["potential", "読める", "よめる", "よめる"],
    ],
    write: [
        ["polite", "書きます", "かきます", "かきます"],
        ["negative", "書かない", "かかない", "かかない"],
        ["past", "書いた", "かいた", "かいた"],
        ["te-form", "書いて", "かいて", "かいて"],
        ["polite-past", "書きました", "かきました", "かきました"],
        ["polite-negative", "書きません", "かきません", "かきません"],
        ["negative-past", "書かなかった", "かかなかった", "かかなかった"],
        ["potential", "書ける", "かける", "かける"],
    ],
    speak: [
        ["polite", "話します", "はなします", "はなします"],
        ["negative", "話さない", "はなさない", "はなさない"],
        ["past", "話した", "はなした", "はなした"],
        ["te-form", "話して", "はなして", "はなして"],
        ["polite-past", "話しました", "はなしました", "はなしました"],
        ["polite-negative", "話しません", "はなしません", "はなしません"],
        ["negative-past", "話さなかった", "はなさなかった", "はなさなかった"],
        ["potential", "話せる", "はなせる", "はなせる"],
    ],
    sleep: [
        ["polite", "寝ます", "ねます", "ねます"],
        ["negative", "寝ない", "ねない", "ねない"],
        ["past", "寝た", "ねた", "ねた"],
        ["te-form", "寝て", "ねて", "ねて"],
        ["polite-past", "寝ました", "ねました", "ねました"],
        ["polite-negative", "寝ません", "ねません", "ねません"],
        ["negative-past", "寝なかった", "ねなかった", "ねなかった"],
        ["potential", "寝られる", "ねられる", "ねられる"],
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
        for (const [ruleId, label, reading, recordedText] of variants) {
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
            assert.equal(clip.text, recordedText);
            assert.equal(clip.voiceId, "xya0RvcJtofTcFTOdX4E");
            assert.ok(
                clip.inputs.some(
                    (input) =>
                        input.label === label && input.readings[0] === reading,
                ),
            );
            assert.equal(clip.request.text, recordedText);
        }
    });
}
