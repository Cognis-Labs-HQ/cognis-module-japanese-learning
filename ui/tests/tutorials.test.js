import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mountProvider } from "../tutorials/provider.js";
import { definition } from "../tutorials/plays.js";

function fixture({ fail = false, version = 1 } = {}) {
    const signal = new AbortController().signal;
    const published = new Map();
    let request,
        disposed = false;
    const ctx = {
        signal,
        capabilities: {
            get: (id) =>
                id === "study:libraryTutorials"
                    ? {
                          version,
                          register: async (input) => {
                              request = input;
                              if (fail) throw new Error("registration_failed");
                              return {
                                  id: `${input.owner}:${input.id}`,
                                  dispose: () => {
                                      disposed = true;
                                  },
                              };
                          },
                      }
                    : undefined,
            contribute: (id, value) => published.set(id, value),
        },
    };
    return {
        ctx,
        published,
        get request() {
            return request;
        },
        get disposed() {
            return disposed;
        },
    };
}

test("the language module registers its own content through Library's public workflow", async () => {
    const state = fixture();
    const dispose = await mountProvider(state.ctx);
    assert.equal(state.request.owner, `module.${definition.moduleId}`);
    assert.equal(state.request.language, definition.language);
    assert.equal(state.request.signal, state.ctx.signal);
    assert.equal(state.request.id, "introduction");
    assert.deepEqual(state.request.stringsBaseUrls, [
        `/static/modules/${definition.moduleId}/languages`,
    ]);
    assert.ok(state.published.get(`${definition.moduleId}:tutorials`));
    dispose();
    assert.equal(state.disposed, true);
});

test("language-specific walkthrough copy resolves from every packaged locale", () => {
    const keys = [
        definition.titleKey,
        ...Object.values(definition.text).flatMap(({ titleKey, bodyKey }) => [
            titleKey,
            bodyKey,
        ]),
    ];
    for (const locale of ["en", "de", "id", "ja"]) {
        const xml = readFileSync(
            new URL(`../languages/${locale}/strings.xml`, import.meta.url),
            "utf8",
        );
        for (const key of keys) {
            assert.ok(key.startsWith("module.study.language.ja.tutorial."));
            assert.ok(xml.includes(`name="${key}"`), `${locale}: ${key}`);
        }
    }
});

test("failed workflow registration publishes no module handle", async () => {
    const state = fixture({ fail: true });
    await assert.rejects(mountProvider(state.ctx), /registration_failed/);
    assert.equal(state.published.size, 0);
});

test("an unsupported Library tutorial contract is rejected before registration", async () => {
    const state = fixture({ version: 2 });
    await assert.rejects(
        mountProvider(state.ctx),
        /library_tutorial_contract_unavailable/,
    );
    assert.equal(state.request, undefined);
});
