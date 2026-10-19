import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const schema = await load("data/library/schema.json");
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const records = new Map(
    [...layers.values()].flat().map((record) => [record.id, record]),
);
const stage = await load("authoring/staged/travel/index.json");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

function selected(record, transformation) {
    let label = record.label;
    let reading = record.fields.pronunciation?.[0] ?? label;
    if (!transformation) return { label, reading };
    const set = schema.transformSets.find(
        ({ id }) => id === transformation.setId,
    );
    assert.ok(set.matchTags.every((tag) => record.tags.includes(tag)));
    let state = set.baseState;
    for (const id of transformation.path) {
        const rule = set.rules.find(
            (item) => item.id === id && item.fromState === state,
        );
        assert.ok(label.endsWith(rule.removeSuffix));
        assert.ok(reading.endsWith(rule.pronunciation.removeSuffix));
        label =
            label.slice(0, label.length - rule.removeSuffix.length) +
            rule.append;
        reading =
            reading.slice(
                0,
                reading.length - rule.pronunciation.removeSuffix.length,
            ) + rule.pronunciation.append;
        state = rule.toState;
    }
    return { label, reading };
}

test("travel forms reproduce reviewed spellings and readings without duplicate visible vocabulary", async () => {
    for (const path of stage.vocabularyFiles) {
        const source = await load(path);
        const record = records.get(source.id);
        assert.equal(record.label, source.label);
        assert.equal(record.fields.pronunciation[0], source.reading);
        assert.equal(
            layers
                .get("words")
                .filter((word) => !word.hidden && word.label === record.label)
                .length,
            1,
        );
        const definition = records.get(
            record.references.find(({ relation }) => relation === "definitions")
                .entryId,
        );
        assert.deepEqual(definition.fields.translations, source.meanings);
        for (const form of source.forms) {
            const transformed = selected(record, {
                setId: `travel-${source.concept}-forms`,
                path: [form.form],
            });
            assert.equal(transformed.label, form.label);
            assert.equal(transformed.reading, form.reading);
        }
    }
});

test("travel sentence constituents reconstruct every displayed form and Japanese reading", async () => {
    for (const path of stage.examplesFiles) {
        const source = await load(path);
        const sentence = records.get(source.id);
        const parts = sentence.references
            .filter(({ position }) => Number.isInteger(position))
            .sort((left, right) => left.position - right.position)
            .map((ref) =>
                selected(records.get(ref.entryId), ref.transformation),
            );
        assert.equal(
            parts
                .map(({ label }) => label)
                .join(schema.language === "ja" ? "" : " ")
                .replaceAll(" .", "."),
            sentence.label,
        );
        if (schema.language === "ja")
            assert.equal(
                parts.map(({ reading }) => reading).join(""),
                sentence.fields.pronunciation[0],
            );
        assert.equal(sentence.fields.audio, undefined);
    }
});

test("all twelve travel illustrations bind actual visual review to published bytes and retained sources", async () => {
    const reviews = await load("authoring/reviews/travel/images.json");
    assert.equal(reviews.length, 12);
    for (const review of reviews) {
        assert.equal(review.visualReview, "pass");
        assert.ok(review.observation.length > 40);
        assert.equal(
            records.get(review.entryId).fields.reference_images[0],
            review.path,
        );
        assert.equal(
            digest(await readFile(`data/library/assets/${review.path}`)),
            review.sha256,
        );
        assert.equal(
            digest(await readFile(review.sourcePath)),
            review.sourceSha256,
        );
    }
});
