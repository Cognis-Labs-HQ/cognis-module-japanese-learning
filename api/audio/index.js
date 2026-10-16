import { readFile, stat } from "node:fs/promises";
import path from "node:path";

function inputKey(input) {
    return JSON.stringify([
        input.label,
        input.semanticRole,
        input.readings?.[0] ?? "",
    ]);
}

export function createAudioProvider({
    root,
    inventory,
    revision,
    speech,
    configuration,
    log,
}) {
    const recordings = new Map();
    for (const recording of inventory.recordings) {
        for (const input of recording.inputs)
            recordings.set(inputKey(input), recording);
    }
    for (const composition of inventory.compositions) {
        recordings.set(inputKey(composition.input), composition);
    }
    return Object.freeze({
        id: `study-language-${inventory.language}:recordings`,
        languages: [inventory.language],
        get revision() {
            return JSON.stringify([
                revision,
                speech()?.revision ?? null,
                configuration().voiceId ?? null,
            ]);
        },
        async fetchAudio(input, signal) {
            signal?.throwIfAborted();
            if (input.language !== inventory.language)
                throw new Error("audio_lookup_unavailable");
            const recording = recordings.get(inputKey(input));
            try {
                if (recording) {
                    if (!/^audio\/[a-f0-9]{64}\.wav$/.test(recording.path))
                        throw new Error("invalid_audio_asset");
                    const target = path.join(root, recording.path);
                    const metadata = await stat(target);
                    if (!metadata.isFile() || metadata.size > 2_000_000)
                        throw new Error("invalid_audio_asset");
                    const data = new Uint8Array(
                        await readFile(target, { signal }),
                    );
                    if (
                        String.fromCharCode(...data.subarray(0, 4)) !==
                            "RIFF" ||
                        String.fromCharCode(...data.subarray(8, 12)) !== "WAVE"
                    )
                        throw new Error("invalid_audio_asset");
                    return { mediaType: "audio/wav", data };
                }
                // New sentences must reuse constituent recordings, including selected forms.
                const synthesizer = speech();
                if (
                    input.semanticRole === "orderedLexicalSequence" ||
                    !synthesizer
                )
                    throw new Error("audio_lookup_unavailable");
                const reading = input.readings?.[0];
                const phonemes = /^\/[^/]+\/$/u.test(reading ?? "")
                    ? reading.slice(1, -1)
                    : undefined;
                return await synthesizer.synthesize(
                    {
                        language: inventory.language,
                        text: phonemes ? input.label : reading || input.label,
                        ...(phonemes ? { phonemes } : {}),
                        voiceId: configuration().voiceId || inventory.voiceId,
                    },
                    signal,
                );
            } catch (error) {
                signal?.throwIfAborted();
                log?.("error", "Study recording retrieval failed.", {
                    component: `study-language-${inventory.language}`,
                    operation: "fetchAudio",
                    language: inventory.language,
                    errorName: error instanceof Error ? error.name : "Error",
                });
                throw error;
            }
        },
    });
}
