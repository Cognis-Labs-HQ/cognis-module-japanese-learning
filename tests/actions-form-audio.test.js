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
        ["polite", "跳びます", "とびます", "とびます"],
        ["negative", "跳ばない", "とばない", "とばない"],
        ["past", "跳んだ", "とんだ", "とんだ"],
        ["te-form", "跳んで", "とんで", "とんで"],
        ["polite-past", "跳びました", "とびました", "とびました"],
        ["polite-negative", "跳びません", "とびません", "とびません"],
        ["negative-past", "跳ばなかった", "とばなかった", "とばなかった"],
        ["potential", "跳べる", "とべる", "とべる"],
    ],
    swim: [
        ["polite", "泳ぎます", "およぎます", "およぎます"],
        ["negative", "泳がない", "およがない", "およがない"],
        ["past", "泳いだ", "およいだ", "およいだ"],
        ["te-form", "泳いで", "およいで", "およいで"],
        ["polite-past", "泳ぎました", "およぎました", "およぎました"],
        ["polite-negative", "泳ぎません", "およぎません", "およぎません"],
        ["negative-past", "泳がなかった", "およがなかった", "およがなかった"],
        ["potential", "泳げる", "およげる", "およげる"],
    ],
    laugh: [
        ["polite", "笑います", "わらいます", "わらいます"],
        ["negative", "笑わない", "わらわない", "わらわない"],
        ["past", "笑った", "わらった", "わらった"],
        ["te-form", "笑って", "わらって", "わらって"],
        ["polite-past", "笑いました", "わらいました", "わらいました"],
        ["polite-negative", "笑いません", "わらいません", "わらいません"],
        ["negative-past", "笑わなかった", "わらわなかった", "わらわなかった"],
        ["potential", "笑える", "わらえる", "わらえる"],
    ],
    cry: [
        ["polite", "泣きます", "なきます", "なきます"],
        ["negative", "泣かない", "なかない", "なかない"],
        ["past", "泣いた", "ないた", "ないた"],
        ["te-form", "泣いて", "ないて", "ないて"],
        ["polite-past", "泣きました", "なきました", "なきました"],
        ["polite-negative", "泣きません", "なきません", "なきません"],
        ["negative-past", "泣かなかった", "なかなかった", "なかなかった"],
        ["potential", "泣ける", "なける", "なける"],
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
