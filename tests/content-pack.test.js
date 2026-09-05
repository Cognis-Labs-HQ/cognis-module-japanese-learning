import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");
const PACK_ROOT = path.join(ROOT, "data", "library");
const CONTENT_ID_PATTERN = /^[a-z0-9]+(?:[-_.:][a-z0-9]+)*$/i;

function readJson(filePath) {
    return JSON.parse(readFileSync(filePath, "utf8"));
}

function loadPack() {
    const manifest = readJson(path.join(PACK_ROOT, "manifest.json"));
    const schema = readJson(path.join(PACK_ROOT, manifest.schema));
    const records = [];
    for (const directory of readdirSync(
        path.join(PACK_ROOT, manifest.content),
        {
            withFileTypes: true,
        },
    ).filter((entry) => entry.isDirectory())) {
        for (const fileName of readdirSync(
            path.join(PACK_ROOT, manifest.content, directory.name),
        ).filter((name) => name.endsWith(".json"))) {
            for (const record of readJson(
                path.join(
                    PACK_ROOT,
                    manifest.content,
                    directory.name,
                    fileName,
                ),
            )) {
                records.push({ ...record, layer: directory.name });
            }
        }
    }
    return { manifest, schema, records };
}

test("declares a data-only Japanese Library content pack", () => {
    const { manifest, schema } = loadPack();
    assert.equal(manifest.id, "japanese-core");
    assert.equal(manifest.schema, "schema.json");
    assert.equal(manifest.content, "content");
    assert.match(manifest.id, CONTENT_ID_PATTERN);
    assert.ok(manifest.publisher.trim());
    assert.ok(manifest.version.trim());
    assert.ok(manifest.contentRevision.trim());
    assert.ok(manifest.license.id);
    assert.equal(schema.id, manifest.id);
    assert.equal(schema.language, "ja");
    assert.deepEqual(Intl.getCanonicalLocales(schema.language), ["ja"]);
    assert.deepEqual(
        schema.layers.map(({ id }) => id),
        ["characters", "alt-characters", "definitions", "words", "sentences"],
    );
});

test("content records satisfy schema fields and relationship targets", () => {
    const { schema, records } = loadPack();
    const recordsById = new Map(records.map((record) => [record.id, record]));
    assert.equal(recordsById.size, records.length, "record IDs must be unique");
    const layersById = new Map(schema.layers.map((layer) => [layer.id, layer]));
    for (const record of records) {
        assert.match(
            record.id,
            CONTENT_ID_PATTERN,
            `${record.id} is not a portable content record ID`,
        );
        assert.ok(record.label?.trim(), `${record.id} requires a label`);
        const layer = layersById.get(record.layer);
        assert.ok(layer, `unknown layer ${record.layer}`);
        const fieldsById = new Map(
            (layer.fields ?? []).map((field) => [field.id, field]),
        );
        for (const [fieldId, value] of Object.entries(record.fields ?? {})) {
            const field = fieldsById.get(fieldId);
            assert.ok(field, `${record.id} has unknown field ${fieldId}`);
            assert.equal(typeof value, field.type, `${record.id}.${fieldId}`);
        }
        for (const field of layer.fields ?? []) {
            if (field.required)
                assert.notEqual(record.fields?.[field.id], undefined);
        }
        const relationshipsById = new Map(
            (layer.relationships ?? []).map((relation) => [
                relation.id,
                relation,
            ]),
        );
        for (const reference of record.references ?? []) {
            const relationship = relationshipsById.get(reference.relation);
            assert.ok(relationship, `${record.id} has unknown relationship`);
            assert.equal(
                recordsById.get(reference.entryId)?.layer,
                relationship.targetLayer,
                `${record.id} has an invalid target`,
            );
        }
        for (const relationship of relationshipsById.values()) {
            const count = (record.references ?? []).filter(
                ({ relation }) => relation === relationship.id,
            ).length;
            assert.ok(count >= (relationship.minimum ?? 0));
            if (relationship.maximum !== undefined) {
                assert.ok(count <= relationship.maximum);
            }
        }
    }
});
