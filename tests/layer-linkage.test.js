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

function orderedReferences(record, relations) {
    return (record.references ?? [])
        .filter(({ relation }) => relations.has(relation))
        .sort((left, right) => left.position - right.position);
}

function derivedPronunciation(record, recordsById, visited = new Set()) {
    if (!record || visited.has(record.id)) return "";
    if (record.layer === "characters") return record.label;
    const nextVisited = new Set(visited).add(record.id);
    return (record.references ?? [])
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

test("the authored graph derives pronunciation from atomic Kana", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const layersById = new Map(schema.layers.map((layer) => [layer.id, layer]));

    for (const record of records) {
        const role = layersById.get(record.layer)?.semanticRole;
        if (role === "atomicWritingUnit") {
            assert.deepEqual(record.fields.pronunciation, [record.label]);
        }
        if (role === "compoundWritingUnit") {
            assert.equal(
                derivedPronunciation(record, recordsById),
                record.fields.pronunciation[0],
                record.id,
            );
            assert.ok(
                orderedReferences(record, new Set(["readings"])).every(
                    ({ entryId }) =>
                        recordsById.get(entryId).layer === "characters",
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

test("vocabulary links directly to Kana without pronunciation duplicates", () => {
    const records = loadRecords();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    const vocabulary = records.filter(({ layer }) => layer === "words");

    assert.equal(vocabulary.length, 37);
    assert.ok(vocabulary.every(({ hidden }) => hidden !== true));
    for (const word of vocabulary) {
        const structural = (word.references ?? []).filter(
            ({ relation }) => relation !== "definitions",
        );
        assert.ok(structural.length > 0, word.id);
        assert.ok(
            structural.every(
                ({ entryId, relation }) =>
                    relation === "reading-kana" &&
                    recordsById.get(entryId)?.layer === "characters",
            ),
            word.id,
        );
        assert.deepEqual(
            structural.map(({ position }) => position),
            structural.map((_, position) => position),
            word.id,
        );
    }

    assert.deepEqual(
        orderedReferences(
            recordsById.get("ja:word:suki"),
            new Set(["reading-kana"]),
        ).map(({ entryId }) => recordsById.get(entryId).label),
        ["す", "き"],
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

test("the relationship hierarchy has no obsolete pronunciation wrappers", () => {
    const records = loadRecords();
    assert.equal(
        records.some(
            ({ class: contentClass, hidden, layer }) =>
                layer === "words" &&
                (hidden === true || contentClass === "reading:pronunciation"),
        ),
        false,
    );
    assert.equal(
        records.some((record) =>
            (record.references ?? []).some(({ relation }) =>
                ["pronunciation-readings", "alternate-readings"].includes(
                    relation,
                ),
            ),
        ),
        false,
    );
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
