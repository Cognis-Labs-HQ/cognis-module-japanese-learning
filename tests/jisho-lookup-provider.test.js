import { readFile } from "node:fs/promises";
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

function kanjiHtml(label, reading) {
    return `<h1 class="character">${label}</h1><div class="kanji-details__main-meanings">meaning</div><dl class="dictionary_entry kun_yomi"><dd class="kanji-details__main-readings-list"><a>${reading}</a></dd></dl>`;
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

test("Jisho provider resolves native content when network lookup is unavailable", async () => {
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: null,
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "猫",
    });
    assert.equal(suggestion.label, "猫");
    assert.ok(
        suggestion.definitions.some(
            ({ translations }) =>
                translations.en &&
                translations.de &&
                translations.id &&
                translations.ja,
        ),
    );
    assert.deepEqual(suggestion.fields.pronunciation, ["ねこ"]);
    assert.deepEqual(suggestion.referenceGroups["pronunciation-readings"], [
        [
            {
                entryId: "ja:word:complete-pronunciation-neko",
                relation: "pronunciation-readings",
                position: 0,
            },
        ],
    ]);
    assert.match(suggestion.provenance, /^cognis-japanese:/);
    assert.equal(suggestion.confidence, 1);
});

test("Jisho provider populates fields and detects links for every retrieval", async () => {
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
    assert.equal(requests.length, 2);
    assert.equal(
        requests[0].url,
        "https://jisho.test/api?keyword=%E7%8C%AB%E5%8F%88",
    );
    assert.equal(requests[0].options.headers.accept, "application/json");
    assert.equal(first.label, "猫又");
    assert.deepEqual(first.fields.pronunciation, ["ねこまた"]);
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
        first.linkedEntries[0].entry.referenceGroups["reading-kana"][0].map(
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

test("Jisho provider accepts ranked English vocabulary searches", async () => {
    const requests = [];
    const provider = createJishoLookupProvider({
        contentRoot,
        endpoint: "https://jisho.test/api",
        async fetchImplementation(url) {
            requests.push(url);
            return {
                ok: true,
                async json() {
                    return jishoResponse();
                },
            };
        },
    });

    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "mythical cat",
    });

    assert.deepEqual(requests, [
        "https://jisho.test/api?keyword=mythical%20cat",
    ]);
    assert.equal(suggestion.label, "猫又");
    assert.equal(suggestion.fields.jlpt_level, "N2");
    assert.equal(suggestion.provenance, "jisho:猫又");
});

test("Jisho Kanji suggestions link readings directly to atomic Kana", async () => {
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            return {
                ok: true,
                async text() {
                    return kanjiHtml("龍", "りゅう");
                },
                async json() {
                    return {
                        data: [
                            {
                                slug: "龍",
                                japanese: [{ word: "龍", reading: "りゅう" }],
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
        layer: kanjiLayer,
        label: "龍",
    });
    assert.deepEqual(
        suggestion.referenceGroups["single-readings"][0].map(
            ({ relation }) => relation,
        ),
        ["single-readings", "single-readings"],
    );
    assert.deepEqual(
        suggestion.referenceGroups["single-readings"][0].map(
            ({ position }) => position,
        ),
        [0, 1],
    );
});

test("Kanji lookup identity uses the Kanji label, not its pronunciation", async () => {
    let requests = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            return {
                ok: true,
                async text() {
                    return kanjiHtml("券", "けん");
                },
                async json() {
                    return {
                        data: [
                            {
                                slug: "券",
                                japanese: [{ word: "券", reading: "けん" }],
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
        layer: kanjiLayer,
        label: "券",
    });

    assert.equal(requests, 1, "犬 must not satisfy a lookup for 券");
    assert.equal(suggestion.label, "券");
    assert.deepEqual(suggestion.fields.pronunciation, ["けん"]);
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
        await provider.lookup({
            schema,
            layer: wordLayer,
            label: "cat<script>",
        }),
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
    assert.deepEqual(
        suggestion.linkedEntries[0].entry.referenceGroups["reading-kana"],
        [[]],
    );
});

test("Jisho provider returns an empty result for an unmatched lexical query", async () => {
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

test("Jisho retains all senses and raw source data with every reading group", async () => {
    const payload = jishoResponse();
    const record = payload.data[0];
    record.japanese.push({ word: "猫又", reading: "ねこ" });
    record.is_common = true;
    record.senses.push({
        english_definitions: ["cat spirit; cat demon", "cat apparition"],
        parts_of_speech: ["Noun"],
        restrictions: ["猫又"],
        info: ["folklore"],
        see_also: ["化け猫"],
        antonyms: [],
        dialects: ["Kansai"],
        tags: ["archaic"],
    });
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "猫又",
    });
    assert.deepEqual(suggestion.fields.pronunciation, ["ねこまた", "ねこ"]);
    assert.equal(suggestion.linkedEntries.length, 2);
    assert.deepEqual(
        suggestion.definitions.map(({ translations }) => translations.en),
        [
            "mythical two-tailed cat",
            "cat spirit",
            "cat demon",
            "cat apparition",
        ],
    );
    assert.deepEqual(JSON.parse(suggestion.fields.dictionary_data), {
        ...record,
        sourceUrl: suggestion.sourceUrl,
    });
    assert.equal(suggestion.class, "lexical:noun");
    assert.deepEqual(suggestion.tags, ["jlpt-n2", "common"]);
    assert.equal(
        suggestion.sourceUrl,
        "https://jisho.org/word/%E7%8C%AB%E5%8F%88",
    );
    assert.deepEqual(provider.capabilities, ["dictionary"]);
});

test("Kanji lookup uses its dedicated Jisho entry when no standalone word exists", async () => {
    const urls = [];
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async (url) => {
            urls.push(url);
            return { ok: true, text: async () => kanjiHtml("鋭", "するど.い") };
        },
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: kanjiLayer,
        label: "鋭",
    });
    assert.equal(suggestion.label, "鋭");
    assert.deepEqual(suggestion.fields.pronunciation, ["するどい"]);
    assert.equal(suggestion.definitions[0].translations.en, "meaning");
    assert.equal(urls[0], "https://jisho.org/search/%E9%8B%AD%20%23kanji");
    assert.deepEqual(
        JSON.parse(suggestion.fields.dictionary_data).kanji.readings.kun,
        ["するど.い"],
    );
});

test("failed dictionary requests reject instead of reporting no matches", async () => {
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({ ok: false }),
    });
    await assert.rejects(
        provider.lookup({ schema, layer: wordLayer, label: "missingword" }),
        /jisho_lookup_failed/,
    );
});

test("Kanji and word requests identify Cognis to upstream servers", async () => {
    const accepts = [];
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async (_url, options) => {
            const identified =
                options.headers["user-agent"]?.startsWith(
                    "Cognis-Japanese-Learning",
                ) === true;
            accepts.push(options.headers.accept);
            return {
                ok: identified,
                status: identified ? 200 : 403,
                text: async () => kanjiHtml("教", "おし.える"),
                json: async () => jishoResponse(),
            };
        },
    });
    const [kanji] = await provider.lookup({ layer: kanjiLayer, label: "教" });
    assert.equal(kanji.label, "教");
    assert.deepEqual(kanji.fields.pronunciation, ["おしえる"]);
    const [word] = await provider.lookup({ layer: wordLayer, label: "猫又" });
    assert.equal(word.label, "猫又");
    assert.deepEqual(accepts, ["text/html", "application/json"]);
});

test("upstream rejections log the status and safe failure code", async () => {
    const logs = [];
    const provider = createJishoLookupProvider({
        contentRoot,
        log: (level, message, metadata) =>
            logs.push({ level, message, metadata }),
        fetchImplementation: async () => ({
            ok: false,
            status: 403,
            text: async () => "private upstream response",
        }),
    });
    await assert.rejects(
        provider.lookup({ layer: kanjiLayer, label: "教" }),
        /jisho_lookup_failed/,
    );
    assert.equal(logs[0].level, "error");
    assert.equal(logs[0].metadata.httpStatus, 403);
    assert.equal(logs[0].metadata.errorCode, "jisho_request_failed");
    assert.doesNotMatch(JSON.stringify(logs), /private upstream response/);
});

test("parser and transport failures remain distinguishable without exposing messages", async () => {
    for (const [fetchImplementation, expectedCode] of [
        [
            async () => ({ ok: true, text: async () => "unexpected page" }),
            "jisho_kanji_response_invalid",
        ],
        [
            async () => {
                throw new TypeError("private connection details");
            },
            "jisho_transport_failed",
        ],
    ]) {
        const logs = [];
        const provider = createJishoLookupProvider({
            contentRoot,
            log: (_level, _message, metadata) => logs.push(metadata),
            fetchImplementation,
        });
        await assert.rejects(
            provider.lookup({ layer: kanjiLayer, label: "教" }),
            /jisho_lookup_failed/,
        );
        assert.equal(logs[0].errorCode, expectedCode);
        assert.equal(logs[0].httpStatus, undefined);
        assert.doesNotMatch(JSON.stringify(logs), /private connection details/);
    }
});

test("dictionary source URLs are retained inside hidden card data", async () => {
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            text: async () => kanjiHtml("教", "おし.える"),
            json: async () => jishoResponse(),
        }),
    });
    for (const [layer, label] of [
        [kanjiLayer, "教"],
        [wordLayer, "猫又"],
    ]) {
        const [suggestion] = await provider.lookup({ layer, label });
        assert.equal(
            JSON.parse(suggestion.fields.dictionary_data).sourceUrl,
            suggestion.sourceUrl,
        );
    }
});

test("dictionary readings resolve compound Kana as existing content-provider characters", async () => {
    const payload = jishoResponse();
    payload.data[0].japanese[0].reading = "きょうっくっく";
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "猫又",
    });
    assert.deepEqual(
        suggestion.linkedEntries[0].entry.referenceGroups[
            "reading-kana"
        ][0].map(({ entryId }) => entryId),
        ["ja:char:kyo", "ja:char:u", "ja:char:kku", "ja:char:kku"],
    );
    assert.deepEqual(
        suggestion.linkedEntries[0].entry.referenceGroups[
            "reading-kana"
        ][0].map(({ position }) => position),
        [0, 1, 2, 3],
    );
});

test("Jisho returns every candidate with its own readings, definitions, and provenance", async () => {
    const payload = jishoResponse();
    payload.data.push({
        ...structuredClone(payload.data[0]),
        slug: "猫神",
        japanese: [{ word: "猫神", reading: "ねこがみ" }],
        senses: [
            { english_definitions: ["cat deity"], parts_of_speech: ["Noun"] },
        ],
    });
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const suggestions = await provider.lookup({
        schema,
        layer: wordLayer,
        label: "cat",
    });
    assert.deepEqual(
        suggestions.map(({ label }) => label),
        ["猫又", "猫神"],
    );
    assert.deepEqual(
        suggestions.map(({ fields }) => fields.pronunciation),
        [["ねこまた"], ["ねこがみ"]],
    );
    assert.deepEqual(
        suggestions.map(({ definitions }) => definitions[0].translations.en),
        ["mythical two-tailed cat", "cat deity"],
    );
    assert.equal(
        new Set(suggestions.map(({ provenance }) => provenance)).size,
        2,
    );
    assert.equal(
        JSON.parse(suggestions[1].fields.dictionary_data).slug,
        "猫神",
    );
});

test("Jisho retrieves provider data for each host-owned query", async () => {
    let calls = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => {
            calls += 1;
            return { ok: true, json: async () => ({ data: [] }) };
        },
    });
    assert.equal(provider.searchable, true);
    const input = { layer: { id: "words" }, label: "unlistedword" };
    await provider.lookup(input);
    await provider.lookup(input);
    assert.equal(calls, 2);
    await provider.lookup({ ...input, refresh: true });
    assert.equal(calls, 3);
});

test("Jisho retrieves full provider data for bundled words", async () => {
    let requests = 0;
    const provider = createJishoLookupProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            return {
                ok: true,
                async json() {
                    return {
                        data: [
                            {
                                slug: "猫",
                                japanese: [{ word: "猫", reading: "ねこ" }],
                                senses: [
                                    { english_definitions: ["cat", "feline"] },
                                ],
                                tags: [],
                                jlpt: [],
                            },
                        ],
                    };
                },
            };
        },
    });
    const input = { schema, layer: wordLayer, label: "猫" };
    const [first] = await provider.lookup(input);
    assert.deepEqual(
        first.definitions.map((value) => value.translations.en),
        ["cat", "feline"],
    );
    assert.equal(requests, 1);
    await provider.lookup(input);
    assert.equal(requests, 2);
    await provider.lookup(input);
    assert.equal(requests, 3);
});

test("greeting searches prefer exact dictionary meanings over Wikipedia title matches", async () => {
    const payload = JSON.parse(
        await readFile(
            new URL("./fixtures/jisho-greeting.json", import.meta.url),
            "utf8",
        ),
    );
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const results = await provider.lookup({
        layer: wordLayer,
        label: "こんにちは",
    });
    assert.equal(results.length, 1);
    assert.equal(results[0].label, "こんにちは");
    assert.deepEqual(results[0].fields.pronunciation, [
        "こんにちは",
        "こんにちわ",
    ]);
    assert.equal(results[0].definitions[0].translations.en, "hello");
    assert.equal(results[0].confidence, 0.99);
    assert.equal(results[0].linkedEntries.length, 2);
});

test("exact readings outrank related dictionary matches and missing readings stay empty", async () => {
    const payload = jishoResponse();
    payload.data.push({
        slug: "猫",
        japanese: [{ word: "猫", reading: "ねこ" }],
        senses: [{ english_definitions: ["cat"], parts_of_speech: ["Noun"] }],
    });
    payload.data.push({
        slug: "named",
        japanese: [{ word: "猫の名前" }],
        senses: [
            { english_definitions: ["cat name"], parts_of_speech: ["Noun"] },
        ],
    });
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const results = await provider.lookup({ layer: wordLayer, label: "ねこ" });
    assert.ok(results[1].confidence > results[0].confidence);
    assert.deepEqual(results[2].fields.pronunciation, []);
    assert.equal(results[2].definitions[0].translations.en, "cat name");
});

test("dictionary reading cards preserve genuine Katakana and filter redundant query echoes", async () => {
    const payload = jishoResponse();
    payload.data[0].japanese = [
        { word: "猫又", reading: "ねこまた" },
        { word: "猫又", reading: "ネコマタ" },
    ];
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const [result] = await provider.lookup({ layer: wordLayer, label: "猫又" });
    assert.deepEqual(result.fields.pronunciation, ["ねこまた"]);
    assert.equal(result.linkedEntries[0].entry.hidden, true);
    assert.equal(result.linkedEntries[0].entry.class, "reading:complete");
    assert.equal(
        result.referenceGroups["pronunciation-readings"][0][0].entryId,
        result.linkedEntries[0].key,
    );
    payload.data[0].japanese = [{ word: "ネコマタ", reading: "ネコマタ" }];
    const [loanword] = await provider.lookup({
        layer: wordLayer,
        label: "ネコマタ",
    });
    assert.deepEqual(loanword.fields.pronunciation, ["ネコマタ"]);
});

test("complete dictionary readings compose through the nearest authored Kanji reading", async () => {
    const payload = jishoResponse();
    payload.data[0].slug = "直す";
    payload.data[0].japanese = [{ word: "直す", reading: "なおす" }];
    const provider = createJishoLookupProvider({
        contentRoot,
        fetchImplementation: async () => ({
            ok: true,
            json: async () => payload,
        }),
    });
    const [result] = await provider.lookup({ layer: wordLayer, label: "直す" });
    const groups = result.linkedEntries[0].entry.referenceGroups;
    assert.equal(groups["pronunciation-readings"][0][0].position, 0);
    assert.equal(groups["reading-kana"][0][0].entryId, "ja:char:su");
    assert.equal(groups["reading-kana"][0][0].position, 1);
});
