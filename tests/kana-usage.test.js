import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readJson(path) {
    return JSON.parse(
        readFileSync(new URL(`../${path}`, import.meta.url), "utf8"),
    );
}

test("full-size and small i Kana explain their distinct usage", () => {
    const schema = readJson("data/library/schema.json");
    const characterLayer = schema.layers.find(({ id }) => id === "characters");
    const usageNote = characterLayer.fields.find(
        ({ id }) => id === "usage_note",
    );
    assert.equal(usageNote.type, "localizedText");
    assert.equal(usageNote.required, undefined);

    const records = [
        ...readJson("data/library/content/characters/hiragana.json"),
        ...readJson("data/library/content/characters/hiragana-variants.json"),
        ...readJson("data/library/content/characters/katakana.json"),
        ...readJson("data/library/content/characters/katakana-variants.json"),
    ];
    const expectedIds = [
        "ja:char:i",
        "ja:char:small-i",
        "ja:char:ka:i",
        "ja:char:ka:small-i",
    ];
    for (const id of expectedIds) {
        const entry = records.find((candidate) => candidate.id === id);
        assert.deepEqual(Object.keys(entry.fields.usage_note).sort(), [
            "de",
            "en",
            "id",
            "ja",
        ]);
    }
    const smallKatakana = records.find(({ id }) => id === "ja:char:ka:small-i");
    assert.match(smallKatakana.fields.usage_note.en, /フィ \(fi\)/u);
});
