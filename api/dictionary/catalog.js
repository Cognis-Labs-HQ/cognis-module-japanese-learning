import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gunzip } from "node:zlib";
import { promisify } from "node:util";
import path from "node:path";

const decompress = promisify(gunzip);

export function createReferenceCatalog(directory, language, log) {
    const pending = new Map();
    return async (label) => {
        const key = label
            .normalize(language === "ja" ? "NFKC" : "NFC")
            .toLowerCase();
        const shard = createHash("sha256")
            .update(key)
            .digest("hex")
            .slice(0, 2);
        let operation = pending.get(shard);
        if (!operation) {
            operation = readFile(path.join(directory, `${shard}.json.gz`))
                .then((data) =>
                    decompress(data, { maxOutputLength: 4_000_000 }),
                )
                .then((data) => JSON.parse(data.toString("utf8")))
                .catch((error) => {
                    pending.delete(shard);
                    log?.("error", "reference_catalog_read_failed", {
                        component: `study-language-${language}`,
                        operation: "readReferenceCatalog",
                        shard,
                        errorName:
                            error instanceof Error ? error.name : "Error",
                    });
                    throw error;
                });
            pending.set(shard, operation);
        }
        const records = await operation;
        return Object.hasOwn(records, key) ? records[key] : [];
    };
}
