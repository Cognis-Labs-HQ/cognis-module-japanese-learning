import assert from "node:assert/strict";
import test from "node:test";
import { createStrokePatternProvider } from "../strokes/index.js";

for (const label of ["きゃあ", "キャア"]) {
    test(`remote small kana retains packaged proportions for ${label}`, async () => {
        const provider = createStrokePatternProvider({
            contentRoot: "data/library/content",
            fetchImplementation: async () =>
                new Response('<svg><path d="M0 0 L109 109"/></svg>'),
        });
        const [result] = await provider.lookup({
            layer: { id: "characters" },
            label,
        });
        const pattern = result.fields.stroke_pattern;
        assert.deepEqual(pattern.groups, [1, 1, 1]);
        assert.equal(pattern.columns, 3);
        const boundaries = [
            [0, 0.3939],
            [0.3939, 0.6061],
            [0.6061, 1],
        ];
        pattern.strokes.forEach((stroke, index) => {
            assert.equal(stroke.points[0].x, boundaries[index][0]);
            assert.equal(stroke.points.at(-1).x, boundaries[index][1]);
        });
    });
}
