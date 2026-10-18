import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

/** Load verified, purpose-grouped recording inventories from a packaged manifest. */
export async function readAudioInventory(root) {
    const manifest = JSON.parse(
        await readFile(path.join(root, "recordings.json"), "utf8"),
    );
    if (
        manifest.inventoryVersion !== 1 ||
        !Array.isArray(manifest.inventories) ||
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
        recordings: [],
        compositions: [],
        sentences: [],
    };
    const files = new Set();
    for (const shard of manifest.inventories) {
        if (
            !/^inventories\/(characters|vocabulary|transformations|sentences|sentence-fallbacks)-\d{3}\.json$/.test(
                shard.path,
            ) ||
            files.has(shard.path) ||
            !["recordings", "compositions", "sentences"].includes(shard.kind)
        )
            throw new Error("invalid_audio_inventory");
        files.add(shard.path);
        const bytes = await readFile(path.join(root, shard.path));
        if (createHash("sha256").update(bytes).digest("hex") !== shard.sha256)
            throw new Error("audio_inventory_integrity_failed");
        const records = JSON.parse(bytes.toString("utf8"));
        if (!Array.isArray(records) || records.length !== shard.count)
            throw new Error("invalid_audio_inventory");
        inventory[shard.kind].push(...records);
    }
    for (const kind of ["recordings", "compositions", "sentences"])
        if (inventory[kind].length !== manifest.counts[kind])
            throw new Error("invalid_audio_inventory");
    return inventory;
}
