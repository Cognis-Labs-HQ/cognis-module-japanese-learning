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
    for (const shard of [
        ...inventory.inventoryIndexes,
        ...inventory.inventories,
    ]) {
        assert.ok(
            (await readFile(path.join("data/audio", shard.path), "utf8")).split(
                "\n",
            ).length <= (shard.path.startsWith("indexes/") ? 400 : 800),
        );
    }
});

test("recording inventory verifies both index levels and rejects corruption, duplicates and traversal", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "study-inventory-"));
    try {
        await mkdir(path.join(root, "inventories"));
        await mkdir(path.join(root, "indexes"));
        const digest = (value) =>
            createHash("sha256").update(value).digest("hex");
        const bytes = JSON.stringify([{ label: "test" }]);
        const shard = {
            path: "inventories/characters-001.json",
            order: 0,
            kind: "recordings",
            count: 1,
            sha256: digest(bytes),
        };
        await writeFile(path.join(root, shard.path), bytes);
        const save = async ({
            shards = [shard],
            indexChange = {},
            manifestChange = {},
            duplicateIndex = false,
        } = {}) => {
            const indexBytes = JSON.stringify(shards);
            await writeFile(
                path.join(root, "indexes/characters-001.json"),
                indexBytes,
            );
            const descriptor = {
                path: "indexes/characters-001.json",
                count: shards.length,
                sha256: digest(indexBytes),
                ...indexChange,
            };
            await writeFile(
                path.join(root, "recordings.json"),
                JSON.stringify({
                    inventoryVersion: 2,
                    counts: { recordings: 1, compositions: 0, sentences: 0 },
                    inventoryIndexes: duplicateIndex
                        ? [descriptor, descriptor]
                        : [descriptor],
                    ...manifestChange,
                }),
            );
        };
        await save();
        const result = await readAudioInventory(root);
        assert.equal(result.recordings[0].label, "test");
        assert.deepEqual(result.inventories, [shard]);
        const secondBytes = JSON.stringify([{ label: "second" }]);
        const second = {
            ...shard,
            path: "inventories/characters-002.json",
            order: 1,
            sha256: digest(secondBytes),
        };
        await writeFile(path.join(root, second.path), secondBytes);
        await save({
            shards: [second, shard],
            manifestChange: {
                counts: { recordings: 2, compositions: 0, sentences: 0 },
            },
        });
        assert.deepEqual(
            (await readAudioInventory(root)).recordings.map(
                ({ label }) => label,
            ),
            ["test", "second"],
        );
        await save({
            shards: [{ ...second, order: 0 }, shard],
            manifestChange: {
                counts: { recordings: 2, compositions: 0, sentences: 0 },
            },
        });
        await assert.rejects(
            readAudioInventory(root),
            /invalid_audio_inventory/,
        );

        for (const change of [
            { path: "../outside.json" },
            { path: "inventories/vocabulary-001.json" },
            { kind: "sentences" },
            { order: -1 },
            { order: 1 },
            { count: 2 },
            { sha256: "bad" },
        ]) {
            await save({ shards: [{ ...shard, ...change }] });
            await assert.rejects(readAudioInventory(root), /audio_inventory/);
        }
        for (const indexChange of [
            { path: "../outside.json" },
            { count: 2 },
            { sha256: "bad" },
        ]) {
            await save({ indexChange });
            await assert.rejects(readAudioInventory(root), /audio_inventory/);
        }
        for (const options of [
            { shards: [shard, shard] },
            { duplicateIndex: true },
            {
                manifestChange: {
                    counts: { recordings: 2, compositions: 0, sentences: 0 },
                },
            },
            {
                manifestChange: {
                    counts: { recordings: -1, compositions: 0, sentences: 0 },
                },
            },
            { manifestChange: { inventoryVersion: 3 } },
        ]) {
            await save(options);
            await assert.rejects(
                readAudioInventory(root),
                /invalid_audio_inventory/,
            );
        }
        await save();
        await writeFile(path.join(root, "indexes/characters-001.json"), "[]");
        await assert.rejects(
            readAudioInventory(root),
            /audio_inventory_integrity_failed/,
        );
        await save();
        await writeFile(path.join(root, shard.path), "[]");
        await assert.rejects(
            readAudioInventory(root),
            /audio_inventory_integrity_failed/,
        );
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});
