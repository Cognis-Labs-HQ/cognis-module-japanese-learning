import { createReferenceCatalog } from "./catalog.js";
import { loadNativeContent, jishoSuggestion } from "./index.js";

export function createReferenceProvider({
    referenceRoot,
    contentRoot,
    metadata,
    source,
    cacheRevision,
    log,
}) {
    const lookup = createReferenceCatalog(referenceRoot, "ja", log);
    let content;
    return Object.freeze({
        id: "study-language-ja:reference",
        capabilities: ["dictionary"],
        fields: ["pronunciation", "dictionary_data"],
        searchable: true,
        cacheRevision,
        metadata,
        supports: (schema, layer) =>
            schema?.id === "japanese-core" &&
            schema.language === "ja" &&
            layer?.id === "alt-characters",
        async lookup({ layer, label }) {
            if (
                layer?.id !== "alt-characters" ||
                typeof label !== "string" ||
                !/^\p{Script=Han}$/u.test(label)
            )
                return [];
            const records = await lookup(label);
            if (!records.length) return [];
            content ??= loadNativeContent(contentRoot);
            const index = await content;
            return records
                .map(
                    (record) =>
                        jishoSuggestion(
                            index,
                            layer.id,
                            label,
                            { data: [record] },
                            label,
                        ) ?? {
                            label,
                            class: "writing:kanji",
                            fields: record.japanese.length
                                ? {
                                      pronunciation: record.japanese.map(
                                          (form) => form.reading,
                                      ),
                                  }
                                : {},
                            definitions: record.senses
                                .flatMap((sense) => sense.english_definitions)
                                .slice(0, 10)
                                .map((meaning) => ({
                                    translations: { en: meaning },
                                })),
                        },
                )
                .filter(Boolean)
                .map((suggestion) => ({
                    ...suggestion,
                    provider: "study-language-ja:reference",
                    definitions: suggestion.definitions?.map(
                        (definition, position) => ({
                            ...definition,
                            provenance: `${source.id}:${label}:meaning:${position}`,
                        }),
                    ),
                    sourceUrl: source.url,
                    provenance: `${source.id}:${label}`,
                    fields: {
                        ...suggestion.fields,
                        dictionary_data: JSON.stringify({
                            provider: source.id,
                            sourceUrl: source.url,
                            license: source.license,
                            records,
                        }),
                    },
                }));
        },
    });
}
