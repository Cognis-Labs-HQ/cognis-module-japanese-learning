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
            const readings = orderedReferences(record, new Set(["readings"]));
            assert.equal(readings.length, record.fields.pronunciation.length);
            readings.forEach(({ entryId }, index) => {
                const target = recordsById.get(entryId);
                assert.ok(
                    target.fields.pronunciation.includes(
                        record.fields.pronunciation[index],
                    ),
                    `${record.id} reading ${index} must match ${target.id}`,
                );
            });
            assert.ok(definitionReferences.length > 0);
        }

        if (role === "lexicalUnit") {
            assert.ok(definitionReferences.length > 0);
            const hasKanji = /[\p{Script=Han}]/u.test(record.label);
            const detached =
                record.hidden === true &&
                record.references.every(
                    ({ relation }) => relation === "definitions",
                );
            if (!detached) {
                assertOrderedComposition(
                    record,
                    new Set([
                        hasKanji || record.hidden
                            ? "reading-kana"
                            : "kana-spelling",
                    ]),
                    record.fields.pronunciation[0],
                    recordsById,
                );
            }
            if (hasKanji) {
                assertOrderedWrittenLinks(record, recordsById);
            } else if (!detached) {
                assertOrderedComposition(
                    record,
                    new Set(["word-spelling", "reading-kana", "kana-spelling"]),
                    record.fields.pronunciation[0],
                    recordsById,
                );
                assert.equal(record.label, record.fields.pronunciation[0]);
            }
            if (record.hidden && !detached) {
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
        words: 85,
        particles: 11,
        sentences: 17,
    });
});

test("teacher vocabulary terminates at Kanji and atomic Kana", () => {
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
    const readings = orderedReferences(teacher, new Set(["reading-kana"])).map(
        ({ entryId }) => recordsById.get(entryId),
    );
    assert.deepEqual(
        readings.map(({ label }) => label),
        ["せ", "ん", "せ", "い"],
    );
    assert.ok(readings.every(({ layer }) => layer === "characters"));
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
            new Set(["reading-kana"]),
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
                return (
                    relation === "reading-kana" && target.layer === "characters"
                );
            }),
        );
    }
});

test("visible core vocabulary terminates at Kanji and Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const visibleVocabulary = records.filter(
        ({ hidden, label, layer }) =>
            layer === "words" &&
            hidden !== true &&
            /[\p{Script=Han}]/u.test(label),
    );

    for (const word of visibleVocabulary) {
        assert.match(word.label, /[\p{Script=Han}]/u, `${word.id} needs Kanji`);
        const Kanji = orderedReferences(
            word,
            new Set(["word-spelling", "spelling"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        const Kana = orderedReferences(word, new Set(["reading-kana"])).map(
            ({ entryId }) => recordsById.get(entryId),
        );
        assert.ok(Kanji.length > 0, `${word.id} bypasses the Kanji layer`);
        assert.equal(
            Kana.map(({ label }) => label).join(""),
            word.fields.pronunciation[0],
        );
        assert.ok(Kana.every(({ layer }) => layer === "characters"));
        assert.equal(
            word.references.some(
                ({ relation }) => relation === "pronunciation-readings",
            ),
            false,
            `${word.id} must not add another Vocabulary hop to its reading`,
        );
    }
});

test("hidden readings compose directly from atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const reading = recordsById.get("ja:word:sentence-reading-inu-mo-kuru");
    const composition = orderedReferences(
        reading,
        new Set(["reading-kana"]),
    ).map(({ entryId, relation }) => ({
        label: recordsById.get(entryId).label,
        relation,
    }));

    assert.deepEqual(composition, [
        { label: "い", relation: "reading-kana" },
        { label: "ぬ", relation: "reading-kana" },
        { label: "も", relation: "reading-kana" },
        { label: "く", relation: "reading-kana" },
        { label: "る", relation: "reading-kana" },
    ]);
});

test("reading titles use atomic Kana without recursive word links", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    assert.equal(
        wordLayer.relationships.find(({ id }) => id === "reading-kana")
            .presentationRole,
        "composition",
    );

    for (const reading of records.filter(
        ({ layer, hidden, references }) =>
            layer === "words" &&
            hidden === true &&
            references.some(({ relation }) => relation === "reading-kana"),
    )) {
        assertOrderedComposition(
            reading,
            new Set(["reading-kana"]),
            reading.label,
            recordsById,
        );
        assert.equal(
            reading.references.some(({ relation }) =>
                ["word-spelling", "kana-spelling"].includes(relation),
            ),
            false,
            `${reading.id} must not route its title back through another word`,
        );
    }
});

test("Kana cards and reading cards use accurate nonduplicated classes", () => {
    const records = loadRecords();
    for (const character of records.filter(
        ({ layer }) => layer === "characters",
    )) {
        assert.equal(character.class, "writing:kana");
        assert.notEqual(
            character.class.split(":").at(-1),
            character.fields.character_class,
            `${character.id} repeats its writing-system tag`,
        );
    }
    for (const reading of records.filter(
        ({ hidden, layer }) => hidden === true && layer === "words",
    )) {
        assert.equal(reading.class, "reading:pronunciation");
        assert.doesNotMatch(reading.label, /[\p{Script=Han}]/u);
    }
});

test("single-Kanji lexical readings open the visible vocabulary", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const Kanji of records.filter(
        ({ layer }) => layer === "alt-characters",
    )) {
        for (const { entryId } of orderedReferences(
            Kanji,
            new Set(["readings"]),
        )) {
            const target = recordsById.get(entryId);
            if (target.hidden === true) continue;
            assert.equal(target.layer, "words");
            if (/[\p{Script=Han}]/u.test(target.label)) {
                assert.equal(target.label, Kanji.label);
            }
            assert.ok(target.class.startsWith("lexical:"));
        }
    }

    const cat = recordsById.get("ja:kanji:core-e78cab");
    assert.deepEqual(
        orderedReferences(cat, new Set(["readings"])).map(
            ({ entryId }) => entryId,
        ),
        ["ja:word:neko"],
    );
});

test("Kanji reading dependencies are visible from every atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const KanjiLayer = schema.layers.find(({ id }) => id === "alt-characters");
    const dependency = KanjiLayer.relationships.find(
        ({ id }) => id === "reading-kana-dependency",
    );
    assert.equal(dependency.targetLayer, "characters");
    assert.equal(dependency.presentationRole, undefined);
    assert.equal(dependency.resolverRole, undefined);

    const inbound = new Map();
    for (const Kanji of records.filter(
        ({ layer }) => layer === "alt-characters",
    )) {
        const expectedIds = new Set(
            Kanji.fields.pronunciation.flatMap((reading) =>
                Array.from(
                    reading,
                    (label) =>
                        records.find(
                            ({ layer, label: candidate }) =>
                                layer === "characters" && candidate === label,
                        )?.id,
                ),
            ),
        );
        const dependencyIds = new Set(
            Kanji.references
                .filter(
                    ({ relation }) => relation === "reading-kana-dependency",
                )
                .map(({ entryId }) => entryId),
        );
        assert.deepEqual(dependencyIds, expectedIds, `${Kanji.id} Kana links`);
        for (const entryId of dependencyIds) {
            assert.equal(recordsById.get(entryId).layer, "characters");
            if (!inbound.has(entryId)) inbound.set(entryId, new Set());
            inbound.get(entryId).add(Kanji.id);
        }
    }

    assert.ok(inbound.get("ja:char:ka").has("ja:kanji:nichi"));
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

test("authored study links are acyclic and terminate at writing characters", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const structuralRelations = new Set([
        "kana-spelling",
        "pronunciation-readings",
        "reading-kana",
        "spelling",
        "word-spelling",
        "words",
        "particles",
    ]);
    const visiting = new Set();
    const visited = new Set();

    function visit(record, path = []) {
        assert.ok(record, `missing record after ${path.join(" -> ")}`);
        assert.equal(
            visiting.has(record.id),
            false,
            `recursive study link: ${[...path, record.id].join(" -> ")}`,
        );
        if (visited.has(record.id)) return;
        visiting.add(record.id);
        for (const reference of record.references ?? []) {
            if (!structuralRelations.has(reference.relation)) continue;
            visit(recordsById.get(reference.entryId), [...path, record.id]);
        }
        visiting.delete(record.id);
        visited.add(record.id);
    }

    for (const record of records) visit(record);
    for (const character of records.filter(
        ({ layer }) => layer === "characters",
    )) {
        assert.equal(
            (character.references ?? []).some(({ relation }) =>
                structuralRelations.has(relation),
            ),
            false,
            `${character.id} must terminate the study-link chain`,
        );
    }
});

test("lexicalized Kanji readings remain vocabulary rather than hidden readings", () => {
    const recordsById = new Map(
        loadRecords().map((record) => [record.id, record]),
    );
    const dayCounter = recordsById.get("ja:word:ka-day-counter");
    assert.equal(dayCounter.class, "lexical:counter");
    assert.equal(dayCounter.hidden, undefined);
    assert.deepEqual(
        orderedReferences(dayCounter, new Set(["kana-spelling"])).map(
            ({ entryId }) => recordsById.get(entryId).label,
        ),
        ["か"],
    );
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

test("content pack does not include binary files", () => {
    const binaryExtensions = new Set([
        ".aac",
        ".gif",
        ".jpeg",
        ".jpg",
        ".m4a",
        ".mp3",
        ".mp4",
        ".ogg",
        ".png",
        ".wav",
        ".webm",
    ]);
    const pending = [path.dirname(CONTENT_ROOT)];
    while (pending.length) {
        const directory = pending.pop();
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const filePath = path.join(directory, entry.name);
            if (entry.isDirectory()) pending.push(filePath);
            else
                assert.equal(
                    binaryExtensions.has(path.extname(entry.name)),
                    false,
                );
        }
    }
});
