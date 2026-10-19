import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const index = await load("authoring/index.json");
for (const theme of [
    "time",
    "colors",
    "weather",
    "directions",
    "seasons",
    "clothing",
    "tableware",
    "places",
    "household",
    "care",
    "transport",
    "school",
    "animals",
    "furnishings",
    "fruit",
    "qualities",
    "actions",
    "fixtures",
    "nature",
    "rooms",
    "vegetables",
    "kitchen",
].filter((name) => index[`${name}Images`])) {
    test(`${theme} vocabulary binds reviewed illustrations and recordings to exact published bytes`, async () => {
        const words = await load(
            `data/library/content/words/${theme}-001.json`,
        );
        const images = await load(`authoring/reviews/${theme}-images.json`);
        const audio = await load(`authoring/reviews/${theme}-audio.json`);
        assert.equal(images.length, 4);
        assert.equal(audio.length, 4);
        for (const word of words.filter(({ hidden }) => !hidden)) {
            const picture = images.find(({ entryId }) => entryId === word.id);
            assert.equal(picture.visualReview, "pass");
            assert.deepEqual(word.fields.reference_images, [picture.path]);
            const clip = audio.find(({ entryId }) => entryId === word.id);
            assert.equal(clip.path, word.fields.audio);
            const vocabulary = await load(
                `authoring/reviews/${theme}-vocabulary.json`,
            );
            const reviewed = vocabulary.find(
                ({ entryId }) => entryId === word.id,
            );
            assert.equal(clip.request.text, reviewed.audioText ?? word.label);
            assert.equal(clip.listening, "unverified-not-performed");
            assert.equal(clip.sourceFullScaleSamples, 0);
            for (const item of [picture, clip]) {
                const bytes = await readFile(
                    `data/library/assets/${item.path}`,
                );
                assert.equal(
                    createHash("sha256").update(bytes).digest("hex"),
                    item.sha256,
                );
                const source = await readFile(item.sourcePath);
                assert.equal(
                    createHash("sha256").update(source).digest("hex"),
                    item.sourceSha256,
                );
            }
            assert.deepEqual(Object.keys(word.fields.usage_notes).sort(), [
                "de",
                "en",
                "id",
                "ja",
            ]);
        }
    });
}
