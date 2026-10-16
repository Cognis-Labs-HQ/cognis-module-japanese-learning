import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import test from "node:test";
import { withConfiguration } from "./configuration-context.js";

const manifest = JSON.parse(
    await readFile(new URL("../../manifest.json", import.meta.url), "utf8"),
);
const entrypoint = await import(
    new URL(`../../${manifest.entrypoints.disabledApi}`, import.meta.url)
);

test("voice configuration is administrator-only, persists while disabled, and omits an unset override", async () => {
    const routes = new Map();
    const register = (method) => (path, handler, options) => {
        assert.equal(path, `/api/v1/modules/${manifest.id}/config`);
        assert.deepEqual(options, {
            access: { minRole: "admin" },
            allowWhenDisabled: true,
        });
        routes.set(method, handler);
    };
    const ctx = withConfiguration({
        registerApiGet: register("GET"),
        registerApiPut: register("PUT"),
        registerApiDelete: register("DELETE"),
        log() {},
    });
    const state = await entrypoint.registerDisabledApiRoutes(ctx);
    const request = async (method, input) => {
        let status;
        let body;
        await routes.get(method)(
            Readable.from(input === undefined ? [] : [JSON.stringify(input)]),
            {
                writeHead(value) {
                    status = value;
                },
                end(value) {
                    body = JSON.parse(value);
                },
            },
        );
        return { status, body };
    };
    assert.deepEqual((await request("GET")).body.data, {});
    assert.equal((await request("PUT", { voiceId: "voice-test" })).status, 200);
    assert.equal(state.value.voiceId, "voice-test");
    assert.equal((await request("GET")).body.data.voiceId, "voice-test");
    assert.equal(
        (await request("PUT", { voiceId: "../../invalid" })).status,
        400,
    );
    await request("PUT", { voiceId: "" });
    assert.deepEqual(state.value, {});
    await request("PUT", { voiceId: "voice-test" });
    await request("DELETE");
    assert.deepEqual((await request("GET")).body.data, {});
});
