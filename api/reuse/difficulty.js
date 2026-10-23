import profile from "../../data/library/difficulty.json" with { type: "json" };

/** Use the earliest supported level represented by provider or authored tags. */
export function difficultyLevel(record, native) {
    const tags = [
        ...(Array.isArray(record?.[profile.sourceField])
            ? record[profile.sourceField]
            : []),
        ...(Array.isArray(native?.tags) ? native.tags : []),
    ];
    const candidates = new Set([
        native?.fields?.difficulty_level,
        ...tags
            .filter((tag) => Object.hasOwn(profile.sourceTags, tag))
            .map((tag) => profile.sourceTags[tag]),
    ]);
    return profile.options.find(({ value }) => candidates.has(value))?.value;
}
