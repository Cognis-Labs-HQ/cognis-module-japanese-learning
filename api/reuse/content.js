import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Read JSON content shards once per requested layer in deterministic filename order.
 * @example const layers = await readContentLayers(contentRoot, ["characters"]);
 * @param {string} contentRoot Directory containing layer directories.
 * @param {Iterable<string>} layers Layer identifiers to read.
 * @returns {Promise<Map<string, Array<object>>>} Records grouped by layer.
 */
export async function readContentLayers(contentRoot, layers) {
    const content = new Map();
    for (const layer of layers) {
        const records = [];
        const directory = path.join(contentRoot, layer);
        for (const name of (await readdir(directory)).sort()) {
            if (!name.endsWith(".json")) continue;
            const shard = JSON.parse(
                await readFile(path.join(directory, name), "utf8"),
            );
            if (!Array.isArray(shard)) throw new Error("invalid_content_shard");
            records.push(...shard);
        }
        content.set(layer, records);
    }
    return content;
}
