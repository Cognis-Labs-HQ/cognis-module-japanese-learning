import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createJishoLookupProvider } from "../api/jisho-lookup-provider.js";

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
    assert.ok(
        suggestion.references.some(
            ({ entryId, relation }) =>
                entryId === "ja:kanji:core-e78cab" && relation === "spelling",
        ),
    );
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
    assert.deepEqual(first.fields.pronunciation, ["ねこまた"]);
    assert.equal(first.fields.jlpt_level, "N2");
    assert.ok(
        first.references.some(
            ({ entryId, relation, position }) =>
                entryId === "ja:kanji:core-e78cab" &&
                relation === "spelling" &&
                position === 0,
        ),
    );
    assert.ok(
        first.references.some(
            ({ entryId, relation }) =>
                entryId === "ja:char:ne" && relation === "kana-spelling",
        ),
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
    assert.equal(requests, 0);
});
