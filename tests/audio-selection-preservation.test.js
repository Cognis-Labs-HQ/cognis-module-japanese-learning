import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import test from "node:test";
import { createAudioProvider } from "../api/audio/index.js";
import { readAudioInventory } from "../api/audio/inventory.js";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

test("published audio inputs retain exact selected WAV bytes after expansion", async () => {
    const index = await load("authoring/index.json");
    const audit = await load(index.currentAudioSelectionAudit);
    const fixture = await readFile(audit.baselineFixture.path);
    assert.equal(digest(fixture), audit.baselineFixture.sha256);
    const baseline = JSON.parse(gunzipSync(fixture).toString("utf8"));
    assert.equal(baseline.length, audit.baselineFixture.inputCount);
    assert.equal(baseline.length, audit.existingDistinctInputsChecked);
    const inventory = await readAudioInventory("data/audio");
    const provider = createAudioProvider({
        root: "data/library/assets",
        inventory,
        revision: "selection-preservation",
        speech: () => null,
        configuration: () => ({}),
        log: () => {},
    });
    for (const { input, sha256 } of baseline) {
        const result = await provider.fetchAudio(input);
        assert.equal(digest(result.data), sha256, JSON.stringify(input));
    }
});
