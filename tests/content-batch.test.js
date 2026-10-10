import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const CONTENT_ROOT = path.resolve(
    import.meta.dirname,
    "..",
    "data",
    "library",
    "content",
);
function load(layer) {
    return readdirSync(path.join(CONTENT_ROOT, layer))
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            JSON.parse(
                readFileSync(path.join(CONTENT_ROOT, layer, name), "utf8"),
            ),
        );
}

const words = new Map(load("words").map((entry) => [entry.id, entry]));
const definitions = new Map(
    load("definitions").map((entry) => [entry.id, entry]),
);
const sentences = new Map(load("sentences").map((entry) => [entry.id, entry]));

function definitionIds(entry) {
    return (entry.references ?? [])
        .filter(({ relation }) => relation === "definitions")
        .map(({ entryId }) => entryId);
}

test("reviewed location and manner words have exact readings and localized meanings", () => {
    const expected = new Map([
        ["ja:word:koko", ["ここ", "here"]],
        ["ja:word:soko", ["そこ", "there"]],
        ["ja:word:doko", ["どこ", "where"]],
        ["ja:word:iru-exist", ["いる", "to exist (animate)"]],
        ["ja:word:aru-exist", ["ある", "to exist (inanimate)"]],
        ["ja:word:kirei", ["きれい", "beautiful; clean"]],
        ["ja:word:totemo", ["とても", "very"]],
        ["ja:word:yukkuri", ["ゆっくり", "slowly; at ease"]],
        ["ja:word:desu", ["です", "to be (polite)"]],
    ]);
    for (const [id, [reading, englishDefinition]] of expected) {
        const word = words.get(id);
        assert.equal(word.label, reading);
        assert.deepEqual(word.fields.pronunciation, [reading]);
        const [definitionId] = definitionIds(word);
        const translations = definitions.get(definitionId).fields.translations;
        assert.equal(translations.en, englishDefinition);
        assert.deepEqual(Object.keys(translations).sort(), [
            "de",
            "en",
            "id",
            "ja",
        ]);
    }
});

test("reviewed location and manner sentences retain exact authored readings", () => {
    const expected = new Map([
        [
            "ja:sentence:neko-wa-koko-ni-iru",
            ["猫はここにいる", "ねこはここにいる"],
        ],
        [
            "ja:sentence:inu-wa-soko-ni-iru",
            ["犬はそこにいる", "いぬはそこにいる"],
        ],
        [
            "ja:sentence:gakkou-wa-doko-desu",
            ["学校はどこです", "がっこうはどこです"],
        ],
        [
            "ja:sentence:hana-wa-totemo-kirei",
            ["花はとてもきれいです", "はなはとてもきれいです"],
        ],
        [
            "ja:sentence:inu-wa-yukkuri-aruku",
            ["犬はゆっくり歩く", "いぬはゆっくりあるく"],
        ],
        [
            "ja:sentence:mizu-wa-koko-ni-aru",
            ["水はここにある", "みずはここにある"],
        ],
        [
            "ja:sentence:tomodachi-wa-soko-ni-iru",
            ["友達はそこにいる", "ともだちはそこにいる"],
        ],
        [
            "ja:sentence:kuruma-wa-doko-desu",
            ["車はどこです", "くるまはどこです"],
        ],
    ]);
    for (const [id, [label, reading]] of expected) {
        const sentence = sentences.get(id);
        assert.equal(sentence.label, label);
        assert.deepEqual(sentence.fields.pronunciation, [reading]);
        assert.equal(definitionIds(sentence).length, 1);
    }
});

test("lexical meanings that diverge from Kanji retain dedicated definitions", () => {
    for (const id of [
        "ja:word:kami-deity",
        "ja:word:umi",
        "ja:word:suki",
        "ja:word:watashi",
    ]) {
        assert.ok(definitionIds(words.get(id)).length > 0, id);
    }
});
