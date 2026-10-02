import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const CONTENT_ROOT = path.resolve(
    import.meta.dirname,
    "..",
    "data",
    "library",
    "content",
);
function load(directory) {
    return readdirSync(path.join(CONTENT_ROOT, directory))
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            JSON.parse(
                readFileSync(path.join(CONTENT_ROOT, directory, name), "utf8"),
            ),
        )
        .map((entry) => ({
            ...entry,
            references: [
                ...(entry.references ?? []),
                ...Object.values(entry.referenceGroups ?? {}).flatMap(
                    (groups) => groups[0] ?? [],
                ),
            ],
        }));
}
const vocabulary = load("words").filter(({ hidden }) => hidden !== true);
const definitions = new Map(
    load("definitions").map((entry) => [entry.id, entry]),
);
const particles = load("particles");
const sentences = load("sentences");
const characters = new Map(
    load("characters").map((entry) => [entry.id, entry]),
);
const kanji = new Map(load("alt-characters").map((entry) => [entry.id, entry]));

function definitionIds(entry) {
    const direct = entry.references
        .filter(({ relation }) => relation === "definitions")
        .map(({ entryId }) => entryId);
    if (direct.length) return direct;
    return entry.references
        .filter(({ relation }) => relation === "spelling")
        .flatMap(({ entryId }) => definitionIds(kanji.get(entryId)));
}
function reading(entry) {
    return entry.fields.pronunciation[0];
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
            (entry) => reading(entry) === pronunciation,
        );
        assert.ok(homophones.length >= 2);
        assert.equal(
            new Set(homophones.flatMap(definitionIds)).size,
            homophones.length,
        );
    }
});
