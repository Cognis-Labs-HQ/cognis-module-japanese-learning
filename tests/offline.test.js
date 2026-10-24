import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(
    readFileSync(new URL("../data/library/schema.json", import.meta.url)),
);
const pack = JSON.parse(
    readFileSync(new URL("../data/library/manifest.json", import.meta.url)),
);

test("packaged schemas opt into host-owned lightweight offline reads", () => {
    assert.deepEqual(schema.metadata.offline, { cache: "lightweight" });
    assert.equal(typeof pack.contentRevision, "string");
    const writingLayers = schema.layers.filter((layer) =>
        layer.fields.some((field) => field.type === "strokePattern"),
    );
    assert.ok(writingLayers.length > 0);
});

test("bundled writing records fit a lightweight snapshot and retain usable drawing guides", async () => {
    const writingLayers = schema.layers.filter((layer) =>
        layer.fields.some((field) => field.type === "strokePattern"),
    );
    const content = await readContentLayers(
        fileURLToPath(new URL("../data/library/content", import.meta.url)),
        writingLayers.map((layer) => layer.id),
    );
    const records = [...content.values()].flat();
    assert.ok(records.length > 0);
    assert.ok(JSON.stringify(records).length * 2 < 4_000_000);
    for (const layer of writingLayers) {
        const field = layer.fields.find(
            (field) => field.type === "strokePattern",
        );
        for (const record of content.get(layer.id))
            assert.ok(record.fields[field.id]?.strokes?.length > 0, record.id);
    }
});
