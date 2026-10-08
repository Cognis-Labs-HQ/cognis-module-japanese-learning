import { requestJisho, jishoFailureDetails } from "./jisho-request.js";
import { createJishoKanjiLookup } from "./jisho-kanji.js";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

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
const CACHE_LIMIT = 512;

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
    const layers = new Map();
    for (const layer of [...SUPPORTED_LAYERS, "definitions"]) {
        const records = [];
        const directory = path.join(contentRoot, layer);
        for (const name of (await readdir(directory)).sort()) {
            if (!name.endsWith(".json")) continue;
            const shard = JSON.parse(
                await readFile(path.join(directory, name), "utf8"),
            );
            for (const record of shard) {
                records.push(record);
            }
        }
        layers.set(layer, records);
    }
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
    const references = [...reading]
        .map((character, position) =>
            exactNativeReference(
                index,
                "characters",
                character,
                relation,
                position,
            ),
        )
        .filter(Boolean);
    return references.length === [...reading].length ? references : [];
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

function jishoSuggestion(index, layer, label, data) {
    const record = selectJishoRecord(data, label, layer === "words");
    if (!record) return null;
    const form = selectJapaneseForm(record, label);
    const canonicalLabel = form.word || form.reading;
    const readings = [
        ...new Set(
            record.japanese
                .map(({ reading }) => reading)
                .filter((reading) => reading && JAPANESE_TEXT.test(reading)),
        ),
    ];
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
    const definitions = record.senses
        .map((sense, position) => ({
            translations: { en: (sense.english_definitions ?? []).join("; ") },
            provenance: `jisho:${record.slug || encodeURIComponent(label)}:sense:${position}`,
        }))
        .filter(({ translations }) => translations.en.trim());
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
        ...(pronunciationGroups.length
            ? {
                  referenceGroups: {
                      [layer === "words" ? "reading-kana" : "single-readings"]:
                          pronunciationGroups,
                  },
              }
            : {}),
        provenance: `jisho:${record.slug || encodeURIComponent(label)}`,
        confidence: canonicalLabel === label ? 0.95 : 0.9,
    };
}

function createCachedJishoLookup({ fetchImplementation, endpoint }) {
    const cache = new Map();
    return async (label) => {
        if (cache.has(label)) return cache.get(label);
        const request = (async () => {
            const response = await requestJisho(
                fetchImplementation,
                `${endpoint}?keyword=${encodeURIComponent(label)}`,
                "application/json",
            );
            const data = await response.json();
            if (!data || !Array.isArray(data.data))
                throw new Error("jisho_response_invalid");
            return data;
        })();
        cache.set(label, request);
        if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value);
        try {
            return await request;
        } catch (error) {
            cache.delete(label);
            throw error;
        }
    };
}

export function createJishoLookupProvider({
    contentRoot,
    log,
    fetchImplementation = globalThis.fetch,
    endpoint = JISHO_ENDPOINT,
    kanjiEndpoint = "https://jisho.org/search",
}) {
    let nativeIndexPromise;
    const lookupJisho = createCachedJishoLookup({
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
            if (native.length) return native;
            if (typeof fetchImplementation !== "function") return [];
            try {
                const kanjiRecord =
                    layer.id === "alt-characters"
                        ? await lookupKanji(normalizedLookupLabel)
                        : null;
                const data =
                    layer.id === "alt-characters"
                        ? { data: kanjiRecord ? [kanjiRecord] : [] }
                        : await lookupJisho(normalizedLookupLabel);
                const suggestion = jishoSuggestion(
                    index,
                    layer.id,
                    normalizedLookupLabel,
                    data,
                );
                if (suggestion && layer.id === "alt-characters")
                    suggestion.sourceUrl = `${kanjiEndpoint}/${encodeURIComponent(`${normalizedLookupLabel} #kanji`)}`;
                return suggestion ? [suggestion] : [];
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
