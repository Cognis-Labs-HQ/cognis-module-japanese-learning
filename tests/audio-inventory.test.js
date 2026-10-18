import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, mkdir, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { readAudioInventory } from "../api/audio/inventory.js";

test("packaged recording manifest verifies every purpose-grouped inventory", async () => {
    const inventory = await readAudioInventory("data/audio");
    assert.ok(inventory.recordings.length > 400);
    assert.ok(inventory.sentences.length > 30);
    assert.ok(
        (await readFile("data/audio/recordings.json", "utf8")).split("\n")
            .length < 400,
    );
    for (const shard of inventory.inventories) {
        assert.ok(
            (await readFile(path.join("data/audio", shard.path), "utf8")).split(
                "\n",
            ).length <= 800,
        );
    }
});

test("recording inventory rejects corrupt bytes, counts, duplicate files and traversal", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "study-inventory-"));
    try {
        await mkdir(path.join(root, "inventories"));
        const bytes = JSON.stringify([{ label: "test" }]);
        const shard = {
            path: "inventories/characters-001.json",
            kind: "recordings",
            count: 1,
            sha256: createHash("sha256").update(bytes).digest("hex"),
        };
        await writeFile(path.join(root, shard.path), bytes);
        const base = {
            inventoryVersion: 1,
            counts: { recordings: 1, compositions: 0, sentences: 0 },
            inventories: [shard],
        };
        const save = (value) =>
            writeFile(
                path.join(root, "recordings.json"),
                JSON.stringify(value),
            );
        await save(base);
        assert.equal(
            (await readAudioInventory(root)).recordings[0].label,
            "test",
        );
        for (const change of [
            { path: "../outside.json" },
            { kind: "other" },
            { count: 2 },
            { sha256: "bad" },
        ]) {
            await save({ ...base, inventories: [{ ...shard, ...change }] });
            await assert.rejects(readAudioInventory(root), /audio_inventory/);
        }
        await save({ ...base, inventories: [shard, shard] });
        await assert.rejects(
            readAudioInventory(root),
            /invalid_audio_inventory/,
        );
        await save({ ...base, counts: { ...base.counts, recordings: 2 } });
        await assert.rejects(
            readAudioInventory(root),
            /invalid_audio_inventory/,
        );
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});
