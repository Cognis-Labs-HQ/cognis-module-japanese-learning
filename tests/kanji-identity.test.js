import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const contentDirectory = path.resolve(
    import.meta.dirname,
    "..",
    "data",
    "library",
    "content",
    "alt-characters",
);

function packagedKanji() {
    return readdirSync(contentDirectory)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .flatMap((name) =>
            JSON.parse(readFileSync(path.join(contentDirectory, name), "utf8")),
        );
}

test("Kanji identity is label-based and permits shared pronunciations", () => {
    const kanji = packagedKanji();
    const labels = kanji.map(({ label }) => label.normalize("NFKC"));
    assert.equal(new Set(labels).size, labels.length);

    const kenHomophones = kanji
        .filter(({ fields }) => fields.pronunciation.includes("けん"))
        .map(({ label }) => label)
        .sort();
    assert.deepEqual(kenHomophones, ["犬", "見"]);
});
