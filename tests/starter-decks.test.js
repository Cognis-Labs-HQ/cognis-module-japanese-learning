import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const load = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));
test("starter flashcard decks use stable keys, localized names, and existing visible provider records", () => {
    const decks = load("data/starter-decks.json");
    const schema = load("data/library/schema.json");
    const records = new Map();
    for (const layer of schema.layers) {
        const directory = path.join(root, "data/library/content", layer.id);
        try {
            for (const file of readdirSync(directory)) {
                if (!file.endsWith(".json")) continue;
                const data = JSON.parse(
                    readFileSync(path.join(directory, file), "utf8"),
                );
                for (const record of Array.isArray(data) ? data : [data])
                    records.set(record.id, record);
            }
        } catch (error) {
            if (error.code !== "ENOENT") throw error;
        }
    }
    assert.equal(decks.length, 38);
    for (const [key, labels] of [
        [
            "hiragana-basics",
            "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
        ],
        [
            "katakana-basics",
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",
        ],
    ]) {
        const deck = decks.find((deck) => deck.key === key);
        assert.equal(
            deck.sourceRecordIds.map((id) => records.get(id).label).join(""),
            labels,
        );
        for (const id of deck.sourceRecordIds)
            assert.ok(records.get(id).fields.stroke_pattern.strokes.length, id);
    }

    assert.equal(new Set(decks.map((deck) => deck.key)).size, decks.length);
    for (const deck of decks) {
        assert.equal(deck.schemaId, schema.id);
        assert.match(deck.key, /^[a-z0-9-]+$/);
        for (const language of ["de", "en", "id", "ja"])
            assert.ok(deck.name[language]?.trim());
        assert.ok(deck.sourceRecordIds.length);
        assert.equal(
            new Set(deck.sourceRecordIds).size,
            deck.sourceRecordIds.length,
        );
        for (const id of deck.sourceRecordIds) {
            assert.ok(records.has(id), id);
            assert.notEqual(records.get(id).hidden, true);
        }
    }
});
