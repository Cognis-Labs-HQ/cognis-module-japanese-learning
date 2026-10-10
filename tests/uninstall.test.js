import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { uninstallModule } from "../bootstrap.js";

function cleanupContext(overrides = {}) {
    const logEntries = [];
    const deletedRoots = [];
    const ctx = {
        moduleRoot: path.resolve("."),
        getCapability(id) {
            assert.equal(id, "study:library:provider");
            return {
                async deleteContentPack(root) {
                    deletedRoots.push(root);
                },
            };
        },
        log(level, message, metadata) {
            logEntries.push({ level, message, metadata });
        },
        ...overrides,
    };
    return { ctx, logEntries, deletedRoots };
}

test("retains all packaged learning data unless destructive cleanup is checked", async () => {
    const { ctx, logEntries, deletedRoots } = cleanupContext({
        getCapability() {
            throw new Error("cleanup capability must not be requested");
        },
    });

    await uninstallModule(ctx, { deleteContent: false });

    assert.deepEqual(deletedRoots, []);
    assert.deepEqual(logEntries, [
        {
            level: "info",
            message: "Japanese language pack content retained.",
            metadata: {
                component: "study-language-ja",
                operation: "uninstall_cleanup",
                deleteContent: false,
            },
        },
    ]);
});

test("deletes the content pack only for explicitly requested destructive cleanup", async () => {
    const { ctx, logEntries, deletedRoots } = cleanupContext();

    await uninstallModule(ctx, { deleteContent: true });

    assert.deepEqual(deletedRoots, [
        path.join(ctx.moduleRoot, "data", "library"),
    ]);
    assert.deepEqual(logEntries, [
        {
            level: "info",
            message: "Japanese language pack content deleted.",
            metadata: {
                component: "study-language-ja",
                operation: "delete_content_pack",
                packId: "japanese-core",
            },
        },
    ]);
});

test("blocks destructive uninstall when content-pack cleanup is unavailable", async () => {
    const { ctx, logEntries } = cleanupContext({
        getCapability() {
            return {};
        },
    });

    await assert.rejects(
        uninstallModule(ctx, { deleteContent: true }),
        /content-pack cleanup is unavailable/,
    );
    assert.equal(logEntries[0].level, "error");
    assert.equal(logEntries[0].metadata.operation, "delete_content_pack");
});

test("logs and propagates content-pack deletion failures", async () => {
    const failure = new Error("database unavailable");
    const { ctx, logEntries } = cleanupContext({
        getCapability() {
            return {
                async deleteContentPack() {
                    throw failure;
                },
            };
        },
    });

    await assert.rejects(
        uninstallModule(ctx, { deleteContent: true }),
        (error) => error === failure,
    );
    assert.deepEqual(logEntries[0], {
        level: "error",
        message: "Japanese language pack cleanup failed.",
        metadata: {
            component: "study-language-ja",
            operation: "delete_content_pack",
            packId: "japanese-core",
            error: "database unavailable",
        },
    });
});
