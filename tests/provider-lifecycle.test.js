import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapModule } from "../bootstrap.js";
import { withConfiguration } from "../api/tests/configuration-context.js";

test("enable-disable-enable releases every live language contribution while retaining imported data", async () => {
    let ingestions = 0;
    const library = new Map();
    const audio = new Map();
    const capability = new Map();
    const routes = new Map();
    const staticRoots = new Map();
    for (let cycle = 0; cycle < 2; cycle++) {
        const scopedDisposers = [];
        const register = (map, key, value) => {
            map.set(key, value);
            const dispose = () => map.delete(key);
            scopedDisposers.push(dispose);
            return dispose;
        };
        const base = {
            moduleRoot: process.cwd(),
            capabilities: {
                require(id) {
                    if (id === "study:audio:provider")
                        return {
                            registerProvider(provider) {
                                return register(audio, provider.id, provider);
                            },
                        };
                    return {
                        async ingestContentPack() {
                            ingestions++;
                            return { packId: "retained" };
                        },
                        async deleteContentPack() {
                            assert.fail("Disable must retain content");
                        },
                        transformationModel: "generated",
                        registerLookupProvider(provider) {
                            return register(library, provider.id, provider);
                        },
                    };
                },
            },
            registerStaticDir(prefix, root) {
                return register(staticRoots, prefix, root);
            },
            contributePublicCapability(id, value) {
                return register(capability, id, value);
            },
            flow: { extend() {} },
            log() {},
        };
        for (const method of ["Get", "Put", "Delete"])
            base[`registerApi${method}`] = (path, handler, options) => {
                assert.deepEqual(options, { access: { minRole: "admin" } });
                return register(routes, method + path, handler);
            };
        const dispose = await bootstrapModule(withConfiguration(base));
        assert.equal(capability.has("study:language:ja"), true);
        assert.equal(audio.size, 1);
        assert.ok(library.size >= 2);
        assert.equal(routes.size, 3);
        assert.equal(staticRoots.size, 1);
        dispose();
        for (const release of scopedDisposers.reverse()) release();
        assert.equal(
            capability.size +
                audio.size +
                library.size +
                routes.size +
                staticRoots.size,
            0,
        );
    }
    assert.equal(ingestions, 2);
});
