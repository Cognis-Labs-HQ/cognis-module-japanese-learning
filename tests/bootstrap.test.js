import assert from "node:assert/strict";
import path from "node:path";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bootstrapModule } from "../bootstrap.js";

test("ingests the declarative pack through the host Library capability", async () => {
    const calls = [];
    const contributions = [];
    const ctx = {
        moduleRoot: path.resolve("."),
        getCapability(id) {
            assert.equal(id, "study:library");
            return {
                async ingestContentPack(root) {
                    calls.push(root);
                    return {
                        packId: "japanese-core",
                        contentRevision: "2026-09-05.2",
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

    await bootstrapModule(ctx);

    assert.deepEqual(calls, [path.join(ctx.moduleRoot, "data", "library")]);
    assert.deepEqual(
        contributions.map(({ id }) => id),
        ["study:language:ja"],
    );
    assert.deepEqual(contributions[0].value.childComponents, []);
    assert.equal(contributions[0].value.languageCode, "ja");
    assert.deepEqual(
        contributions[0].value.package,
        JSON.parse(
            readFileSync(
                path.join(ctx.moduleRoot, "data", "library", "manifest.json"),
                "utf8",
            ),
        ),
    );
});

test("fails safely when the host Library capability is unavailable", async () => {
    await assert.rejects(
        bootstrapModule({ getCapability: () => undefined }),
        /requires study:library/,
    );
});
