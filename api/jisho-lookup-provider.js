import { requestJisho, jishoFailureDetails } from "./jisho-request.js";
import { createJishoKanjiLookup } from "./jisho-kanji.js";
import { readContentLayers } from "../reuse/content.js";

const PROVIDER_ID = "study-language-ja:jisho";
const SCHEMA_ID = "japanese-core";
const JISHO_ENDPOINT = "https://jisho.org/api/v1/search/words";
const SUPPORTED_LAYERS = new Set(["characters", "alt-characters", "words"]);
const JAPANESE_TEXT =
    /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々〆ヶー]+$/u;
const LOOKUP_TEXT = /^[\p{L}\p{M}\p{N}\s'’々〆ヶー-]+$/u;
const MAX_LOOKUP_LENGTH = 100;
const KANJI = /\p{Script=Han}/u;
const SINGLE_KANA = /^[\p{Script=Hiragana}\p{Script=Katakana}]$/u;
const SINGLE_KANJI = /^\p{Script=Han}$/u;

function normalizedLabel(value) {
    return String(value ?? "")
        .trim()
        .normalize("NFKC");
}

function providerMetadata() {
    return {
        labels: {
            de: "Jisho-Wörterbuch",
            en: "Jisho Dictionary",
            id: "Kamus Jisho",
            ja: "Jisho 辞書",
        },
    };
}

async function loadNativeContent(contentRoot) {
    const layers = await readContentLayers(contentRoot, [
        ...SUPPORTED_LAYERS,
        "definitions",
    ]);
    return {
        layers,
        byLabel(layer, label) {
            const identityLabel = normalizedLabel(label);
            return (layers.get(layer) ?? []).filter(
                (record) => normalizedLabel(record.label) === identityLabel,
            );
        },
    };
}

function cloneReferences(references = []) {
    return references.map(({ entryId, relation, position }) => ({
        entryId,
        relation,
        ...(Number.isInteger(position) ? { position } : {}),
    }));
}

function cloneReferenceGroups(referenceGroups = {}) {
    return Object.fromEntries(
        Object.entries(referenceGroups).map(([relation, groups]) => [
            relation,
            groups.map((group) => cloneReferences(group)),
        ]),
    );
}

function nativeSuggestions(index, layer, label) {
    return index
        .byLabel(layer, label)
        .filter(({ hidden }) => hidden !== true)
        .map((record) => ({
            provider: PROVIDER_ID,
            label: record.label,
            class: record.class,
            tags: structuredClone(record.tags ?? []),
            definitions: (record.references ?? [])
                .filter(({ relation }) => relation === "definitions")
                .map(({ entryId }) =>
                    index.layers
                        .get("definitions")
                        .find(({ id }) => id === entryId),
                )
                .filter(Boolean)
                .map((definition) => ({
                    translations: structuredClone(
                        definition.fields?.translations ?? {
                            en: definition.label,
                        },
                    ),
                    provenance: `cognis-japanese:${definition.id}`,
                })),
            fields: structuredClone(record.fields ?? {}),
            references: cloneReferences(record.references),
            referenceGroups: cloneReferenceGroups(record.referenceGroups),
            provenance: `cognis-japanese:${record.id}`,
            confidence: 1,
        }));
}

function jishoLevel(tags = []) {
    const tag = tags.find((value) => /^jlpt-n[1-5]$/i.test(value));
    return tag ? tag.slice(-2).toUpperCase() : undefined;
}

function selectJishoRecord(data, label, allowRankedFallback) {
    const records = Array.isArray(data?.data) ? data.data : [];
    return (
        records.find((record) =>
            record.japanese?.some(
                ({ reading, word }) => word === label || reading === label,
            ),
        ) ?? (allowRankedFallback ? (records[0] ?? null) : null)
    );
}

function selectJapaneseForm(record, label) {
    return (
        record.japanese.find(
            ({ reading, word }) => word === label || reading === label,
        ) ?? record.japanese[0]
    );
}

function exactNativeReference(index, layer, label, relation, position) {
    const [record] = index.byLabel(layer, label);
    return record
        ? {
              entryId: record.id,
              relation,
              ...(Number.isInteger(position) ? { position } : {}),
          }
        : null;
}

function kanaReferences(index, reading, relation) {
    const normalized = normalizedLabel(reading);
    const candidates = (index.layers.get("characters") ?? []).toSorted(
        (left, right) =>
            normalizedLabel(right.label).length -
            normalizedLabel(left.label).length,
    );
    const resolved = new Map([[normalized.length, []]]);
    for (let offset = normalized.length - 1; offset >= 0; offset -= 1) {
        for (const record of candidates) {
            const label = normalizedLabel(record.label);
            if (!label || !normalized.startsWith(label, offset)) continue;
            const tail = resolved.get(offset + label.length);
            if (!tail) continue;
            resolved.set(offset, [record, ...tail]);
            break;
        }
    }
    return (resolved.get(0) ?? []).map((record, position) => ({
        entryId: record.id,
        relation,
        position,
    }));
}

function spellingReferences(index, label) {
    return [...label].flatMap((character, position) => {
        if (!KANJI.test(character)) return [];
        const reference = exactNativeReference(
            index,
            "alt-characters",
            character,
            "spelling",
            position,
        );
        return reference ? [reference] : [];
    });
}

function definitionReferences(index, record) {
    const definitions = new Set(
        record.senses
            .flatMap(({ english_definitions: values = [] }) => values)
            .map((value) => value.trim().toLocaleLowerCase("en")),
    );
    return (index.layers.get("definitions") ?? [])
        .filter((definition) =>
            definitions.has(
                String(definition.fields?.translations?.en ?? definition.label)
                    .trim()
                    .toLocaleLowerCase("en"),
            ),
        )
        .map(({ id }) => ({ entryId: id, relation: "definitions" }));
}

function readingComposition(index, label, reading) {
    const units = [...label];
    const failures = new Set();
    const walk = (position, offset) => {
        if (position === units.length)
            return offset === reading.length ? [] : null;
        const key = `${position}:${offset}`;
        if (failures.has(key)) return null;
        const unit = units[position];
        const source = index.byLabel("alt-characters", unit)[0];
        const candidates = source
            ? (index.layers.get("words") ?? []).filter(
                  (entry) =>
                      entry.hidden &&
                      entry.class === "reading:kanji" &&
                      entry.references?.some(
                          (reference) =>
                              reference.relation === "spelling" &&
                              reference.entryId === source.id,
                      ),
              )
            : index.byLabel("characters", unit);
        for (const candidate of candidates) {
            if (!reading.startsWith(candidate.label, offset)) continue;
            const tail = walk(position + 1, offset + candidate.label.length);
            if (tail)
                return [
                    {
                        entryId: candidate.id,
                        relation: source
                            ? "pronunciation-readings"
                            : "reading-kana",
                        position,
                    },
                    ...tail,
                ];
        }
        failures.add(key);
        return null;
    };
    const references = walk(0, 0);
    return references
        ? Object.fromEntries(
              ["pronunciation-readings", "reading-kana"].flatMap((relation) => {
                  const group = references.filter(
                      (reference) => reference.relation === relation,
                  );
                  return group.length ? [[relation, [group]]] : [];
              }),
          )
        : { "reading-kana": [kanaReferences(index, reading, "reading-kana")] };
}

function jishoSuggestion(index, layer, label, data, query = label) {
    const record = selectJishoRecord(data, label, layer === "words");
    if (!record) return null;
    const form = selectJapaneseForm(record, label);
    const kanaPreferred = record.senses.some((sense) =>
        sense.tags?.includes("Usually written using kana alone"),
    );
    const canonicalLabel =
        kanaPreferred && form.reading
            ? form.reading
            : form.word || form.reading;
    let readings = [
        ...new Set(
            record.japanese
                .map(({ reading }) => reading)
                .filter((reading) => reading && JAPANESE_TEXT.test(reading)),
        ),
    ];
    if (!record.kanji) {
        const hiragana = new Set(
            readings.filter((value) =>
                /^[\p{Script=Hiragana}ー]+$/u.test(value),
            ),
        );
        readings = readings.filter((reading) => {
            if (
                !/^[\p{Script=Katakana}ー]+$/u.test(reading) ||
                record.japanese.some(({ word }) => word === reading)
            )
                return true;
            const normalized = [...reading]
                .map((character) => {
                    const code = character.codePointAt(0);
                    return code >= 0x30a1 && code <= 0x30f6
                        ? String.fromCodePoint(code - 0x60)
                        : character;
                })
                .join("");
            return !hiragana.has(normalized);
        });
    }
    const fields = {};
    if (layer === "characters") {
        fields.character_class = /\p{Script=Katakana}/u.test(label)
            ? "katakana"
            : "hiragana";
    } else if (layer === "alt-characters") {
        fields.pronunciation = readings;
    } else if (layer === "words") {
        fields.pronunciation = readings;
        const level = jishoLevel(record.jlpt);
        if (level) fields.jlpt_level = level;
    }
    fields.dictionary_data = JSON.stringify(record);
    const pronunciationGroups =
        layer === "characters"
            ? []
            : readings
                  .map((reading) =>
                      kanaReferences(
                          index,
                          reading,
                          layer === "words"
                              ? "reading-kana"
                              : "single-readings",
                      ),
                  )
                  .filter((references) => references.length);
    const definitions = record.senses.flatMap((sense, position) =>
        (sense.english_definitions ?? [])
            .flatMap((value) => value.split(/[;；]/u))
            .map((value) => value.trim())
            .filter(Boolean)
            .map((meaning, index) => ({
                translations: { en: meaning },
                provenance: `jisho:${record.slug || encodeURIComponent(label)}:sense:${position}:${index}`,
            })),
    );
    const partsOfSpeech = record.senses.flatMap(
        (sense) => sense.parts_of_speech ?? [],
    );
    const lexicalClass = [
        "verb",
        "adjective",
        "adverb",
        "pronoun",
        "counter",
        "conjunction",
        "interjection",
        "noun",
        "expression",
    ].find((value) =>
        partsOfSpeech.some((part) => part.toLowerCase().includes(value)),
    );
    const references = [];
    if (layer !== "characters")
        references.push(...definitionReferences(index, record));
    if (layer === "words")
        references.unshift(...spellingReferences(index, canonicalLabel));
    const intermediateReadings =
        layer === "words" ||
        (layer === "alt-characters" && readings.length > 1);
    const linkedEntries = intermediateReadings
        ? readings.map((reading, position) => ({
              key: `lookup-reading:${position}`,
              entry: {
                  schemaId: SCHEMA_ID,
                  layer: "words",
                  label: reading,
                  class:
                      layer === "alt-characters"
                          ? "reading:kanji"
                          : "reading:complete",
                  hidden: true,
                  fields: {
                      pronunciation: [reading],
                      ...(fields.jlpt_level
                          ? { jlpt_level: fields.jlpt_level }
                          : {}),
                  },
                  references:
                      layer === "alt-characters"
                          ? [
                                {
                                    entryId: "$root",
                                    relation: "spelling",
                                    position: 0,
                                },
                            ]
                          : spellingReferences(index, canonicalLabel),
                  referenceGroups:
                      layer === "words"
                          ? readingComposition(index, canonicalLabel, reading)
                          : {
                                "reading-kana": [
                                    kanaReferences(
                                        index,
                                        reading,
                                        "reading-kana",
                                    ),
                                ],
                            },
              },
          }))
        : [];
    const readingRelationship =
        layer === "words" ? "pronunciation-readings" : "readings";
    return {
        provider: PROVIDER_ID,
        label: canonicalLabel,
        fields,
        references,
        ...(layer === "words" && lexicalClass
            ? { class: `lexical:${lexicalClass}` }
            : {}),
        tags: [
            ...new Set([
                ...(record.tags ?? []),
                ...(record.jlpt ?? []),
                ...(record.is_common ? ["common"] : []),
            ]),
        ],
        definitions: layer === "characters" ? [] : definitions,
        sourceUrl: `https://jisho.org/word/${encodeURIComponent(record.slug || canonicalLabel)}`,
        ...(linkedEntries.length
            ? {
                  linkedEntries,
                  referenceGroups: {
                      [readingRelationship]: linkedEntries.map(({ key }) => [
                          {
                              entryId: key,
                              relation: readingRelationship,
                              position: 0,
                          },
                      ]),
                  },
              }
            : pronunciationGroups.length
              ? {
                    referenceGroups: {
                        [layer === "words"
                            ? "reading-kana"
                            : "single-readings"]: pronunciationGroups,
                    },
                }
              : {}),
        provenance: `jisho:${record.slug || encodeURIComponent(label)}`,
        confidence: record.japanese.some(
            ({ word, reading }) =>
                normalizedLabel(word) === query ||
                normalizedLabel(reading) === query,
        )
            ? record.is_common
                ? 1
                : 0.99
            : record.is_common
              ? 0.76
              : 0.75,
    };
}

function createJishoLookup({ fetchImplementation, endpoint }) {
    return async (label) => {
        const response = await requestJisho(
            fetchImplementation,
            `${endpoint}?keyword=${encodeURIComponent(label)}`,
            "application/json",
        );
        const data = await response.json();
        if (!data || !Array.isArray(data.data))
            throw new Error("jisho_response_invalid");
        return data;
    };
}

export function createJishoLookupProvider({
    contentRoot,
    cacheRevision,
    log,
    fetchImplementation = globalThis.fetch,
    endpoint = JISHO_ENDPOINT,
    kanjiEndpoint = "https://jisho.org/search",
}) {
    let nativeIndexPromise;
    const lookupJisho = createJishoLookup({
        fetchImplementation,
        endpoint,
    });

    const lookupKanji = createJishoKanjiLookup({
        fetchImplementation,
        endpoint: kanjiEndpoint,
    });

    async function nativeIndex() {
        nativeIndexPromise ??= loadNativeContent(contentRoot).catch((error) => {
            nativeIndexPromise = undefined;
            log?.("error", "Japanese lookup dataset failed to load.", {
                component: "study-language-ja",
                operation: "load_jisho_native_index",
                errorName: error?.name ?? "Error",
            });
            throw new Error("Japanese lookup dataset failed to load.");
        });
        return nativeIndexPromise;
    }

    return Object.freeze({
        id: PROVIDER_ID,
        metadata: providerMetadata(),
        capabilities: ["dictionary"],
        searchable: true,
        cacheRevision,
        fields: ["pronunciation", "jlpt_level", "dictionary_data"],
        supports(schema, layer) {
            return (
                schema?.id === SCHEMA_ID &&
                schema?.language === "ja" &&
                SUPPORTED_LAYERS.has(layer?.id)
            );
        },
        async lookup({ layer, label }) {
            const normalizedLookupLabel = normalizedLabel(label);
            if (
                !normalizedLookupLabel ||
                normalizedLookupLabel.length > MAX_LOOKUP_LENGTH ||
                !LOOKUP_TEXT.test(normalizedLookupLabel) ||
                !SUPPORTED_LAYERS.has(layer?.id) ||
                (layer.id === "characters" &&
                    !SINGLE_KANA.test(normalizedLookupLabel)) ||
                (layer.id === "alt-characters" &&
                    !SINGLE_KANJI.test(normalizedLookupLabel))
            ) {
                return [];
            }
            const index = await nativeIndex();
            const native = nativeSuggestions(
                index,
                layer.id,
                normalizedLookupLabel,
            );
            if (layer.id === "characters") return native;
            if (typeof fetchImplementation !== "function") return native;
            try {
                const kanjiRecord =
                    layer.id === "alt-characters"
                        ? await lookupKanji(normalizedLookupLabel)
                        : null;
                const data =
                    layer.id === "alt-characters"
                        ? { data: kanjiRecord ? [kanjiRecord] : [] }
                        : await lookupJisho(normalizedLookupLabel);
                return data.data.flatMap((record) => {
                    if (
                        !Array.isArray(record?.japanese) ||
                        !record.japanese.length ||
                        !Array.isArray(record.senses) ||
                        record.japanese.some(
                            (form) =>
                                !form ||
                                (form.word !== undefined &&
                                    typeof form.word !== "string") ||
                                (form.reading !== undefined &&
                                    typeof form.reading !== "string"),
                        )
                    )
                        throw new Error("jisho_response_invalid");
                    if (
                        record.senses.length &&
                        record.senses.every((sense) =>
                            sense.parts_of_speech?.includes(
                                "Wikipedia definition",
                            ),
                        )
                    )
                        return [];

                    const exactForm = record.japanese?.find(
                        ({ word, reading }) =>
                            word === normalizedLookupLabel ||
                            reading === normalizedLookupLabel,
                    );
                    const lookupLabel = exactForm
                        ? normalizedLookupLabel
                        : record.japanese?.[0]?.word ||
                          record.japanese?.[0]?.reading;
                    if (!lookupLabel) return [];
                    const suggestion = jishoSuggestion(
                        index,
                        layer.id,
                        lookupLabel,
                        { data: [record] },
                        normalizedLookupLabel,
                    );
                    if (suggestion && layer.id === "alt-characters")
                        suggestion.sourceUrl = `${kanjiEndpoint}/${encodeURIComponent(`${normalizedLookupLabel} #kanji`)}`;
                    if (suggestion)
                        suggestion.fields.dictionary_data = JSON.stringify({
                            ...JSON.parse(suggestion.fields.dictionary_data),
                            sourceUrl: suggestion.sourceUrl,
                        });
                    return suggestion ? [suggestion] : [];
                });
            } catch (error) {
                log?.("error", "Jisho lookup failed.", {
                    component: "study-language-ja",
                    operation: "lookup_jisho",
                    layerId: layer.id,
                    ...jishoFailureDetails(error),
                });
                throw new Error("jisho_lookup_failed");
            }
        },
    });
}

export function registerJishoLookupProvider(libraryProvider, options) {
    if (typeof libraryProvider?.registerLookupProvider !== "function")
        throw new Error("Jisho lookup requires study:library:provider.");
    return libraryProvider.registerLookupProvider(
        createJishoLookupProvider(options),
    );
}
