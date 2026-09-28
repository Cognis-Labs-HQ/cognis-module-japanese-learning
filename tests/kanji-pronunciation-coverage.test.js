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
const SOURCE_READINGS = Object.freeze({
    見: {
        kun: ["み.る", "み.える", "み.せる"],
        on: ["ケン"],
    },
    行: {
        kun: [
            "い.く",
            "ゆ.く",
            "-ゆ.き",
            "-ゆき",
            "-い.き",
            "-いき",
            "おこな.う",
            "おこ.なう",
        ],
        on: ["コウ", "ギョウ", "アン"],
    },
    来: {
        kun: ["く.る", "きた.る", "きた.す", "き.たす", "き.たる", "き", "こ"],
        on: ["ライ", "タイ"],
    },
    大: {
        kun: ["おお-", "おお.きい", "-おお.いに"],
        on: ["ダイ", "タイ"],
    },
    小: {
        kun: ["ちい.さい", "こ-", "お-", "さ-"],
        on: ["ショウ"],
    },
    直: {
        kun: [
            "ただ.ちに",
            "なお.す",
            "-なお.す",
            "なお.る",
            "なお.き",
            "す.ぐ",
        ],
        on: ["チョク", "ジキ", "ジカ"],
    },
    好: {
        kun: ["この.む", "す.く", "よ.い", "い.い"],
        on: ["コウ"],
    },
    歩: {
        kun: ["ある.く", "あゆ.む"],
        on: ["ホ", "ブ", "フ"],
    },
    猫: {
        kun: ["ねこ"],
        on: ["ビョウ"],
    },
    山: {
        kun: ["やま"],
        on: ["サン", "セン"],
    },
    川: {
        kun: ["かわ"],
        on: ["セン"],
    },
    海: {
        kun: ["うみ"],
        on: ["カイ"],
    },
    空: {
        kun: [
            "そら",
            "あ.く",
            "あ.き",
            "あ.ける",
            "から",
            "す.く",
            "す.かす",
            "むな.しい",
        ],
        on: ["クウ"],
    },
    花: {
        kun: ["はな"],
        on: ["カ", "ケ"],
    },
    鼻: {
        kun: ["はな"],
        on: ["ビ"],
    },
    橋: {
        kun: ["はし"],
        on: ["キョウ"],
    },
    箸: {
        kun: ["はし"],
        on: ["チョ", "チャク"],
    },
    雨: {
        kun: ["あめ", "あま-", "-さめ"],
        on: ["ウ"],
    },
    飴: {
        kun: ["あめ", "やしな.う"],
        on: ["イ", "シ"],
    },
    紙: {
        kun: ["かみ"],
        on: ["シ"],
    },
    髪: {
        kun: ["かみ"],
        on: ["ハツ"],
    },
    神: {
        kun: ["かみ", "かん-", "こう-"],
        on: ["シン", "ジン"],
    },
    車: {
        kun: ["くるま"],
        on: ["シャ"],
    },
    電: {
        kun: [],
        on: ["デン"],
    },
    学: {
        kun: ["まな.ぶ"],
        on: ["ガク"],
    },
    校: {
        kun: [],
        on: ["コウ", "キョウ"],
    },
    先: {
        kun: ["さき", "ま.ず"],
        on: ["セン"],
    },
    生: {
        kun: [
            "い.きる",
            "い.かす",
            "い.ける",
            "う.まれる",
            "うま.れる",
            "う.まれ",
            "うまれ",
            "う.む",
            "お.う",
            "は.える",
            "は.やす",
            "き",
            "なま",
            "なま-",
            "な.る",
            "な.す",
            "む.す",
            "-う",
        ],
        on: ["セイ", "ショウ"],
    },
    友: {
        kun: ["とも"],
        on: ["ユウ"],
    },
    達: {
        kun: ["-たち"],
        on: ["タツ", "ダ"],
    },
    食: {
        kun: ["く.う", "く.らう", "た.べる", "は.む"],
        on: ["ショク", "ジキ"],
    },
    飲: {
        kun: ["の.む", "-の.み"],
        on: ["イン", "オン"],
    },
    私: {
        kun: ["わたくし", "わたし"],
        on: ["シ"],
    },
    水: {
        kun: ["みず", "みず-"],
        on: ["スイ"],
    },
    犬: {
        kun: ["いぬ", "いぬ-"],
        on: ["ケン"],
    },
    人: {
        kun: ["ひと", "-り", "-と"],
        on: ["ジン", "ニン"],
    },
    日: {
        kun: ["ひ", "-び", "-か"],
        on: ["ニチ", "ジツ"],
    },
    本: {
        kun: ["もと"],
        on: ["ホン"],
    },
    語: {
        kun: ["かた.る", "かた.らう"],
        on: ["ゴ"],
    },
});
const REVIEWED_CONTEXTUAL_READINGS = Object.freeze({ 達: ["だち"] });

function load(layer) {
    return readdirSync(path.join(CONTENT_ROOT, layer))
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            JSON.parse(
                readFileSync(path.join(CONTENT_ROOT, layer, name), "utf8"),
            ),
        );
}

function hiragana(value) {
    return [...value]
        .map((character) => {
            const codePoint = character.codePointAt(0);
            return codePoint >= 0x30a1 && codePoint <= 0x30f6
                ? String.fromCodePoint(codePoint - 0x60)
                : character;
        })
        .join("");
}

function normalizedReading(value) {
    return hiragana(value.replaceAll("-", "").split(".")[0]);
}

test("every packaged Kanji covers its reviewed KANJIDIC on and kun readings", () => {
    const kanji = load("alt-characters");
    assert.deepEqual(
        new Set(kanji.map(({ label }) => label)),
        new Set(Object.keys(SOURCE_READINGS)),
    );
    for (const entry of kanji) {
        const source = SOURCE_READINGS[entry.label];
        const expected = [
            ...new Set([...source.kun, ...source.on].map(normalizedReading)),
            ...(REVIEWED_CONTEXTUAL_READINGS[entry.label] ?? []),
        ];
        assert.deepEqual(
            new Set(entry.fields.pronunciation),
            new Set(expected),
            entry.label,
        );
        assert.equal(
            entry.referenceGroups.readings.length,
            expected.length,
            entry.label,
        );
    }
});
