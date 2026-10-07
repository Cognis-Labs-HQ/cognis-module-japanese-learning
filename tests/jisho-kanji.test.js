import assert from "node:assert/strict";
import test from "node:test";
import { parseJishoKanji, createJishoKanjiLookup } from "../api/jisho-kanji.js";

const html = `<h1 class="character" lang="ja">教</h1>
<div class="kanji-details__stroke_count"><strong>11</strong> strokes</div>
<div class="kanji-details__main-meanings">teach, faith, doctrine</div>
<dl class="dictionary_entry kun_yomi"><dd class="kanji-details__main-readings-list"><a>おし.える</a>&#12289; <a>おそ.わる</a></dd></dl>
<dl class="dictionary_entry on_yomi"><dd class="kanji-details__main-readings-list"><a>キョウ</a></dd></dl>
<div class="jlpt">JLPT level <strong>N4</strong></div>`;

test("Kanji pages preserve Kun and On readings, meanings, and original notation", () => {
    const record = parseJishoKanji(html, "教");
    assert.deepEqual(record.japanese, [
        { word: "教", reading: "おしえる" },
        { word: "教", reading: "おそわる" },
        { word: "教", reading: "キョウ" },
    ]);
    assert.deepEqual(record.senses[0].english_definitions, [
        "teach",
        "faith",
        "doctrine",
    ]);
    assert.deepEqual(record.jlpt, ["jlpt-n4"]);
    assert.deepEqual(record.kanji.readings.kun, ["おし.える", "おそ.わる"]);
    assert.equal(
        record.kanji.details["kanji-details__stroke_count"],
        "11 strokes",
    );
    assert.equal(parseJishoKanji(html, "鋭"), null);
    assert.equal(parseJishoKanji("<p>No matches found</p>", "教"), null);
    assert.throws(
        () => parseJishoKanji("<p>unexpected upstream page</p>", "教"),
        /jisho_kanji_response_invalid/,
    );
});

test("failed Kanji responses are retried while successful responses are cached", async () => {
    let requests = 0;
    const lookup = createJishoKanjiLookup({
        endpoint: "https://jisho.test/search",
        fetchImplementation: async (url) => {
            requests += 1;
            assert.equal(url, "https://jisho.test/search/%E6%95%99%20%23kanji");
            return { ok: requests > 1, text: async () => html };
        },
    });
    await assert.rejects(lookup("教"), /jisho_request_failed/);
    const first = await lookup("教");
    assert.deepEqual(await lookup("教"), first);
    assert.equal(requests, 2);
});
