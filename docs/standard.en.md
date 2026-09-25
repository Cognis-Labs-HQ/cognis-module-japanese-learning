# Japanese content pack standard

The Cognis Japanese module installs declarative Japanese learning records into the host-owned Study Library while remaining isolated from Library internals, databases, APIs, and browser code.

## Usage

Enable the Study gateway and Library adapter, then enable this module. Its bootstrap resolves `study:library:provider` from `ctx` and ingests `data/library`. Administrators and learners use the Library adapter's generated Study interface rather than a module-owned route.

Because the language descriptor declares no executable child pages, Cognis Study supplies the generated Library destination at `/study/library?language=ja`. The validated language query remains attached to Library links, detail navigation, direct loads, and browser history; authenticated learners may browse while Library scope rules continue to protect authoring and publishing.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library:provider` capability rather than treating the adapter UUID as an independently installable component.

## Technical specification

### Package layout

`data/library/manifest.json` identifies the pack, immutable package version, content revision, schema, content root, publisher, and license. Each immediate content directory matches a layer in `schema.json`; JSON files contain arrays of stable records.

### Schema and graph

The schema and manifest own the same `ja` namespace, and every record ID starts with `ja:`. The schema defines `characters`, `alt-characters`, `definitions`, `words`, `particles`, and `sentences` using localized metadata in German, English, Indonesian, and Japanese. Semantic roles drive neutral generated interfaces. Fields use typed values and detail render hints; layers publish activity compatibility and interest veins. Directed relationships declare localized metadata, target layers, cardinality, required targets, ordering, mandatory deletion behavior, and optional resolver roles. Ordered references carry unique non-negative positions, and every target exists in the same pack.

Pack-local record IDs use only portable lowercase ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

### Lifecycle and ownership

`bootstrap.js` obtains only public capabilities through `ctx`, asks the Library to ingest the pack, publishes the Japanese language descriptor, and logs the receipt. The host Library owns validation, namespaced IDs, transactions, idempotency, persistence, routes, and generated UI. This module registers no API or page routes and accesses no host database.

### Updates and licensing

Schema changes require a schema-version increase. Content changes require a new pack version or content revision. All bundled records use the license and attribution declared by the pack manifest.

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

A Kanji pronunciation field must link to one dedicated Vocabulary record per complete reading. Every reading-only record must be `hidden: true` and must reconstruct itself from atomic Kana through `reading-kana`; ordinary Vocabulary records must remain visible.

An opinionated compound-word pronunciation must use `pronunciation-readings` to reference the largest authored reading segments in display order. `日本語`, for example, links `にほん` to the hidden reading record associated with `日本` and `ご` to the hidden reading record associated with `語`. The visible compound must not duplicate those segments as direct atomic Kana references.

## Contextual Reading Definitions

Give every packaged reading Vocabulary record a localized definition when its usage is narrower than the writing unit that references it. The Vocabulary definition is authoritative. Leave a Vocabulary definition absent only when its meaning is genuinely identical to the source and the record is reached through a related-entry card; title-composition links and previous/next controls intentionally clear that fallback context.

## Polysemy, Homophones, and Data Ownership

Use multiple definition references only when one lexical record genuinely has multiple closely related senses. Create separate Vocabulary records for homophones whose meanings are distinct, even when their Kana labels match. All Japanese characters, vocabulary, particles, sentences, and localized meanings must live in declarative JSON under `data/library/content/`; runtime code must not embed language data.

## Complete sentence-to-Kana traversal

Every conventional lexical form in the core uses Kanji. A sentence references visible Vocabulary and particles only; visible Vocabulary composes through Kanji and hidden reading Vocabulary; each hidden reading reconstructs through atomic Kana. Tests must reject any sentence that bypasses Vocabulary, any word that bypasses Kanji or reading Vocabulary, and any reading that bypasses Kana.

## Host-normalized record controls

Match the installed Library contract before publishing: definition records are always hidden and use `class: "definition"`; ordered lexical sequences use `class: "composite"`; particles use `class: "particle"` and `editable: false`. Tests must verify these exact values so provider hashes and installed records agree after host normalization.

## Inflectional reading composition

Use `word-spelling` for a meaningful multi-Kana reading segment and `reading-kana` for each remaining single-Kana inflectional suffix, sharing contiguous positions. `reading-kana` is a composition relationship; never use partial `kana-spelling`, because that role represents a complete alternate spelling and otherwise renders the suffix as a misleading standalone pronunciation.

## Unique Used By parents

A hidden reading must not have multiple inbound records with the same display label. For a visible single-Kanji word, author a hidden complete-pronunciation wrapper owned by the lexical word and make that wrapper compose from the Kanji-reading record. The Kanji-reading card then has one Kanji parent and one differently labeled reading parent, while the wrapper has only the visible lexical parent.

## Sentence pronunciation graph

A sentence pronunciation field links to exactly one hidden complete-reading Vocabulary record through `pronunciation-readings`. That record reconstructs the entire pronunciation with contiguous `word-spelling` references to the closest hidden lexical readings and `reading-kana` references to atomic particle or non-lexical Kana. Tests must fail on any missing substring, non-hidden vocabulary target, direct sentence-to-character shortcut, or unlinked reading.

## Acyclic traversal and lexical readings

Authored study links form a directed acyclic graph and Kana characters terminate traversal. Kanji may resolve pronunciations through hidden reading Vocabulary to ordered Kana, but those readings never link back to the Kanji or its lexical users. A reading with an independent lexical meaning, such as the day-counter `か`, is visible Vocabulary with a semantic class rather than `reading:kanji`.

## Direct Kana Composition for Reading Titles

Every hidden pronunciation record composes its complete title directly from ordered atomic Kana through `reading-kana`. For reading records, this relationship uses the dedicated `composition` presentation role: do not route a reading title through `word-spelling` or the alternate-spelling relationship, because doing so creates recursive or misleading card navigation.

## Canonical Reading Graph

Package only records that participate in the current authored graph. Remove superseded hidden readings rather than preserving detached compatibility records. Visible Kanji vocabulary must link directly to ordered atomic Kana, and a Kanji may target the matching visible lexical record.

## Kanji-to-Kana Usage Dependencies

Every Kanji must add one deduplicated `reading-kana-dependency` reference to each atomic Kana occurring anywhere in its authored pronunciation list. This relationship has no presentation or resolver role: it exists only to make inverse Used By navigation symmetric after a learner follows a lexical reading to atomic Kana. Keep the normal `readings` relationship as the pronunciation field's deep-link source.

## Parent-Owned Composite Pronunciations

Only the visible sentence owns relationships among its lexical and particle children. Each visible Kanji word links through `pronunciation-readings` to exactly one hidden complete-Kana pronunciation, which reconstructs through ordered `reading-kana`. Sentence records must not reference a parallel complete-pronunciation record, and pronunciation children must never reference sibling pronunciations merely because their words share a sentence.

## Vocabulary-linked sentence title details

Set the sentence pronunciation field's `input.linkRelationships` to `["words", "particles"]`. The host must match each word's complete pronunciation as an alias while preserving the visible vocabulary entry as the link target. Do not add sentence-level pronunciation children or links between sibling word readings; each vocabulary record owns its reading path to atomic Kana independently.

## Vocabulary-owned pronunciation boundaries

When a Kanji reading occurs inside an authored visible vocabulary record, target that vocabulary from the Kanji pronunciation link. Only the vocabulary may own the complete pronunciation wrapper. Within that wrapper, link meaningful Kanji-derived spans through the closest hidden reading and link every remaining single-Kana suffix directly with `reading-kana`; never create a pronunciation record for such a suffix or connect it to an adjacent reading.

## Complete sentence pronunciation links

A sentence pronunciation input must declare every constituent relationship that can supply a displayed reading segment. Declare `linkRelationships: ["words", "particles"]` for complete resolution; the current host reads the array contract when constructing title-detail links. The host must merge those ordered references and match each target's pronunciation alias, so words open vocabulary and particles open particle records.

## Stroke pattern metadata

Every provider-authored writing-unit card must include an immutable required `strokePattern`. Use `coordinateSystem: "normalized"`; keep all point coordinates within 0–1, point times monotonic inside each ordered stroke, optional pressure within 0–1, and tolerance within 0–100. Preserve attribution for any external stroke source in content-manifest metadata.

## Runtime stroke lookup

Register one removable Library lookup provider through `study:library:provider`. Support only the Japanese schema's writing-unit layers with a declared `strokePattern` field. Resolve normalized exact labels from packaged content first. For other valid Japanese Kana or Kanji, fetch the Unicode-named SVG from the canonical KanjiVG source, bound the response, sample its ordered paths into normalized timed points, cache the result, and return it under `fields.stroke_pattern` with exact source provenance and confidence `1`. Return no suggestion for missing glyphs or non-Japanese input, and never infer stroke order with OCR.

## Jisho composer enrichment

Jisho must register only through the generic `study:library:provider.registerLookupProvider` contract and return its remover for lifecycle cleanup. Card lookup must remain native-first. Exact packaged Kana, Kanji, and Vocabulary records return their reviewed fields and relationships without network access. Jisho is queried only after a native miss, and a bounded promise cache coalesces concurrent requests and reuses successful responses. External suggestions may emit only schema-recognized fields and references to existing provider records; unavailable definitions or links must remain unset rather than being fabricated.

Runtime provider entrypoints must not import undeployed npm packages; the KanjiVG SVG path sampler is module-owned and packaged in the manifest.

Runtime bootstrap must resolve the inverse Library provider through the capability bus and register lookup providers through the returned generic surface.

Resolve the injected public `study:library:provider` first. If the host exposes that public capability only to enable validation and not to the module ctx, use the injected `study:library` service solely as the carrier of the same `registerLookupProvider` and `ingestContentPack` interface. Do not introduce a second provider protocol.
