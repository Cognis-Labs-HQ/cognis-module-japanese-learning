import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { createReferenceCatalog } from "../dictionary/catalog.js";

for (const [normalization, label, key] of [
    ["NFC", "E\u0301", "é"],
    ["NFC", "Ａ", "ａ"],
    ["NFKC", "Ａ", "a"],
    ["NFKC", "ｶﾞ", "ガ"],
]) {
    test(`reference catalog uses caller-selected ${normalization} normalization for ${label}`, async () => {
        const directory = await mkdtemp("/tmp/study-normalization-");
        try {
            const shard = createHash("sha256")
                .update(key)
                .digest("hex")
                .slice(0, 2);
            const records = [{ label: "source record" }];
            await writeFile(
                `${directory}/${shard}.json.gz`,
                gzipSync(JSON.stringify({ [key]: records })),
            );
            const lookup = createReferenceCatalog(directory, {
                normalization,
                component: "test-reference",
            });
            assert.deepEqual(await lookup(label), records);
        } finally {
            await rm(directory, { recursive: true, force: true });
        }
    });
}
