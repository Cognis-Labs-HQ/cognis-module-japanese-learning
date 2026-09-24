import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const LIBRARY_ROOT = path.resolve(import.meta.dirname, "..", "data", "library");

function loadLayer(layer) {
    const directory = path.join(LIBRARY_ROOT, "content", layer);
    return readdirSync(directory)
        .filter((name) => name.endsWith(".json"))
        .flatMap((name) =>
            JSON.parse(readFileSync(path.join(directory, name), "utf8")),
        );
}

function assertStrokePattern(record) {
    const pattern = record.fields.stroke_pattern;
    assert.equal(pattern.coordinateSystem, "normalized", record.id);
    assert.equal(pattern.tolerance, 60, record.id);
    assert.ok(pattern.strokes.length > 0, `${record.id} requires strokes`);
    for (const stroke of pattern.strokes) {
        assert.ok(
            stroke.points.length >= 3,
            `${record.id} stroke is too short`,
        );
        let previousTime = -1;
        for (const point of stroke.points) {
            assert.ok(point.x >= 0 && point.x <= 1, `${record.id} x`);
            assert.ok(point.y >= 0 && point.y <= 1, `${record.id} y`);
            assert.ok(point.time >= previousTime, `${record.id} time order`);
            previousTime = point.time;
        }
    }
}

test("writing cards publish normalized stroke practice patterns", () => {
    const schema = JSON.parse(
        readFileSync(path.join(LIBRARY_ROOT, "schema.json"), "utf8"),
    );
    for (const layerId of ["characters", "alt-characters"]) {
        const layer = schema.layers.find(({ id }) => id === layerId);
        const field = layer.fields.find(({ id }) => id === "stroke_pattern");
        assert.equal(field.type, "strokePattern");
        assert.equal(field.required, true);
        assert.equal(field.detail.renderer, "stroke");
        assert.equal(field.input.immutable, true);
        for (const record of loadLayer(layerId)) assertStrokePattern(record);
    }
});

test("stroke metadata preserves KanjiVG attribution", () => {
    const manifest = JSON.parse(
        readFileSync(path.join(LIBRARY_ROOT, "manifest.json"), "utf8"),
    );
    assert.deepEqual(manifest.metadata.sources, [
        {
            id: "kanjivg",
            url: "https://kanjivg.tagaini.net/",
            license: "CC-BY-SA-3.0",
            attribution: "KanjiVG project contributors",
            derivedFields: [
                "characters.stroke_pattern",
                "alt-characters.stroke_pattern",
            ],
        },
    ]);
});
