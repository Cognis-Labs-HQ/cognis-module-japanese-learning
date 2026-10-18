import assert from "node:assert/strict";
import test from "node:test";
import { createStrokePatternProvider } from "../strokes/index.js";

for (const status of [404, 503])
    test(`KanjiVG cancels HTTP ${status} response bodies`, async () => {
        let cancelled = false;
        const provider = createStrokePatternProvider({
            contentRoot: "data/library/content",
            fetchImplementation: async () =>
                new Response(
                    new ReadableStream(
                        {
                            cancel() {
                                cancelled = true;
                            },
                        },
                        { highWaterMark: 0 },
                    ),
                    { status },
                ),
        });
        assert.deepEqual(
            await provider.lookup({
                layer: { id: "characters" },
                label: "ティー",
            }),
            [],
        );
        assert.equal(cancelled, true);
    });

test("remote long-vowel kana includes its complete ordered tracing path", async () => {
    const requests = [];
    const provider = createStrokePatternProvider({
        contentRoot: "data/library/content",
        fetchImplementation: async (url) => {
            requests.push(url);
            return new Response('<svg><path d="M0 0 L109 109"/></svg>');
        },
    });
    const [result] = await provider.lookup({
        layer: { id: "characters" },
        label: "ティー",
    });
    assert.equal(requests.length, 3);
    assert.ok(requests[2].endsWith("030fc.svg"));
    assert.equal(result.fields.stroke_pattern.columns, 3);
    assert.deepEqual(result.fields.stroke_pattern.groups, [1, 1, 1]);
});
