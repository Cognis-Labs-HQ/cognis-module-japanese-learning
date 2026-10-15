import assert from "node:assert/strict";
import test from "node:test";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { gunzipSync } from "node:zlib";
import { createReferenceAudioReader } from "../audio/reference.js";

const root = "data/audio/reference";

test("every known primary reference reading has a whole recording", async () => {
    const bank = JSON.parse(
        await readFile(path.join(root, "index.json"), "utf8"),
    );
    const seed = JSON.parse(
        await readFile("data/audio/recordings.json", "utf8"),
    );
    const available = new Set([
        ...Object.keys(bank.records),
        ...seed.recordings.map((record) => record.text),
    ]);
    const catalog = JSON.parse(
        await readFile("data/reference/manifest.json", "utf8"),
    );
    let checked = 0;
    for (const shard of catalog.shards) {
        const records = JSON.parse(
            gunzipSync(await readFile(`data/reference/${shard.path}`)).toString(
                "utf8",
            ),
        );
        for (const values of Object.values(records)) {
            for (const record of values) {
                if (!record.japanese.length) continue;
                assert.ok(
                    available.has(record.japanese[0].reading),
                    record.slug,
                );
                checked++;
            }
        }
    }
    assert.equal(checked, catalog.coverage.recordsWithPronunciation);
    const text = Object.keys(bank.records)[0];
    const recording = await createReferenceAudioReader(root)(text);
    assert.equal(recording.mediaType, "audio/mpeg");
    assert.equal(recording.data.length, bank.records[text].length);
});

test("reference audio bounds its bank reads and honors cancellation", async () => {
    const directory = await mkdtemp(
        path.join(os.tmpdir(), "cognis-audio-bank-"),
    );
    try {
        await writeFile(
            path.join(directory, "0000.bin"),
            new Uint8Array([0xff, 0xfb, 1]),
        );
        const writeIndex = (record) =>
            writeFile(
                path.join(directory, "index.json"),
                JSON.stringify({ records: { test: record } }),
            );
        await writeIndex({ file: "0000.bin", offset: 0, length: 3 });
        assert.equal(
            (await createReferenceAudioReader(directory)("test")).data.length,
            3,
        );
        await assert.rejects(
            createReferenceAudioReader(directory)("missing"),
            /audio_not_found/,
        );
        const controller = new AbortController();
        controller.abort();
        await assert.rejects(
            createReferenceAudioReader(directory)("test", controller.signal),
            { name: "AbortError" },
        );
        for (const record of [
            { file: "../other", offset: 0, length: 3 },
            { file: "0000.bin", offset: -1, length: 3 },
            { file: "0000.bin", offset: 0, length: 524289 },
            { file: "0000.bin", offset: 1, length: 3 },
        ]) {
            await writeIndex(record);
            await assert.rejects(
                createReferenceAudioReader(directory)("test"),
                /invalid_audio_asset/,
            );
        }
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});
