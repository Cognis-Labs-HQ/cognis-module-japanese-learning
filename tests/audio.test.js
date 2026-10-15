import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { bootstrapModule } from "../bootstrap.js";

const root = process.cwd();
const schema = JSON.parse(
    readFileSync(path.join(root, "data/library/schema.json"), "utf8"),
);

test("every seeded spoken card resolves a nonempty packaged MP3 while sentences stay composite", () => {
    let checked = 0;
    for (const layer of schema.layers) {
        const directory = path.join(root, "data/library/content", layer.id);
        const records = readdirSync(directory)
            .filter((name) => name.endsWith(".json"))
            .flatMap((name) =>
                JSON.parse(readFileSync(path.join(directory, name), "utf8")),
            );
        for (const record of records) {
            if (
                ![
                    "atomicWritingUnit",
                    "compoundWritingUnit",
                    "lexicalUnit",
                    "particle",
                ].includes(layer.semanticRole) ||
                record.tags?.includes("punctuation")
            )
                continue;
            assert.ok(
                layer.fields.some(
                    (field) => field.id === "audio" && field.type === "audio",
                ),
            );
            assert.match(record.fields.audio, /^audio\/[a-f0-9]{64}\.mp3$/);
            const file = path.join(
                root,
                "data/library/assets",
                record.fields.audio,
            );
            assert.ok(statSync(file).isFile());
            const content = readFileSync(file);
            assert.ok(content.byteLength > 100);
            assert.ok(
                content.subarray(0, 3).toString() === "ID3" ||
                    content[0] === 0xff,
            );
            checked++;
        }
    }
    assert.ok(checked > 100);
});

test("audio registrations roll back on activation failure and dispose across remounts", async () => {
    const active = new Set();
    let fail = true;
    const ctx = {
        moduleRoot: root,
        capabilities: {
            require(id) {
                if (id === "study:audio:provider")
                    return {
                        registerProvider(provider) {
                            assert.ok(
                                provider.languages.includes(schema.language),
                            );
                            active.add(provider.id);
                            return () => active.delete(provider.id);
                        },
                    };
                assert.equal(id, "study:library:provider");
                return {
                    registerLookupProvider(provider) {
                        active.add(provider.id);
                        return () => active.delete(provider.id);
                    },
                    deleteContentPack: async () => {},
                    ingestContentPack: async () => {
                        if (fail) throw new Error("ingest_failed");
                        return { packId: "fixture", contentRevision: "test" };
                    },
                };
            },
        },
        registerStaticDir() {},
        registerApiDelete() {},
        contributePublicCapability() {},
        flow: { extend() {} },
        log() {},
    };
    await assert.rejects(bootstrapModule(ctx), /ingest_failed/);
    assert.equal(active.size, 0);
    fail = false;
    for (let cycle = 0; cycle < 2; cycle++) {
        const dispose = await bootstrapModule(ctx);
        assert.equal(active.size, 3);
        dispose();
        assert.equal(active.size, 0);
    }
});
