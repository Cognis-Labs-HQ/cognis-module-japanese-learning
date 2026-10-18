const JAPANESE =
    /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヶー・ ]+$/u;

export function speechText(input) {
    for (const value of [input.label, input.readings?.[0]]) {
        if (typeof value !== "string" || value.length > 200) continue;
        const text = value.normalize("NFKC").trim();
        if (text.length && text.length <= 200 && JAPANESE.test(text))
            return text;
    }
    return undefined;
}
