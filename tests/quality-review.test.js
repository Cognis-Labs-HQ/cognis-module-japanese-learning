import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (path) =>
    JSON.parse(readFileSync(new URL("../" + path, import.meta.url), "utf8"));

test("ambiguous easy-task artwork stays rejected and the reviewed replacement is shipped", () => {
    const rejected = read("authoring/reviews/qualities-rejected-images.json");
    const approved = read("authoring/reviews/qualities-images.json");
    const catalog = read("data/library/assets/images/catalog.json").images;
    assert.equal(rejected.length, 1);
    for (const item of rejected) {
        assert.equal(item.runtimeIncluded, false);
        assert.equal(
            catalog.some((image) => image.sourceSha256 === item.sourceSha256),
            false,
        );
        const replacement = approved.find(
            (image) => image.entryId === item.entryId,
        );
        assert.equal(replacement.sourceSha256, item.replacementSourceSha256);
        assert.equal(replacement.visualReview, "pass");
        assert.ok(
            catalog.some(
                (image) => image.sourceSha256 === replacement.sourceSha256,
            ),
        );
        const source = readFileSync(
            new URL("../" + item.sourcePath, import.meta.url),
        );
        assert.equal(
            createHash("sha256").update(source).digest("hex"),
            item.sourceSha256,
        );
    }
});
