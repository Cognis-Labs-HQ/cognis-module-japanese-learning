import { readAudioInventory } from "../api/audio/inventory.js";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAudioProvider } from "../api/audio/index.js";
import { readContentLayers } from "../api/reuse/content.js";

const inventory = await readAudioInventory("data/audio");
const unavailable = JSON.parse(
    await readFile("data/audio/unavailable.json", "utf8"),
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
        [
            ...inventory.recordings,
            ...inventory.compositions,
            ...inventory.sentences,
        ].map(async (clip) => [
            clip.path,
            await readFile(`data/library/assets/${clip.path}`),
        ]),
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

test("every card and selected form has an unambiguous audio lookup identity", () => {
    const lookups = new Map();
    for (const layer of schema.layers) {
        if (layer.semanticRole === "definition") continue;
        for (const entry of layers.get(layer.id)) {
            if (entry.tags?.includes("punctuation")) continue;
            const candidates = [
                {
                    label: entry.label,
                    reading: entry.fields.pronunciation?.[0] ?? "",
                    path: entry.fields.audio,
                },
            ];
            for (const form of forms(entry)) {
                const recording = inventory.recordings.find((clip) =>
                    clip.variants.some(
                        (variant) =>
                            variant.entryId === entry.id &&
                            variant.setId === form.setId &&
                            JSON.stringify(variant.path) ===
                                JSON.stringify(form.path),
                    ),
                );
                assert.ok(recording, `${entry.id}: missing ${form.label}`);
                candidates.push({
                    label: form.label,
                    reading: form.reading,
                    path: recording.path,
                });
            }
            for (const candidate of candidates) {
                const key = JSON.stringify([
                    candidate.label,
                    layer.semanticRole,
                    candidate.reading,
                ]);
                const digest = createHash("sha256")
                    .update(assets.get(candidate.path))
                    .digest("hex");
                const previous = lookups.get(key);
                if (previous)
                    assert.equal(
                        digest,
                        previous.digest,
                        `${entry.id} conflicts with ${previous.entryId} for ${key}`,
                    );
                else lookups.set(key, { digest, entryId: entry.id });
            }
        }
    }
});

test("every packaged clip has the designated language voice, stable settings, non-silent PCM and a verified digest", () => {
    const expectedVoice =
        inventory.language === "ja"
            ? "xya0RvcJtofTcFTOdX4E"
            : "gJx1vCzNCD1EQHT212Ls";
    assert.equal(inventory.voiceId, expectedVoice);
    for (const clip of [
        ...inventory.recordings,
        ...inventory.compositions,
        ...inventory.sentences,
    ]) {
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
            inventory.language === "ja" &&
                clip.metadata?.languageSelection !==
                    "native-input-autodetection"
                ? "ja"
                : undefined,
        );
        assert.ok(Number.isInteger(clip.request.seed));
    }
});

test("all playable cards and selected forms have complete bundled audio coverage", async () => {
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
            const actual = (await provider.fetchAudio(input)).data;
            assert.equal(
                createHash("sha256").update(actual).digest("hex"),
                createHash("sha256")
                    .update(assets.get(entry.fields.audio))
                    .digest("hex"),
                `${entry.id}: bundled playback must match the card audio`,
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

test("composite fallback sentence PCM reuses exact ordered constituent clips and selected transformation paths", () => {
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
        label: "未収録の日本語",
        semanticRole: "lexicalUnit",
        readings: [],
    });
    assert.deepEqual(requests, [
        {
            language: inventory.language,
            text: "未収録の日本語",
            voiceId: inventory.voiceId,
        },
    ]);
    await assert.rejects(
        provider.fetchAudio({
            language: inventory.language === "ja" ? "en" : "ja",
            label: "未収録の日本語",
            semanticRole: "lexicalUnit",
            readings: [],
        }),
        /audio_lookup_unavailable/,
    );
    assert.equal(requests.length, 1);
});

test("small-kana lexical recordings retain native Japanese requests and the canonical school spelling", () => {
    const affected = inventory.recordings.filter((clip) =>
        clip.inputs.some(
            (input) =>
                input.semanticRole === "lexicalUnit" &&
                /[っゃゅょぁぃぅぇぉゎッャュョァィゥェォヮ]/u.test(
                    input.readings.join(""),
                ),
        ),
    );
    assert.ok(affected.length > 30);
    for (const clip of affected) {
        if (clip.metadata?.languageSelection === "native-input-autodetection") {
            assert.equal(clip.request.language_code, undefined);
            assert.match(
                clip.request.text,
                /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u,
            );
        } else assert.equal(clip.request.language_code, "ja");
        assert.equal(
            clip.request.apply_text_normalization,
            clip.metadata?.languageSelection === "native-input-autodetection"
                ? undefined
                : "off",
        );
        assert.equal(clip.voiceId, "xya0RvcJtofTcFTOdX4E");
    }
    const school = affected.find((clip) =>
        clip.inputs.some((input) => input.label === "学校"),
    );
    assert.equal(school.request.text, "学校");
    assert.ok(school.inputs.some((input) => input.readings[0] === "がっこう"));
});

test("packaged sentence playback preserves exact constituent composition without runtime synthesis", async () => {
    const provider = makeProvider(() => {
        throw new Error("unexpected_synthesis");
    });
    assert.ok(inventory.sentences.length <= inventory.compositions.length);
    for (const sentence of inventory.sentences) {
        const composition = inventory.compositions.find(
            (item) => item.entryId === sentence.entryId,
        );
        assert.equal(
            entries.get(sentence.entryId).fields.audio,
            composition.path,
        );
        assert.equal(sentence.voiceId, inventory.voiceId);
        assert.equal(sentence.request.text, sentence.inputs[0].label);
        const result = await provider.fetchAudio(composition.input);
        assert.deepEqual(
            Buffer.from(result.data),
            assets.get(composition.path),
        );
    }
});

test("unbundled Japanese kana and kanji never send romanized readings to speech", async () => {
    const requests = [];
    const provider = makeProvider(() => ({
        synthesize: async (input) => {
            requests.push(input);
            return { mediaType: "audio/wav", data: new Uint8Array([1]) };
        },
    }));
    await provider.fetchAudio({
        language: "ja",
        label: "ゔぁ",
        semanticRole: "atomicWritingUnit",
        readings: ["va"],
    });
    await provider.fetchAudio({
        language: "ja",
        label: "新しい学校",
        semanticRole: "lexicalUnit",
        readings: ["atarashii gakkou"],
    });
    assert.deepEqual(
        requests.map(({ text }) => text),
        ["ゔぁ", "新しい学校"],
    );
    await assert.rejects(
        provider.fetchAudio({
            language: "ja",
            label: "romaji only",
            semanticRole: "lexicalUnit",
            readings: ["romaji"],
        }),
        /audio_lookup_unavailable/,
    );
    assert.equal(requests.length, 2);
    for (const clip of [...inventory.recordings, ...inventory.sentences]) {
        assert.match(
            clip.request.text,
            /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
        );
        if (clip.metadata?.languageSelection === "native-input-autodetection") {
            assert.equal(clip.request.language_code, undefined);
            assert.match(
                clip.request.text,
                /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u,
            );
        } else assert.equal(clip.request.language_code, "ja");
        assert.equal(clip.voiceId, "xya0RvcJtofTcFTOdX4E");
    }
});

function validatePlayableAudio(candidates) {
    for (const entry of candidates) {
        if (entry.class === "definition" || entry.tags?.includes("punctuation"))
            continue;
        assert.ok(
            entry.fields?.audio && assets.has(entry.fields.audio),
            `${entry.id}: missing playable audio`,
        );
    }
}

test("all playable cards require audio independently of the unavailable ledger", () => {
    validatePlayableAudio(entries.values());
    assert.deepEqual(unavailable.entries, []);
    const entry = structuredClone(
        [...entries.values()].find(
            (entry) => entry.class?.startsWith("lexical:") && !entry.hidden,
        ),
    );
    delete entry.fields.audio;
    assert.throws(
        () => validatePlayableAudio([entry]),
        /missing playable audio/,
    );
});

test("supporting-card recordings retain source provenance and explicit listening status", () => {
    const added = inventory.recordings.filter(
        (clip) => clip.metadata?.sourceWavSha256,
    );
    assert.equal(added.length, 50);
    const bound = new Set();
    for (const clip of added) {
        assert.match(clip.metadata.sourceWavSha256, /^[a-f0-9]{64}$/);
        assert.match(clip.metadata.sourcePcmSha256, /^[a-f0-9]{64}$/);
        assert.ok(clip.metadata.requestId);
        assert.ok(clip.metadata.historyItemId);
        assert.equal(clip.metadata.validation.automated, "passed");
        assert.equal(
            clip.metadata.validation.listening,
            "unavailable-audio-input-unsupported",
        );
        assert.equal(clip.metadata.processing.paddingMs, 20);
        assert.equal(clip.metadata.processing.peakLimit, 0.82);
        assert.ok(clip.metadata.processing.gain > 0);
        assert.ok(clip.metadata.processing.gain <= 1);
        for (const entryId of clip.entries) {
            const entry = entries.get(entryId);
            assert.equal(entry.fields.audio, clip.path, entryId);
            assert.equal(
                entry.fields.pronunciation[0],
                clip.request.text,
                `${entryId}: speech must use the authored reading`,
            );
            assert.ok(
                clip.inputs.some(
                    (input) =>
                        input.label === entry.label &&
                        input.readings[0] === entry.fields.pronunciation[0],
                ),
                entryId,
            );
            bound.add(entryId);
        }
    }
    assert.equal(bound.size, 52);
});
