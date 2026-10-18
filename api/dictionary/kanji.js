import { katakanaToHiragana } from "../reuse/kana.js";
import { requestJisho } from "./request.js";
import { readBoundedText } from "../reuse/response.js";

function text(markup) {
    return markup
        .replace(/<[^>]*>/gu, "")
        .replace(/&#(x[0-9a-f]+|[0-9]+);/giu, (_match, code) =>
            String.fromCodePoint(
                code[0].toLowerCase() === "x"
                    ? parseInt(code.slice(1), 16)
                    : Number(code),
            ),
        )
        .replace(/&amp;/gu, "&")
        .replace(/&quot;/gu, '"')
        .replace(/&#39;|&apos;/gu, "'")
        .replace(/&lt;/gu, "<")
        .replace(/&gt;/gu, ">")
        .replace(/&nbsp;/gu, " ")
        .replace(/\s+/gu, " ")
        .trim();
}

export function parseJishoKanji(html, label) {
    const character = html.match(
        /<h1\b[^>]*class=["'][^"']*\bcharacter\b[^"']*["'][^>]*>([\s\S]*?)<\/h1>/iu,
    );
    if (!character) {
        if (/No matches found|No results found/iu.test(html)) return null;
        throw new Error("jisho_kanji_response_invalid");
    }
    if (text(character[1]) !== label) return null;
    const meanings = html.match(
        /<div\b[^>]*class=["'][^"']*\bkanji-details__main-meanings\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/iu,
    );
    if (!meanings) throw new Error("jisho_kanji_response_invalid");
    const readings = { kun: [], on: [] };
    for (const [, kind, contents] of html.matchAll(
        /<dl\b[^>]*class=["'][^"']*\b(kun|on)_yomi\b[^"']*["'][^>]*>([\s\S]*?)<\/dl>/giu,
    )) {
        if (!contents.includes("kanji-details__main-readings-list")) continue;
        readings[kind].push(
            ...Array.from(
                contents.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/giu),
                ([, reading]) => text(reading),
            ),
        );
    }
    if (!readings.kun.length && !readings.on.length)
        throw new Error("jisho_kanji_response_invalid");
    const details = {};
    for (const field of [
        "kanji-details__stroke_count",
        "grade",
        "jlpt",
        "frequency",
    ]) {
        const match = html.match(
            new RegExp(
                `<div\\b[^>]*class=["'][^"']*\\b${field}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`,
                "iu",
            ),
        );
        if (match) details[field] = text(match[1]);
    }
    const definitions = text(meanings[1]).split(/,\s*/u).filter(Boolean);
    const level = details.jlpt?.match(/N[1-5]/u)?.[0];
    return {
        slug: label,
        japanese: [
            ...new Set(
                [...readings.kun, ...readings.on].map((reading) =>
                    katakanaToHiragana(
                        reading.split(".", 1)[0].replace(/-/gu, ""),
                    ),
                ),
            ),
        ].map((reading) => ({ word: label, reading })),
        senses: [{ english_definitions: definitions, parts_of_speech: [] }],
        jlpt: level ? [`jlpt-${level.toLowerCase()}`] : [],
        tags: [],
        kanji: { readings, meanings: definitions, details },
    };
}

export function createJishoKanjiLookup({ fetchImplementation, endpoint }) {
    return async (label) => {
        const response = await requestJisho(
            fetchImplementation,
            `${endpoint}/${encodeURIComponent(`${label} #kanji`)}`,
            "text/html",
        );
        return parseJishoKanji(await readBoundedText(response), label);
    };
}

/** Prefer common exact word readings while retaining every Kanji reading. */
export function prioritizeJishoKanjiReadings(record, words, label) {
    const priorities = new Map();
    for (const word of words
        .filter(({ japanese }) => Array.isArray(japanese))
        .toSorted(
            (left, right) =>
                Number(right.is_common === true) -
                Number(left.is_common === true),
        )) {
        for (const form of word.japanese) {
            if (form.word !== label || typeof form.reading !== "string")
                continue;
            const reading = katakanaToHiragana(form.reading);
            if (!priorities.has(reading))
                priorities.set(reading, priorities.size);
        }
    }
    return {
        ...record,
        japanese: record.japanese.toSorted(
            (left, right) =>
                (priorities.get(left.reading) ?? Infinity) -
                (priorities.get(right.reading) ?? Infinity),
        ),
    };
}
