import assert from "node:assert/strict";
import test from "node:test";
import { createLookupCache } from "../reuse/lookup-cache.js";

test("failed older lookups retain a successful refreshed cache entry", async () => {
    let reject;
    let calls = 0;
    const lookup = createLookupCache(() => {
        calls += 1;
        return calls === 1
            ? new Promise((_resolve, fail) => {
                  reject = fail;
              })
            : Promise.resolve("fresh");
    });
    const older = lookup("word");
    const failure = assert.rejects(older, /upstream_failure/);
    await Promise.resolve();
    assert.equal(await lookup("word", true), "fresh");
    reject(new Error("upstream_failure"));
    await failure;
    assert.equal(await lookup("word"), "fresh");
    assert.equal(calls, 2);
});

test("lookup caching coalesces callers and evicts beyond its configured capacity", async () => {
    let calls = 0;
    const lookup = createLookupCache(
        async (key) => {
            calls += 1;
            return key;
        },
        { limit: 1 },
    );
    assert.deepEqual(await Promise.all([lookup("first"), lookup("first")]), [
        "first",
        "first",
    ]);
    assert.equal(calls, 1);
    await lookup("second");
    await lookup("first");
    assert.equal(calls, 3);
});

test("negative asset results expire promptly without replacing newer refreshes", async () => {
    let timestamp = 0;
    let calls = 0;
    const lookup = createLookupCache(
        () => {
            calls += 1;
            return calls === 1 ? null : "available";
        },
        { ttl: 1000, negativeTtl: 10, now: () => timestamp },
    );
    assert.equal(await lookup("asset"), null);
    timestamp = 9;
    assert.equal(await lookup("asset"), null);
    assert.equal(calls, 1);
    timestamp = 10;
    assert.equal(await lookup("asset"), "available");
    assert.equal(calls, 2);
    timestamp = 100;
    assert.equal(await lookup("asset"), "available");
    assert.equal(calls, 2);
});
