import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAudioProvider } from "../api/audio/index.js";
import { readContentLayers } from "../api/reuse/content.js";

const inventory = JSON.parse(
    await readFile("data/audio/recordings.json", "utf8"),
);
const schema = JSON.parse(await readFile("data/library/schema.json", "utf8"));
const layers = await readContentLayers(
    "data/library/content",
    schema.layers.map(({ id }) => id),
);
const entries = new Map(
    [...layers.values()].flat().map((entry) => [entry.id, entry]),
);
const assets = new Map(
    await Promise.all(
        [...inventory.recordings, ...inventory.compositions].map(
            async (clip) => [
                clip.path,
                await readFile(`data/library/assets/${clip.path}`),
            ],
        ),
    ),
);
const makeProvider = (speech = () => undefined) =>
    createAudioProvider({
        root: "data/library/assets",
        inventory,
        revision: "test",
        speech,
        configuration: () => ({}),
    });

function forms(entry) {
    return schema.transformSets
        .filter(
            (set) =>
                set.matchTags.every((tag) => entry.tags?.includes(tag)) &&
                (!set.optInTag || entry.tags?.includes(set.optInTag)),
        )
        .flatMap((set) => {
            const nodes = [
                {
                    state: set.baseState,
                    label: entry.label,
                    reading: entry.fields?.pronunciation?.[0] ?? entry.label,
                    path: [],
                },
            ];
            const seen = new Set([
                JSON.stringify([set.baseState, entry.label]),
            ]);
            for (const node of nodes)
                for (const rule of set.rules) {
                    if (
                        rule.fromState !== node.state ||
                        !node.label.endsWith(rule.removeSuffix)
                    )
                        continue;
                    const label =
                        node.label.slice(
                            0,
                            node.label.length - rule.removeSuffix.length,
                        ) + rule.append;
                    const key = JSON.stringify([rule.toState, label]);
                    if (seen.has(key)) continue;
                    seen.add(key);
                    const operation = rule.pronunciation;
                    const reading =
                        operation &&
                        node.reading.endsWith(operation.removeSuffix)
                            ? node.reading.slice(
                                  0,
                                  node.reading.length -
                                      operation.removeSuffix.length,
                              ) + operation.append
                            : node.reading;
                    nodes.push({
                        state: rule.toState,
                        label,
                        reading,
                        path: [...node.path, rule.id],
                    });
                }
            return nodes.slice(1).map((node) => ({ ...node, setId: set.id }));
        });
}

test("every packaged clip has the designated language voice, stable settings, audible PCM and a verified digest", () => {
    const expectedVoice =
        inventory.language === "ja"
            ? "xya0RvcJtofTcFTOdX4E"
            : "gJx1vCzNCD1EQHT212Ls";
    assert.equal(inventory.voiceId, expectedVoice);
    for (const clip of [...inventory.recordings, ...inventory.compositions]) {
        const data = assets.get(clip.path);
        assert.ok(data.length < 2_000_000, clip.path);
        assert.equal(data.toString("ascii", 0, 4), "RIFF");
        assert.equal(data.toString("ascii", 8, 12), "WAVE");
        assert.equal(data.readUInt32LE(24), 24000);
        assert.equal(data.readUInt16LE(22), 1);
        assert.equal(data.readUInt16LE(34), 16);
        assert.equal(
            createHash("sha256").update(data).digest("hex"),
            clip.sha256,
        );
        let peak = 0;
        for (let offset = 44; offset < data.length; offset += 2)
            peak = Math.max(peak, Math.abs(data.readInt16LE(offset)));
        assert.ok(peak > 100 && peak <= 26870, `${clip.path}: ${peak}`);
        if (!clip.request) continue;
        assert.equal(clip.voiceId, expectedVoice);
        assert.ok(
            clip.inputs.every((input) => input.language === inventory.language),
        );
        assert.equal(clip.request.model_id, inventory.modelId);
        assert.deepEqual(clip.request.voice_settings, {
            stability: inventory.processing.stability,
            similarity_boost: 0.85,
            style: 0,
            use_speaker_boost: true,
            speed: 0.9,
        });
        assert.equal(
            clip.request.language_code,
            inventory.language === "ja" ? "ja" : undefined,
        );
        assert.ok(Number.isInteger(clip.request.seed));
    }
});

test("every spoken seed card and every reachable transformation has a playable bundled recording", async () => {
    const provider = makeProvider(() => {
        throw new Error("unexpected_speech_lookup");
    });
    let variants = 0;
    for (const layer of schema.layers)
        for (const entry of layers.get(layer.id)) {
            if (
                layer.semanticRole === "definition" ||
                entry.tags?.includes("punctuation")
            )
                continue;
            assert.ok(assets.has(entry.fields.audio), entry.id);
            const input = {
                language: inventory.language,
                label: entry.label,
                semanticRole: layer.semanticRole,
                readings: entry.fields.pronunciation?.slice(0, 1) ?? [],
            };
            assert.deepEqual(
                (await provider.fetchAudio(input)).data,
                new Uint8Array(assets.get(entry.fields.audio)),
            );
            for (const form of forms(entry)) {
                variants++;
                const recording = inventory.recordings.find((clip) =>
                    clip.variants.some(
                        (variant) =>
                            variant.entryId === entry.id &&
                            variant.setId === form.setId &&
                            JSON.stringify(variant.path) ===
                                JSON.stringify(form.path),
                    ),
                );
                assert.ok(recording, `${entry.id}: ${form.path}`);
                assert.deepEqual(
                    (
                        await provider.fetchAudio({
                            ...input,
                            label: form.label,
                            readings: [form.reading],
                        })
                    ).data,
                    new Uint8Array(assets.get(recording.path)),
                );
            }
        }
    assert.ok(variants > 100);
});

test("sentence PCM reuses exact ordered constituent clips and selected transformation paths", () => {
    for (const sentence of inventory.compositions) {
        const references = entries
            .get(sentence.entryId)
            .references.filter(
                ({ relation, entryId }) =>
                    ["words", "particles"].includes(relation) &&
                    !entries.get(entryId).tags?.includes("punctuation"),
            )
            .sort((left, right) => left.position - right.position);
        assert.equal(sentence.segments.length, references.length);
        for (const [index, segment] of sentence.segments.entries()) {
            assert.equal(segment.entryId, references[index].entryId);
            assert.deepEqual(
                segment.transformation,
                references[index].transformation,
            );
            if (segment.transformation) {
                const recording = inventory.recordings.find(
                    (clip) => clip.path === segment.path,
                );
                assert.ok(
                    recording.variants.some(
                        (variant) =>
                            variant.entryId === segment.entryId &&
                            variant.setId === segment.transformation.setId &&
                            JSON.stringify(variant.path) ===
                                JSON.stringify(segment.transformation.path),
                    ),
                );
            }
            const pcm = assets.get(segment.path).subarray(44);
            assert.equal(pcm.length, segment.frameCount * 2);
            assert.deepEqual(
                assets
                    .get(sentence.path)
                    .subarray(
                        44 + segment.startFrame * 2,
                        44 + (segment.startFrame + segment.frameCount) * 2,
                    ),
                pcm,
            );
        }
    }
});

test("cross-language, cancelled and unavailable variant requests never substitute a base recording", async () => {
    const provider = makeProvider();
    const first = inventory.recordings[0].inputs[0];
    await assert.rejects(
        provider.fetchAudio({
            ...first,
            language: inventory.language === "ja" ? "en" : "ja",
        }),
        /audio_lookup_unavailable/,
    );
    await assert.rejects(
        provider.fetchAudio({
            ...first,
            label: "unbundled-variant",
            readings: [],
        }),
        /audio_lookup_unavailable/,
    );
    await assert.rejects(provider.fetchAudio(first, AbortSignal.abort()), {
        name: "AbortError",
    });
    await assert.rejects(
        makeProvider(() => ({
            synthesize() {
                throw new Error("must_not_synthesize_sentence");
            },
        })).fetchAudio({
            ...first,
            label: "new sentence",
            semanticRole: "orderedLexicalSequence",
        }),
        /audio_lookup_unavailable/,
    );
});

test("unbundled lexical synthesis uses only this language and its designated default voice", async () => {
    const requests = [];
    const provider = makeProvider(() => ({
        synthesize: async (input) => {
            requests.push(input);
            return { mediaType: "audio/wav", data: new Uint8Array([1]) };
        },
    }));
    await provider.fetchAudio({
        language: inventory.language,
        label: "unbundled-lexical-record",
        semanticRole: "lexicalUnit",
        readings: [],
    });
    assert.deepEqual(requests, [
        {
            language: inventory.language,
            text: "unbundled-lexical-record",
            voiceId: inventory.voiceId,
        },
    ]);
    await assert.rejects(
        provider.fetchAudio({
            language: inventory.language === "ja" ? "en" : "ja",
            label: "unbundled-lexical-record",
            semanticRole: "lexicalUnit",
            readings: [],
        }),
        /audio_lookup_unavailable/,
    );
    assert.equal(requests.length, 1);
});
