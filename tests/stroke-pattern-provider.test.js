import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createStrokePatternProvider } from "../api/stroke-pattern-provider.js";

const contentRoot = path.resolve(
    import.meta.dirname,
    "..",
    "data",
    "library",
    "content",
);

const schema = { id: "japanese-core", language: "ja" };
const KanjiLayer = {
    id: "alt-characters",
    fields: [{ id: "stroke_pattern", type: "strokePattern" }],
};

test("stroke provider supports Japanese writing-unit layers only", () => {
    const provider = createStrokePatternProvider({ contentRoot });
    assert.equal(provider.id, "study-language-ja:stroke-patterns");
    assert.equal(provider.supports(schema, KanjiLayer), true);
    assert.equal(
        provider.supports(schema, {
            id: "words",
            fields: [{ id: "stroke_pattern", type: "strokePattern" }],
        }),
        false,
    );
    assert.equal(
        provider.supports({ id: "japanese-core", language: "en" }, KanjiLayer),
        false,
    );
});

test("stroke provider returns the packaged Kanji pattern", async () => {
    const provider = createStrokePatternProvider({ contentRoot });
    const suggestions = await provider.lookup({
        schema,
        layer: KanjiLayer,
        label: " 猫 ",
    });
    assert.equal(suggestions.length, 1);
    assert.equal(suggestions[0].provider, provider.id);
    assert.equal(suggestions[0].provenance, "kanjivg:ja:kanji:core-e78cab");
    assert.equal(suggestions[0].confidence, 1);
    const pattern = suggestions[0].fields.stroke_pattern;
    assert.equal(pattern.coordinateSystem, "normalized");
    assert.equal(pattern.tolerance, 60);
    assert.ok(pattern.strokes.length > 0);
    assert.ok(pattern.strokes.every(({ points }) => points.length >= 3));
});

test("stroke provider returns no suggestion for unknown labels", async () => {
    const provider = createStrokePatternProvider({
        contentRoot,
        fetchImplementation: async () => ({ ok: false, status: 404 }),
    });
    assert.deepEqual(
        await provider.lookup({ schema, layer: KanjiLayer, label: "不存在" }),
        [],
    );
    assert.deepEqual(
        await provider.lookup({ schema, layer: KanjiLayer, label: "" }),
        [],
    );
});

test("stroke provider fetches any unpackaged Japanese writing unit", async () => {
    const requests = [];
    const provider = createStrokePatternProvider({
        contentRoot,
        sourceBaseUrl: "https://stroke.test/kanji",
        async fetchImplementation(url, options) {
            requests.push({ url, options });
            return {
                ok: true,
                async text() {
                    return '<svg><path d="M10 10 C20 20 30 30 40 40"/></svg>';
                },
            };
        },
    });
    const [suggestion] = await provider.lookup({
        schema,
        layer: KanjiLayer,
        label: "龍",
    });
    assert.equal(requests[0].url, "https://stroke.test/kanji/09f8d.svg");
    assert.equal(requests[0].options.headers.accept, "image/svg+xml");
    assert.equal(suggestion.provider, provider.id);
    assert.equal(
        suggestion.provenance,
        "kanjivg:https://stroke.test/kanji/09f8d.svg",
    );
    assert.equal(suggestion.confidence, 1);
    assert.ok(suggestion.fields.stroke_pattern.strokes[0].points.length >= 4);
});

test("stroke provider never sends non-Japanese labels to the source", async () => {
    let requests = 0;
    const provider = createStrokePatternProvider({
        contentRoot,
        async fetchImplementation() {
            requests += 1;
            throw new Error("unexpected request");
        },
    });
    assert.deepEqual(
        await provider.lookup({ schema, layer: KanjiLayer, label: "dragon" }),
        [],
    );
    assert.equal(requests, 0);
});

test("stroke provider logs packaged-data failures safely", async () => {
    const logs = [];
    const provider = createStrokePatternProvider({
        contentRoot: path.join(contentRoot, "missing"),
        log(level, message, metadata) {
            logs.push({ level, message, metadata });
        },
    });
    await assert.rejects(
        provider.lookup({ schema, layer: KanjiLayer, label: "猫" }),
        /Japanese stroke pattern lookup failed/,
    );
    assert.deepEqual(logs, [
        {
            level: "error",
            message: "Japanese stroke pattern lookup failed.",
            metadata: {
                component: "study-language-ja",
                operation: "load_stroke_patterns",
                errorName: "Error",
            },
        },
    ]);
});
