import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
    createJishoLookupProvider,
    registerJishoLookupProvider,
} from "../api/jisho-lookup-provider.js";

const contentRoot = path.resolve(
    import.meta.dirname,
    "..",
    "data",
    "library",
    "content",
);
const schema = { id: "japanese-core", language: "ja" };
const wordLayer = { id: "words" };
const kanjiLayer = { id: "alt-characters" };

function jishoResponse() {
    return {
        data: [
            {
                slug: "猫又",
                is_common: false,
                tags: [],
                jlpt: ["jlpt-n2"],
                japanese: [{ word: "猫又", reading: "ねこまた" }],
                senses: [
                    {
                        english_definitions: ["mythical two-tailed cat"],
                        parts_of_speech: ["Noun"],
                    },
                ],
            },
        ],
    };
}

test("Jisho provider publishes localized composer metadata", () => {
    const provider = createJishoLookupProvider({ contentRoot });
    assert.equal(provider.id, "study-language-ja:jisho");
    assert.deepEqual(Object.keys(provider.metadata.labels).sort(), [
        "de",
        "en",
        "id",
        "ja",
    ]);
    assert.equal(provider.supports(schema, wordLayer), true);
    assert.equal(provider.supports(schema, kanjiLayer), true);
    assert.equal(provider.supports(schema, { id: "sentences" }), false);
});

test("Jisho provider resolves native content before network lookup", async () => {
    let requests = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            throw new Error("unexpected request");
        },
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "猫",
    });
    assert.equal(requests, 0);
    assert.equal(suggestion.label, "猫");
    assert.deepEqual(suggestion.fields.pronunciation, ["ねこ"]);
    assert.deepEqual(suggestion.referenceGroups["pronunciation-readings"], [
        [
            {
                entryId: "ja:word:pronunciation-neko",
                relation: "pronunciation-readings",
                position: 0,
            },
        ],
    ]);
    assert.match(suggestion.provenance, /^cognis-japanese:/);
    assert.equal(suggestion.confidence, 1);
});

test("Jisho provider populates fields, detects links, and caches requests", async () => {
    const requests = [];
    const provider = createJishoLookupProvider({
        contentRoot,
        endpoint: "https://jisho.test/api",
        async fetchImplementation(url, options) {
            requests.push({ url, options });
            return {
                ok: true,
                async json() {
                    return jishoResponse();
                },
            };
        },
    });
    const input = { schema, layer: wordLayer, label: "猫又" };
    const [first] = await provider.lookup(input);
    const [second] = await provider.lookup(input);
    assert.equal(requests.length, 1);
    assert.equal(
        requests[0].url,
        "https://jisho.test/api?keyword=%E7%8C%AB%E5%8F%88",
    );
    assert.equal(requests[0].options.headers.accept, "application/json");
    assert.equal(first.label, "猫又");
    assert.equal(first.fields.pronunciation, undefined);
    assert.equal(first.fields.jlpt_level, "N2");
    assert.deepEqual(
        first.references.filter(({ relation }) => relation === "spelling"),
        [
            {
                entryId: "ja:kanji:core-e78cab",
                relation: "spelling",
                position: 0,
            },
        ],
    );
    assert.deepEqual(
        first.referenceGroups["reading-kana"][0].map(
            ({ entryId, position }) => ({ entryId, position }),
        ),
        [
            { entryId: "ja:char:ne", position: 0 },
            { entryId: "ja:char:ko", position: 1 },
            { entryId: "ja:char:ma", position: 2 },
            { entryId: "ja:char:ta", position: 3 },
        ],
    );
    assert.deepEqual(second, first);
    assert.equal(first.provenance, "jisho:猫又");
});

test("Jisho provider does not query invalid or unrelated input", async () => {
    let requests = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            return {
                ok: true,
                async json() {
                    return { data: [] };
                },
            };
        },
    });
    assert.deepEqual(
        await provider.lookup({ schema, layer: wordLayer, label: "cat" }),
        [],
    );
    assert.deepEqual(
        await provider.lookup({
            schema,
            layer: { id: "sentences" },
            label: "猫",
        }),
        [],
    );
    assert.deepEqual(
        await provider.lookup({
            schema,
            layer: { id: "characters" },
            label: "龍",
        }),
        [],
    );
    assert.equal(requests, 0);
});

test("Jisho provider never emits a partial Kana pronunciation group", async () => {
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            return {
                ok: true,
                async json() {
                    return {
                        data: [
                            {
                                slug: "コーヒー",
                                japanese: [{ reading: "コーヒー" }],
                                senses: [],
                                tags: [],
                                jlpt: [],
                            },
                        ],
                    };
                },
            };
        },
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "コーヒー",
    });
    assert.equal(suggestion.referenceGroups, undefined);
});

test("Jisho provider does not expose hidden pronunciation shims", async () => {
    let requests = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            return {
                ok: true,
                async json() {
                    return { data: [] };
                },
            };
        },
    });
    assert.deepEqual(
        await provider.lookup({ schema, layer: wordLayer, label: "かみ" }),
        [],
    );
    assert.equal(requests, 1);
});

test("Jisho integration registers through the generic Library provider", async () => {
    let registered;
    let removed = false;
    const libraryProvider = {
        registerLookupProvider(provider) {
            registered = provider;
            return () => {
                removed = true;
            };
        },
    };
    const remove = registerJishoLookupProvider(libraryProvider, {
        contentRoot,
    });
    assert.equal(registered.id, "study-language-ja:jisho");
    assert.equal(typeof registered.lookup, "function");
    remove();
    assert.equal(removed, true);
});
