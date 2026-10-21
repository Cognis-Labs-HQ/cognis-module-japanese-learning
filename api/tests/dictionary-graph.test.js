import assert from "node:assert/strict";
import test from "node:test";
import {
    createJishoLookupProvider,
    loadNativeContent,
    jishoSuggestion,
} from "../dictionary/index.js";
import { readContentLayers } from "../reuse/content.js";

const contentRoot = "data/library/content";

function provider(wordClass = "Suffix", meanings = "teach, doctrine") {
    return createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async (url) =>
            url.startsWith("https://jisho.org/search/")
                ? new Response(
                      `<h1 class="character">教</h1><div class="kanji-details__main-meanings">${meanings}</div><dl class="kun_yomi"><dd class="kanji-details__main-readings-list"><a>おし.える</a></dd></dl><dl class="on_yomi"><dd class="kanji-details__main-readings-list"><a>キョウ</a></dd></dl>`,
                  )
                : Response.json({
                      data: [
                          {
                              slug: "教",
                              japanese: [{ word: "教", reading: "きょう" }],
                              senses: [
                                  {
                                      english_definitions: ["teach"],
                                      parts_of_speech: [wordClass],
                                  },
                              ],
                          },
                      ],
                  }),
    });
}

test("remote Kanji readings reconstruct exact stems and carry self-contained definition links", async () => {
    const [result] = await provider().lookup({
        layer: { id: "alt-characters" },
        label: "教",
    });
    assert.equal(result.class, "writing:kanji");
    assert.deepEqual(
        new Set(result.fields.pronunciation),
        new Set(["おし", "きょう"]),
    );
    const characters = (
        await readContentLayers(contentRoot, ["characters"])
    ).get("characters");
    const definitions = result.linkedEntries.filter(
        ({ entry }) => entry.layer === "definitions",
    );
    assert.deepEqual(
        definitions.map(({ entry }) => entry.fields.translations.en),
        ["teach", "doctrine"],
    );
    const readings = result.linkedEntries.filter(
        ({ entry }) => entry.class === "reading:kanji",
    );
    for (const { entry } of readings) {
        const group = entry.referenceGroups["reading-kana"][0];
        assert.equal(
            group
                .map(
                    ({ entryId }) =>
                        characters.find(({ id }) => id === entryId).label,
                )
                .join(""),
            entry.label,
        );
        const meanings = entry.references.filter(
            ({ relation }) => relation === "definitions",
        );
        assert.equal(meanings.length, 2);
        for (const { entryId } of meanings)
            assert.ok(definitions.some(({ key }) => key === entryId));
        assert.ok(
            entry.references.some(
                ({ relation, entryId }) =>
                    relation === "spelling" && entryId === "$root",
            ),
        );
    }
    for (const group of result.referenceGroups.readings)
        assert.ok(readings.some(({ key }) => key === group[0].entryId));
});

test("affixes and unmapped word senses retain semantic lexical classes", async () => {
    const [suffix] = await provider().lookup({
        layer: { id: "words" },
        label: "教",
    });
    assert.equal(suffix.class, "lexical:suffix");
    const [unknown] = await provider("Unclassified").lookup({
        layer: { id: "words" },
        label: "教",
    });
    assert.equal(unknown.class, "lexical:expression");
});

test("remote Kanji readings reuse matching packaged definitions", async () => {
    const [result] = await provider("Suffix", "cat").lookup({
        layer: { id: "alt-characters" },
        label: "教",
    });
    assert.equal(
        result.linkedEntries.some(({ entry }) => entry.layer === "definitions"),
        false,
    );
    for (const { entry } of result.linkedEntries.filter(
        ({ entry }) => entry.class === "reading:kanji",
    )) {
        assert.ok(
            entry.references.some(
                ({ relation, entryId }) =>
                    relation === "definitions" &&
                    entryId === "ja:def:kanji-core-e78cab",
            ),
        );
    }
    assert.ok(
        result.references.some(
            ({ relation, entryId }) =>
                relation === "definitions" &&
                entryId === "ja:def:kanji-core-e78cab",
        ),
    );
});

test("new dictionary verbs and adjectives select the correct provider paradigm, including adverbial forms", async () => {
    const index = await loadNativeContent(contentRoot);
    for (const [label, reading, partOfSpeech, tag, expected] of [
        ["考える", "かんがえる", "Ichidan verb", "ichidan", "考えます"],
        [
            "帰る",
            "かえる",
            "Godan verb with 'ru' ending",
            "godan-ru",
            "帰ります",
        ],
        ["笑う", "わらう", "Godan verb with 'u' ending", "godan-u", "笑います"],
        [
            "待つ",
            "まつ",
            "Godan verb with 'tsu' ending",
            "godan-tsu",
            "待ちます",
        ],
        ["死ぬ", "しぬ", "Godan verb with 'nu' ending", "godan-nu", "死にます"],
        [
            "美しい",
            "うつくしい",
            "I-adjective (keiyoushi)",
            "i-adjective",
            "美しく",
        ],
        [
            "静か",
            "しずか",
            "Na-adjective (keiyodoshi)",
            "na-adjective",
            "静かに",
        ],
    ]) {
        const suggestion = jishoSuggestion(index, "words", label, {
            data: [
                {
                    slug: label,
                    japanese: [{ word: label, reading }],
                    senses: [
                        {
                            english_definitions: ["meaning"],
                            parts_of_speech: [partOfSpeech],
                        },
                    ],
                },
            ],
        });
        assert.ok(suggestion.tags.includes(tag));
        const extraForms = {
            帰る: { negative: "帰らない", past: "帰った", "te-form": "帰って" },
            笑う: { negative: "笑わない", past: "笑った", "te-form": "笑って" },
            待つ: { negative: "待たない", past: "待った", "te-form": "待って" },
            死ぬ: { negative: "死なない", past: "死んだ", "te-form": "死んで" },
        };
        const set = index.transformSets.find(({ id }) => id === tag);
        for (const [state, value] of Object.entries(extraForms[label] ?? {})) {
            const operation = set.rules.find(
                (rule) =>
                    rule.fromState === set.baseState && rule.toState === state,
            );
            assert.ok(operation, `${label}:${state}`);
            assert.equal(
                label.slice(0, label.length - operation.removeSuffix.length) +
                    operation.append,
                value,
            );
            assert.equal(
                reading.slice(
                    0,
                    reading.length -
                        operation.pronunciation.removeSuffix.length,
                ) + operation.pronunciation.append,
                value.replace(label.slice(0, -1), reading.slice(0, -1)),
            );
        }
        const rule = set.rules.find(
            ({ id }) =>
                id ===
                (partOfSpeech.toLowerCase().includes("verb")
                    ? "polite"
                    : "adverb"),
        );
        assert.equal(
            label.slice(0, label.length - rule.removeSuffix.length) +
                rule.append,
            expected,
        );
    }
});
