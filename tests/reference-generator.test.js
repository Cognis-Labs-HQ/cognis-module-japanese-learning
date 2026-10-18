import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { gzipSync, gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

test("reference generator uses packaged language metadata and produces deterministic shards", async (t) => {
    if (spawnSync("python3", ["--version"]).error)
        return t.skip("Python is not installed");
    const language = JSON.parse(
        await readFile("data/audio/recordings.json", "utf8"),
    ).language;
    const root = await mkdtemp("/tmp/study-reference-generator-");
    try {
        await mkdir(path.join(root, "data/audio"), { recursive: true });
        await writeFile(
            path.join(root, "data/audio/recordings.json"),
            JSON.stringify({ language }),
        );
        const source = path.join(
            root,
            language === "ja" ? "source.json" : "source.xml.gz",
        );
        await writeFile(
            source,
            language === "ja"
                ? JSON.stringify({
                      犬: { readings_kun: ["いぬ"], meanings: ["dog"] },
                  })
                : gzipSync(
                      '<LexicalResource><Lexicon><Synset id="dog-n"><Definition>a canine</Definition></Synset><LexicalEntry id="dog"><Lemma writtenForm="dog" partOfSpeech="n"><Pronunciation>dog</Pronunciation></Lemma><Sense synset="dog-n"/></LexicalEntry></Lexicon></LexicalResource>',
                  ),
        );
        const generate = () => {
            const result = spawnSync(
                "python3",
                [
                    "scripts/import-reference.py",
                    "--source",
                    source,
                    "--root",
                    root,
                ],
                { encoding: "utf8" },
            );
            assert.equal(result.status, 0, result.stderr);
        };
        generate();
        const manifestPath = path.join(root, "data/reference/manifest.json");
        const first = await readFile(manifestPath, "utf8");
        const manifest = JSON.parse(first);
        assert.equal(manifest.language, language);
        assert.equal(manifest.records, 1);
        const shardPath = path.join(
            root,
            "data/reference",
            manifest.shards[0].path,
        );
        const bytes = await readFile(shardPath);
        assert.equal(
            createHash("sha256").update(bytes).digest("hex"),
            manifest.shards[0].sha256,
        );
        assert.equal(Object.keys(JSON.parse(gunzipSync(bytes))).length, 1);
        generate();
        assert.equal(await readFile(manifestPath, "utf8"), first);
        assert.deepEqual(await readFile(shardPath), bytes);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});
