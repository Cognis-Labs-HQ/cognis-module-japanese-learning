import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const words = await load("data/library/content/words/household-001.json");
const inventory = await readAudioInventory("data/audio");
const expected = {
    wash: [
        ["polite", "洗います", "あらいます", "あらいます"],
        ["negative", "洗わない", "あらわない", "あらわない"],
        ["past", "洗った", "あらった", "あらった"],
        ["te-form", "洗って", "あらって", "あらって"],
        ["polite-past", "洗いました", "あらいました", "あらいました"],
        ["polite-negative", "洗いません", "あらいません", "あらいません"],
        ["negative-past", "洗わなかった", "あらわなかった", "あらわなかった"],
        ["potential", "洗える", "あらえる", "あらえる"],
    ],
    cook: [
        ["polite", "料理します", "りょうりします", "りょうりします"],
        ["negative", "料理しない", "りょうりしない", "りょうりしない"],
        ["past", "料理した", "りょうりした", "りょうりした"],
        ["te-form", "料理して", "りょうりして", "りょうりして"],
        ["polite-past", "料理しました", "りょうりしました", "りょうりしました"],
        [
            "polite-negative",
            "料理しません",
            "りょうりしません",
            "りょうりしません",
        ],
        [
            "negative-past",
            "料理しなかった",
            "りょうりしなかった",
            "りょうりしなかった",
        ],
        ["potential", "料理できる", "りょうりできる", "りょうりできる"],
    ],
    clean: [
        ["polite", "掃除します", "そうじします", "そうじします"],
        ["negative", "掃除しない", "そうじしない", "そうじしない"],
        ["past", "掃除した", "そうじした", "そうじした"],
        ["te-form", "掃除して", "そうじして", "そうじして"],
        ["polite-past", "掃除しました", "そうじしました", "そうじしました"],
        ["polite-negative", "掃除しません", "そうじしません", "そうじしません"],
        [
            "negative-past",
            "掃除しなかった",
            "そうじしなかった",
            "そうじしなかった",
        ],
        ["potential", "掃除できる", "そうじできる", "そうじできる"],
    ],
    dry: [
        ["polite", "乾かします", "かわかします", "かわかします"],
        ["negative", "乾かさない", "かわかさない", "かわかさない"],
        ["past", "乾かした", "かわかした", "かわかした"],
        ["te-form", "乾かして", "かわかして", "かわかして"],
        ["polite-past", "乾かしました", "かわかしました", "かわかしました"],
        ["polite-negative", "乾かしません", "かわかしません", "かわかしません"],
        [
            "negative-past",
            "乾かさなかった",
            "かわかさなかった",
            "かわかさなかった",
        ],
        ["potential", "乾かせる", "かわかせる", "かわかせる"],
    ],
};

for (const [key, variants] of Object.entries(expected)) {
    test(`household ${key} forms have exact spelling, reading and audio bindings`, () => {
        const word = words.find(({ id }) => id === `ja:word:household-${key}`);
        const transform = schema.transformSets.find(
            ({ id }) => id === `household-${key}-forms`,
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
