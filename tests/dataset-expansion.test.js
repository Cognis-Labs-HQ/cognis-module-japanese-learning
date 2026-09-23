import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readData(path) {
    return JSON.parse(
        readFileSync(
            new URL(`../data/library/content/${path}`, import.meta.url),
        ),
    );
}

const vocabulary = readData("words/expanded.json");
const definitions = new Map(
    [
        ...readData("definitions/expanded.json"),
        ...readData("definitions/particles-expanded.json"),
        ...readData("definitions/sentences-expanded.json"),
    ].map((entry) => [entry.id, entry]),
);
const particles = readData("particles/expanded.json");
const sentences = readData("sentences/expanded.json");

function definitionIds(entry) {
    return entry.references
        .filter(({ relation }) => relation === "definitions")
        .map(({ entryId }) => entryId);
}

test("expanded learning data remains declarative and substantial", () => {
    assert.ok(vocabulary.length >= 30);
    assert.ok(particles.length >= 10);
    assert.ok(sentences.length >= 8);
    for (const entry of [...vocabulary, ...particles, ...sentences]) {
        assert.ok(definitionIds(entry).length > 0);
        for (const definitionId of definitionIds(entry)) {
            assert.ok(definitions.has(definitionId));
        }
    }
});

test("polysemy uses multiple definitions without collapsing homophones", () => {
    const naosu = vocabulary.find(({ id }) => id === "ja:word:naosu");
    assert.deepEqual(definitionIds(naosu), [
        "ja:def:naosu-fix",
        "ja:def:naosu-correct",
    ]);

    for (const pronunciation of ["はし", "あめ", "かみ", "はな"]) {
        const homophones = vocabulary.filter(
            (entry) => entry.fields.pronunciation[0] === pronunciation,
        );
        assert.ok(homophones.length >= 2);
        assert.equal(
            new Set(homophones.flatMap(definitionIds)).size,
            homophones.length,
        );
    }
});
