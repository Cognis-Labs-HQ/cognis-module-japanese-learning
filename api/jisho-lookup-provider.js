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
            return (layers.get(layer) ?? []).filter(
                (record) => record.label.normalize() === label,
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

function wordReferences(index, reading) {
    return kanaReferences(index, reading, "reading-kana");
}

function kanjiReferences(index, readings) {
    if (readings.length !== 1) return [];
    return kanaReferences(index, readings[0], "single-readings");
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
        fields.pronunciation = readings.slice(0, 1);
    } else if (layer === "words") {
        const level = jishoLevel(record.jlpt);
        if (level) fields.jlpt_level = level;
    }
    const pronunciationReferences =
        layer === "words"
            ? wordReferences(index, form.reading)
            : layer === "alt-characters"
              ? kanjiReferences(index, readings)
              : [];
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
        ...(pronunciationReferences.length
            ? {
                  referenceGroups: {
                      [layer === "words"
                          ? "reading-kana"
                          : pronunciationReferences[0].relation]: [
                          pronunciationReferences,
                      ],
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
            const response = await fetchImplementation(
                `${endpoint}?keyword=${encodeURIComponent(label)}`,
                {
                    headers: { accept: "application/json" },
                    signal: AbortSignal.timeout(15000),
                },
            );
            if (!response.ok) throw new Error("jisho_request_failed");
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
}) {
    let nativeIndexPromise;
    const lookupJisho = createCachedJishoLookup({
        fetchImplementation,
        endpoint,
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
        supports(schema, layer) {
            return (
                schema?.id === SCHEMA_ID &&
                schema?.language === "ja" &&
                SUPPORTED_LAYERS.has(layer?.id)
            );
        },
        async lookup({ layer, label }) {
            const normalizedLabel = String(label ?? "")
                .trim()
                .normalize();
            if (
                !normalizedLabel ||
                normalizedLabel.length > MAX_LOOKUP_LENGTH ||
                !LOOKUP_TEXT.test(normalizedLabel) ||
                !SUPPORTED_LAYERS.has(layer?.id) ||
                (layer.id === "characters" &&
                    !SINGLE_KANA.test(normalizedLabel)) ||
                (layer.id === "alt-characters" &&
                    !SINGLE_KANJI.test(normalizedLabel))
            ) {
                return [];
            }
            const index = await nativeIndex();
            const native = nativeSuggestions(index, layer.id, normalizedLabel);
            if (native.length) return native;
            if (typeof fetchImplementation !== "function") return [];
            try {
                const data = await lookupJisho(normalizedLabel);
                const suggestion = jishoSuggestion(
                    index,
                    layer.id,
                    normalizedLabel,
                    data,
                );
                return suggestion ? [suggestion] : [];
            } catch (error) {
                log?.("error", "Jisho lookup failed.", {
                    component: "study-language-ja",
                    operation: "lookup_jisho",
                    layerId: layer.id,
                    errorName: error?.name ?? "Error",
                });
                return [];
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
