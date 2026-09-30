import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const LIBRARY_ROOT = path.resolve(import.meta.dirname, "..", "data", "library");
const schema = JSON.parse(readFileSync(path.join(LIBRARY_ROOT, "schema.json")));
const records = readdirSync(path.join(LIBRARY_ROOT, "content"), {
    withFileTypes: true,
})
    .filter((entry) => entry.isDirectory())
    .flatMap((directory) =>
        readdirSync(path.join(LIBRARY_ROOT, "content", directory.name))
            .filter((name) => name.endsWith(".json"))
            .flatMap((name) =>
                JSON.parse(
                    readFileSync(
                        path.join(
                            LIBRARY_ROOT,
                            "content",
                            directory.name,
                            name,
                        ),
                    ),
                ).map((record) => ({ ...record, layer: directory.name })),
            ),
    );

test("semantic cards require definitions while structural readings inherit them", () => {
    for (const layerId of ["particles", "sentences"]) {
        const layer = schema.layers.find(({ id }) => id === layerId);
        assert.equal(layer.displayDefinition, true);
        const relationship = layer.relationships.find(
            ({ targetLayer }) => targetLayer === "definitions",
        );
        assert.ok(relationship?.minimum >= 1);
        for (const record of records.filter(
            ({ layer: id }) => id === layerId,
        )) {
            assert.ok(
                record.references.some(
                    ({ relation }) => relation === relationship.id,
                ),
                `${record.id} requires display definition content`,
            );
        }
    }
});

test("layer semantics reject sentence and particle structures in Vocabulary", () => {
    const byId = new Map(records.map((record) => [record.id, record]));
    const vocabulary = records.filter(({ layer }) => layer === "words");
    const sentences = records.filter(({ layer }) => layer === "sentences");
    const sentencePronunciations = new Set(
        sentences.flatMap(({ fields }) => fields.pronunciation ?? []),
    );
    const kanaLabels = new Set(
        records
            .filter(({ layer }) => layer === "characters")
            .map(({ label }) => label),
    );
    const sentenceLayer = schema.layers.find(({ id }) => id === "sentences");
    const pronunciationField = sentenceLayer.fields.find(
        ({ id }) => id === "pronunciation",
    );
    assert.deepEqual(pronunciationField.input.linkRelationships, [
        "words",
        "particles",
    ]);

    for (const record of vocabulary) {
        assert.notEqual(record.class, "composite", record.id);
        assert.notEqual(record.class, "particle", record.id);
        if (record.hidden)
            assert.ok(
                !kanaLabels.has(record.label),
                `${record.id} duplicates Kana`,
            );
        assert.ok(
            !sentencePronunciations.has(record.label),
            `${record.id} duplicates a complete sentence pronunciation`,
        );
        for (const reference of record.references ?? []) {
            assert.ok(
                !["particles", "sentences"].includes(
                    byId.get(reference.entryId)?.layer,
                ),
                `${record.id} contains ${reference.entryId}`,
            );
        }
    }

    for (const sentence of sentences) {
        assert.equal(sentence.class, "composite", sentence.id);
        assert.notEqual(sentence.hidden, true, sentence.id);
        assert.equal(
            sentence.referenceGroups?.["pronunciation-readings"],
            undefined,
            sentence.id,
        );
        for (const reference of sentence.references ?? []) {
            if (reference.relation === "words") {
                assert.equal(byId.get(reference.entryId)?.layer, "words");
                assert.notEqual(
                    byId.get(reference.entryId)?.hidden,
                    true,
                    reference.entryId,
                );
            }
            if (reference.relation === "particles")
                assert.equal(byId.get(reference.entryId)?.layer, "particles");
        }
    }
});
