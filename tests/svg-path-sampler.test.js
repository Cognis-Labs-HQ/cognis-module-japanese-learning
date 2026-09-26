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

test("preserves the directional turns in the Hiragana e stroke", () => {
    const points = sampleSvgPath(
        "M32.52,45.12c1.88,1.25,4.5,1.75,7.38,0.62c3.29-1.29,17-7.88,21.25-9.88c4.25-2,8.32,0.04,4.38,4.62c-12.26,14.27-27.26,31.52-39.51,44.4c-3.26,3.42-0.58,3.54,1.5,1.37c13.5-14.12,18.12-20.12,23.62-20.12c7.13,0,3.5,16.75,6.75,22.38c3.25,5.63,19.12,3.75,26.12,2.12",
    );

    assert.equal(points.length, 32);
    assert.ok(points.some(({ x, y }) => x < 28 && y > 83));
    assert.ok(points.some(({ x, y }) => x > 45 && y > 65 && y < 70));
    assert.ok(points.some(({ x, y }) => x > 80 && y > 88));
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
