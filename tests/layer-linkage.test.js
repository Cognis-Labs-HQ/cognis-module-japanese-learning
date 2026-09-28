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
                        references: [
                            ...(record.references ?? []),
                            ...Object.values(
                                record.referenceGroups ?? {},
                            ).flatMap((groups) => groups.flat()),
                        ],
                        layer: directory.name,
                    })),
                ),
        );
}

function orderedReferences(record, relations) {
    return (record.references ?? [])
        .filter(({ relation }) => relations.has(relation))
        .sort((left, right) => left.position - right.position);
}

function derivedPronunciation(record, recordsById, visited = new Set()) {
    if (!record || visited.has(record.id)) return "";
    if (record.layer === "characters") return record.label;
    const nextVisited = new Set(visited).add(record.id);
    const groupedReferences = [
        ...(record.referenceGroups?.["pronunciation-readings"]?.[0] ?? []),
        ...(record.referenceGroups?.["reading-kana"]?.[0] ?? []),
        ...(record.referenceGroups?.["kana-spelling"]?.[0] ?? []),
    ];
    return (
        groupedReferences.length ? groupedReferences : (record.references ?? [])
    )
        .filter(({ relation }) => relation !== "definitions")
        .slice()
        .sort(
            (left, right) =>
                (left.position ?? Number.MAX_SAFE_INTEGER) -
                (right.position ?? Number.MAX_SAFE_INTEGER),
        )
        .map(({ entryId }) =>
            derivedPronunciation(
                recordsById.get(entryId),
                recordsById,
                nextVisited,
            ),
        )
        .join("");
}

function derivedGroupedPronunciations(record, relationship, recordsById) {
    return (record.referenceGroups?.[relationship] ?? []).map((group) =>
        group
            .slice()
            .sort((left, right) => left.position - right.position)
            .map(({ entryId }) =>
                derivedPronunciation(recordsById.get(entryId), recordsById),
            )
            .join(""),
    );
}

test("the authored graph derives pronunciation from atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const layersById = new Map(schema.layers.map((layer) => [layer.id, layer]));

    for (const record of records) {
        const role = layersById.get(record.layer)?.semanticRole;
        if (role === "atomicWritingUnit") {
            assert.equal(record.fields.pronunciation.length, 1);
            assert.match(record.fields.pronunciation[0], /^[a-z]+$/u);
            assert.notEqual(record.fields.pronunciation[0], record.label);
        }
        if (role === "compoundWritingUnit") {
            assert.deepEqual(
                derivedGroupedPronunciations(record, "readings", recordsById),
                record.fields.pronunciation,
                record.id,
            );
            assert.ok(
                orderedReferences(record, new Set(["readings"])).every(
                    ({ entryId }) =>
                        recordsById.get(entryId).layer === "words" &&
                        recordsById.get(entryId).hidden === true &&
                        recordsById.get(entryId).class === "reading:kanji",
                ),
            );
        }
        if (["lexicalUnit", "orderedLexicalSequence"].includes(role)) {
            const derived = derivedPronunciation(record, recordsById);
            assert.deepEqual(record.fields.pronunciation, [derived], record.id);
            assert.ok(derived, record.id);
        }
    }

    assert.equal(
        derivedPronunciation(
            recordsById.get("ja:sentence:tomodachi-nihongo-manabu"),
            recordsById,
        ),
        "ともだちはにほんごをまなぶ",
    );
});

test("visible Kanji vocabulary uses complete hidden pronunciation records", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const vocabulary = records.filter(
        ({ layer, hidden }) => layer === "words" && hidden !== true,
    );
    const shims = records.filter(
        ({ class: contentClass, layer, hidden }) =>
            layer === "words" &&
            hidden === true &&
            contentClass === "reading:pronunciation",
    );

    assert.equal(vocabulary.length, 37);
    assert.ok(vocabulary.every(({ hidden }) => hidden !== true));
    assert.equal(shims.length, 53);
    assert.ok(
        shims.every(
            ({ class: contentClass }) =>
                contentClass === "reading:pronunciation",
        ),
    );
    for (const word of vocabulary) {
        const structural = (word.references ?? []).filter(({ relation }) =>
            ["reading-kana", "pronunciation-readings"].includes(relation),
        );
        assert.ok(structural.length > 0, word.id);
        assert.ok(structural.some(({ relation }) => relation !== "spelling"));
        assert.deepEqual(
            structural.map(({ position }) => position),
            structural.map((_, position) => position),
            word.id,
        );
    }

    assert.deepEqual(
        derivedPronunciation(recordsById.get("ja:word:suki"), recordsById),
        "すき",
    );
});

test("sentences contain only real vocabulary and particles", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    for (const sentence of records.filter(
        ({ layer }) => layer === "sentences",
    )) {
        const constituents = orderedReferences(
            sentence,
            new Set(["words", "particles"]),
        );
        assert.ok(constituents.length > 0, sentence.id);
        assert.equal(
            constituents
                .map(({ entryId }) => recordsById.get(entryId).label)
                .join(""),
            sentence.label,
            sentence.id,
        );
        assert.ok(
            constituents.every(({ entryId }) =>
                ["words", "particles"].includes(recordsById.get(entryId).layer),
            ),
        );
    }
});

test("pronunciation shims stay hidden and connect Kanji to Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const shims = records.filter(
        ({ class: contentClass, hidden, layer }) =>
            layer === "words" &&
            hidden === true &&
            contentClass === "reading:pronunciation",
    );
    assert.equal(shims.length, 53);
    for (const shim of shims) {
        const shimDefinitionIds = new Set(
            shim.references
                .filter(({ relation }) => relation === "definitions")
                .map(({ entryId }) => entryId),
        );
        const kanjiDefinitionIds = new Set(
            shim.references
                .filter(({ relation }) => relation === "spelling")
                .flatMap(
                    ({ entryId }) =>
                        recordsById
                            .get(entryId)
                            ?.references.filter(
                                ({ relation }) => relation === "definitions",
                            ) ?? [],
                )
                .map(({ entryId }) => entryId),
        );
        assert.notDeepEqual(shimDefinitionIds, kanjiDefinitionIds, shim.id);
        if (!shim.id.includes(":pronunciation-sentence-"))
            assert.ok(
                shim.references.some(
                    ({ entryId, relation }) =>
                        relation === "spelling" &&
                        recordsById.get(entryId)?.layer === "alt-characters",
                ),
                shim.id,
            );
        assert.ok(
            shim.references.some(({ relation }) =>
                ["reading-kana", "pronunciation-readings"].includes(relation),
            ),
            shim.id,
        );
        assert.ok(
            shim.references.some(({ relation }) => relation === "definitions"),
            shim.id,
        );
    }
});

test("every Kanji pronunciation resolves through its own hidden Kana reading", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const kanji = records.filter(({ layer }) => layer === "alt-characters");
    const readings = records.filter(
        ({ class: contentClass, hidden, layer }) =>
            layer === "words" &&
            hidden === true &&
            contentClass === "reading:kanji",
    );

    assert.equal(readings.length, 140);
    for (const record of kanji) {
        const groups = record.referenceGroups?.readings ?? [];
        assert.equal(
            groups.length,
            record.fields.pronunciation.length,
            record.id,
        );
        assert.deepEqual(
            derivedGroupedPronunciations(record, "readings", recordsById),
            record.fields.pronunciation,
            record.id,
        );
        for (const group of groups) {
            assert.equal(group.length, 1, record.id);
            const target = recordsById.get(group[0].entryId);
            assert.equal(target?.hidden, true, record.id);
            assert.equal(target?.class, "reading:kanji", record.id);
            assert.equal(
                target?.referenceGroups?.["kana-spelling"]?.length,
                1,
                target?.id,
            );
        }
    }
});

test("authored pronunciation paths are acyclic and end at Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const visit = (record, path = new Set()) => {
        assert.ok(!path.has(record.id), `cycle at ${record.id}`);
        if (record.layer === "characters") return;
        const nextPath = new Set(path).add(record.id);
        const children = (record.references ?? [])
            .filter(({ relation }) => relation !== "definitions")
            .map(({ entryId }) => recordsById.get(entryId));
        assert.ok(
            children.length > 0,
            `${record.id} has no pronunciation path`,
        );
        for (const child of children) visit(child, nextPath);
    };
    for (const record of records.filter(({ layer }) =>
        ["alt-characters", "words", "particles", "sentences"].includes(layer),
    )) {
        visit(record);
    }
});
