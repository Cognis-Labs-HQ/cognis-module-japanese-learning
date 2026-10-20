import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/material-feel-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    hard: [
        ["adverb", "硬く", "かたく", "かたく"],
        ["negative", "硬くない", "かたくない", "かたくない"],
        ["past", "硬かった", "かたかった", "かたかった"],
    ],
    soft: [
        ["adverb", "柔らかく", "やわらかく", "やわらかく"],
        ["negative", "柔らかくない", "やわらかくない", "やわらかくない"],
        ["past", "柔らかかった", "やわらかかった", "やわらかかった"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`material-feel ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(
            ({ id }) => id === `ja:word:material-feel-${key}`,
        );
        const transform = schema.transformSets.find(
            ({ id }) => id === `material-feel-${key}-forms`,
        );
        assert.equal(word.class, "lexical:adjective");
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
