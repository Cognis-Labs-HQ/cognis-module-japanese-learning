import { withConfiguration } from "../api/tests/configuration-context.js";
import assert from "node:assert/strict";
import path from "node:path";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bootstrapModule as bootstrapLanguageModule } from "../bootstrap.js";

function bootstrapModule(ctx) {
    return bootstrapLanguageModule(withConfiguration(ctx));
}

test("ingests the declarative pack through the host Library capability", async () => {
    const calls = [];
    const audio = [];
    let speech;
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
                if (id === "study:audio:provider")
                    return {
                        registerProvider: (...args) => {
                            audio.push(args);
                            return () => {};
                        },
                    };
                assert.equal(id, "study:library:provider");
                return {
                    registerLookupProvider(provider) {
                        providers.push(provider);
                        return () => {
                            removed += 1;
                        };
                    },
                    async deleteContentPack() {},
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
        getCapability(id) {
            assert.equal(id, "elevenlabs-tts:synthesis");
            return speech;
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
    const recordingProvider = audio[0][0];
    assert.deepEqual(recordingProvider.languages, ["ja"]);
    const input = {
        language: "ja",
        label: "未収録",
        semanticRole: "lexicalUnit",
        readings: [],
    };
    await assert.rejects(
        recordingProvider.fetchAudio(input),
        /audio_lookup_unavailable/,
    );
    speech = {
        configured: true,
        revision: "one",
        synthesize: async () => ({
            mediaType: "audio/mpeg",
            data: new Uint8Array([1]),
        }),
    };
    assert.equal(
        (await recordingProvider.fetchAudio(input)).mediaType,
        "audio/mpeg",
    );
    speech.configured = false;
    await assert.rejects(
        recordingProvider.fetchAudio(input),
        /audio_lookup_unavailable/,
    );
    speech = undefined;

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
    await apiRoutes[0].handler({}, response);
    assert.equal(response.status, 200);
    assert.equal(response.ended, true);
    assert.deepEqual(
        providers.map(({ id }) => id),
        [
            "study-language-ja:stroke-patterns",
            "study-language-ja:jisho",
            "study-language-ja:reference",
        ],
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
    assert.equal(removed, 3);
});

test("fails safely when the host Library capability is unavailable", async () => {
    await assert.rejects(
        bootstrapModule({
            capabilities: {
                get() {
                    return undefined;
                },
                require(id) {
                    if (id === "study:audio:provider")
                        return { registerProvider: () => () => {} };
                    throw new Error(
                        'Required capability "study:library:provider" is not available.',
                    );
                },
            },
        }),
        /Required capability "study:library:provider" is not available/,
    );
});

test("content ingestion failures remain activation-blocking", async () => {
    const contributions = [];
    const logs = [];
    let removed = 0;
    const ctx = {
        moduleRoot: path.resolve("."),
        capabilities: {
            get() {
                return undefined;
            },
            require(id) {
                if (id === "study:audio:provider")
                    return { registerProvider: () => () => {} };
                return {
                    registerLookupProvider() {
                        return () => {
                            removed += 1;
                        };
                    },
                    async deleteContentPack() {},
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
        log(...args) {
            logs.push(args);
        },
    };

    await assert.rejects(bootstrapModule(ctx), /content import failed/);
    assert.deepEqual(contributions, []);
    assert.equal(removed, 3);
    assert.equal(logs[0][0], "error");
    assert.equal(logs[0][2].operation, "bootstrap");
    assert.equal(logs[0][2].errorName, "Error");
    assert.ok(!JSON.stringify(logs).includes("content import failed"));
    const manifest = JSON.parse(
        readFileSync(path.join(ctx.moduleRoot, "manifest.json"), "utf8"),
    );
    assert.equal(manifest.allowBootstrapFailure, undefined);
});

test("requires the public provider capability when it is injected", async () => {
    const provider = {
        registerLookupProvider() {
            return () => {};
        },
        async deleteContentPack() {},
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
            require(id) {
                if (id === "study:audio:provider")
                    return { registerProvider: () => () => {} };
                assert.equal(id, "study:library:provider");
                required = true;
                return provider;
            },
        },
        registerStaticDir() {},
        registerApiDelete() {},
        contributePublicCapability() {},
        flow: { extend() {} },
        log() {},
    };
    const dispose = await bootstrapModule(ctx);
    assert.equal(required, true);
    dispose();
});

test("failed capability publication or flow registration removes every lookup provider", async () => {
    for (const failure of ["capability", "flow"]) {
        let removed = 0;
        const ctx = {
            moduleRoot: path.resolve("."),
            capabilities: {
                require(id) {
                    if (id === "study:audio:provider")
                        return { registerProvider: () => () => {} };
                    assert.equal(id, "study:library:provider");
                    return {
                        registerLookupProvider() {
                            return () => {
                                removed += 1;
                            };
                        },
                        async deleteContentPack() {},
                        async ingestContentPack() {
                            return { packId: "japanese-core" };
                        },
                    };
                },
            },
            registerStaticDir() {},
            registerApiDelete() {},
            contributePublicCapability() {
                if (failure === "capability")
                    throw new Error("publication_failed");
            },
            flow: {
                extend() {
                    if (failure === "flow")
                        throw new Error("registration_failed");
                },
            },
        };
        await assert.rejects(
            bootstrapModule(ctx),
            failure === "flow" ? /registration_failed/ : /publication_failed/,
        );
        assert.equal(removed, 3);
    }
});

test("activation rejects a host provider without content-pack cleanup", async () => {
    await assert.rejects(
        bootstrapModule({
            capabilities: {
                require(id) {
                    if (id === "study:audio:provider")
                        return { registerProvider: () => () => {} };
                    return {
                        async ingestContentPack() {},
                        registerLookupProvider() {},
                    };
                },
            },
        }),
        /Invalid Study Library provider capability/,
    );
});
