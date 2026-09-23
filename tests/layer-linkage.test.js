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
const schema = JSON.parse(
    readFileSync(path.join(CONTENT_ROOT, "..", "schema.json"), "utf8"),
);

function loadRecords() {
    return readdirSync(CONTENT_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((directory) =>
            readdirSync(path.join(CONTENT_ROOT, directory.name))
                .filter((name) => name.endsWith(".json"))
                .flatMap((name) =>
                    JSON.parse(
                        readFileSync(
                            path.join(CONTENT_ROOT, directory.name, name),
                            "utf8",
                        ),
                    ).map((record) => ({
                        ...record,
                        layer: directory.name,
                    })),
                ),
        );
}

function orderedReferences(record, relationships) {
    return (record.references ?? [])
        .filter(({ relation }) => relationships.has(relation))
        .sort((left, right) => left.position - right.position);
}

function assertOrderedComposition(
    record,
    relationships,
    expected,
    recordsById,
) {
    const references = orderedReferences(record, relationships);
    assert.ok(references.length > 0, `${record.id} has no authored links`);
    assert.deepEqual(
        references.map(({ position }) => position),
        references.map((_, position) => position),
        `${record.id} link positions must be contiguous`,
    );
    assert.equal(
        references
            .map(({ entryId }) => recordsById.get(entryId)?.label)
            .join(""),
        expected,
        `${record.id} links must reconstruct ${expected}`,
    );
}

function assertOrderedWrittenLinks(record, recordsById) {
    const references = orderedReferences(
        record,
        new Set(["word-spelling", "spelling"]),
    );
    if (!/[\p{Script=Han}]/u.test(record.label)) return;
    assert.ok(references.length > 0, `${record.id} has no written links`);
    let offset = 0;
    for (const { entryId } of references) {
        const label = recordsById.get(entryId)?.label;
        const position = record.label.indexOf(label, offset);
        assert.notEqual(position, -1, `${record.id} does not contain ${label}`);
        offset = position + label.length;
    }
}

function validateLayerLinks(records) {
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const layersById = new Map(schema.layers.map((layer) => [layer.id, layer]));
    const referencedIds = new Set(
        records.flatMap((record) =>
            (record.references ?? []).map(({ entryId }) => entryId),
        ),
    );

    for (const record of records) {
        const role = layersById.get(record.layer)?.semanticRole;
        assert.match(
            record.class,
            /^[a-z][a-zA-Z0-9]*(?::[a-z][a-zA-Z0-9]*)*$/,
            `${record.id} requires a semantic class`,
        );
        if (record.editable !== undefined) {
            assert.equal(typeof record.editable, "boolean");
        }
        const definitionReferences = (record.references ?? []).filter(
            ({ relation }) => relation === "definitions",
        );

        if (role === "compoundWritingUnit") {
            assert.deepEqual(
                orderedReferences(record, new Set(["readings"])).map(
                    ({ entryId }) => recordsById.get(entryId)?.label,
                ),
                record.fields.pronunciation,
                `${record.id} readings must match its pronunciation field`,
            );
            assert.ok(definitionReferences.length > 0);
        }

        if (role === "lexicalUnit") {
            assert.ok(definitionReferences.length > 0);
            const hasKanji = /[\p{Script=Han}]/u.test(record.label);
            if (hasKanji) {
                assertOrderedComposition(
                    record,
                    new Set(["pronunciation-readings"]),
                    record.fields.pronunciation[0],
                    recordsById,
                );
            }
            if (hasKanji) {
                assertOrderedWrittenLinks(record, recordsById);
            } else {
                assertOrderedComposition(
                    record,
                    new Set(["word-spelling", "reading-kana", "kana-spelling"]),
                    record.fields.pronunciation[0],
                    recordsById,
                );
                assert.equal(record.label, record.fields.pronunciation[0]);
            }
            if (record.hidden) {
                assert.ok(
                    referencedIds.has(record.id),
                    `${record.id} hidden reading is orphaned`,
                );
            }
        }

        if (role === "particle") {
            assert.equal(record.class, "particle");
            assert.equal(record.editable, false);
            assert.ok(definitionReferences.length > 0);
            assertOrderedComposition(
                record,
                new Set(["kana-spelling"]),
                record.label,
                recordsById,
            );
        }

        if (role === "orderedLexicalSequence") {
            assert.equal(record.class, "composite");
            assert.ok(definitionReferences.length > 0);
            assertOrderedComposition(
                record,
                new Set(["words", "particles"]),
                record.label,
                recordsById,
            );
            const pronunciation = orderedReferences(
                record,
                new Set(["words", "particles"]),
            )
                .map(
                    ({ entryId }) =>
                        recordsById.get(entryId)?.fields.pronunciation[0],
                )
                .join("");
            assert.equal(pronunciation, record.fields.pronunciation[0]);
            const pronunciationReadings = orderedReferences(
                record,
                new Set(["pronunciation-readings"]),
            ).map(({ entryId }) => recordsById.get(entryId));
            assert.ok(
                pronunciationReadings.every(({ hidden }) => hidden === true),
            );
            assert.equal(
                pronunciationReadings.map(({ label }) => label).join(""),
                record.fields.pronunciation[0],
            );
        }

        if (role === "definition") {
            assert.equal(record.class, "definition");
            assert.equal(record.hidden, true);
            assert.ok(referencedIds.has(record.id), `${record.id} is orphaned`);
        }
    }
}

test("every layer preserves its required authored link path", () => {
    validateLayerLinks(loadRecords());
});

test("reviewed graph inventory remains bounded to the core curriculum", () => {
    const records = loadRecords();
    const counts = Object.fromEntries(
        schema.layers.map(({ id }) => [
            id,
            records.filter(({ layer }) => layer === id).length,
        ]),
    );
    assert.deepEqual(counts, {
        characters: 270,
        "alt-characters": 39,
        definitions: 115,
        words: 133,
        particles: 11,
        sentences: 17,
    });
});

test("teacher vocabulary traverses Kanji readings to atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const teacher = recordsById.get("ja:word:sensei");
    assert.equal(teacher.label, "先生");
    assert.equal(teacher.hidden, undefined);
    assert.deepEqual(
        orderedReferences(teacher, new Set(["spelling"])).map(
            ({ entryId }) => recordsById.get(entryId).label,
        ),
        ["先", "生"],
    );
    const readings = orderedReferences(
        teacher,
        new Set(["pronunciation-readings"]),
    ).map(({ entryId }) => recordsById.get(entryId));
    assert.deepEqual(
        readings.map(({ label }) => label),
        ["せん", "せい"],
    );
    assert.ok(readings.every(({ hidden }) => hidden === true));
    for (const reading of readings) {
        assertOrderedComposition(
            reading,
            new Set(["kana-spelling"]),
            reading.label,
            recordsById,
        );
    }
});

test("sentences link only through visible vocabulary and particles", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        const constituents = orderedReferences(
            sentence,
            new Set(["words", "particles"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.ok(constituents.length > 0);
        assert.ok(
            constituents.every(
                ({ hidden, layer }) =>
                    hidden !== true && ["words", "particles"].includes(layer),
            ),
            `${sentence.id} bypasses visible lexical layers`,
        );
    }
});

test("sentence pronunciations resolve through vocabulary and atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        const readingReference = sentence.references.find(
            ({ relation }) => relation === "pronunciation-readings",
        );
        const reading = recordsById.get(readingReference.entryId);
        const composition = orderedReferences(
            reading,
            new Set(["word-spelling", "reading-kana"]),
        );
        assert.equal(reading.hidden, true);
        assert.equal(reading.label, sentence.fields.pronunciation[0]);
        assert.equal(
            composition
                .map(({ entryId }) => recordsById.get(entryId).label)
                .join(""),
            reading.label,
            `${sentence.id} has unlinked pronunciation text`,
        );
        assert.ok(
            composition.every(({ entryId, relation }) => {
                const target = recordsById.get(entryId);
                return relation === "reading-kana"
                    ? target.layer === "characters"
                    : target.layer === "words" && target.hidden === true;
            }),
        );
    }
});

test("visible core vocabulary uses Kanji without skipping reading layers", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const visibleVocabulary = records.filter(
        ({ hidden, layer }) => layer === "words" && hidden !== true,
    );

    for (const word of visibleVocabulary) {
        assert.match(word.label, /[\p{Script=Han}]/u, `${word.id} needs Kanji`);
        const Kanji = orderedReferences(
            word,
            new Set(["word-spelling", "spelling"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        const readings = orderedReferences(
            word,
            new Set(["pronunciation-readings"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.ok(Kanji.length > 0, `${word.id} bypasses the Kanji layer`);
        assert.ok(
            readings.length > 0,
            `${word.id} bypasses reading Vocabulary`,
        );
        assert.ok(readings.every(({ hidden }) => hidden === true));
    }
});

test("inflected readings compose meaningful stems and atomic Kana suffixes", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const reading = recordsById.get("ja:word:reading-naosu");
    const composition = orderedReferences(
        reading,
        new Set(["word-spelling", "reading-kana"]),
    ).map(({ entryId, relation }) => ({
        label: recordsById.get(entryId).label,
        relation,
    }));

    assert.deepEqual(composition, [
        { label: "なお", relation: "word-spelling" },
        { label: "す", relation: "reading-kana" },
    ]);
    assert.equal(
        reading.references.some(({ relation }) => relation === "kana-spelling"),
        false,
        "a partial Kana suffix must not masquerade as a complete alternate spelling",
    );
});

test("hidden readings do not show duplicate-labeled Used By entries", () => {
    const records = loadRecords();
    const inbound = new Map();
    for (const source of records) {
        for (const { entryId } of source.references ?? []) {
            if (!inbound.has(entryId)) inbound.set(entryId, []);
            inbound.get(entryId).push(source);
        }
    }

    for (const reading of records.filter(
        ({ class: entryClass, hidden }) =>
            hidden === true && entryClass.startsWith("reading:"),
    )) {
        const labels = (inbound.get(reading.id) ?? []).map(
            ({ label }) => label,
        );
        assert.equal(
            new Set(labels).size,
            labels.length,
            `${reading.id} has duplicate-labeled parents: ${labels.join(", ")}`,
        );
    }
});

test("layer checks reject content whose required links are removed", () => {
    const records = loadRecords();
    const linkedRoles = [
        "compoundWritingUnit",
        "lexicalUnit",
        "particle",
        "orderedLexicalSequence",
    ];

    for (const role of linkedRoles) {
        const layerId = schema.layers.find(
            ({ semanticRole }) => semanticRole === role,
        ).id;
        const candidate = records.find(({ layer }) => layer === layerId);
        const mutated = records.map((record) =>
            record.id === candidate.id
                ? {
                      ...record,
                      references: record.references.filter(
                          ({ relation }) => relation === "definitions",
                      ),
                  }
                : record,
        );
        assert.throws(
            () => validateLayerLinks(mutated),
            undefined,
            `${role} accepted unlinked content`,
        );
    }

    const definition = records.find(({ layer }) => layer === "definitions");
    const orphanedDefinition = records.map((record) => ({
        ...record,
        references: (record.references ?? []).filter(
            ({ entryId }) => entryId !== definition.id,
        ),
    }));
    assert.throws(
        () => validateLayerLinks(orphanedDefinition),
        undefined,
        "definition layer accepted an orphaned entry",
    );
});
