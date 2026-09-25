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
                    target.fields.pronunciation.some((pronunciation) =>
                        pronunciation.includes(
                            record.fields.pronunciation[index],
                        ),
                    ),
                    `${record.id} reading ${index} must match ${target.id}`,
                );
            });
            assert.ok(definitionReferences.length > 0);
        }

        if (role === "lexicalUnit") {
            assert.ok(definitionReferences.length > 0);
            const hasKanji = /[\p{Script=Han}]/u.test(record.label);
            assertOrderedComposition(
                record,
                record.hidden
                    ? new Set(["word-spelling", "reading-kana"])
                    : new Set([
                          hasKanji ? "pronunciation-readings" : "kana-spelling",
                      ]),
                record.fields.pronunciation[0],
                recordsById,
            );
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
            assert.equal(
                record.references.some(
                    ({ relation }) => relation === "pronunciation-readings",
                ),
                false,
                `${record.id} must not create a parallel pronunciation parent`,
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
        words: 121,
        particles: 11,
        sentences: 17,
    });
});

test("teacher vocabulary terminates at Kanji and full Kana vocabulary", () => {
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
        ["せんせい"],
    );
    assert.ok(readings.every(({ hidden }) => hidden === true));
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

test("sentence pronunciations follow visible vocabulary and particles", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        assert.equal(
            orderedReferences(sentence, new Set(["words", "particles"]))
                .map(({ entryId }) => recordsById.get(entryId).label)
                .join(""),
            sentence.label,
        );
        assert.equal(
            orderedReferences(sentence, new Set(["words", "particles"]))
                .map(
                    ({ entryId }) =>
                        recordsById.get(entryId).fields.pronunciation[0],
                )
                .join(""),
            sentence.fields.pronunciation[0],
        );
    }
});

test("sentence pronunciation details deep-link words and particles", () => {
    const sentenceLayer = schema.layers.find(({ id }) => id === "sentences");
    const pronunciationField = sentenceLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciationField.input.linkRelationships, [
        "words",
        "particles",
    ]);

    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        const pronunciationReferences = orderedReferences(
            sentence,
            new Set(pronunciationField.input.linkRelationships),
        );
        assert.ok(
            pronunciationReferences.length > 0,
            `${sentence.id} has no pronunciation links`,
        );
        for (const { entryId, relation } of pronunciationReferences) {
            const target = recordsById.get(entryId);
            assert.equal(target.layer, relation);
            assert.notEqual(target.hidden, true, `${entryId} must be visible`);
            const pronunciation = target.fields.pronunciation[0];
            assert.ok(
                sentence.fields.pronunciation[0].includes(pronunciation),
                `${sentence.id} must expose ${entryId}'s complete reading`,
            );
        }
        assert.equal(
            sentence.references.some(
                ({ relation }) => relation === "pronunciation-readings",
            ),
            false,
            `${sentence.id} must not own a parallel reading chain`,
        );
    }
});

test("school sentence links every displayed pronunciation segment", () => {
    const recordsById = new Map(
        loadRecords().map((record) => [record.id, record]),
    );
    const sentence = recordsById.get("ja:sentence:gakkou-ni-iku");
    const links = orderedReferences(
        sentence,
        new Set(["words", "particles"]),
    ).map(({ entryId }) => recordsById.get(entryId));
    assert.deepEqual(
        links.map(({ id }) => id),
        ["ja:word:gakkou", "ja:particle:ni", "ja:word:iku"],
    );
    assert.deepEqual(
        links.map(({ fields }) => fields.pronunciation[0]),
        ["がっこう", "に", "いく"],
    );
    assert.equal(
        links.map(({ fields }) => fields.pronunciation[0]).join(""),
        sentence.fields.pronunciation[0],
    );
});

test("dog mountain sentence links Kana spans to independent vocabulary", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const sentence = recordsById.get("ja:sentence:inu-yama-kuru");
    const words = orderedReferences(sentence, new Set(["words"])).map(
        ({ entryId }) => recordsById.get(entryId),
    );
    assert.deepEqual(
        words.map(({ label }) => label),
        ["犬", "山", "来る"],
    );
    assert.deepEqual(
        words.map(({ fields }) => fields.pronunciation[0]),
        ["いぬ", "やま", "くる"],
    );
    for (const word of words) {
        const readings = orderedReferences(
            word,
            new Set(["pronunciation-readings"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.deepEqual(
            readings.map(({ label }) => label),
            word.fields.pronunciation,
        );
        for (const reading of readings) {
            const relations = new Set(
                reading.references.map(({ relation }) => relation),
            );
            assert.ok(relations.has("definitions"));
            assert.ok(
                relations.has("reading-kana") || relations.has("word-spelling"),
                `${reading.id} must end at its own Kana`,
            );
        }
    }
});

test("visible core vocabulary terminates at Kanji and full Kana vocabulary", () => {
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
        const readings = orderedReferences(
            word,
            new Set(["pronunciation-readings"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.ok(Kanji.length > 0, `${word.id} bypasses the Kanji layer`);
        assert.equal(
            readings.map(({ label }) => label).join(""),
            word.fields.pronunciation[0],
        );
        assert.ok(readings.every(({ hidden }) => hidden === true));
    }
});

test("vocabulary pronunciation details use the host multi-link contract", () => {
    const wordLayer = schema.layers.find(({ id }) => id === "words");
    const pronunciation = wordLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciation.input.linkRelationships, [
        "pronunciation-readings",
    ]);

    const recordsById = new Map(
        loadRecords().map((record) => [record.id, record]),
    );
    const cat = recordsById.get("ja:word:neko");
    const targets = orderedReferences(
        cat,
        new Set(pronunciation.input.linkRelationships),
    ).map(({ entryId }) => recordsById.get(entryId));
    assert.deepEqual(
        targets.map(({ id, label }) => ({ id, label })),
        [{ id: "ja:word:pronunciation-neko", label: "ねこ" }],
    );
});

test("small-cat sentence owns composition without a parallel Kana chain", () => {
    const recordsById = new Map(
        loadRecords().map((record) => [record.id, record]),
    );
    const sentence = recordsById.get("ja:sentence:chiisai-neko-suki");
    assert.deepEqual(
        orderedReferences(sentence, new Set(["words", "particles"])).map(
            ({ entryId }) => recordsById.get(entryId).label,
        ),
        ["小さい", "猫", "が", "好き"],
    );
    for (const wordId of ["ja:word:chiisai", "ja:word:neko", "ja:word:suki"]) {
        const word = recordsById.get(wordId);
        const reading = orderedReferences(
            word,
            new Set(["pronunciation-readings"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.deepEqual(
            reading.map(({ label }) => label),
            word.fields.pronunciation,
        );
    }
    assert.equal(
        sentence.references.some(
            ({ relation }) => relation === "pronunciation-readings",
        ),
        false,
    );
    const sukiReading = recordsById.get("ja:word:pronunciation-suki");
    const parents = loadRecords().filter((record) =>
        (record.references ?? []).some(
            ({ entryId }) => entryId === sukiReading.id,
        ),
    );
    assert.deepEqual(
        parents.map(({ id }) => id),
        ["ja:word:suki"],
    );
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
            new Set(["word-spelling", "reading-kana"]),
            reading.label,
            recordsById,
        );
        assert.equal(
            reading.references.some(
                ({ relation }) => relation === "kana-spelling",
            ),
            false,
            `${reading.id} must not publish a partial alternate spelling`,
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

test("Kanji pronunciations contain only their own Kana reading", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));

    for (const Kanji of records.filter(
        ({ layer }) => layer === "alt-characters",
    )) {
        const primaryReadings = orderedReferences(
            Kanji,
            new Set(["readings"]),
        ).map(({ entryId }) => recordsById.get(entryId));
        assert.equal(primaryReadings.length, 1);
        assert.deepEqual(
            Kanji.fields.pronunciation,
            primaryReadings.map(({ label }) => label),
            `${Kanji.id} pronunciation must equal its direct Kana reading`,
        );
        for (const reading of [
            ...primaryReadings,
            ...orderedReferences(Kanji, new Set(["alternate-readings"])).map(
                ({ entryId }) => recordsById.get(entryId),
            ),
        ]) {
            assert.doesNotMatch(reading.label, /[\p{Script=Han}]/u);
        }
    }

    const liked = recordsById.get("ja:kanji:core-e5a5bd");
    assert.deepEqual(liked.fields.pronunciation, ["す"]);
    assert.deepEqual(
        orderedReferences(liked, new Set(["readings"])).map(
            ({ entryId }) => entryId,
        ),
        ["ja:word:kanji-reading-e5a5bd-e38199"],
    );
    const completeWordReading = recordsById.get("ja:word:pronunciation-suki");
    assert.deepEqual(
        orderedReferences(
            completeWordReading,
            new Set(["word-spelling", "reading-kana"]),
        ).map(({ entryId }) => entryId),
        ["ja:word:kanji-reading-e5a5bd-e38199", "ja:char:ki"],
    );
});

test("Kana Used By contains only direct reading relationships", () => {
    const records = loadRecords();
    const Kanji = records.filter(({ layer }) => layer === "alt-characters");

    for (const record of Kanji) {
        assert.equal(
            record.references.some(({ entryId }) =>
                entryId.startsWith("ja:char:"),
            ),
            false,
            `${record.id} must reach Kana through its reading record`,
        );
    }

    const rainReading = records.find(
        ({ id }) => id === "ja:word:kanji-reading-core-e99ba8-3042-3081",
    );
    assert.ok(
        rainReading.references.some(
            ({ entryId, relation }) =>
                entryId === "ja:char:a" && relation === "reading-kana",
        ),
    );
    const rainKanji = records.find(({ id }) => id === "ja:kanji:core-e99ba8");
    assert.equal(
        rainKanji.references.some(({ entryId }) => entryId === "ja:char:a"),
        false,
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

function aliases(record) {
    return [record.label, ...(record.fields?.pronunciation ?? [])]
        .map((value) => value.normalize("NFKC"))
        .sort((left, right) => right.length - left.length);
}

function assertTitlePronunciationLinks(record, layer, recordsById) {
    const pronunciationField = layer.fields?.find(
        ({ id }) => id === "pronunciation",
    );
    const relationships = new Set(
        pronunciationField?.input?.linkRelationships ?? [],
    );
    for (const pronunciation of record.fields?.pronunciation ?? []) {
        if (pronunciation === record.label) continue;
        const references = (record.references ?? [])
            .map((reference, authoredIndex) => ({
                ...reference,
                authoredIndex,
                target: recordsById.get(reference.entryId),
            }))
            .filter(
                ({ relation, target }) => relationships.has(relation) && target,
            )
            .sort(
                (left, right) =>
                    (left.position ?? left.authoredIndex) -
                        (right.position ?? right.authoredIndex) ||
                    left.authoredIndex - right.authoredIndex,
            );
        assert.ok(references.length, `${record.id} has no title-detail links`);
        let offset = 0;
        for (const { target } of references) {
            const alias = aliases(target).find((value) =>
                pronunciation.startsWith(value, offset),
            );
            assert.ok(
                alias,
                `${record.id} cannot link ${pronunciation} through ${target.id}`,
            );
            offset += alias.length;
        }
        assert.equal(
            offset,
            pronunciation.length,
            `${record.id} links only ${pronunciation.slice(0, offset)}`,
        );
    }
}

test("every sentence pronunciation segment has a working title link", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const layer = schema.layers.find(({ id }) => id === "sentences");
    for (const sentence of records.filter(
        ({ layer: layerId }) => layerId === "sentences",
    )) {
        assertTitlePronunciationLinks(sentence, layer, recordsById);
    }
});

test("every Kanji pronunciation opens its complete adjacent reading", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const layer = schema.layers.find(({ id }) => id === "alt-characters");
    for (const kanji of records.filter(
        ({ layer: layerId }) => layerId === "alt-characters",
    )) {
        assert.equal(
            kanji.references.filter(({ relation }) => relation === "readings")
                .length,
            1,
            `${kanji.id} must expose one unambiguous adjacent reading`,
        );
        assertTitlePronunciationLinks(kanji, layer, recordsById);
    }
});
