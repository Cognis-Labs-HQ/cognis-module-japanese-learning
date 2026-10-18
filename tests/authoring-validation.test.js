import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const index = await load("authoring/index.json");
const manifest = await load("manifest.json");
const catalog = await load("data/library/assets/images/catalog.json");
const schema = await load("data/library/schema.json");
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const records = new Map(
    [...layers.values()].flat().map((record) => [record.id, record]),
);

test("reviewed replacements bind final JPEGs and retained sources to exact hashes", async () => {
    const replacements = await load(index.replacementReview);
    assert.equal(replacements.length, index.replacementCount);
    assert.equal(catalog.images.length, index.currentCatalogCount);
    for (const review of replacements) {
        const current = catalog.images.find(
            (image) => image.sha256 === review.newSha256,
        );
        assert.ok(current, review.path);
        assert.equal(review.finalVisualReview, "pass");
        assert.ok(review.observation.length > 40);
        assert.ok(review.scopeQualification);
        assert.deepEqual(current.entryIds, review.entryIds);
        assert.equal(
            digest(await readFile("data/library/assets/" + current.path)),
            review.newSha256,
        );
        assert.equal(
            digest(await readFile(review.sourcePath)),
            review.sourceSha256,
        );
        assert.equal(current.sourceSha256, review.sourceSha256);
        assert.deepEqual(current.crop, [0, 0, ...review.dimensions]);
        assert.equal(
            digest(
                await readFile(
                    "authoring/rejected-sources/" + review.oldSha256 + ".jpg",
                ),
            ),
            review.oldSha256,
        );
    }
});

test("authoring specifications stay outside the runtime inventory and import graph", async () => {
    assert.ok(
        manifest.files.every(({ path }) => !path.startsWith("authoring/")),
    );
    const stage = await load(index.stagedTravel);
    assert.equal(stage.publishable, false);
    assert.equal(stage.status, "staged-not-importable");
    assert.equal(stage.vocabularyFiles.length, 12);
    assert.equal(stage.examplesFiles.length, 8);
    const planned = new Map();
    for (const file of [...stage.vocabularyFiles, ...stage.examplesFiles]) {
        const record = await load(file);
        assert.ok(file.startsWith("authoring/staged/"));
        assert.equal(records.has(record.id), false, record.id);
        assert.equal(record.media, null);
        assert.equal(planned.has(record.id), false);
        planned.set(record.id, record);
        assert.deepEqual(Object.keys(record.meanings).sort(), [
            "de",
            "en",
            "id",
            "ja",
        ]);
    }
    for (const file of stage.vocabularyFiles) {
        const word = await load(file);
        for (const form of [word, ...word.forms]) {
            const atoms = form.atomicReadingPlan ?? form.atomicSpellingPlan;
            const expected = form.atomicReadingPlan ? form.reading : form.label;
            assert.equal(
                atoms.map(({ character }) => character).join(""),
                expected,
            );
            for (const atom of atoms) {
                assert.equal(records.get(atom.entryId)?.label, atom.character);
            }
        }
    }
    for (const file of stage.examplesFiles) {
        const sentence = await load(file);
        const parts = sentence.orderedComposition;
        assert.deepEqual(
            parts.map(({ position }) => position),
            parts.map((_, i) => i),
        );
        for (const part of parts) {
            assert.ok(records.has(part.entryId) || planned.has(part.entryId));
        }
        const text = parts
            .map(({ surface }) => surface)
            .join(schema.language === "ja" ? "" : " ")
            .replaceAll(" .", ".");
        assert.equal(text, sentence.label);
        if (schema.language === "ja") {
            assert.equal(
                parts.map(({ reading }) => reading).join(""),
                sentence.reading,
            );
        }
    }
});

test("initial visual review and contextual disposition cover every inventoried target", async () => {
    const initial = await load(index.initialVisualReview);
    const initialRecords = (
        await Promise.all(initial.assetFiles.map(load))
    ).flat();
    assert.equal(initialRecords.length, catalog.images.length);
    assert.equal(
        new Set(initialRecords.map(({ assetId }) => assetId)).size,
        initialRecords.length,
    );
    const context = await load(index.contextDisposition);
    const decisions = (await Promise.all(context.recordFiles.map(load))).flat();
    assert.equal(
        decisions.length,
        initialRecords.filter(({ status }) => status === "context-required")
            .length,
    );
    for (const decision of decisions) {
        assert.ok(decision.rationale);
        for (const example of decision.existingExamples) {
            assert.equal(records.get(example.entryId)?.label, example.label);
        }
        if (decision.decision === "retain-with-existing-example") {
            assert.ok(decision.existingExamples.length);
        }
    }
});
