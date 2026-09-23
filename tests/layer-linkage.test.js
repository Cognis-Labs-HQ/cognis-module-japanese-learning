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
            assert.ok(referencedIds.has(record.id), `${record.id} is orphaned`);
        }

        if (role === "lexicalUnit") {
            assert.ok(definitionReferences.length > 0);
            const hasKanji = /[\p{Script=Han}]/u.test(record.label);
            if (!record.hidden || hasKanji) {
                assertOrderedComposition(
                    record,
                    new Set(["pronunciation-readings"]),
                    record.fields.pronunciation[0],
                    recordsById,
                );
            }
            if (record.hidden) {
                if (hasKanji) {
                    assertOrderedWrittenLinks(record, recordsById);
                } else {
                    assertOrderedComposition(
                        record,
                        new Set(["word-spelling", "kana-spelling"]),
                        record.fields.pronunciation[0],
                        recordsById,
                    );
                }
                assert.ok(
                    referencedIds.has(record.id),
                    `${record.id} hidden reading is orphaned`,
                );
            } else {
                assertOrderedWrittenLinks(record, recordsById);
            }
        }

        if (role === "particle") {
            assert.ok(definitionReferences.length > 0);
            assertOrderedComposition(
                record,
                new Set(["kana-spelling"]),
                record.label,
                recordsById,
            );
            assert.ok(referencedIds.has(record.id), `${record.id} is orphaned`);
        }

        if (role === "orderedLexicalSequence") {
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
        }

        if (role === "definition") {
            assert.ok(referencedIds.has(record.id), `${record.id} is orphaned`);
        }
    }
}

test("every layer preserves its required authored link path", () => {
    validateLayerLinks(loadRecords());
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
