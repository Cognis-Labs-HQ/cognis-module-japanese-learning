import assert from "node:assert/strict";
import test from "node:test";
import { cp, mkdtemp, rm, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { createReferenceProvider } from "../dictionary/reference.js";

const manifest = JSON.parse(
    await readFile("data/reference/manifest.json", "utf8"),
);

test("the full reference inventory matches its source counts and integrity digests", async () => {
    let records = 0;
    let keys = 0;
    for (const shard of manifest.shards) {
        const data = await readFile(`data/reference/${shard.path}`);
        assert.equal(
            createHash("sha256").update(data).digest("hex"),
            shard.sha256,
        );
        const values = JSON.parse(gunzipSync(data).toString("utf8"));
        assert.equal(Object.keys(values).length, shard.keys);
        keys += shard.keys;
        records += Object.values(values).reduce(
            (total, items) => total + items.length,
            0,
        );
    }
    assert.equal(records, manifest.records);
    assert.equal(keys, manifest.keys);
    assert.equal(records, manifest.language === "en" ? 135969 : 13108);
});

test("reference lookup builds real spelling/reading graphs without contacting a service", async () => {
    const provider = createReferenceProvider({
        referenceRoot: "data/reference",
        contentRoot: "data/library/content",
        metadata: manifest.metadata,
        source: manifest.source,
        cacheRevision: "test",
    });
    const layer = {
        id: manifest.language === "en" ? "words" : "alt-characters",
    };
    const results = await provider.lookup({
        layer,
        label: manifest.language === "en" ? "serendipity" : "常",
    });
    assert.ok(results.length);
    assert.ok(results[0].definitions.length);
    assert.equal(results[0].sourceUrl, manifest.source.url);
    if (manifest.language === "en") {
        assert.ok(results[0].references.length);
        assert.ok(results[0].fields.pronunciation[0].startsWith("/"));
    } else {
        assert.equal(results[0].fields.pronunciation[0], "つね");
        assert.ok(Object.values(results[0].referenceGroups).flat(2).length);
    }
    assert.deepEqual(await provider.lookup({ layer, label: "<invalid>" }), []);
});

test("reference records preserve legitimate unfamiliar spellings and unknown Kanji readings", async () => {
    const provider = createReferenceProvider({
        referenceRoot: "data/reference",
        contentRoot: "data/library/content",
        metadata: manifest.metadata,
        source: manifest.source,
        cacheRevision: "test",
    });
    if (manifest.language === "en") {
        const results = await provider.lookup({
            layer: { id: "words" },
            label: "'hood",
        });
        assert.ok(results.length);
        assert.equal(results[0].label, "'hood");
        assert.ok(results[0].definitions.length);
        assert.equal(results[0].references, undefined);
    } else {
        let unknown;
        for (const shard of manifest.shards) {
            const records = JSON.parse(
                gunzipSync(
                    await readFile(`data/reference/${shard.path}`),
                ).toString("utf8"),
            );
            unknown = Object.values(records)
                .flat()
                .find((record) => !record.japanese.length);
            if (unknown) break;
        }
        assert.ok(unknown);
        const results = await provider.lookup({
            layer: { id: "alt-characters" },
            label: unknown.slug,
        });
        assert.ok(results.length);
        assert.equal(results[0].fields.pronunciation, undefined);
        assert.equal(
            JSON.parse(results[0].fields.dictionary_data).records[0].slug,
            unknown.slug,
        );
    }
});

test("reference content loading recovers after a transient local failure", async () => {
    const root = await mkdtemp("/tmp/study-reference-retry-");
    const logs = [];
    try {
        const provider = createReferenceProvider({
            referenceRoot: "data/reference",
            contentRoot: root,
            metadata: manifest.metadata,
            source: manifest.source,
            cacheRevision: "retry",
            log: (...args) => logs.push(args),
        });
        const input = {
            layer: {
                id: manifest.language === "en" ? "words" : "alt-characters",
            },
            label: manifest.language === "en" ? "serendipity" : "節",
        };
        await assert.rejects(
            provider.lookup(input),
            /reference_content_unavailable/,
        );
        assert.equal(logs.length, 1);
        await cp("data/library/content", root, { recursive: true });
        const result = await provider.lookup(input);
        assert.ok(result.length);
        if (manifest.language === "ja")
            assert.equal(result[0].definitions.length, 14);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test("colliding catalog records produce one identity with merged meanings and complete references", async () => {
    const provider = createReferenceProvider({
        referenceRoot: "data/reference",
        contentRoot: "data/library/content",
        metadata: manifest.metadata,
        source: manifest.source,
        cacheRevision: "merged",
    });
    const japanese = manifest.language === "ja";
    const input = {
        layer: { id: japanese ? "alt-characters" : "words" },
        label: japanese ? "神" : "mare",
    };
    const results = await provider.lookup(input);
    assert.equal(results.length, 1);
    const definitions = results[0].definitions.map(
        (definition) => definition.translations.en,
    );
    if (japanese) {
        assert.ok(definitions.includes("spirit"));
        assert.ok(definitions.includes("gods"));
        assert.ok(results[0].referenceGroups.readings.length >= 14);
        assert.equal(results[0].fields.pronunciation[0], "かみ");
        const equivalent = await provider.lookup({ ...input, label: "神" });
        assert.equal(equivalent[0].provenance, results[0].provenance);
        assert.equal(equivalent[0].label, "神");
    } else {
        assert.ok(
            definitions.some((value) =>
                /female.*horse|female equine/i.test(value),
            ),
        );
        assert.ok(definitions.some((value) => /moon|lunar/i.test(value)));
        assert.ok(
            results[0].references.some(
                ({ relation }) => relation === "spelling",
            ),
        );
    }
    assert.ok(
        JSON.parse(results[0].fields.dictionary_data).records.length >= 2,
    );
});
