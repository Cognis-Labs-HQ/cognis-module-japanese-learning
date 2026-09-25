import assert from "node:assert/strict";
import path from "node:path";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bootstrapModule } from "../bootstrap.js";

test("ingests the declarative pack through the host Library capability", async () => {
    const calls = [];
    const contributions = [];
    const providers = [];
    let removed = false;
    const ctx = {
        moduleRoot: path.resolve("."),
        getCapability(id) {
            assert.equal(id, "study:library:provider");
            return {
                registerLookupProvider(provider) {
                    providers.push(provider);
                    return () => {
                        removed = true;
                    };
                },
                async ingestContentPack(root) {
                    calls.push(root);
                    return {
                        packId: "japanese-core",
                        contentRevision: "2026-09-05.5",
                        unchanged: false,
                    };
                },
            };
        },
        registerStaticDir() {},
        contributePublicCapability(id, value) {
            contributions.push({ id, value });
        },
        flow: { extend() {} },
        log() {},
    };

    const dispose = await bootstrapModule(ctx);

    assert.deepEqual(calls, [path.join(ctx.moduleRoot, "data", "library")]);
    assert.equal(providers[0].id, "study-language-ja:stroke-patterns");
    assert.deepEqual(
        contributions.map(({ id }) => id),
        ["study:language:ja"],
    );
    assert.deepEqual(contributions[0].value.childComponents, []);
    assert.equal(contributions[0].value.code, "ja");
    assert.equal(contributions[0].value.languageCode, "ja");
    assert.equal(
        contributions[0].value.code,
        contributions[0].value.languageCode,
    );
    assert.deepEqual(
        contributions[0].value.package,
        JSON.parse(
            readFileSync(
                path.join(ctx.moduleRoot, "data", "library", "manifest.json"),
                "utf8",
            ),
        ),
    );
    dispose();
    assert.equal(removed, true);
});

test("fails safely when the host Library capability is unavailable", async () => {
    await assert.rejects(
        bootstrapModule({ getCapability: () => undefined }),
        /requires study:library/,
    );
});

test("content ingestion failures remain activation-blocking", async () => {
    const contributions = [];
    let removed = false;
    const ctx = {
        moduleRoot: path.resolve("."),
        getCapability() {
            return {
                registerLookupProvider() {
                    return () => {
                        removed = true;
                    };
                },
                async ingestContentPack() {
                    throw new Error("content import failed");
                },
            };
        },
        registerStaticDir() {},
        contributePublicCapability(id) {
            contributions.push(id);
        },
        flow: { extend() {} },
        log() {},
    };

    await assert.rejects(bootstrapModule(ctx), /content import failed/);
    assert.deepEqual(contributions, []);
    assert.equal(removed, true);
    const manifest = JSON.parse(
        readFileSync(path.join(ctx.moduleRoot, "manifest.json"), "utf8"),
    );
    assert.equal(manifest.allowBootstrapFailure, undefined);
});
