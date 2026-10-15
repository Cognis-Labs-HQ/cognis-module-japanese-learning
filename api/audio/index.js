import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROLES = new Set([
    "atomicWritingUnit",
    "compoundWritingUnit",
    "lexicalUnit",
    "particle",
]);

export function speechText(input, voice) {
    const override = voice.overrides?.[input.semanticRole]?.[input.label];
    if (override) return override;
    if (voice.letterNames && input.semanticRole === "atomicWritingUnit")
        return input.label.toUpperCase();
    if (voice.useKanaReadings) {
        const reading = input.readings?.find((value) =>
            /^[\u3040-\u30ffー]+$/u.test(value),
        );
        if (reading) return reading;
    }
    return input.label;
}

export function createAudioProvider({
    voice,
    revision,
    audioRoot,
    recordings,
    log,
}) {
    return Object.freeze({
        id: `study-language-${voice.language}:audio`,
        revision,
        languages: [voice.language],
        async fetchAudio(input, signal) {
            if (
                input?.language !== voice.language ||
                !ROLES.has(input.semanticRole) ||
                typeof input.label !== "string" ||
                !input.label.trim() ||
                [...input.label].length > 200
            )
                throw new Error("invalid_audio_input");
            try {
                signal?.throwIfAborted();
                const text = speechText(input, voice);
                const phonemes =
                    voice.phonemeReadings &&
                    /^\/[^/]+\/$/u.test(input.readings?.[0] ?? "")
                        ? input.readings[0].slice(1, -1)
                        : undefined;
                const recording = recordings.find(
                    (candidate) =>
                        (phonemes
                            ? candidate.phonemes === phonemes
                            : candidate.text === text) &&
                        /^audio\/[a-f0-9]{64}\.mp3$/.test(candidate.path),
                );
                if (!recording) throw new Error("audio_not_found");
                const asset = path.join(audioRoot, recording.path);
                const metadata = await stat(asset);
                if (!metadata.isFile() || metadata.size > 2_000_000)
                    throw new Error("invalid_audio_asset");
                const data = new Uint8Array(await readFile(asset, { signal }));
                if (
                    !data.byteLength ||
                    !(
                        String.fromCharCode(...data.subarray(0, 3)) === "ID3" ||
                        (data[0] === 0xff && (data[1] & 0xe0) === 0xe0)
                    )
                )
                    throw new Error("invalid_audio_asset");
                return { mediaType: "audio/mpeg", data };
            } catch (error) {
                log?.("error", "Pronunciation audio retrieval failed.", {
                    component: `study-language-${voice.language}`,
                    operation: "fetch_audio",
                    language: voice.language,
                    source: "bundled-recordings",
                    errorName: error instanceof Error ? error.name : "Error",
                });
                throw error;
            }
        },
    });
}
