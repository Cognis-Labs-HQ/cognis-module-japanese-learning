/** Merge compatibility spellings into the canonical Kanji's ordered reading graph. */
export function mergeReferenceRecords(records, label) {
    const ordered = [...records].sort(
        (first, second) =>
            Number(second.slug === label) - Number(first.slug === label),
    );
    const primary = ordered[0];
    const readings = [
        ...new Set(
            ordered.flatMap((record) =>
                record.japanese.map((form) => form.reading),
            ),
        ),
    ];
    const meanings = [
        ...new Set(
            ordered.flatMap((record) =>
                record.senses.flatMap((sense) => sense.english_definitions),
            ),
        ),
    ];
    return {
        ...primary,
        slug: label,
        japanese: readings.map((reading) => ({ word: label, reading })),
        senses: [{ english_definitions: meanings, parts_of_speech: [] }],
        kanji: {
            ...primary.kanji,
            readings: Object.fromEntries(
                ["kun", "on", "nanori"].map((kind) => [
                    kind,
                    [
                        ...new Set(
                            ordered.flatMap(
                                (record) =>
                                    record.kanji?.readings?.[kind] ?? [],
                            ),
                        ),
                    ],
                ]),
            ),
            meanings,
        },
    };
}
