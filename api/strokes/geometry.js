const SMALL_KANA = new Set([..."ぁぃぅぇぉゃゅょっゎァィゥェォャュョッヮヵヶ"]);

export function characterViewport(characters, index) {
    const widths = characters.map((character) =>
        SMALL_KANA.has(character) ? 0.35 : 0.65,
    );
    const total = widths.reduce((sum, width) => sum + width, 0);
    return {
        width: widths[index] / total,
        offset:
            widths.slice(0, index).reduce((sum, width) => sum + width, 0) /
            total,
    };
}
