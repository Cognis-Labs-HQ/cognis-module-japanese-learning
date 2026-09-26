# Cognis Japanese

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanese is a declarative Japanese content pack for the Cognis Study Library. It provides a versioned schema and validated character, definition, word, particle, and sentence records without owning API routes, persistence, or browser interfaces.

## Requirements

- Cognis with the Study gateway and Library adapter enabled.
- The `study:library:provider` host capability.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library:provider` capability rather than treating the adapter UUID as an independently installable component.

## Development

```sh
npm install
npm test
npm run check:manifest
```

During bootstrap, the module obtains `study:library:provider` through `ctx` and calls `ingestContentPack` for `data/library`. Cognis owns path safety, graph validation, stable internal IDs, transactions, idempotency, persistence, API routes, and schema-generated Study interfaces.

Because the language descriptor declares no executable child pages, Cognis Study supplies the generated Library destination at `/study/library?language=ja`. The validated language query remains attached to Library links, detail navigation, direct loads, and browser history; authenticated learners may browse while Library scope rules continue to protect authoring and publishing.

The content-pack manifest records its publisher, immutable package version, content revision, schema and content paths, and license. `schema.json` declares Japanese-specific layers, typed fields, relationships, cardinality, ordering, and resolvers. Content files use stable pack-local IDs and explicit references.

Pack-local record IDs use only portable lowercase ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

The schema and pack share the `ja` namespace, and every record ID begins with `ja:`. Schema, layer, field, and relationship metadata provide localized labels in German, English, Indonesian, and Japanese. Semantic roles, typed values, detail hints, activity compatibility, interest veins, required targets, ordered positions, deletion behavior, and resolver roles allow Cognis to generate neutral interfaces and enforce the complete contract.

The external module manifest publishes `/static/modules/study-language-ja/languages` so Cognis can translate marketplace metadata before module bootstrap.

The published language descriptor provides the canonical `code` value `ja` as well as the compatible `languageCode` value. Cognis PR #215 uses that code to annotate the active language button and preserve the selected language in router history when a Study sub-navigation destination is opened.

The `definitions` dictionary layer declares module-owned definition localization with stable `japanese:definitions:*` string keys and a typed `localizedText` field. Every preseeded definition includes German, English, Indonesian, and Japanese text, so consumers resolve display strings without depending on Cognis core language data.

## Writing-unit audio and particles

Atomic and compound writing units provide required pronunciation lists and an optional audio upload field. The pack no longer publishes external placeholder URLs: current Library ingestion accepts only audio files bundled as authenticated pack assets. The dedicated particle layer stores grammatical function metadata, and sentence records can preserve ordered word and particle references.

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

## Complete Kana deletion graph

The `好き` vocabulary record now declares its ordered `す` and `き` Kana spelling. It therefore participates in the same reference dependency graph as every other vocabulary entry and is included when Cognis previews or performs a cascading deletion of the Kana charts.

## Stable Kana variant identities

The pack is republished for the latest Library identity safeguards. Every Kana record has a distinct content identity, and every variant reference targets a different parent record, allowing re-ingestion to rebuild stale edges without rendering a parent as its own child.

## Explicit Kana child hierarchies

Aligned with the latest Library relationship contract by marking Kana parent relationships as both variants and spatial children. The suppressed duplicate relationship section makes the explicit `usage_note` field unnecessary, so it and its four record values have been removed.

## Canonical Kanji reading vocabulary

Removed the duplicate `人` lexical record. The Kanji entry now points only to its distinct `じん`, `にん`, and `ひと` Vocabulary readings; every reading composes from matching Hiragana records and carries its own direct definition reference.

## PR 220 module ownership contract

The module now requests trusted privilege explicitly because it publishes the standardized `study:language:ja` capability outside its module-owned namespace. Its Cognis Labs repository provenance lets the host verify that request, while Library access remains capability-based and all registrations remain lifecycle-owned.

## Closest authored Library relationships

Compositions now use the closest available records: `日本語` links to the word `日本` and Kanji `語`, while `日本` links to Kanji `日` and `本`. Ordered Kana alternate spellings provide direct links for pronunciations, and every field declares its provider-owned editor control and localized options.

## Hidden Reading Vocabulary for Kanji

A Kanji card's displayed readings link to dedicated Vocabulary records, and each reading record links onward to the Hiragana characters that reconstruct it. Reading-only Vocabulary records remain deep-linkable for definitions but are hidden from the Vocabulary browser; ordinary vocabulary stays visible.

Opinionated compound pronunciations use the largest available hidden reading segments instead of linking every Kana directly. For example, `日本語` resolves its displayed `にほんご` through the hidden `にほん` reading for `日本` and the hidden `ご` reading for `語`; only those reading records resolve onward to individual Kana.

## Contextual Reading Definitions

Hidden reading Vocabulary records carry their own four-locale definition whenever a reading has a narrower grammatical or lexical use than its source Kanji, such as `にん` as a counter for people or `じん` as a nationality suffix. Cognis may inherit a source card's localized definition only when a related-entry link opens Vocabulary without its own definition; authored definitions always win, and title-composition or previous/next navigation does not transfer fallback context.

## Expanded Core Dataset

The pack now includes more than thirty additional everyday Vocabulary records, ten additional particles, and eight fully composed example sentences, all stored as declarative JSON under `data/library/content/`. Genuine polysemy may use several localized definition references on one record (`なおす`: repair/correct), while homophones such as `はし` (bridge/chopsticks), `あめ` (rain/candy), `かみ` (paper/hair/deity), and `はな` (flower/nose) remain separate Vocabulary records with distinct definitions.

## Kanji-first core graph

The compact core now uses conventional Kanji spellings throughout. Sentences reference visible vocabulary, visible vocabulary references its Kanji and hidden pronunciation segments, and every hidden segment reconstructs from atomic Kana through the composition-only `reading-kana` relationship. For example, `私は学生` resolves through `私` → `わたし` → `わ`・`た`・`し` and `学生` → `がく`・`せい` → atomic Kana.

## Latest PR 226 record controls

The provider data now matches the latest Study Library normalization contract: definitions are hidden `definition` records, sentences are `composite` records, and particles are immutable `particle` records with `editable: false`. Lexical and reading classes remain provider-neutral and namespaced.

## Inflectional Kana composition

Hidden complete readings now distinguish meaningful reading segments from non-lexical Kana suffixes. `なおす` composes `なお` through the hidden `直` reading Vocabulary and links `す` directly to atomic Kana through the composition-only `reading-kana` relationship, preventing a partial suffix from appearing as the card's alternate pronunciation.

## Deduplicated reading parents

Single-Kanji vocabulary now uses a hidden complete-pronunciation wrapper before reaching the Kanji-reading record. For `猫`, the visible lexical card points to hidden `ねこ`, which composes through the Kanji reading; the Kanji also points to that reading. The reading's Used By list therefore contains distinct `猫` and `ねこ` parents instead of two indistinguishable `猫` cards.

## Linked sentence readings and reviewed practice batch

Every sentence pronunciation now opens a hidden complete-reading record whose segments resolve through existing hidden vocabulary and atomic particle Kana; unlinked pronunciation text is no longer the default. Eight reviewed sentences add varied practice for drinking water, studying Japanese, travel, animals, size, and walking, with new fully linked `学ぶ` and `歩く` vocabulary.

## Direct Kana Reading Titles

Hidden pronunciation records now compose their titles directly from atomic Kana through the composition-only `reading-kana` relationship. Opening a Kanji pronunciation therefore leads to individually linked Kana instead of routing back through another reading or Kanji card, and the title no longer presents an alternate-spelling detail.

## Canonical Card Graph

The content pack contains only the active canonical graph. Every Kanji pronunciation targets a dedicated Kana-only reading record; a complete vocabulary pronunciation remains separate and may add inflectional Kana. For example, `好` resolves to `す`, while the word `好き` resolves through that reading plus `き`.

## Direct Kana Usage Navigation

Kana Used By lists only immediate reading records. Kanji never point directly to atomic Kana: learners follow `あ` → `あめ` → `雨`, so unrelated words and Kanji that merely contain `あ` do not appear as direct parents.

## Parent-Owned Composite Pronunciations

Sentence cards alone own their word-and-particle composition. A sentence such as `猫が好き` references visible `猫`, `が`, and `好き`; each visible Kanji word references its one complete Kana pronunciation (`ねこ` or `すき`), which resolves onward to atomic Kana. Complete Kana readings never form a parallel sentence chain.

## Vocabulary-linked sentence readings

A sentence pronunciation uses its existing ordered `words` relationship for title-detail deep links. Each complete Kana span therefore opens the visible vocabulary record for that word, while particles remain sentence-owned constituents; the vocabulary then resolves only through its own complete reading to atomic Kana and never to adjacent sentence children.

## Kanji-to-vocabulary readings

A Kanji pronunciation links to the nearest visible vocabulary that uses it. The vocabulary alone owns the complete pronunciation record: meaningful Kanji-derived spans reuse hidden readings, while a remaining single Kana suffix links directly to the atomic Kana. Thus `好` opens `好き`, whose `すき` reading composes from the Kanji span `す` and atomic `き`; no standalone pronunciation card is created for `き`.

## Fully linked sentence pronunciations

Sentence pronunciation details use the current `linkRelationships` contract to declare both `words` and `particles` as link sources. The reading `がっこうにいく` therefore links its complete segments to visible `学校`, particle `に`, and visible `行く`, without introducing a parallel sentence-reading record.

## Stroke-guided writing practice

Every Kana and Kanji card now carries a required `strokePattern` with normalized coordinates, ordered monotonic timing samples, and a practice tolerance compatible with the latest Study Library drawing contract from Cognis PR #226. The patterns are regenerated directly from the Unicode-named KanjiVG paths with curve-preserving sampling, so turns and loops remain faithful to each displayed glyph. Source and CC BY-SA 3.0 attribution remain in the content manifest.

## Runtime stroke-pattern provider

The module registers `study-language-ja:stroke-patterns` through the Library's `study:library:provider` capability. Exact packaged Kana or Kanji labels return the reviewed `stroke_pattern` immediately. Any other Japanese Kana or Kanji is fetched from the canonical KanjiVG SVG source, converted to normalized timed strokes, cached for the session, and returned with source provenance and full confidence. Non-Japanese or unavailable glyphs return no guess; OCR is never used, and the provider unregisters cleanly when the module is disabled.

## Jisho-assisted card creation

The module registers a localized **Jisho Dictionary** composer provider directly through the generic `study:library:provider.registerLookupProvider` contract for Kana, Kanji, and Vocabulary cards. It resolves exact matches from the packaged dataset first, including every authored field and relationship. Only a cache miss queries Jisho; successful in-flight and completed responses are shared from a bounded session cache. External results populate the canonical label, pronunciations, JLPT level when available, and links to existing Kanji, complete readings, or atomic Kana without inventing records or guessing links.

The SVG path sampler is module-owned, so installed external modules do not depend on host `node_modules`.

Bootstrap consumes the inverse provider through `ctx.capabilities.require("study:library:provider")`, matching the registration pattern used by authentication providers; it does not use the legacy convenience getter.

During Cognis PR #226 rollout, bootstrap prefers the injected public `study:library:provider` capability and otherwise uses the already injected `study:library` service, which implements the identical generic `registerLookupProvider` and `ingestContentPack` surface. This avoids depending on system-ctx visibility while preserving one provider contract.

## Verified title-detail links

Every sentence pronunciation is now tested against the host title-detail resolver, so each Kana span opens its ordered Vocabulary or Particle record. Each Kanji exposes one unambiguous complete primary reading that exactly matches its adjacent Vocabulary target; additional readings remain available through a separate non-title relationship, and all Kana dependencies remain visible for inverse navigation.
