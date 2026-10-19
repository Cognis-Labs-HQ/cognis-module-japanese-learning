import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const purposes = {
    characters: "recordings",
    vocabulary: "recordings",
    transformations: "recordings",
    sentences: "sentences",
    "sentence-compositions": "compositions",
};

async function readVerified(root, descriptor) {
    const bytes = await readFile(path.join(root, descriptor.path));
    if (createHash("sha256").update(bytes).digest("hex") !== descriptor.sha256)
        throw new Error("audio_inventory_integrity_failed");
    const rows = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(rows) || rows.length !== descriptor.count)
        throw new Error("invalid_audio_inventory");
    return rows;
}

/** Verify purpose indexes and their recording shards before exposing any audio. */
export async function readAudioInventory(root) {
    const manifest = JSON.parse(
        await readFile(path.join(root, "recordings.json"), "utf8"),
    );
    if (
        manifest.inventoryVersion !== 2 ||
        !Array.isArray(manifest.inventoryIndexes) ||
        !manifest.counts ||
        !["recordings", "compositions", "sentences"].every(
            (kind) =>
                Number.isSafeInteger(manifest.counts[kind]) &&
                manifest.counts[kind] >= 0,
        )
    )
        throw new Error("invalid_audio_inventory");
    const inventory = {
        ...manifest,
        inventories: [],
        recordings: [],
        compositions: [],
        sentences: [],
    };
    const files = new Set();
    for (const index of manifest.inventoryIndexes) {
        const match =
            /^indexes\/(characters|vocabulary|transformations|sentences|sentence-compositions)-\d{3}\.json$/.exec(
                index.path,
            );
        if (!match || files.has(index.path))
            throw new Error("invalid_audio_inventory");
        files.add(index.path);
        const purpose = match[1];
        const shards = await readVerified(root, index);
        for (const shard of shards) {
            if (
                !new RegExp(`^inventories/${purpose}-\\d{3}\\.json$`).test(
                    shard.path,
                ) ||
                files.has(shard.path) ||
                shard.kind !== purposes[purpose]
            )
                throw new Error("invalid_audio_inventory");
            files.add(shard.path);
            inventory.inventories.push(shard);
        }
    }
    inventory.inventories.sort((left, right) => left.order - right.order);
    for (const [order, shard] of inventory.inventories.entries()) {
        if (shard.order !== order) throw new Error("invalid_audio_inventory");
        const records = await readVerified(root, shard);
        inventory[shard.kind].push(...records);
    }
    for (const kind of ["recordings", "compositions", "sentences"])
        if (inventory[kind].length !== manifest.counts[kind])
            throw new Error("invalid_audio_inventory");
    return inventory;
}
