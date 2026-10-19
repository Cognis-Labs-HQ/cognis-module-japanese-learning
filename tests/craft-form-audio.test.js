import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/craft-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    cut: [
        ["polite", "きります", "きります"],
        ["negative", "きらない", "きらない"],
        ["past", "きった", "きった"],
        ["te-form", "きって", "きって"],
        ["polite-past", "きりました", "きりました"],
        ["polite-negative", "きりません", "きりません"],
        ["negative-past", "きらなかった", "きらなかった"],
        ["potential", "きれる", "きれる"],
    ],
    fold: [
        ["polite", "おります", "おります"],
        ["negative", "おらない", "おらない"],
        ["past", "おった", "おった"],
        ["te-form", "おって", "おって"],
        ["polite-past", "おりました", "おりました"],
        ["polite-negative", "おりません", "おりません"],
        ["negative-past", "おらなかった", "おらなかった"],
        ["potential", "おれる", "おれる"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`craft ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:craft-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `craft-${key}-forms`,
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
