import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { difficultyLevel } from "../api/reuse/difficulty.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const profile = JSON.parse(
    await readFile("data/library/difficulty.json", "utf8"),
);
const values = profile.options.map(({ value }) => value);
const roles = new Set([
    "compoundWritingUnit",
    "lexicalUnit",
    "particle",
    "orderedLexicalSequence",
]);

test("all graded layers use the same generic difficulty contract and provider-defined scale", () => {
    for (const layer of schema.layers.filter(({ semanticRole }) =>
        roles.has(semanticRole),
    )) {
        const field = layer.fields.find(({ id }) => id === "difficulty_level");
        assert.equal(field.type, "string");
        assert.deepEqual(field.input.options, profile.options);
        assert.equal(field.detail.group, "difficulty-level");
        assert.equal(field.detail.required, false);
        assert.equal(field.detail.filterable, true);
        assert.equal(field.detail.autoSelectSingle, false);
        if (layer.semanticRole === "orderedLexicalSequence") {
            assert.deepEqual(field.derivation.values, values);
            assert.deepEqual(field.derivation.relationships, [
                "words",
                "particles",
            ]);
            assert.deepEqual(
                field.derivation.transformationValues,
                profile.transformationValues,
            );
            assert.equal(field.derivation.requireAll, true);
        }
    }
    for (const option of profile.options) {
        assert.deepEqual(Object.keys(option.metadata.labels).sort(), [
            "de",
            "en",
            "id",
            "ja",
        ]);
    }
});

test("difficulty normalization uses provider data instead of hardcoded scale names or source order", () => {
    const tags = Object.keys(profile.sourceTags);
    const expected = values.find((value) =>
        Object.values(profile.sourceTags).includes(value),
    );
    assert.equal(
        difficultyLevel({ [profile.sourceField]: tags.toReversed() }),
        expected,
    );
    assert.equal(
        difficultyLevel({ [profile.sourceField]: ["unclassified"] }),
        undefined,
    );
    assert.equal(difficultyLevel({ [profile.sourceField]: {} }), undefined);
    assert.equal(
        difficultyLevel({}, { fields: { difficulty_level: values[0] } }),
        values[0],
    );
    assert.equal(difficultyLevel({}, { tags }), expected);
});

test("every declared transformation has a valid provider difficulty", () => {
    for (const set of schema.transformSets) {
        for (const rule of set.rules) {
            assert.ok(
                values.includes(profile.transformationValues[rule.id]),
                rule.id,
            );
        }
    }
});
