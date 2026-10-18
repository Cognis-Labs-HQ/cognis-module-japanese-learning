import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const records = (
    await readContentLayers("data/library/content", ["words"])
).get("words");
const entries = new Map(records.map((record) => [record.id, record]));
const catalog = JSON.parse(
    await readFile("data/library/assets/images/catalog.json", "utf8"),
);
const attribution = await readFile(
    "data/library/assets/images/LICENSE.md",
    "utf8",
);

test("reference illustrations use the existing image-list contract and language-specific art style", () => {
    for (const layer of schema.layers) {
        const field = layer.fields.find(({ id }) => id === "reference_images");
        assert.equal(field.type, "imageList");
        assert.equal(field.input.control, "imageFiles");
        for (const locale of ["en", "de", "id", "ja"])
            assert.ok(field.metadata.labels[locale]);
    }
    assert.equal(catalog.version, 3);
    assert.equal(catalog.source, "OpenAI image generation");
    assert.equal(
        catalog.style,
        schema.language === "ja" ? "anime" : "colored-pencil-watercolor",
    );
    assert.match(attribution, /AI-generated/);
    assert.match(attribution, /AGPL-3.0-or-later/);
});

test("every visible vocabulary card has a distinct illustration, including abstract concepts and Japanese homophones", () => {
    const visible = records.filter((record) => !record.hidden);
    assert.equal(catalog.images.length, visible.length);
    const digests = new Set();
    for (const card of visible) {
        assert.equal(card.fields.reference_images?.length, 1, card.id);
        const image = catalog.images.find(
            (item) => item.path === card.fields.reference_images[0],
        );
        assert.ok(image, card.id);
        assert.deepEqual(image.entryIds, [card.id]);
        assert.equal(digests.has(image.sha256), false, card.id);
        digests.add(image.sha256);
    }
});

test("illustration JPEGs have verified bytes, crop provenance and complete bundled assignments", async () => {
    const byPath = new Map(catalog.images.map((image) => [image.path, image]));
    assert.equal(byPath.size, catalog.images.length);
    const files = (await readdir("data/library/assets/images")).filter((name) =>
        name.endsWith(".jpg"),
    );
    assert.deepEqual(
        files.sort(),
        catalog.images.map((image) => image.path.slice(7)).sort(),
    );
    for (const image of catalog.images) {
        assert.match(image.path, /^images\/[a-f0-9]{64}\.jpg$/);
        assert.equal(image.id, image.sha256);
        assert.equal(image.path, `images/${image.id}.jpg`);
        for (const locale of ["en", "de", "id", "ja"]) {
            assert.ok(
                image.metadata.labels[locale]?.trim(),
                `${image.id}:${locale}`,
            );
        }
        assert.equal(image.sourceSheet, image.sourceSha256);
        assert.match(image.sourceSha256, /^[a-f0-9]{64}$/);
        assert.equal(image.crop.length, 4);
        assert.equal(image.width, image.crop[2]);
        assert.equal(image.height, image.crop[3]);
        assert.ok(image.width >= 250 && image.height >= 250);
        const bytes = await readFile(`data/library/assets/${image.path}`);
        assert.equal(
            bytes.subarray(0, 3).toString("hex"),
            "ffd8ff",
            image.path,
        );
        assert.ok(bytes.length > 256 && bytes.length <= 250000, image.path);
        assert.equal(
            createHash("sha256").update(bytes).digest("hex"),
            image.sha256,
            image.path,
        );
        const card = entries.get(image.entryIds[0]);
        assert.ok(card && !card.hidden, image.entryIds[0]);
        assert.ok(card.fields.reference_images.includes(image.path), card.id);
    }
});

test("illustration labels use the card's authored meanings in all supported locales", async () => {
    const definitions = new Map(
        (await readContentLayers("data/library/content", ["definitions"]))
            .get("definitions")
            .map((record) => [record.id, record]),
    );
    for (const image of catalog.images) {
        const card = entries.get(image.entryIds[0]);
        const meanings = card.references
            .filter(({ relation }) => relation === "definitions")
            .map(({ entryId }) => definitions.get(entryId));
        for (const locale of ["en", "de", "id", "ja"])
            assert.equal(
                image.metadata.labels[locale],
                meanings
                    .map((meaning) => meaning.fields.translations[locale])
                    .join("; "),
            );
    }
});
