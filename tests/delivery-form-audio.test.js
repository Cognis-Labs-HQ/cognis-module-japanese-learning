import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/delivery-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    send: [
        ["polite", "送ります", "おくります", "おくります"],
        ["negative", "送らない", "おくらない", "おくらない"],
        ["past", "送った", "おくった", "おくった"],
        ["te-form", "送って", "おくって", "おくって"],
        ["polite-past", "送りました", "おくりました", "おくりました"],
        ["polite-negative", "送りません", "おくりません", "おくりません"],
        ["negative-past", "送らなかった", "おくらなかった", "おくらなかった"],
        ["potential", "送れる", "おくれる", "おくれる"],
    ],
    carry: [
        ["polite", "運びます", "はこびます", "はこびます"],
        ["negative", "運ばない", "はこばない", "はこばない"],
        ["past", "運んだ", "はこんだ", "はこんだ"],
        ["te-form", "運んで", "はこんで", "はこんで"],
        ["polite-past", "運びました", "はこびました", "はこびました"],
        ["polite-negative", "運びません", "はこびません", "はこびません"],
        ["negative-past", "運ばなかった", "はこばなかった", "はこばなかった"],
        ["potential", "運べる", "はこべる", "はこべる"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`delivery ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:delivery-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `delivery-${key}-forms`,
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
