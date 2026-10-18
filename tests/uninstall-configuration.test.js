import assert from "node:assert/strict";
import test from "node:test";
import { Configuration } from "../api/configuration.js";
import { uninstallModule } from "../bootstrap.js";

for (const deleteContent of [false, true]) {
    test(`uninstall clears persisted voice independently of retained content (${deleteContent})`, async () => {
        let stored = JSON.stringify({ voiceId: "previous-admin" });
        let deleted = 0;
        const logs = [];
        const database = {
            async ensureTable() {},
            async executeCommand(command) {
                if (command.option === "SELECT")
                    return { rows: stored ? [{ value: stored }] : [] };
                if (command.option === "DELETE") stored = undefined;
                return { rows: [] };
            },
        };
        const ctx = {
            moduleRoot: process.cwd(),
            getCapability(id) {
                if (id === "db:executor") return database;
                return {
                    async deleteContentPack() {
                        deleted += 1;
                    },
                };
            },
            log: (...args) => logs.push(args),
        };
        await uninstallModule(ctx, { deleteContent });
        assert.deepEqual(await new Configuration(database).load(), {});
        assert.equal(deleted, deleteContent ? 1 : 0);
        assert.ok(
            logs.some((entry) => entry[2].operation === "clear_configuration"),
        );
    });
}

test("uninstall logs and propagates configuration cleanup failure", async () => {
    const logs = [];
    const failure = new Error("private_database_failure");
    await assert.rejects(
        uninstallModule(
            {
                getCapability() {
                    return {
                        async ensureTable() {
                            throw failure;
                        },
                    };
                },
                log: (...args) => logs.push(args),
            },
            { deleteContent: false },
        ),
        (error) => error === failure,
    );
    assert.equal(logs[0][0], "error");
    assert.equal(logs[0][2].operation, "clear_configuration");
    assert.ok(!JSON.stringify(logs).includes(failure.message));
});
