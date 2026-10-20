import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const load = async (path) => JSON.parse(await readFile(path, "utf8"));

test("sending and carrying progresses from vocabulary to contextual sentences", async () => {
    const decks = await load("data/starter-decks.json");
    const deck = decks.find(({ key }) => key === "delivery-practice");
    const expected = [
        "ja:word:delivery-send",
        "ja:word:delivery-carry",
        "ja:sentence:delivery-example-send-friend-letter",
        "ja:sentence:delivery-example-send-postcard",
        "ja:sentence:delivery-example-transport-box",
        "ja:sentence:delivery-example-carry-slowly",
        "ja:sentence:message-practice-example-tomorrow-recipient",
        "ja:sentence:message-practice-example-coordinated-mail",
        "ja:sentence:message-practice-example-carry-together",
        "ja:sentence:message-practice-example-suitcase-destination",
    ];
    assert.deepEqual(deck.sourceRecordIds.slice(0, expected.length), expected);
    assert.equal(
        new Set(deck.sourceRecordIds).size,
        deck.sourceRecordIds.length,
    );
    const sentences = await load(
        "data/library/content/sentences/message-practice-001.json",
    );
    assert.deepEqual(
        sentences.map(({ label }) => label),
        [
            "明日友達にはがきを送る",
            "手紙とはがきを送る",
            "友達と重い箱を運ぶ",
            "スーツケースを駅まで運ぶ",
        ],
    );
});
