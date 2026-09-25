import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { sampleSvgPath } from "../api/svg-path-sampler.js";

test("samples compact relative KanjiVG cubic paths without packages", () => {
    const points = sampleSvgPath(
        "M36.05,19.5c0.07,0.61-0.17,1.57-0.63,2.21C30,29.25,23.75,36.25,11.25,45.29",
    );
    assert.ok(points.length >= 4);
    assert.deepEqual(points[0], { x: 36.05, y: 19.5 });
    assert.ok(Math.abs(points.at(-1).x - 11.25) < 0.001);
    assert.ok(Math.abs(points.at(-1).y - 45.29) < 0.001);
    assert.ok(
        points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)),
    );
});

test("samples line, quadratic, smooth, and arc endpoints", () => {
    const points = sampleSvgPath(
        "M1 1 L4 1 q2 0 2 2 s2 2 3 0 A2 2 0 0 1 12 6 z",
    );
    assert.ok(points.length >= 4);
    assert.deepEqual(points[0], { x: 1, y: 1 });
    assert.deepEqual(points.at(-1), { x: 1, y: 1 });
});

test("runtime provider has no production package dependency", async () => {
    const packageMetadata = JSON.parse(
        await readFile(new URL("../package.json", import.meta.url), "utf8"),
    );
    assert.equal(packageMetadata.dependencies, undefined);
});
