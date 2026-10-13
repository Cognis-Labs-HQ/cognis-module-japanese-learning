/** Convert standard Katakana to Hiragana without changing non-Katakana characters. */
export function katakanaToHiragana(value) {
    return [...value]
        .map((character) => {
            const code = character.codePointAt(0);
            return code >= 0x30a1 && code <= 0x30f6
                ? String.fromCodePoint(code - 0x60)
                : character;
        })
        .join("");
}
