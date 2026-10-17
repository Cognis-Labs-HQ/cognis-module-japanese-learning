import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const content = await readContentLayers("data/library/content", ["words"]);
const records = content.get("words");
const entries = new Map(records.map((record) => [record.id, record]));
const catalog = JSON.parse(
    await readFile("data/library/assets/images/catalog.json", "utf8"),
);
const attribution = await readFile(
    "data/library/assets/images/LICENSE.md",
    "utf8",
);

test("reference images are declared on every layer and the original dog photograph retains its credit", async () => {
    for (const layer of schema.layers) {
        const field = layer.fields.find(({ id }) => id === "reference_images");
        assert.equal(field.type, "imageList");
        assert.equal(field.input.control, "imageFiles");
        for (const locale of ["en", "de", "id", "ja"])
            assert.ok(field.metadata.labels[locale]);
    }
    const card = records.find(
        ({ label }) => label === (schema.language === "ja" ? "犬" : "dog"),
    );
    assert.deepEqual(card.fields.reference_images, ["images/dog.jpg"]);
    assert.match(attribution, /CC BY-SA 3.0/);
    assert.match(attribution, /Djmirko/);
});

test("every curated concrete noun has a reference photograph, including distinct Japanese homophones", () => {
    const abstract = new Set(
        schema.language === "ja"
            ? ["日本語", "私"]
            : ["name", "English", "language", "question", "answer", "country"],
    );
    for (const card of records.filter(
        (record) =>
            !record.hidden &&
            record.class === "lexical:noun" &&
            !abstract.has(record.label),
    )) {
        assert.ok(card.fields.reference_images?.length, card.label);
    }
    if (schema.language === "ja") {
        for (const group of [
            ["hana-flower", "hana-nose"],
            ["hashi-bridge", "hashi-chopsticks"],
            ["ame-rain", "ame-candy"],
            ["kami-paper", "kami-hair", "kami-deity"],
        ]) {
            const photos = group.map(
                (id) => entries.get(`ja:word:${id}`).fields.reference_images[0],
            );
            assert.equal(new Set(photos).size, group.length);
        }
    }
});

test("bundled photographs have verified JPEG bytes, explicit open licenses and complete card-to-credit assignments", async () => {
    const byPath = new Map(catalog.images.map((photo) => [photo.path, photo]));
    assert.equal(byPath.size, catalog.images.length);
    for (const photo of catalog.images) {
        assert.match(photo.path, /^images\/[a-z-]+\.jpg$/);
        assert.ok(photo.creator && photo.title && photo.modifications);
        assert.match(
            photo.sourceUrl,
            /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/,
        );
        assert.match(
            photo.license,
            /^(CC BY(-SA)? (2\.0|2\.5|3\.0|4\.0)|CC0|Public domain)$/,
        );
        assert.match(photo.licenseUrl, /^https:\/\/creativecommons\.org\//);
        assert.ok(attribution.includes(photo.sourceUrl));
        assert.ok(attribution.includes(photo.creator.replaceAll("|", "\\|")));
        assert.ok(attribution.includes(photo.licenseUrl));
        const bytes = await readFile(`data/library/assets/${photo.path}`);
        assert.equal(
            bytes.subarray(0, 3).toString("hex"),
            "ffd8ff",
            photo.path,
        );
        assert.ok(bytes.length > 256 && bytes.length <= 1500000, photo.path);
        assert.equal(
            createHash("sha256").update(bytes).digest("hex"),
            photo.sha256,
            photo.path,
        );
        assert.ok(photo.width > 0 && photo.height > 0);
        assert.ok(photo.entryIds.length);
        for (const id of photo.entryIds) {
            const card = entries.get(id);
            assert.ok(card && !card.hidden, id);
            assert.ok(card.fields.reference_images.includes(photo.path), id);
        }
    }
    for (const card of records) {
        for (const path of card.fields?.reference_images ?? []) {
            assert.ok(
                byPath.get(path)?.entryIds.includes(card.id),
                `${card.id}: ${path}`,
            );
        }
    }
});
