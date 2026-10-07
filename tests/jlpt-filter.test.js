import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("JLPT filtering permits multiple levels and no initial selection", () => {
    const schema = JSON.parse(
        readFileSync(
            new URL("../data/library/schema.json", import.meta.url),
            "utf8",
        ),
    );
    const vocabulary = schema.layers.find(({ id }) => id === "words");
    const proficiency = vocabulary.fields.find(({ id }) => id === "jlpt_level");
    assert.equal(proficiency.detail.filterable, true);
    assert.equal(proficiency.detail.group, "proficiency-level");
    assert.equal(proficiency.detail.exclusive, false);
    assert.equal(proficiency.detail.required, false);
    assert.equal(proficiency.detail.defaultTag, undefined);
    assert.deepEqual(
        proficiency.input.options.map(({ value }) => value),
        ["N5", "N4", "N3", "N2", "N1"],
    );
});
