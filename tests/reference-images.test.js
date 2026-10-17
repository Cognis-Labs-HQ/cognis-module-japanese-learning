import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../data/library/", import.meta.url);
test("reference images are declared on every layer and the dog photograph is bundled with attribution", async () => {
    const schema = JSON.parse(
        await readFile(new URL("schema.json", root), "utf8"),
    );
    for (const layer of schema.layers) {
        const field = layer.fields.find(({ id }) => id === "reference_images");
        assert.equal(field.type, "imageList");
        assert.equal(field.input.control, "imageFiles");
        for (const locale of ["en", "de", "id", "ja"])
            assert.ok(field.metadata.labels[locale]);
    }
    const words = new URL("content/words/", root);
    const records = (
        await Promise.all(
            (await readdir(words))
                .filter((file) => file.endsWith(".json"))
                .map(async (file) =>
                    JSON.parse(await readFile(new URL(file, words), "utf8")),
                ),
        )
    ).flat();
    const card = records.find(({ label }) => label === "犬");
    assert.deepEqual(card.fields.reference_images, ["images/dog.jpg"]);
    const bytes = await readFile(
        new URL("assets/" + card.fields.reference_images[0], root),
    );
    assert.equal(bytes.subarray(0, 3).toString("hex"), "ffd8ff");
    const attribution = await readFile(
        new URL("assets/images/LICENSE.md", root),
        "utf8",
    );
    assert.match(attribution, /CC BY-SA 3.0/);
    assert.match(attribution, /Djmirko/);
});
