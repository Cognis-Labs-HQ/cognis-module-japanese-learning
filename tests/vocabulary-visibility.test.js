import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const vocabularyLayer = schema.layers.find(
    ({ semanticRole }) => semanticRole === "lexicalUnit",
);
const vocabulary = layers.get(vocabularyLayer.id);
const visible = vocabulary.filter(({ hidden }) => !hidden);
const carousels = schema.layers.flatMap(
    (layer) => layer.cardConstructor?.tag_carousels ?? [],
);

const definitionRelations = new Set(
    vocabularyLayer.relationships
        .filter(({ targetLayer }) =>
            schema.layers.some(
                ({ id, semanticRole }) =>
                    id === targetLayer && semanticRole === "definition",
            ),
        )
        .map(({ id }) => id),
);

function lexicalIdentity(record) {
    const meanings = record.references
        .filter(({ relation }) => definitionRelations.has(relation))
        .map(({ entryId }) => entryId)
        .sort();
    return JSON.stringify([
        record.label.normalize("NFKC").toLowerCase(),
        meanings,
    ]);
}

test("composer carousels explicitly preserve all visible lexical vocabulary", () => {
    for (const carousel of carousels) {
        assert.equal(typeof carousel.excludeFromBrowse, "boolean", carousel.id);
        for (const word of visible) {
            if (word.tags?.includes(carousel.tag)) {
                assert.equal(carousel.excludeFromBrowse, false, word.id);
            }
        }
    }
    for (const field of vocabularyLayer.fields) {
        if (
            !field.detail?.filterable ||
            field.detail.required ||
            field.detail.defaultTag ||
            field.detail.autoSelectSingle === false
        )
            continue;
        const values = new Set(
            visible.flatMap((word) => {
                const value = word.fields?.[field.id];
                return value === undefined
                    ? []
                    : Array.isArray(value)
                      ? value
                      : [value];
            }),
        );
        assert.ok(
            values.size !== 1 ||
                visible.every((word) => word.fields?.[field.id] !== undefined),
            `${field.id}: sole filter would hide unclassified vocabulary`,
        );
    }
});

test("every sentence vocabulary reference has a visible lexical card", () => {
    const visibleIds = new Set(visible.map(({ id }) => id));
    const visibleMeanings = new Set(visible.map(lexicalIdentity));
    const wordsById = new Map(vocabulary.map((word) => [word.id, word]));
    for (const layer of schema.layers.filter(
        ({ semanticRole }) => semanticRole === "orderedLexicalSequence",
    )) {
        const relations = new Set(
            layer.relationships
                .filter(({ targetLayer }) => targetLayer === vocabularyLayer.id)
                .map(({ id }) => id),
        );
        for (const sentence of layers.get(layer.id)) {
            const references = [
                ...sentence.references,
                ...Object.values(sentence.referenceGroups ?? {}).flat(2),
            ];
            for (const reference of references.filter(({ relation }) =>
                relations.has(relation),
            )) {
                const word = wordsById.get(reference.entryId);
                assert.ok(word, `${sentence.id}: missing ${reference.entryId}`);
                assert.ok(
                    visibleIds.has(word.id) ||
                        visibleMeanings.has(lexicalIdentity(word)),
                    `${sentence.id}: ${word.label} is absent from Vocabulary`,
                );
            }
        }
    }
});
