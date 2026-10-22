import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { gunzipSync } from "node:zlib";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const schema = read("data/library/schema.json");
// Field contract from the pre-expansion schema, 4769593296e78a20c9763a4d919bdc44830e5209.
const fieldContract = {
    characters: {
        pronunciation: "stringList",
        audio: "audio",
        character_class: "string",
        stroke_pattern: "strokePattern",
        dictionary_data: "string",
        reference_images: "imageList",
    },
    "alt-characters": {
        jlpt_level: "string",
        pronunciation: "stringList",
        audio: "audio",
        stroke_pattern: "strokePattern",
        dictionary_data: "string",
        reference_images: "imageList",
    },
    definitions: {
        string_key: "string",
        translations: "localizedText",
        reference_images: "imageList",
    },
    words: {
        pronunciation: "stringList",
        jlpt_level: "string",
        dictionary_data: "string",
        audio: "audio",
        reference_images: "imageList",
    },
    particles: {
        jlpt_level: "string",
        pronunciation: "stringList",
        audio: "audio",
        reference_images: "imageList",
    },
    sentences: {
        jlpt_level: "string",
        pronunciation: "stringList",
        audio: "audio",
        reference_images: "imageList",
    },
};
const fieldPresentationDigests = {
    characters:
        "a4f95ece92b6786f556db51645e95f0c5ad859279096b8e70ea592c797796d50",
    "alt-characters":
        "279c4e5c013182d6f7c69e45ed6c415f837bb3205c16f82d6d0b237d685e8bb1",
    definitions:
        "13143a900de232c23f86f34e0e69e9e525ea9e364fbdb0f10563fe06b02ebe08",
    words: "81709e06aa859197857eedc013599ed81ab0b63ebe820a4505b8c704f67253b8",
    particles:
        "afdd49a36772d68f5ddc3dfaa9a333053c1607a8a4656f7ea3b56fdd64f27176",
    sentences:
        "bd7c4b1ea98a4e7efe13d9d5d94e978142ce70335d12ff98114d01e6b6efb763",
};
const originalWordShards = new Set([
    "complete-pronunciations.json",
    "content-batch-001.json",
    "foodbody-1.json",
    "foodbody-2.json",
    "foodbody-3.json",
    "foodbody-4.json",
    "foodbody-5.json",
    "foodbody-6.json",
    "foodbody-7.json",
    "foodbody-pronunciations-1.json",
    "foodbody-pronunciations-2.json",
    "foodbody-pronunciations-3.json",
    "foodbody-pronunciations-4.json",
    "foodbody-pronunciations-5.json",
    "foodbody-pronunciations-6.json",
    "foodbody-pronunciations-7.json",
    "household-1.json",
    "household-2.json",
    "household-3.json",
    "household-pronunciations-1.json",
    "household-pronunciations-2.json",
    "household-pronunciations-3.json",
    "kanji-readings-001.json",
    "kanji-readings-002.json",
    "kanji-readings-003.json",
    "kanji-readings-004.json",
    "kanji-readings-005.json",
    "kanji-readings-006.json",
    "kanji-readings-007.json",
    "sentence-structure.json",
    "vocabulary-001.json",
    "vocabulary-002.json",
]);
const records = schema.layers.flatMap((layer) =>
    readdirSync(`data/library/content/${layer.id}`)
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            read(`data/library/content/${layer.id}/${name}`).map((record) => ({
                ...record,
                layer: layer.id,
                shard: name,
            })),
        ),
);
const byId = new Map(records.map((record) => [record.id, record]));
const vocabulary = records.filter(
    (record) =>
        record.layer === "words" &&
        record.class?.startsWith("lexical:") &&
        !originalWordShards.has(record.shard),
);

function validateFields(candidateSchema, candidates) {
    for (const layer of candidateSchema.layers) {
        assert.deepEqual(
            Object.fromEntries(
                layer.fields.map((field) => [field.id, field.type]),
            ),
            fieldContract[layer.id],
            `${layer.id}: unreviewed schema fields`,
        );
    }
    for (const layer of candidateSchema.layers) {
        assert.equal(
            createHash("sha256")
                .update(JSON.stringify(layer.fields))
                .digest("hex"),
            fieldPresentationDigests[layer.id],
            `${layer.id}: reviewed field presentation changed`,
        );
    }
    for (const record of candidates) {
        for (const key of Object.keys(record.fields ?? {})) {
            assert.ok(
                Object.hasOwn(fieldContract[record.layer], key),
                `${record.id}: unexpected field ${key}`,
            );
        }
    }
}

function validateVocabulary(record, catalog = byId) {
    const role = record.class.split(":")[1];
    assert.ok(record.tags?.includes(role), `${record.id}: missing ${role} tag`);
    assert.ok(
        record.references?.some(
            ({ relation, entryId }) =>
                relation === "definitions" &&
                catalog.get(entryId)?.layer === "definitions",
        ),
        `${record.id}: missing definition`,
    );
    if (record.id.includes(":form-") || record.tags?.includes("inflected")) {
        assert.equal(
            record.hidden,
            true,
            `${record.id}: form must remain hidden`,
        );
        assert.ok(
            record.tags.includes("inflected"),
            `${record.id}: missing inflected tag`,
        );
        const parents = record.references.filter(
            ({ relation }) => relation === "inflected-from",
        );
        assert.equal(parents.length, 1, `${record.id}: missing base form`);
        const parent = catalog.get(parents[0].entryId);
        assert.ok(
            parent && !parent.hidden && parent.class === record.class,
            `${record.id}: invalid base form`,
        );
    } else {
        assert.notEqual(
            record.hidden,
            true,
            `${record.id}: lexical word must remain visible`,
        );
    }
}

test("schema and card fields retain the pre-expansion contract", () => {
    validateFields(schema, records);
});

test("schema contract rejects added usage fields even when declared", () => {
    const changed = structuredClone(schema);
    changed.layers
        .find(({ id }) => id === "words")
        .fields.push({ id: "usage_notes", type: "localizedText" });
    assert.throws(
        () => validateFields(changed, records),
        /unreviewed schema fields/,
    );
    const word = structuredClone(vocabulary.find(({ hidden }) => !hidden));
    word.fields.usage_notes = { en: "An authoring paragraph." };
    assert.throws(
        () => validateFields(schema, [word]),
        /unexpected field usage_notes/,
    );
});

test("expanded vocabulary preserves lexical roles, definitions and form parents", () => {
    for (const word of vocabulary) validateVocabulary(word);
});

test("visibility and role regressions are rejected", () => {
    const word = structuredClone(vocabulary.find(({ hidden }) => !hidden));
    word.hidden = true;
    assert.throws(() => validateVocabulary(word), /must remain visible/);
    delete word.hidden;
    word.tags = word.tags.filter((tag) => tag !== word.class.split(":")[1]);
    assert.throws(() => validateVocabulary(word), /missing .* tag/);
});

test("every expanded visible word remains selectable in a starter deck", () => {
    const decks = read("data/starter-decks.json");
    const covered = new Set(
        decks.flatMap(({ sourceRecordIds }) => sourceRecordIds),
    );
    for (const word of vocabulary.filter(({ hidden }) => !hidden)) {
        assert.ok(covered.has(word.id), `${word.id}: no starter deck`);
        const excludedTags = schema.layers.flatMap((layer) =>
            (layer.cardConstructor?.tag_carousels ?? [])
                .filter(({ excludeFromBrowse }) => excludeFromBrowse)
                .map(({ tag }) => tag),
        );
        assert.ok(
            !word.tags.some((tag) => excludedTags.includes(tag)),
            `${word.id}: excluded from ordinary browsing`,
        );
    }
});

function validateBook(catalog) {
    const word = catalog.get("ja:word:reading-time-book");
    assert.equal(word.label, "本", "book must use its authored Kanji");
    assert.deepEqual(word.fields.pronunciation, ["ほん"]);
    assert.ok(
        word.references.some(
            ({ relation, entryId }) =>
                relation === "spelling" && entryId === "ja:kanji:hon",
        ),
        "book must link its Kanji",
    );
    const wrapper = catalog.get(
        word.referenceGroups["pronunciation-readings"][0][0].entryId,
    );
    assert.equal(wrapper.class, "reading:pronunciation");
    assert.equal(wrapper.hidden, true);
    assert.ok(
        wrapper.referenceGroups["pronunciation-readings"]?.[0].some(
            ({ entryId }) =>
                entryId === "ja:word:kanji-reading-ja:kanji:hon-01",
        ),
        "book must reuse the authored Kanji reading",
    );
}

test("book preserves conventional spelling and the original pronunciation-wrapper graph", () => {
    validateBook(byId);
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        const parts = sentence.references
            .filter(({ relation }) => ["words", "particles"].includes(relation))
            .sort((a, b) => a.position - b.position);
        assert.equal(
            parts.map(({ entryId }) => byId.get(entryId).label).join(""),
            sentence.label,
            sentence.id,
        );
    }
});

test("orthography regression rejects kana replacement and bypassed Kanji reading", () => {
    const copy = () => new Map(structuredClone([...byId]));
    const kana = copy();
    kana.get("ja:word:reading-time-book").label = "ほん";
    assert.throws(() => validateBook(kana), /authored Kanji/);
    const missing = copy();
    missing.get("ja:word:reading-time-book").references = [];
    assert.throws(() => validateBook(missing), /link its Kanji/);
    const bypass = copy();
    bypass.get(
        "ja:word:complete-pronunciation-reading-time-book",
    ).referenceGroups = {};
    assert.throws(
        () => validateBook(bypass),
        /reuse the authored Kanji reading/,
    );
    assert.equal(byId.get("ja:word:travel-passport").label, "パスポート");
});

function validatePronunciationNavigation(word, catalog = byId) {
    const group = word.referenceGroups?.["pronunciation-readings"]?.[0];
    assert.equal(group?.length, 1, `${word.id}: complete reading required`);
    const reading = catalog.get(group[0].entryId);
    assert.equal(reading.class, "reading:pronunciation");
    assert.equal(reading.hidden, true);
    const meanings = (record) =>
        record.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => entryId)
            .sort();
    assert.deepEqual(
        meanings(reading),
        meanings(word),
        `${word.id}: pronunciation navigation must retain the word meaning`,
    );
}

test("new hidden pronunciation targets remain self-contained on direct navigation", () => {
    for (const word of vocabulary) validatePronunciationNavigation(word);
    const catalog = new Map(structuredClone([...byId]));
    const word = catalog.get("ja:word:containers-bottle");
    const reading = catalog.get(
        word.referenceGroups["pronunciation-readings"][0][0].entryId,
    );
    reading.references = [];
    assert.throws(
        () => validatePronunciationNavigation(word, catalog),
        /retain the word meaning/,
    );
});

const reviewedSpellings = {
    "ja:word:soredemo": "それでも",
    "ja:word:desuga": "ですが",
    "ja:word:dakedo": "だけど",
    "ja:word:shikashi": "しかし",
    "ja:word:soshite": "そして",
    "ja:word:sorekara": "それから",
    "ja:word:dakara": "だから",
    "ja:word:nanode": "なので",
    "ja:word:da-copula": "だ",
    "ja:word:containers-bottle": "瓶",
    "ja:word:containers-box": "箱",
    "ja:word:containers-basket": "かご",
    "ja:word:containers-envelope": "封筒",
    "ja:word:household-wash": "洗う",
    "ja:word:household-cook": "料理する",
    "ja:word:household-clean": "掃除する",
    "ja:word:household-dry": "乾かす",
    "ja:word:material-feel-hard": "硬い",
    "ja:word:material-feel-soft": "柔らかい",
    "ja:word:recreation-ball": "ボール",
    "ja:word:recreation-racket": "ラケット",
    "ja:word:greetings-morning": "おはようございます",
    "ja:word:greetings-evening": "こんばんは",
    "ja:word:greetings-night": "おやすみなさい",
    "ja:word:greetings-later": "またね",
    "ja:word:actions-jump": "跳ぶ",
    "ja:word:actions-swim": "泳ぐ",
    "ja:word:actions-laugh": "笑う",
    "ja:word:actions-cry": "泣く",
    "ja:word:places-library": "図書館",
    "ja:word:places-hospital": "病院",
    "ja:word:places-supermarket": "スーパー",
    "ja:word:places-restaurant": "レストラン",
    "ja:word:social-greeting": "こんにちは",
    "ja:word:social-gratitude": "ありがとうございます",
    "ja:word:social-attention": "すみません",
    "ja:word:social-farewell": "さようなら",
    "ja:word:craft-cut": "切る",
    "ja:word:craft-fold": "折る",
    "ja:word:width-wide": "広い",
    "ja:word:width-narrow": "狭い",
    "ja:word:comprehension-understand": "分かる",
    "ja:word:banana": "バナナ",
    "ja:word:orange": "オレンジ",
    "ja:word:grape": "ぶどう",
    "ja:word:strawberry": "いちご",
    "ja:word:lemon": "レモン",
    "ja:word:courtesy-sorry": "ごめんなさい",
    "ja:word:courtesy-welcome": "ようこそ",
    "ja:word:requests-yes": "はい",
    "ja:word:requests-no": "いいえ",
    "ja:word:requests-please": "お願いします",
    "ja:word:requests-repeat": "もう一度",
    "ja:word:directions-left": "左",
    "ja:word:directions-right": "右",
    "ja:word:directions-north": "北",
    "ja:word:directions-south": "南",
    "ja:word:hat": "帽子",
    "ja:word:coat": "コート",
    "ja:word:key": "鍵",
    "ja:word:phone": "電話",
    "ja:word:computer": "パソコン",
    "ja:word:travel-bicycle": "自転車",
    "ja:word:travel-map": "地図",
    "ja:word:rooms-bedroom": "寝室",
    "ja:word:rooms-bathroom": "浴室",
    "ja:word:rooms-kitchen": "台所",
    "ja:word:rooms-garden": "庭",
    "ja:word:reading-time-morning": "朝",
    "ja:word:reading-time-night": "夜",
    "ja:word:reading-time-book": "本",
    "ja:word:reading-time-newspaper": "新聞",
    "ja:word:animals-rabbit": "うさぎ",
    "ja:word:animals-horse": "馬",
    "ja:word:animals-cow": "牛",
    "ja:word:animals-pig": "豚",
    "ja:word:mouth": "口",
    "ja:word:hand": "手",
    "ja:word:foot": "足",
    "ja:word:arm": "腕",
    "ja:word:tooth": "歯",
    "ja:word:weather-sun": "太陽",
    "ja:word:weather-snow": "雪",
    "ja:word:weather-wind": "風",
    "ja:word:weather-cloud": "雲",
    "ja:word:table": "テーブル",
    "ja:word:chair": "椅子",
    "ja:word:bed": "ベッド",
    "ja:word:bag": "かばん",
    "ja:word:shoe": "靴",
    "ja:word:travel-passport": "パスポート",
    "ja:word:travel-suitcase": "スーツケース",
    "ja:word:belongings-wallet": "財布",
    "ja:word:belongings-camera": "カメラ",
    "ja:word:belongings-glasses": "眼鏡",
    "ja:word:belongings-watch": "腕時計",
    "ja:word:butter": "バター",
    "ja:word:head": "頭",
    "ja:word:face": "顔",
    "ja:word:eye": "目",
    "ja:word:ear": "耳",
    "ja:word:finger": "指",
    "ja:word:neck": "首",
    "ja:word:back": "背中",
    "ja:word:stomach": "お腹",
    "ja:word:shoulder": "肩",
    "ja:word:fixtures-fridge": "冷蔵庫",
    "ja:word:fixtures-oven": "オーブン",
    "ja:word:fixtures-sink": "流し",
    "ja:word:fixtures-shower": "シャワー",
    "ja:word:clock": "時計",
    "ja:word:umbrella": "傘",
    "ja:word:egg": "卵",
    "ja:word:rice": "ご飯",
    "ja:word:fish": "魚",
    "ja:word:kitchen-bowl": "ボウル",
    "ja:word:kitchen-knife": "ナイフ",
    "ja:word:kitchen-pot": "鍋",
    "ja:word:kitchen-pan": "フライパン",
    "ja:word:kami-hair": "髪",
    "ja:word:kami-deity": "神",
    "ja:word:kuruma": "車",
    "ja:word:densha": "電車",
    "ja:word:gakkou": "学校",
    "ja:word:sensei": "先生",
    "ja:word:gakusei": "学生",
    "ja:word:tomodachi": "友達",
    "ja:word:taberu": "食べる",
    "ja:word:nomu": "飲む",
    "ja:word:miru": "見る",
    "ja:word:iku": "行く",
    "ja:word:kuru": "来る",
    "ja:word:ookii": "大きい",
    "ja:word:chiisai": "小さい",
    "ja:word:naosu": "直す",
    "ja:word:manabu": "学ぶ",
    "ja:word:aruku": "歩く",
    "ja:word:nihon": "日本",
    "ja:word:delivery-send": "送る",
    "ja:word:delivery-carry": "運ぶ",
    "ja:word:care-soap": "石けん",
    "ja:word:care-towel": "タオル",
    "ja:word:care-toothbrush": "歯ブラシ",
    "ja:word:care-toothpaste": "歯磨き粉",
    "ja:word:depth-deep": "深い",
    "ja:word:depth-shallow": "浅い",
    "ja:word:koko": "ここ",
    "ja:word:soko": "そこ",
    "ja:word:doko": "どこ",
    "ja:word:iru-exist": "いる",
    "ja:word:aru-exist": "ある",
    "ja:word:kirei": "きれい",
    "ja:word:totemo": "とても",
    "ja:word:yukkuri": "ゆっくり",
    "ja:word:desu": "です",
    "ja:word:nature-tree": "木",
    "ja:word:nature-forest": "森",
    "ja:word:nature-leaf": "葉っぱ",
    "ja:word:nature-stone": "石",
    "ja:word:travel-ticket": "切符",
    "ja:word:travel-station": "駅",
    "ja:word:school-pencil": "鉛筆",
    "ja:word:school-pen": "ペン",
    "ja:word:school-notebook": "ノート",
    "ja:word:school-ruler": "定規",
    "ja:word:wildlife-fox": "きつね",
    "ja:word:wildlife-bear": "熊",
    "ja:word:wildlife-monkey": "猿",
    "ja:word:wildlife-elephant": "象",
    "ja:word:seasons-spring": "春",
    "ja:word:seasons-summer": "夏",
    "ja:word:seasons-autumn": "秋",
    "ja:word:seasons-winter": "冬",
    "ja:word:furnishings-sofa": "ソファ",
    "ja:word:furnishings-lamp": "ランプ",
    "ja:word:furnishings-mirror": "鏡",
    "ja:word:furnishings-pillow": "枕",
    "ja:word:frequency-often": "よく",
    "ja:word:frequency-sometimes": "時々",
    "ja:word:frequency-usually": "大抵",
    "ja:word:frequency-again": "また",
    "ja:word:travel-platform": "ホーム",
    "ja:word:travel-airport": "空港",
    "ja:word:transport-airplane": "飛行機",
    "ja:word:transport-boat": "ボート",
    "ja:word:transport-taxi": "タクシー",
    "ja:word:transport-motorcycle": "オートバイ",
    "ja:word:clothing-shirt": "シャツ",
    "ja:word:clothing-dress": "ワンピース",
    "ja:word:clothing-sock": "靴下",
    "ja:word:clothing-skirt": "スカート",
    "ja:word:core-read": "読む",
    "ja:word:core-write": "書く",
    "ja:word:core-speak": "話す",
    "ja:word:core-sleep": "寝る",
    "ja:word:travel-buy": "買う",
    "ja:word:travel-wait": "待つ",
    "ja:word:posture-sit": "座る",
    "ja:word:posture-stand": "立つ",
    "ja:word:knee": "膝",
    "ja:word:skin": "肌",
    "ja:word:travel-arrive": "着く",
    "ja:word:travel-depart": "出発する",
    "ja:word:force-push": "押す",
    "ja:word:force-pull": "引く",
    "ja:word:qualities-heavy": "重い",
    "ja:word:qualities-light": "軽い",
    "ja:word:qualities-easy": "易しい",
    "ja:word:qualities-difficult": "難しい",
    "ja:word:warm-accessories-scarf": "マフラー",
    "ja:word:warm-accessories-glove": "手袋",
    "ja:word:location-inside": "中",
    "ja:word:location-outside": "外",
    "ja:word:colors-red": "赤",
    "ja:word:colors-blue": "青",
    "ja:word:colors-green": "緑",
    "ja:word:colors-yellow": "黄色",
    "ja:word:soup": "スープ",
    "ja:word:cheese": "チーズ",
    "ja:word:meat": "肉",
    "ja:word:chicken": "鶏肉",
    "ja:word:beef": "牛肉",
    "ja:word:tableware-cup": "カップ",
    "ja:word:tableware-plate": "皿",
    "ja:word:tableware-spoon": "スプーン",
    "ja:word:tableware-fork": "フォーク",
    "ja:word:fruit-peach": "桃",
    "ja:word:fruit-pear": "梨",
    "ja:word:fruit-watermelon": "すいか",
    "ja:word:fruit-pineapple": "パイナップル",
    "ja:word:correspondence-letter": "手紙",
    "ja:word:correspondence-postcard": "葉書",
    "ja:word:exchange-give": "あげる",
    "ja:word:exchange-receive": "もらう",
    "ja:word:carrot": "にんじん",
    "ja:word:potato": "じゃがいも",
    "ja:word:tomato": "トマト",
    "ja:word:onion": "たまねぎ",
    "ja:word:cucumber": "きゅうり",
    "ja:word:length-long": "長い",
    "ja:word:length-short": "短い",
    "ja:word:light-level-bright": "明るい",
    "ja:word:light-level-dark": "暗い",
    "ja:word:nihongo": "日本語",
    "ja:word:ka-day-counter": "日",
    "ja:word:suki": "好き",
    "ja:word:watashi": "私",
    "ja:word:mizu": "水",
    "ja:word:inu": "犬",
    "ja:word:neko": "猫",
    "ja:word:yama": "山",
    "ja:word:kawa-river": "川",
    "ja:word:umi": "海",
    "ja:word:sora": "空",
    "ja:word:hana-flower": "花",
    "ja:word:hana-nose": "鼻",
    "ja:word:hashi-bridge": "橋",
    "ja:word:hashi-chopsticks": "箸",
    "ja:word:ame-rain": "雨",
    "ja:word:ame-candy": "飴",
    "ja:word:kami-paper": "紙",
    "ja:word:time-tomorrow": "明日",
    "ja:word:time-yesterday": "昨日",
    "ja:word:time-soon": "もうすぐ",
    "ja:word:time-later": "後で",
    "ja:word:stationery-eraser": "消しゴム",
    "ja:word:stationery-scissors": "はさみ",
    "ja:word:stationery-tape": "テープ",
    "ja:word:stationery-stapler": "ホチキス",
    "ja:word:outings-museum": "博物館",
    "ja:word:outings-zoo": "動物園",
    "ja:word:vegetables-cabbage": "キャベツ",
    "ja:word:vegetables-mushroom": "きのこ",
    "ja:word:vegetables-spinach": "ほうれん草",
    "ja:word:vegetables-lettuce": "レタス",
};

function validateSpelling(word, catalog = byId) {
    assert.equal(
        word.label,
        reviewedSpellings[word.id],
        `${word.id}: conventional spelling changed`,
    );
    const spelling = word.references.filter(
        ({ relation }) => relation === "spelling",
    );
    for (const [position, character] of [...word.label].entries()) {
        // The iteration mark repeats the preceding Kanji; it has no independent reading.
        if (character === "々" || !/\p{Script=Han}/u.test(character)) continue;
        const reference = spelling.find((item) => item.position === position);
        assert.equal(
            catalog.get(reference?.entryId)?.label,
            character,
            `${word.id}: missing Kanji spelling component`,
        );
        assert.equal(catalog.get(reference.entryId).layer, "alt-characters");
    }
}

function validateReviewCoverage(visible, decisions) {
    assert.deepEqual(
        visible.map(({ id }) => id).sort(),
        Object.keys(decisions).sort(),
        "Every visible word needs a sense-specific spelling decision, regardless of shard age",
    );
}

test("every visible vocabulary card retains reviewed orthography and authored Kanji links", () => {
    const visible = records.filter(
        (record) =>
            record.layer === "words" &&
            record.class?.startsWith("lexical:") &&
            !record.hidden,
    );
    validateReviewCoverage(visible, reviewedSpellings);
    const incomplete = { ...reviewedSpellings };
    delete incomplete["ja:word:face"];
    assert.throws(
        () => validateReviewCoverage(visible, incomplete),
        /Every visible word/,
    );
    for (const word of visible) validateSpelling(word);
    const face = structuredClone(byId.get("ja:word:face"));
    face.label = "かお";
    assert.throws(() => validateSpelling(face), /conventional spelling/);
    face.label = "顔";
    face.references = face.references.filter(
        ({ relation }) => relation !== "spelling",
    );
    assert.throws(() => validateSpelling(face), /missing Kanji spelling/);
    const bottle = structuredClone(byId.get("ja:word:containers-bottle"));
    bottle.label = "びん";
    assert.throws(() => validateSpelling(bottle), /conventional spelling/);
    bottle.label = "瓶";
    bottle.references = bottle.references.filter(
        ({ relation }) => relation !== "spelling",
    );
    assert.throws(() => validateSpelling(bottle), /missing Kanji spelling/);
});

test("supporting Kanji readings come from bundled KANJIDIC rather than guessed compound splits", () => {
    const dictionary = new Map();
    for (const name of readdirSync("data/reference").filter((name) =>
        name.endsWith(".json.gz"),
    )) {
        const shard = JSON.parse(
            gunzipSync(readFileSync(`data/reference/${name}`)).toString("utf8"),
        );
        for (const [label, records] of Object.entries(shard))
            dictionary.set(label, records[0]);
    }
    const normalize = (reading) =>
        [...reading.replaceAll("-", "").split(".")[0]]
            .map((character) => {
                const point = character.codePointAt(0);
                return point >= 0x30a1 && point <= 0x30f6
                    ? String.fromCodePoint(point - 0x60)
                    : character;
            })
            .join("");
    for (const kanji of records.filter(({ id }) =>
        id.startsWith("ja:kanji:expanded-"),
    )) {
        const source = dictionary.get(kanji.label).kanji.readings;
        const attested = new Set([...source.kun, ...source.on].map(normalize));
        for (const reading of kanji.fields.pronunciation)
            assert.ok(
                attested.has(reading),
                `${kanji.label}: unattested reading ${reading}`,
            );
    }
});

// Each retained kana spelling is reviewed by sense, not exempted by its source shard.
const retainedKanaReasons = {
    "ja:word:soredemo": "Conjunction normally written in kana.",
    "ja:word:desuga":
        "Polite copula plus connective particle, written in kana.",
    "ja:word:dakedo": "Plain copula plus connective particle, written in kana.",
    "ja:word:shikashi": "Conjunction normally written in kana.",
    "ja:word:soshite": "Conjunction normally written in kana.",
    "ja:word:sorekara": "Pronominal connective normally written in kana.",
    "ja:word:dakara": "Copular connective normally written in kana.",
    "ja:word:nanode": "Copular connective normally written in kana.",
    "ja:word:da-copula": "Plain copula, written in kana.",
    "ja:word:containers-basket":
        "Basket commonly uses kana; 籠 is an optional uncommon character spelling.",
    "ja:word:recreation-ball":
        "Loanword for ボール uses its conventional katakana spelling.",
    "ja:word:recreation-racket":
        "Loanword for ラケット uses its conventional katakana spelling.",
    "ja:word:greetings-morning":
        "Conventional greeting uses kana rather than etymological 早.",
    "ja:word:greetings-evening":
        "Fixed greeting, kana spelling retains particle は.",
    "ja:word:greetings-night":
        "Fixed greeting conventionally written in kana; お休みなさい is also valid.",
    "ja:word:greetings-later": "Casual farewell normally written in kana.",
    "ja:word:places-supermarket":
        "Loanword for スーパー uses its conventional katakana spelling.",
    "ja:word:places-restaurant":
        "Loanword for レストラン uses its conventional katakana spelling.",
    "ja:word:social-greeting":
        "Fixed greeting, kana spelling retains particle は.",
    "ja:word:social-gratitude":
        "Polite gratitude formula normally written in kana.",
    "ja:word:social-attention":
        "Attention-getting formula normally written in kana.",
    "ja:word:social-farewell": "Fixed farewell normally written in kana.",
    "ja:word:banana":
        "Loanword for バナナ uses its conventional katakana spelling.",
    "ja:word:orange":
        "Loanword for オレンジ uses its conventional katakana spelling.",
    "ja:word:grape":
        "Fruit commonly written in kana; 葡萄 is optional uncommon kanji.",
    "ja:word:strawberry":
        "Fruit commonly written in kana; 苺 is optional uncommon kanji.",
    "ja:word:lemon":
        "Loanword for レモン uses its conventional katakana spelling.",
    "ja:word:courtesy-sorry": "Fixed apology normally written in kana.",
    "ja:word:courtesy-welcome": "Fixed greeting normally written in kana.",
    "ja:word:requests-yes": "Response word conventionally written in kana.",
    "ja:word:requests-no": "Response word conventionally written in kana.",
    "ja:word:coat":
        "Loanword for コート uses its conventional katakana spelling.",
    "ja:word:computer":
        "Loanword for パソコン uses its conventional katakana spelling.",
    "ja:word:animals-rabbit":
        "Animal commonly written in kana; 兎 is an optional kanji spelling.",
    "ja:word:table":
        "Loanword for テーブル uses its conventional katakana spelling.",
    "ja:word:bed":
        "Loanword for ベッド uses its conventional katakana spelling.",
    "ja:word:bag":
        "Bag commonly written in kana; 鞄 is an optional uncommon kanji spelling.",
    "ja:word:travel-passport":
        "Loanword for パスポート uses its conventional katakana spelling.",
    "ja:word:travel-suitcase":
        "Loanword for スーツケース uses its conventional katakana spelling.",
    "ja:word:belongings-camera":
        "Loanword for カメラ uses its conventional katakana spelling.",
    "ja:word:butter":
        "Loanword for バター uses its conventional katakana spelling.",
    "ja:word:fixtures-oven":
        "Loanword for オーブン uses its conventional katakana spelling.",
    "ja:word:fixtures-shower":
        "Loanword for シャワー uses its conventional katakana spelling.",
    "ja:word:kitchen-bowl":
        "Loanword for ボウル uses its conventional katakana spelling.",
    "ja:word:kitchen-knife":
        "Loanword for ナイフ uses its conventional katakana spelling.",
    "ja:word:kitchen-pan":
        "Loanword for フライパン uses its conventional katakana spelling.",
    "ja:word:care-towel":
        "Loanword for タオル uses its conventional katakana spelling.",
    "ja:word:koko": "Demonstrative location word normally written in kana.",
    "ja:word:soko": "Demonstrative location word normally written in kana.",
    "ja:word:doko": "Interrogative location word normally written in kana.",
    "ja:word:iru-exist":
        "Existential verb commonly written in kana; 居る is also valid.",
    "ja:word:aru-exist":
        "Existential verb commonly written in kana; 有る and 在る are sense-specific alternatives.",
    "ja:word:kirei": "Beautiful/clean commonly uses kana; 綺麗 is also valid.",
    "ja:word:totemo": "Degree adverb conventionally written in kana.",
    "ja:word:yukkuri": "Manner adverb conventionally written in kana.",
    "ja:word:desu": "Polite copula, written in kana.",
    "ja:word:school-pen":
        "Loanword for ペン uses its conventional katakana spelling.",
    "ja:word:school-notebook":
        "Loanword for ノート uses its conventional katakana spelling.",
    "ja:word:wildlife-fox":
        "Animal commonly written in kana; 狐 is an optional kanji spelling.",
    "ja:word:furnishings-sofa":
        "Loanword for ソファ uses its conventional katakana spelling.",
    "ja:word:furnishings-lamp":
        "Loanword for ランプ uses its conventional katakana spelling.",
    "ja:word:frequency-often":
        "Frequency sense often uses kana; 良く can imply goodness instead.",
    "ja:word:frequency-again":
        "Repetition adverb commonly written in kana; 又 is optional.",
    "ja:word:travel-platform":
        "Loanword for ホーム uses its conventional katakana spelling.",
    "ja:word:transport-boat":
        "Loanword for ボート uses its conventional katakana spelling.",
    "ja:word:transport-taxi":
        "Loanword for タクシー uses its conventional katakana spelling.",
    "ja:word:transport-motorcycle":
        "Loanword for オートバイ uses its conventional katakana spelling.",
    "ja:word:clothing-shirt":
        "Loanword for シャツ uses its conventional katakana spelling.",
    "ja:word:clothing-dress":
        "Loanword for ワンピース uses its conventional katakana spelling.",
    "ja:word:clothing-skirt":
        "Loanword for スカート uses its conventional katakana spelling.",
    "ja:word:warm-accessories-scarf":
        "Loanword for マフラー uses its conventional katakana spelling.",
    "ja:word:soup":
        "Loanword for スープ uses its conventional katakana spelling.",
    "ja:word:cheese":
        "Loanword for チーズ uses its conventional katakana spelling.",
    "ja:word:tableware-cup":
        "Loanword for カップ uses its conventional katakana spelling.",
    "ja:word:tableware-spoon":
        "Loanword for スプーン uses its conventional katakana spelling.",
    "ja:word:tableware-fork":
        "Loanword for フォーク uses its conventional katakana spelling.",
    "ja:word:fruit-watermelon":
        "Fruit commonly written in kana; 西瓜 is an optional kanji spelling.",
    "ja:word:fruit-pineapple":
        "Loanword for パイナップル uses its conventional katakana spelling.",
    "ja:word:exchange-give":
        "Giving verb commonly written in kana; 上げる also denotes raising and can blur the taught sense.",
    "ja:word:exchange-receive":
        "Receiving verb normally written in kana; 貰う is an uncommon kanji alternative.",
    "ja:word:carrot": "Vegetable commonly written in kana; 人参 is also valid.",
    "ja:word:potato":
        "Vegetable normally written in kana; 馬鈴薯 uses a different reading.",
    "ja:word:tomato":
        "Loanword for トマト uses its conventional katakana spelling.",
    "ja:word:onion":
        "Vegetable commonly written in kana; 玉ねぎ is also valid.",
    "ja:word:cucumber":
        "Vegetable commonly written in kana; 胡瓜 is an optional uncommon spelling.",
    "ja:word:time-soon": "Adverbial phrase conventionally written in kana.",
    "ja:word:stationery-scissors":
        "Tool commonly written in kana; 鋏 is an uncommon kanji alternative.",
    "ja:word:stationery-tape":
        "Loanword for テープ uses its conventional katakana spelling.",
    "ja:word:stationery-stapler":
        "Loanword for ホチキス uses its conventional katakana spelling.",
    "ja:word:vegetables-cabbage":
        "Loanword for キャベツ uses its conventional katakana spelling.",
    "ja:word:vegetables-mushroom":
        "Generic mushroom normally written in kana; 茸 is an uncommon kanji alternative.",
    "ja:word:vegetables-lettuce":
        "Loanword for レタス uses its conventional katakana spelling.",
};

test("every retained kana-only word has an explicit sense-specific spelling decision", () => {
    const kanaOnly = Object.entries(reviewedSpellings).filter(
        ([, label]) => !/\p{Script=Han}/u.test(label),
    );
    assert.deepEqual(
        kanaOnly.map(([id]) => id).sort(),
        Object.keys(retainedKanaReasons).sort(),
    );
    for (const [id] of kanaOnly)
        assert.ok(retainedKanaReasons[id].length > 20, id);
});

// NINJAL: https://mmsrv.ninjal.ac.jp/kamus/data/item1297.html
function validateDayCounter(catalog) {
    const counter = catalog.get("ja:word:ka-day-counter");
    validateSpelling(counter, catalog);
    assert.equal(counter.class, "lexical:counter");
    assert.deepEqual(
        counter.fields.pronunciation,
        ["か"],
        "day counter must retain its contextual reading",
    );
    assert.ok(
        counter.references.some(
            ({ relation, entryId }) =>
                relation === "definitions" && entryId === "ja:def:reading-ka",
        ),
    );
    const wrapper = catalog.get(
        counter.referenceGroups["pronunciation-readings"][0][0].entryId,
    );
    assert.equal(wrapper.class, "reading:pronunciation");
    assert.equal(wrapper.label, "か");
    assert.equal(
        wrapper.referenceGroups["pronunciation-readings"][0][0].entryId,
        "ja:word:kanji-reading-ja:kanji:nichi-04",
    );
}

test("day counter uses 日 with its lexical meaning and existing か reading graph", () => {
    validateDayCounter(byId);
    const changed = new Map(structuredClone([...byId]));
    changed.get("ja:word:ka-day-counter").fields.pronunciation = ["にち"];
    assert.throws(() => validateDayCounter(changed), /contextual reading/);
});

test("sense-specific kana words reject misleading Kanji substitutions", () => {
    for (const [id, label] of [
        ["ja:word:frequency-often", "良く"],
        ["ja:word:exchange-give", "上げる"],
    ]) {
        const changed = structuredClone(byId.get(id));
        changed.label = label;
        assert.throws(() => validateSpelling(changed), /conventional spelling/);
    }
});
