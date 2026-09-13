# Cognis Japanese

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanese is a declarative Japanese content pack for the Cognis Study Library. It provides a versioned schema and validated character, definition, word, particle, and sentence records without owning API routes, persistence, or browser interfaces.

## Requirements

- Cognis with the Study gateway and Library adapter enabled.
- The `study:library` host capability.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library` capability rather than treating the adapter UUID as an independently installable component.

## Development

```sh
npm install
npm test
npm run check:manifest
```

During bootstrap, the module obtains `study:library` through `ctx` and calls `ingestContentPack` for `data/library`. Cognis owns path safety, graph validation, stable internal IDs, transactions, idempotency, persistence, API routes, and schema-generated Study interfaces.

Because the language descriptor declares no executable child pages, Cognis Study supplies the generated Library destination at `/study/library?language=ja`. The validated language query remains attached to Library links, detail navigation, direct loads, and browser history; authenticated learners may browse while Library scope rules continue to protect authoring and publishing.

The content-pack manifest records its publisher, immutable package version, content revision, schema and content paths, and license. `schema.json` declares Japanese-specific layers, typed fields, relationships, cardinality, ordering, and resolvers. Content files use stable pack-local IDs and explicit references.

Pack-local record IDs use only portable lowercase ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

The schema and pack share the `ja` namespace, and every record ID begins with `ja:`. Schema, layer, field, and relationship metadata provide localized labels in German, English, Indonesian, and Japanese. Semantic roles, typed values, detail hints, activity compatibility, interest veins, required targets, ordered positions, deletion behavior, and resolver roles allow Cognis to generate neutral interfaces and enforce the complete contract.

The external module manifest publishes `/static/modules/study-language-ja/languages` so Cognis can translate marketplace metadata before module bootstrap.

The published language descriptor provides the canonical `code` value `ja` as well as the compatible `languageCode` value. Cognis PR #215 uses that code to annotate the active language button and preserve the selected language in router history when a Study sub-navigation destination is opened.

The `definitions` dictionary layer declares module-owned definition localization with stable `japanese:definitions:*` string keys and a typed `localizedText` field. Every preseeded definition includes German, English, Indonesian, and Japanese text, so consumers resolve display strings without depending on Cognis core language data.

## Writing-unit audio and particles

Atomic and compound writing units now provide required pronunciation lists and HTTPS audio references without packaging binary media. The dedicated particle layer stores grammatical function metadata, and sentence records can preserve ordered word and particle references.

## Library-native meanings

Removed duplicate `romanization`, `reading`, `readings`, `meaning`, `function`, and definition-language fields. Pronunciation now consistently uses the Library-recognized `pronunciation` field, while kanji, words, and particles express meanings through relationships to localized definition records.

## Kana-backed kanji readings

Each kanji reading is a distinct vocabulary record whose ordered `kana-spelling` references group its exact hiragana characters. Kanji link to those reading records in pronunciation order, so multi-kana readings remain separate from one another. Katakana characters retain separate IDs and links and remain available for genuinely katakana content.

## Current Library activation contract

Character-script and JLPT badge filters now declare named, mutually exclusive filter groups supported by Library 2.6. The module intentionally does not enable `allowBootstrapFailure`: content ingestion and publication of `study:language:ja` are its essential runtime work, and keeping it enabled without them would expose a nonfunctional module. Cognis PR #216 now updates existing entries, assets, and references during repeated content-pack imports, which addresses the reported duplicate-reference failure at its persistence boundary.

## Nested kana variants

Kana variants remain within their own writing system and cover dakuten, handakuten, small kana, standard yōon contractions, and common sokuon geminations. Every contracted form links directly to the kana that supplies its primary sound: `きゃ`, `きゅ`, and `きょ` all link to `き`, while `じゃ`, `じゅ`, and `じょ` all link to `じ`. The voiced parent still links to its unvoiced form, preserving the meaningful `し` → `じ` → `じゃ` nesting.

## Latest Library presentation contract

Variant relationships have no resolver role or fixed direction. The Library dynamically assigns left, upper, or right positions and recursively unfolds nested children, while Kanji readings and word spellings retain resolver roles for navigable constituents.

## Compositions and definitions

Resolver roles are now reserved for true compositions: kanji readings, word spellings, and ordered sentence words or particles. Relationships to the semantic definition layer no longer declare a resolver, so primary and alternate definition links render as meanings instead of composition groups. Required writing-system and proficiency filters also declare intentional default tags for the latest Library filter contract.

## Complete kana tables

Alongside all 46 basic gojūon entries and 25 dakuten or handakuten forms per script, the pack includes small kana, all standard yōon series, and common sokuon geminations. Examples include `ひゃ`, `しゅ`, `じゃ`, and `って`, plus their katakana equivalents.

## Dynamic variant placement

Every character parent relationship declares only `variant: true`; none requests `variantDirection`. This lets the Library choose an available position at runtime and display nested chains without module-authored slot collisions.

## Standard kana grid

The character layer requests a five-card row and keeps each script to exactly ten rows. The last row places `を`/`ヲ` in the middle and `ん`/`ン` at the end. Extended forms stay outside the grid and unfold through their character-parent chains.

## Definition-backed cards

Aligned with the latest Library presentation contract: words, particles, and sentences now request localized definition-backed card text and every such entry has a required definition reference.

## Japanese-specific layer labels

The generated Library tabs now use module-owned subject labels: Kana for atomic characters, Kanji for compound writing units, and Vocabulary for words. Kanji readings target grouped vocabulary records rather than a flattened run of character references.

## Visible kana chart gaps

Each script owns four explicit `{ "blank": true }` cells: two in the `y` row and two in the combined `w`/`n` row. Hiragana therefore has no trailing blank row, and Katakana begins immediately at the next row boundary without inherited leading blanks.

## Compact Kana cards

Only the Kana character layer sets `minimal: true`, so the chart renders compact cards containing the primary kana label. Kanji, Vocabulary, and Sentences retain their full pronunciation, definition, metadata, and composition presentation.

## Fully resolved compound entries

Aligned ordered compounds with the latest Library preflight restrictions. Every sentence character is now covered by a contiguous ordered word or particle reference; `日本語が好き` includes the previously missing `好き` vocabulary item. Resolver relationships also declare whether they present a composition or a complete pronunciation.

## Hidden small-tsu forms

Every standalone or compound entry containing `っ` or `ッ` now sets `hidden: true`. The records remain in the pack with their existing parent references for resolution and detail use, but neither they nor their descendants can leak into the end of the directly browsable Kana chart.

## Filter-scoped Kana gaps

The four explicit chart gaps are shared between paired Hiragana and Katakana grid positions. Interleaving each corresponding script entry lets the Library filter remove the inactive script without leaving its gaps at the beginning or end of the selected chart.

## Related vocabulary

Vocabulary can declare non-compositional, intra-layer `related` references. `日本語` now points to `日本` as a related word without treating that semantic association as spelling, pronunciation, or another resolver composition.

## Complete Kana deletion graph

The `好き` vocabulary record now declares its ordered `す` and `き` Kana spelling. It therefore participates in the same reference dependency graph as every other vocabulary entry and is included when Cognis previews or performs a cascading deletion of the Kana charts.

## Stable Kana variant identities

The pack is republished for the latest Library identity safeguards. Every Kana record has a distinct content identity, and every variant reference targets a different parent record, allowing re-ingestion to rebuild stale edges without rendering a parent as its own child.

## Explicit Kana child hierarchies

Aligned with the latest Library relationship contract by marking Kana parent relationships as both variants and spatial children. The suppressed duplicate relationship section makes the explicit `usage_note` field unnecessary, so it and its four record values have been removed.

## Canonical Kanji reading vocabulary

Removed the duplicate `人` lexical record. The Kanji entry now points only to its distinct `じん`, `にん`, and `ひと` Vocabulary readings; every reading composes from matching Hiragana records and carries its own direct definition reference.
