import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";
import { readContentLayers } from "../api/reuse/content.js";

const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const content = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const inventory = await readAudioInventory("data/audio");

function verify(source, recordings) {
    for (const flag of source.tags?.filter((tag) =>
        tag.startsWith("transform:"),
    ) ?? []) {
        const families = schema.transformSets.filter(
            (set) =>
                set.flag === flag &&
                set.matchTags.every((tag) => source.tags.includes(tag)),
        );
        assert.ok(families.length, `${source.id}: unhandled ${flag}`);
        for (const family of families) {
            const bindings = recordings.flatMap((clip) =>
                (clip.variants ?? [])
                    .filter(
                        (binding) =>
                            binding.entryId === source.id &&
                            binding.setId === family.id,
                    )
                    .map((binding) => ({ clip, binding })),
            );
            for (const rule of family.rules)
                assert.ok(
                    bindings.some(
                        ({ binding }) => binding.path.at(-1) === rule.id,
                    ),
                    `${source.id}/${family.id}/${rule.id}: missing generated recording`,
                );
            for (const { clip, binding } of bindings) {
                let state = family.baseState;
                for (const id of binding.path) {
                    const rule = family.rules.find(
                        (rule) => rule.id === id && rule.fromState === state,
                    );
                    assert.ok(rule, `${source.id}: invalid variant path`);
                    state = rule.toState;
                }
                assert.equal(state, binding.state);
                assert.ok(
                    binding.label && binding.reading,
                    `${source.id}: missing media identity`,
                );
                assert.ok(
                    clip.inputs.some(
                        (input) =>
                            input.label === binding.label &&
                            input.readings[0] === binding.reading,
                    ),
                    `${source.id}: stale audio binding`,
                );
            }
        }
    }
}

test("every enabled transform flag requires complete path-bound packaged recordings", () => {
    for (const source of [...content.values()].flat())
        verify(source, inventory.recordings);
});

test("adding a flagged source or removing its required media fails coverage", () => {
    const source = [...content.values()]
        .flat()
        .find((entry) =>
            entry.tags?.some((tag) => tag.startsWith("transform:")),
        );
    assert.ok(source);
    assert.throws(
        () => verify({ ...source, id: "new-source" }, inventory.recordings),
        /missing generated recording/,
    );
    assert.throws(() => verify(source, []), /missing generated recording/);
});

test("every recording variant targets a flagged base and a declared family", () => {
    const sources = new Map(
        [...content.values()].flat().map((source) => [source.id, source]),
    );
    for (const clip of inventory.recordings)
        for (const binding of clip.variants ?? []) {
            const source = sources.get(binding.entryId);
            assert.ok(
                source,
                `${binding.entryId}: unresolved recording source`,
            );
            const family = schema.transformSets.find(
                (set) => set.id === binding.setId,
            );
            assert.ok(
                family && source.tags?.includes(family.flag),
                `${binding.entryId}: inactive recording family`,
            );
            assert.ok(binding.path.length > 0);
            for (const id of binding.path)
                assert.ok(family.rules.some((rule) => rule.id === id));
        }
});
