import assert from "node:assert/strict";
import path from "node:path";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bootstrapModule } from "../bootstrap.js";

test("ingests the declarative pack through the host Library capability", async () => {
    const calls = [];
    const contributions = [];
    const providers = [];
    const apiRoutes = [];
    let removed = 0;
    const ctx = {
        moduleRoot: path.resolve("."),
        capabilities: {
            get(id) {
                assert.equal(id, "study:library:provider");
                return undefined;
            },
            require(id) {
                assert.equal(id, "study:library");
                return {
                    registerLookupProvider(provider) {
                        providers.push(provider);
                        return () => {
                            removed += 1;
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
        },
        registerStaticDir() {},
        registerApiDelete(routePath, handler, options) {
            apiRoutes.push({ routePath, handler, options });
        },
        contributePublicCapability(id, value) {
            contributions.push({ id, value });
        },
        flow: { extend() {} },
        log() {},
    };

    const dispose = await bootstrapModule(ctx);

    assert.deepEqual(calls, [path.join(ctx.moduleRoot, "data", "library")]);
    assert.equal(apiRoutes.length, 1);
    assert.equal(
        apiRoutes[0].routePath,
        "/api/v1/modules/study-language-ja/config",
    );
    assert.deepEqual(apiRoutes[0].options, {
        access: { minRole: "admin" },
        allowWhenDisabled: true,
    });
    const response = {
        status: 0,
        ended: false,
        writeHead(status) {
            this.status = status;
        },
        end() {
            this.ended = true;
        },
    };
    apiRoutes[0].handler({}, response);
    assert.equal(response.status, 204);
    assert.equal(response.ended, true);
    assert.deepEqual(
        providers.map(({ id }) => id),
        ["study-language-ja:stroke-patterns", "study-language-ja:jisho"],
    );
    assert.ok(
        providers.every(
            ({ metadata }) => Object.keys(metadata.labels).length === 4,
        ),
    );
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
    assert.equal(removed, 2);
});

test("fails safely when the host Library capability is unavailable", async () => {
    await assert.rejects(
        bootstrapModule({
            capabilities: {
                get() {
                    return undefined;
                },
                require() {
                    throw new Error(
                        'Required capability "study:library" is not available.',
                    );
                },
            },
        }),
        /Required capability "study:library" is not available/,
    );
});

test("content ingestion failures remain activation-blocking", async () => {
    const contributions = [];
    let removed = 0;
    const ctx = {
        moduleRoot: path.resolve("."),
        capabilities: {
            get() {
                return undefined;
            },
            require() {
                return {
                    registerLookupProvider() {
                        return () => {
                            removed += 1;
                        };
                    },
                    async ingestContentPack() {
                        throw new Error("content import failed");
                    },
                };
            },
        },
        registerStaticDir() {},
        registerApiDelete() {},
        contributePublicCapability(id) {
            contributions.push(id);
        },
        flow: { extend() {} },
        log() {},
    };

    await assert.rejects(bootstrapModule(ctx), /content import failed/);
    assert.deepEqual(contributions, []);
    assert.equal(removed, 2);
    const manifest = JSON.parse(
        readFileSync(path.join(ctx.moduleRoot, "manifest.json"), "utf8"),
    );
    assert.equal(manifest.allowBootstrapFailure, undefined);
});

test("prefers the public provider capability when it is injected", async () => {
    const provider = {
        registerLookupProvider() {
            return () => {};
        },
        async ingestContentPack() {
            return { packId: "japanese-core", unchanged: true };
        },
    };
    let required = false;
    const ctx = {
        moduleRoot: path.resolve("."),
        capabilities: {
            get(id) {
                assert.equal(id, "study:library:provider");
                return provider;
            },
            require() {
                required = true;
                throw new Error("unexpected fallback");
            },
        },
        registerStaticDir() {},
        registerApiDelete() {},
        contributePublicCapability() {},
        flow: { extend() {} },
        log() {},
    };
    const dispose = await bootstrapModule(ctx);
    assert.equal(required, false);
    dispose();
});
