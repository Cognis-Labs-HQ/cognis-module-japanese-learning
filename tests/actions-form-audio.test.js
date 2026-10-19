import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/actions-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    jump: [
        ["polite", "とびます", "とびます"],
        ["negative", "とばない", "とばない"],
        ["past", "とんだ", "とんだ"],
        ["te-form", "とんで", "とんで"],
        ["polite-past", "とびました", "とびました"],
        ["polite-negative", "とびません", "とびません"],
        ["negative-past", "とばなかった", "とばなかった"],
        ["potential", "とべる", "とべる"],
    ],
    swim: [
        ["polite", "およぎます", "およぎます"],
        ["negative", "およがない", "およがない"],
        ["past", "およいだ", "およいだ"],
        ["te-form", "およいで", "およいで"],
        ["polite-past", "およぎました", "およぎました"],
        ["polite-negative", "およぎません", "およぎません"],
        ["negative-past", "およがなかった", "およがなかった"],
        ["potential", "およげる", "およげる"],
    ],
    laugh: [
        ["polite", "わらいます", "わらいます"],
        ["negative", "わらわない", "わらわない"],
        ["past", "わらった", "わらった"],
        ["te-form", "わらって", "わらって"],
        ["polite-past", "わらいました", "わらいました"],
        ["polite-negative", "わらいません", "わらいません"],
        ["negative-past", "わらわなかった", "わらわなかった"],
        ["potential", "わらえる", "わらえる"],
    ],
    cry: [
        ["polite", "なきます", "なきます"],
        ["negative", "なかない", "なかない"],
        ["past", "ないた", "ないた"],
        ["te-form", "ないて", "ないて"],
        ["polite-past", "なきました", "なきました"],
        ["polite-negative", "なきません", "なきません"],
        ["negative-past", "なかなかった", "なかなかった"],
        ["potential", "なける", "なける"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`actions ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:actions-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `actions-${key}-forms`,
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
