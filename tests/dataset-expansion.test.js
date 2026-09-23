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

test("provider content is protected from user-owned mutations", () => {
    const manifest = JSON.parse(
        readFileSync(new URL("../data/library/manifest.json", import.meta.url)),
    );
    assert.equal(manifest.protected, true);
});

test("pack metadata and filters follow the PR 226 external contract", () => {
    const manifest = JSON.parse(
        readFileSync(new URL("../data/library/manifest.json", import.meta.url)),
    );
    const schema = JSON.parse(
        readFileSync(new URL("../data/library/schema.json", import.meta.url)),
    );
    assert.deepEqual(manifest.metadata, {
        catalog: { category: "language", featured: true },
        tags: ["japanese", "study"],
    });
    assert.deepEqual(schema.metadata.provider, {
        id: "study-language-ja",
        stable: true,
    });
    assert.deepEqual(
        schema.layers.flatMap((layer) =>
            (layer.fields ?? [])
                .filter(({ detail }) => detail?.filterable === true)
                .map(({ id }) => `${layer.id}:${id}`),
        ),
        ["characters:character_class", "words:jlpt_level"],
    );
});

test("every provider record declares a valid semantic class", () => {
    const records = [
        "characters",
        "alt-characters",
        "definitions",
        "words",
        "particles",
        "sentences",
    ].flatMap(readLayer);
    const classPattern = /^[a-z][a-zA-Z0-9]*(?::[a-z][a-zA-Z0-9]*)*$/;

    for (const record of records) {
        assert.match(record.class, classPattern, `${record.id} needs a class`);
    }

    const entriesById = new Map(records.map((entry) => [entry.id, entry]));
    assert.equal(entriesById.get("ja:word:tsuyoi").class, "lexical:adjective");
    assert.equal(
        entriesById.get("ja:word:kanji-reading-e5bcb7-0").class,
        "reading:kanji",
    );
    assert.equal(
        entriesById.get("ja:sentence:particle-wa-final").class,
        "syntax:sentence",
    );
});

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

test("visible vocabulary uses conventional Kanji primary forms", () => {
    const expectedLabels = new Map([
        ["ja:word:watashi", "私"],
        ["ja:word:mizu", "水"],
        ["ja:word:yama", "山"],
        ["ja:word:kawa-river", "川"],
        ["ja:word:umi", "海"],
        ["ja:word:sora", "空"],
        ["ja:word:hana-flower", "花"],
        ["ja:word:hana-nose", "鼻"],
        ["ja:word:hashi-bridge", "橋"],
        ["ja:word:hashi-chopsticks", "箸"],
        ["ja:word:ame-rain", "雨"],
        ["ja:word:ame-candy", "飴"],
        ["ja:word:kami-paper", "紙"],
        ["ja:word:kami-hair", "髪"],
        ["ja:word:kami-deity", "神"],
        ["ja:word:kuruma", "車"],
        ["ja:word:densha", "電車"],
        ["ja:word:sensei", "先生"],
        ["ja:word:gakusei", "学生"],
        ["ja:word:tomodachi", "友達"],
        ["ja:word:taberu", "食べる"],
        ["ja:word:nomu", "飲む"],
        ["ja:word:miru", "見る"],
        ["ja:word:iku", "行く"],
        ["ja:word:kuru", "来る"],
        ["ja:word:ookii", "大きい"],
        ["ja:word:chiisai", "小さい"],
        ["ja:word:naosu", "直す"],
    ]);
    const allVocabulary = new Map(
        readLayer("words").map((entry) => [entry.id, entry]),
    );
    for (const [id, label] of expectedLabels) {
        assert.equal(allVocabulary.get(id).label, label);
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

test("particle sentences use varied vocabulary instead of one template", () => {
    const particleSentences = readLayer("sentences").filter(({ id }) =>
        id.startsWith("ja:sentence:particle-"),
    );
    const vocabularyIds = new Set(
        particleSentences.flatMap((entry) =>
            entry.references
                .filter(({ relation }) => relation === "words")
                .map(({ entryId }) => entryId),
        ),
    );
    const schoolUses = particleSentences.filter((entry) =>
        entry.references.some(({ entryId }) => entryId === "ja:word:gakkou"),
    ).length;
    assert.ok(vocabularyIds.size >= 30);
    assert.ok(schoolUses / particleSentences.length < 0.2);
    assert.equal(new Set(particleSentences.map(({ label }) => label)).size, 51);
});

test("particle sentences traverse vocabulary, Kanji, and Kana", () => {
    const entriesById = new Map(
        ["characters", "alt-characters", "words", "particles", "sentences"]
            .flatMap(readLayer)
            .map((entry) => [entry.id, entry]),
    );
    const examples = readLayer("sentences").filter(
        ({ id }) =>
            id.startsWith("ja:sentence:particle-") ||
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

test("complete word readings retain segment-level Vocabulary and Kana links", () => {
    const entriesById = new Map(
        ["characters", "alt-characters", "words"]
            .flatMap(readLayer)
            .map((entry) => [entry.id, entry]),
    );
    const visibleWords = readLayer("words").filter(({ hidden }) => !hidden);

    for (const word of visibleWords) {
        const pronunciation = word.fields.pronunciation[0];
        const readingReferences = word.references
            .filter(({ relation }) => relation === "pronunciation-readings")
            .sort((left, right) => left.position - right.position);
        assert.ok(readingReferences.length > 0, `${word.id} needs readings`);
        assert.equal(
            readingReferences
                .map(({ entryId }) => entriesById.get(entryId).label)
                .join(""),
            pronunciation,
            `${word.id} reading segments must reconstruct its pronunciation`,
        );

        for (const { entryId } of readingReferences) {
            const reading = entriesById.get(entryId);
            const spelling = reading.references
                .filter(({ relation }) =>
                    ["word-spelling", "kana-spelling"].includes(relation),
                )
                .sort((left, right) => left.position - right.position);
            assert.equal(
                spelling
                    .map(
                        (reference) => entriesById.get(reference.entryId).label,
                    )
                    .join(""),
                reading.label,
                `${reading.id} must preserve its internal deep links`,
            );
        }
    }

    const strongReading = entriesById.get("ja:word:reading-tsuyoi");
    assert.deepEqual(
        strongReading.references
            .filter(({ relation }) =>
                ["word-spelling", "kana-spelling"].includes(relation),
            )
            .map(({ entryId, relation, position }) => ({
                label: entriesById.get(entryId).label,
                relation,
                position,
            })),
        [
            { label: "つよ", relation: "word-spelling", position: 0 },
            { label: "い", relation: "kana-spelling", position: 1 },
        ],
    );
});

test("particle sentence definitions describe meaning rather than authorship", () => {
    const metadataTerms =
        /\b(?:example|exercise|demonstration|placeholder)\b|\bBeispiel\b|\bcontoh\b|例文|例$/iu;
    const sentenceDefinitions = readLayer("definitions").filter(({ id }) =>
        id.startsWith("ja:def:sentence-particle-"),
    );

    for (const definition of sentenceDefinitions) {
        assert.equal(metadataTerms.test(definition.label), false);
        for (const translation of Object.values(
            definition.fields.translations,
        )) {
            assert.equal(metadataTerms.test(translation), false);
        }
    }
});

test("sentence readings follow their ordered vocabulary and particle graph", () => {
    const words = new Map(readLayer("words").map((entry) => [entry.id, entry]));
    const particles = new Map(
        readLayer("particles").map((entry) => [entry.id, entry]),
    );

    for (const sentence of readLayer("sentences")) {
        const constituents = sentence.references
            .filter(({ relation }) => ["words", "particles"].includes(relation))
            .sort((left, right) => left.position - right.position)
            .map(({ entryId, relation }) =>
                relation === "words"
                    ? words.get(entryId)
                    : particles.get(entryId),
            );
        assert.equal(
            sentence.fields.pronunciation[0],
            constituents.map((entry) => entry.fields.pronunciation[0]).join(""),
            `${sentence.id} pronunciation must match its linked content`,
        );
    }
});

test("Kanji vocabulary traverses through hidden readings to atomic Kana", () => {
    const words = new Map(readLayer("words").map((entry) => [entry.id, entry]));
    const kanji = new Map(
        readLayer("alt-characters").map((entry) => [entry.id, entry]),
    );

    for (const word of words.values()) {
        if (word.hidden || !/[\p{Script=Han}]/u.test(word.label)) continue;
        const spelling = word.references.filter(
            ({ relation }) => relation === "spelling",
        );
        const wordSpelling = word.references.filter(
            ({ relation }) => relation === "word-spelling",
        );
        const readings = word.references.filter(
            ({ relation }) => relation === "pronunciation-readings",
        );
        assert.ok(
            spelling.length + wordSpelling.length > 0,
            `${word.id} must link its written composition`,
        );
        assert.ok(readings.length > 0, `${word.id} must link its reading`);
        assert.ok(spelling.every(({ entryId }) => kanji.has(entryId)));
        assert.ok(wordSpelling.every(({ entryId }) => words.has(entryId)));
        assert.ok(
            readings.every(({ entryId }) => {
                const reading = words.get(entryId);
                return (
                    reading?.hidden === true &&
                    reading.references.some(({ relation }) =>
                        ["word-spelling", "kana-spelling"].includes(relation),
                    )
                );
            }),
        );
    }
});
