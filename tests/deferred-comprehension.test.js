import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { readAudioInventory } from "../api/audio/inventory.js";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));

test("host-blocked selected-form sentence drafts retain exact audio outside runtime", async () => {
    const audit = read("authoring/reviews/comprehension-deferred.json");
    const inventory = await readAudioInventory("data/audio");
    const published = read(
        "data/library/content/sentences/comprehension-001.json",
    );
    const decks = read("data/starter-decks.json");
    assert.equal(audit.status, "blocked-host-import-excluded-from-runtime");
    assert.equal(audit.sentences.length, 2);
    for (const sentence of audit.sentences) {
        assert.ok(!published.some(({ id }) => id === sentence.id));
        assert.ok(
            !decks.some(({ sourceRecordIds }) =>
                sourceRecordIds.includes(sentence.id),
            ),
        );
        assert.ok(
            !inventory.compositions.some(
                ({ entryId }) => entryId === sentence.id,
            ),
        );
        const composition = audit.compositions.find(
            ({ entryId }) => entryId === sentence.id,
        );
        assert.equal(
            existsSync("data/library/assets/" + composition.path),
            false,
        );
        const bytes = readFileSync(
            audit.audioDirectory + "/" + composition.path.split("/").at(-1),
        );
        assert.equal(
            createHash("sha256").update(bytes).digest("hex"),
            composition.sha256,
        );
        for (const segment of composition.segments) {
            const source = readFileSync(
                "data/library/assets/" + segment.path,
            ).subarray(44);
            assert.deepEqual(
                bytes.subarray(
                    44 + segment.startFrame * 2,
                    44 + (segment.startFrame + segment.frameCount) * 2,
                ),
                source,
            );
            if (!segment.transformation) continue;
            assert.ok(
                inventory.recordings.some(
                    (clip) =>
                        clip.path === segment.path &&
                        clip.variants.some(
                            (variant) =>
                                variant.entryId === segment.entryId &&
                                variant.setId ===
                                    segment.transformation.setId &&
                                JSON.stringify(variant.path) ===
                                    JSON.stringify(segment.transformation.path),
                        ),
                ),
            );
        }
    }
});
