import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const LIBRARY_ROOT = path.resolve(import.meta.dirname, "..", "data", "library");
const schema = JSON.parse(readFileSync(path.join(LIBRARY_ROOT, "schema.json")));
const records = readdirSync(path.join(LIBRARY_ROOT, "content"), {
    withFileTypes: true,
})
    .filter((entry) => entry.isDirectory())
    .flatMap((directory) =>
        readdirSync(path.join(LIBRARY_ROOT, "content", directory.name))
            .filter((name) => name.endsWith(".json"))
            .flatMap((name) =>
                JSON.parse(
                    readFileSync(
                        path.join(
                            LIBRARY_ROOT,
                            "content",
                            directory.name,
                            name,
                        ),
                    ),
                ).map((record) => ({ ...record, layer: directory.name })),
            ),
    );

test("semantic cards require definitions while structural readings inherit them", () => {
    for (const layerId of ["particles", "sentences"]) {
        const layer = schema.layers.find(({ id }) => id === layerId);
        assert.equal(layer.displayDefinition, true);
        const relationship = layer.relationships.find(
            ({ targetLayer }) => targetLayer === "definitions",
        );
        assert.ok(relationship?.minimum >= 1);
        for (const record of records.filter(
            ({ layer: id }) => id === layerId,
        )) {
            assert.ok(
                record.references.some(
                    ({ relation }) => relation === relationship.id,
                ),
                `${record.id} requires display definition content`,
            );
        }
    }
});
