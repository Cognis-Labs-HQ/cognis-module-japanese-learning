import assert from "node:assert/strict";
import test from "node:test";
import { uninstallModule } from "../../bootstrap.js";

test("supports uninstall cleanup without deleting packaged learning data", async () => {
    const logEntries = [];
    await uninstallModule(
        {
            log(level, message, metadata) {
                logEntries.push({ level, message, metadata });
            },
        },
        { deleteContent: true },
    );

    assert.deepEqual(logEntries, [
        {
            level: "info",
            message: "Japanese learning module cleanup completed.",
            metadata: {
                component: "study-language-ja",
                operation: "uninstall_cleanup",
                deleteContent: true,
            },
        },
    ]);
});
