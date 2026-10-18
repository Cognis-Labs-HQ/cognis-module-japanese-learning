import assert from "node:assert/strict";
import test from "node:test";
import { createAudioProvider } from "../audio/index.js";

const language = "ja";
const inputs =
    language === "ja"
        ? ["猫abc", "猫\u0000", "猫".repeat(201), "猫\n犬", "猫\u202e"]
        : ["cat猫", "cat\u0000", "a".repeat(201), "cat\ndog", "cat\u202e"];
for (const label of inputs)
    test(`invalid speech text is rejected before synthesis (${JSON.stringify(label.slice(0, 12))})`, async () => {
        const calls = [];
        const logs = [];
        const provider = createAudioProvider({
            inventory: {
                language,
                voiceId: "designated",
                recordings: [],
                sentences: [],
                compositions: [],
            },
            revision: "test",
            configuration: () => ({}),
            speech: () => ({ synthesize: (input) => calls.push(input) }),
            log: (...args) => logs.push(args),
        });
        await assert.rejects(
            provider.fetchAudio({
                language,
                label,
                semanticRole: "lexicalUnit",
                readings: [],
            }),
            /audio_lookup_unavailable/,
        );
        assert.equal(calls.length, 0);
        assert.equal(logs.length, 1);
    });

test("valid native text is normalized and retains the designated voice", async () => {
    const calls = [];
    const provider = createAudioProvider({
        inventory: {
            language,
            voiceId: "designated",
            recordings: [],
            sentences: [],
            compositions: [],
        },
        revision: "test",
        configuration: () => ({}),
        speech: () => ({
            async synthesize(input) {
                calls.push(input);
                return { mediaType: "audio/wav", data: new Uint8Array([1]) };
            },
        }),
    });
    const input =
        language === "ja"
            ? { label: "ｶﾞｯｺｳ", readings: [] }
            : { label: "thing", readings: ["/θɪŋ/"] };
    await provider.fetchAudio({
        language,
        semanticRole: "lexicalUnit",
        ...input,
    });
    assert.equal(calls[0].language, language);
    assert.equal(calls[0].voiceId, "designated");
    assert.equal(calls[0].text, language === "ja" ? "ガッコウ" : "thing");
    if (language === "en") assert.equal(calls[0].phonemes, "θɪŋ");
});
