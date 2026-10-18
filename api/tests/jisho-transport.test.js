import assert from "node:assert/strict";
import test from "node:test";
import { createJishoLookupProvider } from "../dictionary/index.js";

for (const label of ["猫又", "節"]) {
    for (const declared of [false, true]) {
        test(`Jisho bounds ${label === "節" ? "HTML" : "JSON"} responses (${declared ? "declared" : "streamed"})`, async () => {
            let cancelled = false;
            const provider = createJishoLookupProvider({
                contentRoot: "data/library/content",
                fetchImplementation: async () =>
                    new Response(
                        new ReadableStream(
                            {
                                pull(controller) {
                                    controller.enqueue(
                                        new Uint8Array(1_000_001),
                                    );
                                },
                                cancel() {
                                    cancelled = true;
                                },
                            },
                            { highWaterMark: 0 },
                        ),
                        {
                            headers: declared
                                ? { "content-length": "1000001" }
                                : {},
                        },
                    ),
            });
            await assert.rejects(
                provider.lookup({
                    layer: { id: label === "節" ? "alt-characters" : "words" },
                    label,
                }),
            );
            assert.equal(cancelled, true);
        });
    }
}

test("Jisho retains every definition beyond the tenth meaning", async () => {
    const definitions = Array.from(
        { length: 14 },
        (_, index) => `distinct meaning ${index}`,
    );
    const provider = createJishoLookupProvider({
        contentRoot: "data/library/content",
        fetchImplementation: async () =>
            new Response(
                JSON.stringify({
                    data: [
                        {
                            slug: "猫又",
                            japanese: [{ word: "猫又", reading: "ねこまた" }],
                            senses: [
                                {
                                    english_definitions: definitions,
                                    parts_of_speech: ["Noun"],
                                },
                            ],
                        },
                    ],
                }),
            ),
    });
    const results = await provider.lookup({
        layer: { id: "words" },
        label: "猫又",
    });
    assert.deepEqual(
        results[0].definitions.map((definition) => definition.translations.en),
        definitions,
    );
});
