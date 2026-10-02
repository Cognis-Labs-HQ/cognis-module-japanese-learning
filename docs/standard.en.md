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

Atomic and compound writing units provide required pronunciation lists and an optional audio upload field. Content packs must bundle referenced audio as authenticated pack assets; external audio URLs are invalid and this pack does not publish placeholders. The dedicated particle layer stores grammatical function metadata, and sentence records can preserve ordered word and particle references.

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

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Contextual Reading Definitions

Give every packaged reading Vocabulary record a localized definition when its usage is narrower than the writing unit that references it. The Vocabulary definition is authoritative. Leave a Vocabulary definition absent only when its meaning is genuinely identical to the source and the record is reached through a related-entry card; title-composition links and previous/next controls intentionally clear that fallback context.

## Polysemy, Homophones, and Data Ownership

Use multiple definition references only when one lexical record genuinely has multiple closely related senses. Create separate Vocabulary records for homophones whose meanings are distinct, even when their Kana labels match. All Japanese characters, vocabulary, particles, sentences, and localized meanings must live in declarative JSON under `data/library/content/`; runtime code must not embed language data.

## Complete sentence-to-Kana traversal

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Host-normalized record controls

Match the installed Library contract before publishing: definition records are always hidden and use `class: "definition"`; ordered lexical sequences use `class: "composite"`; particles use `class: "particle"` and `editable: false`. Tests must verify these exact values so provider hashes and installed records agree after host normalization.

## Inflectional reading composition

Use `word-spelling` for a meaningful multi-Kana reading segment and `reading-kana` for each remaining single-Kana inflectional suffix, sharing contiguous positions. `reading-kana` is a composition relationship; never use partial `kana-spelling`, because that role represents a complete alternate spelling and otherwise renders the suffix as a misleading standalone pronunciation.

## Unique Used By parents

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Sentence pronunciation graph

A sentence pronunciation field links through `words` and `particles` to every ordered visible constituent card. The host matches each constituent's complete pronunciation as an alias, so each reading segment opens its Vocabulary or Particle card instead of one hidden card for the whole sentence. Sentence-level complete-reading Vocabulary records and `pronunciation-readings` groups are forbidden.

## Acyclic traversal and lexical readings

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Direct Kana Composition for Reading Titles

Every hidden pronunciation record composes its complete title directly from ordered atomic Kana through `reading-kana`. For reading records, this relationship uses the dedicated `composition` presentation role: do not route a reading title through `word-spelling` or the alternate-spelling relationship, because doing so creates recursive or misleading card navigation.

## Canonical Reading Graph

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Kanji-to-Kana Usage Dependencies

Kanji must never reference atomic Kana directly. A Kanji reaches Kana only through its complete reading record, so inverse Used By navigation exposes the immediate reading first (`あ` → `あめ` → `雨`) instead of incorrectly listing every Kanji that happens to contain that Kana.

## Parent-Owned Composite Pronunciations

Only the visible sentence owns relationships among its lexical and particle children. Each visible Kanji word links through `pronunciation-readings` to exactly one hidden complete-Kana pronunciation, which reconstructs through ordered `reading-kana`. Sentence records must not reference a parallel complete-pronunciation record, and pronunciation children must never reference sibling pronunciations merely because their words share a sentence.

## Vocabulary-linked sentence title details

Set the sentence pronunciation field's `input.linkRelationships` to `["words", "particles"]`. The host must match each word's complete pronunciation as an alias while preserving the visible vocabulary entry as the link target. Do not add sentence-level pronunciation children or links between sibling word readings; each vocabulary record owns its reading path to atomic Kana independently.

## Vocabulary-owned pronunciation boundaries

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Complete sentence pronunciation links

A sentence pronunciation input must declare every constituent relationship that can supply a displayed reading segment. Declare `linkRelationships: ["words", "particles"]` for complete resolution; the current host reads the array contract when constructing title-detail links. The host must merge those ordered references and match each target's pronunciation alias, so words open vocabulary and particles open particle records.

## Stroke pattern metadata

Every provider-authored writing-unit card must include an immutable required `strokePattern`. Use `coordinateSystem: "normalized"`; keep all point coordinates within 0–1, point times monotonic inside each ordered stroke, optional pressure within 0–1, and tolerance within 0–100. Preserve attribution for any external stroke source in content-manifest metadata. Generate packaged patterns from the Unicode-named KanjiVG paths with enough cubic and quadratic subdivisions to preserve every directional turn and loop; sparse endpoint-only approximations are invalid.

## Runtime stroke lookup

Register one removable Library lookup provider through `study:library:provider`. Support only the Japanese schema's writing-unit layers with a declared `strokePattern` field. Resolve normalized exact labels from packaged content first. For other valid Japanese Kana or Kanji, fetch the Unicode-named SVG from the canonical KanjiVG source, bound the response, sample its ordered paths into normalized timed points, cache the result, and return it under `fields.stroke_pattern` with exact source provenance and confidence `1`. Return no suggestion for missing glyphs or non-Japanese input, and never infer stroke order with OCR.

## Jisho composer enrichment

Jisho must register only through the generic `study:library:provider.registerLookupProvider` contract and return its remover for lifecycle cleanup. Card lookup must remain native-first. Exact packaged Kana, Kanji, and Vocabulary records return their reviewed fields and relationships without network access. Jisho is queried only after a native miss, and a bounded promise cache coalesces concurrent requests and reuses successful responses. External suggestions may emit only schema-recognized fields and references to existing provider records; unavailable definitions or links must remain unset rather than being fabricated.

Runtime provider entrypoints must not import undeployed npm packages; the KanjiVG SVG path sampler is module-owned and packaged in the manifest.

Runtime bootstrap must resolve the inverse Library provider through the capability bus and register lookup providers through the returned generic surface.

Resolve the injected public `study:library:provider` first. If the host exposes that public capability only to enable validation and not to the module ctx, use the injected `study:library` service solely as the carrier of the same `registerLookupProvider` and `ingestContentPack` interface. Do not introduce a second provider protocol.

## Resolvable title details

For every pronunciation-bearing sentence and Kanji, replay the host alias-composition algorithm in tests. All linked targets, in relationship position order, must concatenate exactly to the displayed pronunciation. A Kanji title exposes one primary dedicated Kana-only reading; store additional readings outside the pronunciation field and its `input.linkRelationships` path so they cannot make every title link fail as one concatenated chain.

## Current recursive pronunciation contract

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Complete pronunciation paths

Every Kanji-spelled vocabulary item links its writing to packaged Kanji and routes its pronunciation through one hidden complete-pronunciation record. Those records preserve the closest available Kanji-reading segments and use atomic Kana only for inflections or spans without an authored Kanji reading. Sentence pronunciations similarly route through one hidden complete record assembled from word pronunciations and particle Kana. Runtime Jisho suggestions enforce layer-specific scripts, never emit partial Kana groups, and attach available Kanji spelling links.

### Shared homophone pronunciation cards

When multiple distinct Kanji vocabulary records have exactly the same complete Kana pronunciation, they may share one hidden structural pronunciation card. The shared card reconstructs the reading directly from atomic Kana and carries no definitions. Each visible vocabulary retains a definition only when it differs from its Kanji parent; otherwise definition display falls back through the spelling relationship.

## Stable inter-layer card traversal

Relationships, never same-label discovery, define card traversal. A Vocabulary reading may link to another Vocabulary record only when that target represents a strictly smaller reading segment; identically labeled Vocabulary-to-Vocabulary reading links are forbidden. Complete single-Kanji pronunciation wrappers therefore reconstruct directly through ordered atomic Kana, while compounds retain links to smaller authored Kanji-reading segments and inflectional Kana. Hidden reading and pronunciation records are structural and carry no definitions. Visible vocabulary keeps a definition only when its lexical meaning differs from the referenced Kanji; otherwise its spelling relationship supplies the parent definition. The host suppresses a sole definition whose normalized text exactly equals a Vocabulary card's primary label.

## Kanji pronunciation coverage

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Reviewed location and manner batch

The reviewed beginner batch adds `ここ`, `そこ`, `どこ`, `いる`, `ある`, `きれい`, `とても`, `ゆっくり`, and `です`, plus eight varied sentences about locations, existence, questions, appearance, and manner. Every new word has a localized definition and ordered Kana spelling; every sentence has an exact localized meaning, ordered lexical composition, and a complete hidden pronunciation path.

## Destructive Uninstall Cleanup

Disabling the module and ordinary uninstall cleanup retain every imported Japanese record. Only the host uninstall hook's explicit `deleteContent: true` option may call the Study Library provider's `deleteContentPack` operation; that provider owns transactional relationship cascading and must report failure before Cognis removes the module. The administrative `DELETE /api/v1/modules/study-language-ja/config` compatibility route only clears module-local configuration (the module has none) and therefore returns `204` without touching learning content.

## Vocabulary Card Definitions

The Cognis Library card renderer reads definitions only from an entry's direct definition relationships; it does not inherit a definition through a Kanji spelling relationship. Every visible Kanji-spelled Vocabulary record therefore references a definition directly, even when its meaning is identical to its Kanji writing record. Hidden structural pronunciation records remain definition-free.

## Jisho Query Validation

Vocabulary lookup accepts bounded Japanese or Latin search terms, including multiword English glosses, and uses Jisho's highest-ranked result when no Japanese spelling exactly matches the query. Kana and Kanji layers remain restricted to one valid character because their suggestions must preserve the selected writing-unit layer. Invalid punctuation, control input, and oversized queries are rejected before network access.

## Base Verbs, Adverbs, and Transformations

The Vocabulary layer separates tagged base-form verbs and adverbs into provider-named transformation views. Every verb carries the `verb` tag plus exactly one conjugation-family tag; the schema distinguishes ichidan, regular godan endings, the exceptional `行く` and `ある` patterns, and irregular `来る`. Deterministic rules derive polite, negative, past, and te forms at presentation time. Japanese adverbs carry only `adverb` and remain invariant, so their transformation view shows the canonical base card without fabricated inflections. The content pack never stores generated verb forms or derived adverb cards.

## Complete Japanese Pronunciation Rendering

Atomic Kana keep Hepburn romanization for their own cards, but recursive pronunciation derivation must use each Kana label. Every Kanji, Vocabulary, Particle, and Sentence pronunciation remains Japanese text from beginning to end. Segmented sentence readings must preserve and visibly render the complete concatenated value; title layout may wrap or shrink it but must never clip its final constituent.

## Atomic Kana Reading Titles

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Multi-Kana Titles and Small-Form Geometry

Every multi-symbol Kana record declares an explicit `character-title` composition to its atomic Kana, preventing generic label matching from deep-linking to a same-labeled hidden Vocabulary reading. Compound stroke layouts allocate a narrower horizontal slot to small Kana such as `ゃ`, `ゅ`, `ょ`, and `っ`; full-size components retain the larger slot, so yōon and geminated practice patterns preserve their conventional relative sizes.

## Sentence links without sentence Vocabulary impostors

Sentence pronunciation links each ordered reading segment to its existing visible Vocabulary or Particle constituent through `linkRelationships: ["words", "particles"]`. Complete sentence pronunciations must never be stored as Vocabulary records; Vocabulary also cannot carry sentence, composite, or particle structures.

## Selective Kanji reading intermediates

A Kanji with one pronunciation links directly to ordered atomic Kana. A Kanji with multiple pronunciations uses exactly one hidden `reading:kanji` Vocabulary record per reading; that record links its title to the single source Kanji through `spelling` and reconstructs its pronunciation through ordered `reading-kana`. It carries direct definition links so pronunciation deep links remain self-contained: reuse the source Kanji definitions when meanings are identical, and use reading-specific definitions when the reading is narrower. Never create a reading record for a concatenated compound pronunciation such as `せんせい`; compound words reuse separate segments such as `せん` and `せい`.

## Deep branching transformations

Verb transform sets now form deep branching pathways from each canonical base card. Branches cover polite negative and past forms, negative past and connective forms, causative, passive, potential, volitional, and multi-step causative desire chains. Every rule independently transforms the written form and pronunciation; localized definition overrides explain semantic branches. Adverbs remain canonical invariant base cards, and no generated form is stored as a Vocabulary entry.

Verb transformations use the Cognis 2.24 `definitionTransform` contract. Each localized rule declares a removable definition boundary and a template using `{{ definition }}`, `{{ stem }}`, `{{ prefix }}`, or `{{ suffix }}`; templates compose along deep paths. Stored definitions remain ordinary text without transformation placeholders. Thus `見る` keeps separate `to see` and `to watch` definitions while its desire path renders `to (want to) see` and `to (want to) watch`.

Context-sensitive branches use localized ordered `replacements` before their fallback templates. Later rules can therefore rewrite an earlier annotation—for example, `to (want to) see` becomes `to (have wanted to) see`—while connective rules append to the fully transformed definition as `to (want to) see (and then)`.

Stroke patterns now publish explicit logical columns and ordered per-character stroke groups. The Cognis aspect-preserving Drawing viewport can size compound characters without distortion, retain intentional spacing, and test the next stroke against the correct character boundary instead of treating the entire pattern as one undifferentiated sequence.

## Kanji Identity and Conflicts

Normalize Kanji labels with NFKC for lookup and identity comparison. Do not include pronunciation in visible Kanji identity and do not infer equality from a shared reading. A `content_conflict` for an alternate-character creation therefore means that the same normalized Kanji label is visible in the destination or global scope; the host must expose the conflict entry ID so the existing card can be selected even when filters hide it.

## Sentence Structure Vocabulary

Declare sentence composition explicitly through the sentence layer's `cardConstructor`. Keep ordinary word and particle targets in `input_carousels`, place visible structural vocabulary in a `tag_carousels` entry using the `sentence-structure` tag and `words` relationship, and publish Japanese punctuation through a repeatable `literal_carousels` entry. Tag only lexical structure words such as the copula `です`; particles remain particles and ordinary predicates remain ordinary vocabulary.

## Connector and Copula Coverage

The sentence-structure inventory must include reviewed coordinating, contrastive, and consequential connectors rather than only one copula. Every tagged connector remains visible Vocabulary, resolves its complete reading through atomic Kana, carries localized definitions, and is used by an authored sentence. Model `だ` as the sole stored plain copula base and derive its polite, past, and negative branches through a localized `copula` transform set; do not store `だった` or the other generated branches as Vocabulary records.
