import assert from "node:assert/strict";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

test("installed content-pack paths resolve using only packaged files", async (context) => {
    const installed = await mkdtemp(path.join(tmpdir(), "study-pack-install-"));
    context.after(() => rm(installed, { recursive: true, force: true }));
    const moduleManifest = JSON.parse(
        await readFile(path.join(ROOT, "manifest.json"), "utf8"),
    );
    for (const { path: relative } of moduleManifest.files) {
        if (!relative.startsWith("data/library/")) continue;
        const target = path.join(installed, relative);
        await mkdir(path.dirname(target), { recursive: true });
        await copyFile(path.join(ROOT, relative), target);
    }
    const packRoot = path.join(installed, "data/library");
    const manifest = JSON.parse(
        await readFile(path.join(packRoot, "manifest.json"), "utf8"),
    );
    assert.equal(
        (await stat(path.join(packRoot, manifest.schema))).isFile(),
        true,
    );
    for (const relative of [
        manifest.content,
        ...(manifest.assets ? [manifest.assets] : []),
    ]) {
        assert.equal(
            (await stat(path.join(packRoot, relative))).isDirectory(),
            true,
        );
    }
});
