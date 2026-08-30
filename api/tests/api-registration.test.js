import assert from "node:assert/strict";
import test from "node:test";
import { LIBRARY_API_BASE, registerApi } from "../index.js";

test("registers library endpoints only inside the module-owned API namespace", async () => {
    const routes = [];
    const database = {
        async ensureTable() {},
    };
    const router = {};
    for (const method of ["get", "post", "put"]) {
        router[method] = (routePath) => routes.push({ method, routePath });
    }
    const ctx = {
        moduleRoot: process.cwd(),
        getCapability(capability) {
            if (capability === "auth:requireAuth") return async () => null;
            if (capability === "db:executor") return database;
            return undefined;
        },
        router,
        registerStaticDir() {},
        registerSpaRoute() {},
        registerNavbarPlugin() {},
    };

    await registerApi(ctx);

    assert.equal(routes.length, 8);
    assert.ok(
        routes.every(({ routePath }) =>
            routePath.startsWith(`${LIBRARY_API_BASE}/`),
        ),
    );
    assert.equal(
        routes.some(({ routePath }) => routePath.startsWith("/api/v1/study/")),
        false,
    );
});
