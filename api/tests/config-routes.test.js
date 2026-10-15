import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("disabled entrypoint registers only the admin configuration cleanup route", async () => {
    const manifest = JSON.parse(
        await readFile(new URL("../../manifest.json", import.meta.url), "utf8"),
    );
    const entrypoint = await import(
        new URL(`../../${manifest.entrypoints.disabledApi}`, import.meta.url)
    );
    const routes = [];
    entrypoint.registerDisabledApiRoutes({
        registerApiDelete(path, handler, options) {
            routes.push({ path, handler, options });
        },
    });
    assert.equal(routes.length, 1);
    assert.equal(routes[0].path, `/api/v1/modules/${manifest.id}/config`);
    assert.deepEqual(routes[0].options, {
        access: { minRole: "admin" },
        allowWhenDisabled: true,
    });
    let status;
    let ended = false;
    routes[0].handler(
        {},
        {
            writeHead(code) {
                status = code;
            },
            end() {
                ended = true;
            },
        },
    );
    assert.equal(status, 204);
    assert.equal(ended, true);
});
