import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const provenance = JSON.parse(
    await readFile("data/library/proficiency.json", "utf8"),
);
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const fieldFor = (id) =>
    schema.layers
        .find((layer) => layer.id === id)
        .fields.find((field) => field.id === "jlpt_level");

test("Vocabulary and Kanji levels match exact source evidence and preserve unknown classifications", () => {
    for (const id of ["words", "alt-characters"]) {
        for (const entry of layers.get(id).filter(({ hidden }) => !hidden)) {
            const evidence = provenance[id][entry.id];
            assert.equal(evidence.label, entry.label);
            assert.equal(
                entry.fields.jlpt_level ?? null,
                evidence.level,
                entry.id,
            );
            assert.ok(
                !entry.tags?.some((tag) => /^jlpt-/iu.test(tag)),
                entry.id,
            );
        }
    }
    const long = layers
        .get("words")
        .find(({ label, hidden }) => label === "長い" && !hidden);
    assert.equal(long.fields.jlpt_level, "N5");
    assert.ok(
        Object.values(provenance.words).some(({ level }) => level === null),
    );
});

test("level filters are compact, optional and available to Kanji and Sentences", () => {
    for (const id of ["words", "alt-characters", "sentences"]) {
        const field = fieldFor(id);
        assert.equal(field.detail.autoSelectSingle, false);
        assert.equal(field.detail.required, false);
        assert.equal(field.detail.filterable, true);
        assert.deepEqual(
            field.input.options.map(({ value }) => value),
            ["N5", "N4", "N3", "N2", "N1"],
        );
        assert.ok(
            schema.layers
                .find((layer) => layer.id === id)
                .detail.tags.every(({ filterable }) => !filterable),
        );
    }
});

test("sentence level derives from every word, particle and generated grammar requirement", () => {
    const derivation = fieldFor("sentences").derivation;
    assert.deepEqual(derivation.relationships, ["words", "particles"]);
    assert.equal(derivation.requireAll, true);
    assert.deepEqual(derivation.values, ["N5", "N4", "N3", "N2", "N1"]);
    for (const set of schema.transformSets) {
        for (const rule of set.rules) {
            assert.ok(
                derivation.values.includes(
                    derivation.transformationValues[rule.id],
                ),
                `${set.id}/${rule.id}`,
            );
        }
    }
    assert.equal(derivation.transformationValues.potential, "N4");
    assert.equal(derivation.transformationValues.causative, "N3");
    assert.equal(derivation.transformationValues.polite, "N5");
    for (const particle of layers.get("particles"))
        assert.equal(particle.fields.jlpt_level, "N5");
});

test("technical transformation and form tags never become learner pills", () => {
    for (const layer of schema.layers) {
        for (const tag of layer.detail.tags) {
            assert.doesNotMatch(
                tag.value,
                /^(?:transform:|length-form-|jlpt-)/u,
            );
            assert.deepEqual(Object.keys(tag.metadata.labels).sort(), [
                "de",
                "en",
                "id",
                "ja",
            ]);
        }
    }
});
