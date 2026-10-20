import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/posture-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    sit: [
        ["polite", "座ります", "すわります", "すわります"],
        ["negative", "座らない", "すわらない", "すわらない"],
        ["past", "座った", "すわった", "すわった"],
        ["te-form", "座って", "すわって", "すわって"],
        ["polite-past", "座りました", "すわりました", "すわりました"],
        ["polite-negative", "座りません", "すわりません", "すわりません"],
        ["negative-past", "座らなかった", "すわらなかった", "すわらなかった"],
        ["potential", "座れる", "すわれる", "すわれる"],
    ],
    stand: [
        ["polite", "立ちます", "たちます", "たちます"],
        ["negative", "立たない", "たたない", "たたない"],
        ["past", "立った", "たった", "たった"],
        ["te-form", "立って", "たって", "たって"],
        ["polite-past", "立ちました", "たちました", "たちました"],
        ["polite-negative", "立ちません", "たちません", "たちません"],
        ["negative-past", "立たなかった", "たたなかった", "たたなかった"],
        ["potential", "立てる", "たてる", "たてる"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`posture ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:posture-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `posture-${key}-forms`,
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
