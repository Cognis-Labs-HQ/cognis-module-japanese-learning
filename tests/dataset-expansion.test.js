import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

function readData(path) {
    return JSON.parse(
        readFileSync(
            new URL(`../data/library/content/${path}`, import.meta.url),
        ),
    );
}

function readLayer(layer) {
    const directory = new URL(
        `../data/library/content/${layer}/`,
        import.meta.url,
    );
    return readdirSync(directory)
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) => readData(`${layer}/${name}`));
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

    for (const label of ["はし", "あめ", "かみ", "はな"]) {
        const homophones = vocabulary.filter((entry) => entry.label === label);
        assert.ok(homophones.length >= 2);
        assert.equal(
            new Set(homophones.flatMap(definitionIds)).size,
            homophones.length,
        );
    }
});

test("every authored particle is exercised by a sentence", () => {
    const allParticles = readLayer("particles");
    const allSentences = readLayer("sentences");
    const usedParticleIds = new Set(
        allSentences.flatMap((entry) =>
            entry.references
                .filter(({ relation }) => relation === "particles")
                .map(({ entryId }) => entryId),
        ),
    );
    assert.ok(allParticles.length >= 60);
    for (const particle of allParticles) {
        assert.ok(
            usedParticleIds.has(particle.id),
            `${particle.id} requires an example sentence`,
        );
    }
});

test("particle examples traverse vocabulary, Kanji, and Kana", () => {
    const entriesById = new Map(
        ["characters", "alt-characters", "words", "particles", "sentences"]
            .flatMap(readLayer)
            .map((entry) => [entry.id, entry]),
    );
    const examples = readLayer("sentences").filter(
        ({ id }) =>
            id.startsWith("ja:sentence:particle-example-") ||
            ["ja:sentence:gakkou-de-miru", "ja:sentence:gakkou-e-iku"].includes(
                id,
            ),
    );

    for (const sentence of examples) {
        const vocabulary = sentence.references
            .filter(({ relation }) => relation === "words")
            .map(({ entryId }) => entriesById.get(entryId));
        const Kanji = vocabulary.flatMap((entry) =>
            entry.references
                .filter(({ relation }) => relation === "spelling")
                .map(({ entryId }) => entriesById.get(entryId)),
        );
        const readings = Kanji.flatMap((entry) =>
            entry.references
                .filter(({ relation }) => relation === "readings")
                .map(({ entryId }) => entriesById.get(entryId)),
        );

        assert.ok(Kanji.length > 0, `${sentence.id} must reach Kanji`);
        assert.ok(
            readings.some((entry) =>
                entry.references.some(
                    ({ relation }) => relation === "kana-spelling",
                ),
            ),
            `${sentence.id} must reach Kana through a Kanji reading`,
        );
    }
});
