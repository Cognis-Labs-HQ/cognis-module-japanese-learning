import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createAudioProvider, speechText } from "../audio/index.js";

const voice = JSON.parse(
    readFileSync(
        new URL("../../data/audio/voice.json", import.meta.url),
        "utf8",
    ),
);
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const index = JSON.parse(
    readFileSync(
        new URL("../../data/audio/recordings.json", import.meta.url),
        "utf8",
    ),
);

function provider(options = {}) {
    return createAudioProvider({
        voice,
        revision: "test",
        audioRoot: join(root, "data/library/assets"),
        recordings: index.recordings,
        ...options,
    });
}

test("audio fetchers resolve complete bundled recordings and reject unsupported requests", async () => {
    const recording = index.recordings[0];
    const input = {
        language: voice.language,
        semanticRole: "lexicalUnit",
        label: recording.text,
    };
    const result = await provider().fetchAudio(input);
    assert.deepEqual(
        result.data,
        new Uint8Array(
            readFileSync(join(root, "data/library/assets", recording.path)),
        ),
    );
    assert.equal(result.mediaType, "audio/mpeg");
    await assert.rejects(
        provider().fetchAudio({
            ...input,
            semanticRole: "orderedLexicalSequence",
        }),
        /invalid_audio_input/,
    );
    await assert.rejects(
        provider().fetchAudio({ ...input, label: "x".repeat(201) }),
        /invalid_audio_input/,
    );
    await assert.rejects(
        provider().fetchAudio({ ...input, label: "unrecorded-word" }),
        /audio_not_found/,
    );
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(provider().fetchAudio(input, controller.signal), {
        name: "AbortError",
    });
});

test("preferred phonemes distinguish identical spellings and failures are logged safely", async () => {
    const directory = await mkdtemp(join(tmpdir(), "study-audio-"));
    try {
        await mkdir(join(directory, "audio"));
        const recordings = [
            {
                text: "read",
                phonemes: "riːd",
                path: `audio/${"a".repeat(64)}.mp3`,
            },
            {
                text: "read",
                phonemes: "rɛd",
                path: `audio/${"b".repeat(64)}.mp3`,
            },
        ];
        await writeFile(
            join(directory, recordings[0].path),
            new Uint8Array([0xff, 0xfb, 1]),
        );
        await writeFile(
            join(directory, recordings[1].path),
            new Uint8Array([0xff, 0xfb, 2]),
        );
        const logs = [];
        const fetcher = provider({
            audioRoot: directory,
            recordings,
            voice: { ...voice, phonemeReadings: true, useKanaReadings: false },
            log: (...args) => logs.push(args),
        });
        const input = {
            language: voice.language,
            semanticRole: "lexicalUnit",
            label: "read",
            readings: ["/rɛd/"],
        };
        assert.deepEqual(
            (await fetcher.fetchAudio(input)).data,
            new Uint8Array([0xff, 0xfb, 2]),
        );
        assert.deepEqual(
            (
                await fetcher.fetchAudio({
                    ...input,
                    label: "reed",
                    readings: ["/riːd/"],
                })
            ).data,
            new Uint8Array([0xff, 0xfb, 1]),
        );
        await assert.rejects(
            fetcher.fetchAudio({ ...input, readings: ["/ruːd/"] }),
            /audio_not_found/,
        );
        assert.equal(logs[0][2].operation, "fetch_audio");
        assert.equal(JSON.stringify(logs).includes("ruːd"), false);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test("speech selection preserves letter names and authored Japanese particle readings", () => {
    if (voice.letterNames)
        assert.equal(
            speechText(
                { label: "a", semanticRole: "atomicWritingUnit" },
                voice,
            ),
            "A",
        );
    if (voice.useKanaReadings) {
        assert.equal(
            speechText(
                { label: "は", semanticRole: "particle", readings: ["は"] },
                voice,
            ),
            "わ",
        );
        assert.equal(
            speechText(
                {
                    label: "ゃ",
                    semanticRole: "atomicWritingUnit",
                    readings: ["ya"],
                },
                voice,
            ),
            "や",
        );
    }
});
