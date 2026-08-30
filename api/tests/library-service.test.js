import assert from "node:assert/strict";
import test from "node:test";
import {
    allowedReferenceLayers,
    isLibraryLayer,
    validateReferenceLayers,
} from "../library/layers.js";
import { LibraryService } from "../library/service.js";

function createMemoryStore() {
    const entries = [];
    let nextId = 0;
    return {
        entries,
        async list(location, layer) {
            return entries.filter(
                (entry) =>
                    entry.scope === location.scope &&
                    entry.scopeId === location.scopeId &&
                    (!layer || entry.layer === layer),
            );
        },
        async get(id) {
            return entries.find((entry) => entry.id === id) ?? null;
        },
        async create(location, input, accountId) {
            const entry = {
                ...input,
                id: `entry-${++nextId}`,
                scope: location.scope,
                scopeId: location.scopeId,
                createdBy: accountId,
                createdAt: "2026-08-29T00:00:00.000Z",
                updatedAt: "2026-08-29T00:00:00.000Z",
                references: input.references ?? [],
            };
            entries.push(entry);
            return entry;
        },
        async referencesFor(id) {
            return entries.filter((entry) =>
                entry.references.some((reference) => reference.entryId === id),
            );
        },
    };
}

test("defines and validates the layered library graph", () => {
    assert.equal(isLibraryLayer("routines"), true);
    assert.equal(isLibraryLayer("unknown"), false);
    assert.deepEqual(allowedReferenceLayers("workouts"), ["exercises"]);
    assert.throws(
        () =>
            validateReferenceLayers(
                "sentences",
                [{ entryId: "alphabet" }],
                new Map([["alphabet", "alphabet"]]),
            ),
        /invalid_reference:sentences:alphabet/,
    );
});

test("creates missing alphabet dependencies for words", async () => {
    const store = createMemoryStore();
    const service = new LibraryService(store);
    const actor = { accountId: "admin-1", role: "admin" };
    const word = await service.create(
        actor,
        { scope: "global" },
        { layer: "words", language: "ja", label: "あい" },
    );
    assert.deepEqual(
        store.entries.map((entry) => entry.layer),
        ["alphabet", "alphabet", "words"],
    );
    assert.deepEqual(
        word.references.map((reference) => reference.relation),
        ["contains", "contains"],
    );
});

test("enforces global, user, and class scope authorization", async () => {
    const store = createMemoryStore();
    const classAccess = {
        canRead: async () => true,
        canWrite: async () => false,
    };
    const service = new LibraryService(store, classAccess);
    const user = { accountId: "user-1", role: "user" };
    await assert.rejects(
        service.create(
            user,
            { scope: "global" },
            { layer: "definitions", label: "Meaning" },
        ),
        /forbidden/,
    );
    await service.create(
        user,
        { scope: "user" },
        { layer: "definitions", label: "Meaning" },
    );
    await assert.rejects(
        service.list(user, { scope: "user", scopeId: "user-2" }),
        /forbidden/,
    );
    await assert.rejects(
        service.create(
            user,
            { scope: "class", scopeId: "class-1" },
            { layer: "definitions", label: "Meaning" },
        ),
        /forbidden/,
    );
});

test("exports words and sentences in JSON and Anki formats", async () => {
    const store = createMemoryStore();
    const service = new LibraryService(store);
    const actor = { accountId: "admin-1", role: "admin" };
    await service.create(
        actor,
        { scope: "global" },
        { layer: "words", label: "猫", fields: { definition: "cat" } },
    );
    const exported = await service.exportJson(actor, { scope: "global" });
    assert.equal(exported.schemaVersion, 1);
    assert.match(
        await service.exportAnki(actor, { scope: "global" }),
        /^猫\tcat$/,
    );
});
