# Scoped Study Library

**Feature Branch:** work

## Multi-Layer Library

Replaced the packaged-file library with the database-backed Study library from Cognis PR #196, including nine validated layers, reference tracing, scoped access, JSON and Anki interchange, and reviewed push requests.

## Library Browser

Updated the localized library page to browse populated global layers through the host page composer.

## Consumer-Selectable Templates

Consumers can clone only the canonical library layers they need. Relationship metadata retains valid links and required dependencies, while word and sentence creation can infer appropriate links.

## Module-Owned API Routes

Moved every library endpoint into the module-owned API namespace so Cognis can enable the module without rejecting protected Study gateway routes.

## Localized Study Navigation

Restored the Japanese Study sub-navigation on the library page, localized all three child-page labels from the module bundle, and routed clicks through the Cognis host router on every Japanese Study page.

## Declarative Japanese Content Pack

Realigned the module with the revised Cognis Library 2.1 contract. Japanese data now ships as a versioned schema and declarative content graph ingested through `study:library`; the host owns validation, persistence, routes, and generated UI, so the duplicated module Library service, database, APIs, and pages were removed.

## Capability-Based Library Dependency

Removed the Library adapter UUID from component dependencies because Study adapters are not independently installable components. The module now depends on the Study gateway component and discovers the Library exclusively through the required `study:library` capability.

## Portable Content Identifiers

Replaced kanji glyphs in record IDs with stable ASCII identifiers while retaining the glyphs as labels, then advanced the content-pack version and revision so corrected bytes can be ingested safely.

## Language-Scoped Generated Navigation

Aligned the declarative Japanese descriptor with Cognis PRs #196 and #213 by explicitly declaring no executable child pages. Study now supplies the generated learner-visible Library destination and preserves the validated `ja` language context across browsing and history navigation.

## Versioned Neutral Schema Contract

Aligned with Cognis PR #214 by adding namespace ownership, localized schema metadata, semantic layer roles, expanded field types, detail hints, activity and interest discovery tags, required relationship targets, explicit deletion behavior, resolver roles, and strictly positioned ordered references. The language descriptor now publishes the immutable package identity.

## Strict Lowercase Content IDs

Katakana record IDs now use lowercase ASCII exclusively, allowing the host to accept every record instead of aborting activation with `invalid_content_record`. The pack version and content revision were advanced so Cognis ingests the corrected data.

## Republished With Strict Preflight Validation

The corrected pack was republished as version `2.1.2` with content revision `2026-09-05.4` so installations cannot reuse cached invalid pack bytes. Standalone tests now mirror the host prerequisites for string IDs, the `ja:` prefix, lowercase portable characters, and non-empty string labels.

## Language Code for Study Sub-Navigation

The language descriptor now publishes canonical `code: "ja"` alongside the compatible `languageCode`. This lets Cognis PR #215 annotate the spawned active-language button with the Japanese code and carry that selection through router history to subsequent Study destinations without URL query parameters.

## Resolvable Localized Dictionary Definitions

The `definitions` layer now follows the dictionary contract from Cognis PR #196. It declares `definitionLocalization`, stable module-owned string keys, and a typed localized-text field. Every preseeded definition contains German, English, Indonesian, and Japanese strings; the schema and package advance to versions `3` and `2.2.0` for the immutable structural change.

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

## Commits

- [a6fa75d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a6fa75d15c478b1d8ef1930dcc3c5c29e3938b97)
- [33cf20c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/33cf20c040c55a177efe83fa6d14674491da2254)
- [ddd8464](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddd84646f1930ea660f469e4b1776219558e1e5b)
- [7048e41](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7048e4155bb52132741016c35371f0e0c215d67e)
- [131afdf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/131afdf5125a3eebae584a2c4729bd0a1b144654)
- [db6df0a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db6df0a0d71e75892cac726991ab0d5fa9edf172)
- [530fdfd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/530fdfdb7cb55b05d316d404ab8e64c33ba0b04c)
- [549322e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/549322e5e597f186c36ada77d330921e7b335a4d)
- [1740b0b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1740b0b0da93d15c450ca82c452bb1fe8698b7e9)
- [4639371](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4639371d8fe55c71477aa70087cc4e8a18100438)
- [e9ae382](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e9ae382be9ed7fd23b4a323f081904ad9137410f)
- [92032ec](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92032ecd30c7bee0dbcb76007108ef12e6a892e8)
- [b9f3e6e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b9f3e6eb6813d99d5ee76902729bc478fe36afd1)
- [90bac12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/90bac12fb8d4c90451b6a0ae2e9c0572be99cbd0)
- [4a0b288](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4a0b28830b5a1d6fcea2df490e74e99108d1e4dd)
- [32b43de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32b43dec923a4fc7a62401bb21b5b01259cb311e)
- [c7a745f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c7a745f39078cb5cb4d4206ce20a855aed195a22)

- [5ab8006](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5ab80067e1e3151a86f648cedf7660167a1f6f15)

- [32ac841](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32ac8416bbf3676b3cecdde536e645e24941f81a)

- [ed1fd35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ed1fd35e5235f79773ba91bd1d28377365509e2b)

- [e5c86a4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5c86a4cf17408e92c5021015ff4404c2e5802b6)

- [2a56248](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a562481c79002aa62a1ab51de91b7543c1acd18)

- [f6ace9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f6ace9e86c0c27634edeba5ffb98e429bfd2be4f)

- [64682aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64682aa25ecd32bf106613dec2b8a26812e1fba5)

- [06f4b09](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/06f4b09449d44ca464c31f11464fd474bddf4fcd)

- [0912c79](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0912c79cff5ba0fce67cd2c9ec6e10da11331a64)

- [a8e559e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a8e559e3bfad5bbf1c1778dd4a9505c83bc04f8d)

- [7f8cc35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7f8cc35b43f92480c77dba4807bf4f237e4ebd8d)

- [e5eae65](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5eae656076a0bcb31c74e7f388c06b4ed790815)

- [6677a4f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6677a4f80b97c2d3f056b189002e2c0f30f88e22)

- [b314603](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b314603e775c02a12ee16c3c718618a4077125bc)

## Filter-scoped Kana gaps

The four explicit chart gaps are shared between paired Hiragana and Katakana grid positions. Interleaving each corresponding script entry lets the Library filter remove the inactive script without leaving its gaps at the beginning or end of the selected chart.

- [eaae470](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eaae470ad48226b0f1c3e931748511eae7178bb1)

## Complete Kana deletion graph

The `好き` vocabulary record now declares its ordered `す` and `き` Kana spelling. It therefore participates in the same reference dependency graph as every other vocabulary entry and is included when Cognis previews or performs a cascading deletion of the Kana charts.

- [408a5c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/408a5c957033a9200286e9fed7e9a6d0fbfa3873)

## Stable Kana variant identities

The pack is republished for the latest Library identity safeguards. Every Kana record has a distinct content identity, and every variant reference targets a different parent record, allowing re-ingestion to rebuild stale edges without rendering a parent as its own child.

- [01606c4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/01606c49ade781db72f6652ca779517732eed7a6)

## Explicit Kana child hierarchies

Aligned with the latest Library relationship contract by marking Kana parent relationships as both variants and spatial children. The suppressed duplicate relationship section makes the explicit `usage_note` field unnecessary, so it and its four record values have been removed.

- [6734506](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/67345060175f87f4a73e1f07598efcb2df814edb)

## Canonical Kanji reading vocabulary

Removed the duplicate `人` lexical record. The Kanji entry now points only to its distinct `じん`, `にん`, and `ひと` Vocabulary readings; every reading composes from matching Hiragana records and carries its own direct definition reference.

- [986261f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/986261f57188d939eb014e4f07eb2d90ed85059d)

## PR 220 module ownership contract

The module now requests trusted privilege explicitly because it publishes the standardized `study:language:ja` capability outside its module-owned namespace. Its Cognis Labs repository provenance lets the host verify that request, while Library access remains capability-based and all registrations remain lifecycle-owned.

- [d1efe4b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d1efe4b52184c4cdc77843441c2dfa7948339afe)

## Closest authored Library relationships

Compositions now use the closest available records: `日本語` links to the word `日本` and Kanji `語`, while `日本` links to Kanji `日` and `本`. Ordered Kana alternate spellings provide direct links for pronunciations, and every field declares its provider-owned editor control and localized options.

- [8e8323e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e8323e9d435685a54cbdd0ae87b56391d637ff2)

## Direct Kana Links for Kanji Pronunciations

Kanji cards with multiple readings now resolve every displayed pronunciation directly to its constituent Hiragana records. Vocabulary reading records remain available for definitions and study without creating recursive pronunciation links.

- [f3faf6c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3faf6ccbd41bd5709996a9b7d6fb31174a2c437)

## Hidden Kanji Reading Vocabulary

Kanji pronunciations now link to one complete Vocabulary reading apiece, and each reading continues to its ordered atomic Kana spelling. Reading-only Vocabulary records are hidden from browsing while remaining deep-linkable; all ordinary Vocabulary records remain visible.

- [cb5c46a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cb5c46a541006afea645504178fd86f788b4565f)

## Authored Compound Pronunciation Segments

Opinionated compound pronunciations now deep-link through the largest authored hidden reading records rather than directly through atomic Kana. `日本語` resolves `にほんご` as the hidden `にほん` reading associated with `日本` followed by the hidden `ご` reading associated with `語`; those records then resolve to ordered Kana.

- [eff02dd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eff02dd26396e0198e63e51b24758701f05d00d2)

## Contextual Vocabulary Definitions

Hidden Kanji-reading Vocabulary now owns four-locale definitions for narrower uses such as the `にん` people counter and `じん` nationality suffix instead of reusing broad Kanji meanings. The authoring standard reserves Cognis's source-definition fallback for genuinely identical meanings reached through related-entry navigation, because title composition and previous/next navigation intentionally clear that context.

- [d52fcb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d52fcb2578d7854a9e36361a5077dc2276e05115)

## Dramatically Expanded Declarative Dataset

Added more than thirty everyday Vocabulary records, ten particles, and eight fully composed sentences with four-locale definitions, all as data-only JSON. Genuine polysemy uses multiple definitions on one record (`なおす`), while homophones such as bridge/chopsticks `はし`, rain/candy `あめ`, and paper/hair/deity `かみ` remain distinct Vocabulary records with independent meanings.

- [a538833](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a538833e990505cad9b817cb9995b1cf2b8bab5e)

## Restored Reviewed Core and Kana Links

Removed the unreviewed comprehensive particle, generated Kanji, sentence, and reading additions, returning the pack to its compact reviewed inventory. Every retained record now carries its contract class and passes layer-shaped linkage checks. Kana-primary cards remain Kana: `せんせい` links directly to `せ`, `ん`, `せ`, and `い`, and no disconnected teacher-reading card is exposed.

- [70b6951](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/70b6951274722f1506bb75dfd9db0bc808f70651)

## Complete Kanji-to-Kana Traversal

Every visible core Vocabulary record now uses its conventional Kanji form and connects through the full authored graph. Sentences reference only visible Vocabulary and particles; Vocabulary references Kanji and hidden reading segments; hidden readings reconstruct from ordered atomic Kana. `私は学生` now follows `私` → `わたし` → `わ`・`た`・`し`, `は`, and `学生` → `がく`・`せい` → `が`・`く`・`せ`・`い`. Regression tests reject every skipped layer.

- [65ff45a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/65ff45affebb7a647d7ee3012eb9e8999e4de7b0)

## Latest PR 226 Record Controls

Aligned provider records with the latest Study Library external-package contract. Definitions are explicitly hidden with the host-reserved `definition` class, sentences use the `composite` class, and particles use the `particle` class with `editable: false`. Contract tests verify these normalized values before ingestion so installed records and provider hashes remain consistent.

- [e74c036](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e74c0362e8a1fb9e15bdc58b80c2e1c7eb0d07f3)

## Correct Inflectional Reading Composition

Hidden complete readings now use the composition-only `reading-kana` relationship for non-lexical Kana suffixes instead of misusing partial `kana-spelling` as an alternate pronunciation. The `なおす` reading composes meaningful `なお` through the hidden `直` reading Vocabulary and links its single `す` suffix directly to atomic Kana, so the card no longer presents only the latter half as a pronunciation.

- [1bb8457](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1bb84576d96472bba37b33163a9fbc3b292954ab)

## Deduplicated Reading Parents

Single-Kanji lexical records now point to dedicated hidden complete-pronunciation wrappers, which compose from the underlying Kanji-reading Vocabulary. A reading such as `ねこ` is therefore used by the Kanji `猫` and a differently labeled hidden `ねこ` wrapper rather than by two visually identical `猫` cards. A whole-graph regression test rejects duplicate-labeled parents for every hidden reading.

- [d5c257d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d5c257df1f91978090c7e9ea9f85ded883847c06)

## Fully Linked Sentence Pronunciations

Every sentence pronunciation now resolves through a hidden complete-pronunciation record. Lexical spans use the closest hidden word readings, while particles and other nonlexical single Kana link directly through `reading-kana`; tests reject unreconstructed text. Eight reviewed, varied practice sentences and the fully linked vocabulary for `学ぶ` and `歩く` extend the curriculum without template-generated filler.

- [d90876c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d90876c607bf4a34f628d27429e38264943f1c2d)

## Acyclic Reading Semantics

The lexical day-counter `か` is now visible `lexical:counter` Vocabulary rather than a hidden Kanji-reading implementation record. New whole-graph checks reject forward composition cycles and require Kana to terminate study-link traversal. The remaining duplicate-label back-navigation concern is recorded as a Study Library host follow-up because the module must retain the required word-to-Kanji spelling edge.

- [07f7a0c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/07f7a0c2e298debdc71965f63a380f5f84fc8c37)

## Direct Kana Reading Navigation

Hidden pronunciation titles now compose directly from their individual atomic Kana links. Opening a Kanji reading no longer routes through another Kanji-derived reading card or exposes the alternate spelling in the card-title detail.

- [631e76b6c2471aff02f37e982ece772fe7ad266c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/631e76b6c2471aff02f37e982ece772fe7ad266c)

## Enable-Safe Reading Composition

Reading titles now use the schema's dedicated `reading-kana` composition relationship, while `kana-spelling` retains its supported alternate-spelling role. This preserves direct Kana title navigation without causing content-pack validation to reject module enablement.

- [2187c82db49d331797cbb015e4665ad7ccb5264b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2187c82db49d331797cbb015e4665ad7ccb5264b)

## Canonical Vocabulary and Kana Cards

Removed redundant pronunciation Vocabulary wrappers. Visible Kanji vocabulary now links directly to Kanji and atomic Kana, Kanji readings prefer the matching visible lexical entry such as `猫`, and remaining hidden readings use the pronunciation class instead of appearing as Kanji. Kana cards now carry one writing-system badge without a duplicate class tag.

- [697459a2379a0d11ce7fcc1ad947dacbe7d556a3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/697459a2379a0d11ce7fcc1ad947dacbe7d556a3)

## Ingestible Content Shards

Removed two empty Vocabulary JSON shards left after reading normalization. Every discovered content file now contains at least one record, preventing the Study Library importer from attempting to inspect an undefined record during module activation.

- [423a3250facb90f3435fc28faee469aa63bacceb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/423a3250facb90f3435fc28faee469aa63bacceb)

## Restored Ingestible Reading Graph

Reverted the broad lexical graph rewrite that caused Study Library activation to fail inside its database transaction. The pack again uses the previously ingestible layered reading structure while retaining the supported `reading-kana` composition correction, and advances to a fresh content revision so the host retries ingestion.

- [3ab7d2577f18d204465863ce3c820b8fe153d8be](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ab7d2577f18d204465863ce3c820b8fe153d8be)

## Incremental Canonical Card Migration

Applied the simplified card graph without deleting provider records that may already exist in an installation. Current Kanji and Vocabulary cards link directly to the intended lexical, Kanji, and Kana endpoints; superseded hidden readings are detached but retained for safe database updates. Reading-only cards no longer claim the Kanji class, and Kana cards no longer repeat their writing-system tag.

- [997392f71fd178e43599bc8d27be786839b98b8b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/997392f71fd178e43599bc8d27be786839b98b8b)

## Schema Upgrade Installation Workaround

Advanced the Japanese content schema to revision 46 so Cognis inserts the sanitized schema instead of exercising PR #226's broken same-version schema update command. The host follow-up is documented precisely: that command supplies `values` although the structured database gateway requires `set`, causing the reported `Object.entries(undefined)` failure on PostgreSQL.

- [bb20511152a80522055af67e6895ff28e5d9b8c8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bb20511152a80522055af67e6895ff28e5d9b8c8)

## Purged Superseded Reading Data

Removed all 48 obsolete hidden reading records instead of retaining detached compatibility data. The package now contains only the active canonical graph, reducing the Vocabulary inventory from 133 to 85 records while preserving direct Kanji, lexical, and atomic-Kana navigation.

- [b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4)

## Symmetric Kanji and Kana Usage

Added non-presentational dependencies from every Kanji to every atomic Kana used by its readings. After following `日` through the lexical day-counter `か` to atomic `か`, the Kana card now lists `日` in Used By; the same invariant is enforced across the complete Kanji inventory.

- [0fcae71e11836dbce3361184c378e46a2ee0d430](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0fcae71e11836dbce3361184c378e46a2ee0d430)

## Logical Composite Pronunciation Links

Replaced character-by-character sentence title links with reviewed lexical and particle segments. Complete pronunciations now reuse canonical hidden word-reading segments and whole particles; for example, `ちいさいねこがすき` links as `ちいさい`・`ねこ`・`が`・`すき`, with each word resolving onward to atomic Kana.

- [973980b8e821218608836970f51a0eefc75bfb11](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/973980b8e821218608836970f51a0eefc75bfb11)

## Parent-Owned Sentence Composition

Removed the parallel full-Kana sentence-reading chain. A sentence such as `猫が好き` now owns links only to visible `猫`, `が`, and `好き`; each Kanji word owns exactly one complete Kana child (`ねこ` or `すき`), and those children resolve only to atomic Kana rather than to sentence siblings.

- [274238c377ebb0a5ce4759456a0d433df83810da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/274238c377ebb0a5ce4759456a0d433df83810da)

## Vocabulary-Linked Sentence Readings

Sentence title details now use the sentence's existing `words` relationship, so complete Kana spans such as `いぬ`, `やま`, and `くる` target the visible `犬`, `山`, and `来る` vocabulary records. Each vocabulary record continues only through its own complete reading to atomic Kana; no parallel sentence-reading chain or sibling-reading link is introduced.

- [3bc0779](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3bc0779)

## Vocabulary-Owned Kanji Pronunciations

Kanji pronunciation links now prefer the visible vocabulary that uses the reading. That vocabulary alone owns the complete pronunciation wrapper, which reuses meaningful Kanji-reading spans and sends remaining single-Kana suffixes directly to atomic Kana. For example, `好` links to `好き`, while its complete `すき` reading uses the `す` Kanji span and atomic `き` without creating a standalone `き` pronunciation card.

- [b20b4e3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b20b4e3)

## Complete Sentence Pronunciation Links

Sentence pronunciation metadata now declares both word and particle relationships as deep-link sources. `がっこうにいく` consequently resolves into the visible `学校` vocabulary, the `に` particle, and the visible `行く` vocabulary, while retaining the parent-owned sentence graph without a synthetic full-reading record.

- [860a01e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/860a01e)

## Stroke-Guided Writing Cards

Aligned Kana and Kanji cards with the latest Cognis PR #226 drawing contract by adding required normalized `strokePattern` metadata with ordered timing samples and practice tolerances. Patterns derived from KanjiVG retain CC BY-SA 3.0 attribution, and content shards were split to preserve the repository file-size guardrail.

- [ba7857b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ba7857b)

## Restored Vocabulary Kana Links

Updated every pronunciation-bearing layer to publish the current `input.linkRelationships` array consumed by Cognis PR #226. Vocabulary such as `猫` now exposes its `pronunciation-readings` target through that contract, allowing displayed `ねこ` to open the authored pronunciation entry; Kanji readings and particle Kana links use the same current metadata shape.

- [046b335](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/046b335)

## Current-Contract-Only Pronunciation Links

Removed the deprecated singular `linkRelationship` metadata instead of retaining a compatibility path in the beta content schema. Pronunciation fields now publish only the current `linkRelationships` arrays consumed by Cognis, and regression coverage rejects any reintroduction of the legacy property.

- [29d7b90](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/29d7b90)

## Runtime Stroke-Pattern Provider

Implemented the latest Cognis Library lookup-provider contract for Japanese writing units. Exact Kana and Kanji labels now return their packaged, validated `stroke_pattern` with stable KanjiVG provenance and confidence `1`; unknown labels return no guess. The provider is entirely local—no network service or OCR—and its registration is removed on disable or immediately after failed ingestion.

- [bbc6d84](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bbc6d84)

## Complete Kana and Kanji Stroke Lookup

Extended the lookup provider beyond the packaged curriculum. Packaged patterns remain immediate and offline; any other Japanese Kana or Kanji is resolved by its Unicode code point against canonical KanjiVG SVG data, converted into bounded normalized stroke samples, cached, and returned with exact provenance and confidence `1`. Unsupported or unavailable characters return no guess, and OCR is intentionally unnecessary for exact text input.

- [e040cf0](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e040cf0)

## Native-First Jisho Card Lookup

Added a localized Jisho composer provider for Kana, Kanji, and Vocabulary cards using the latest Cognis lookup contract. Exact packaged records return all reviewed fields and relationships without a network request. Native misses use a bounded request cache before querying Jisho, then populate canonical labels, pronunciations, JLPT levels, and only those Kanji, reading, Kana, or definition links that already exist in the provider graph. The stroke provider now also publishes the localized metadata required by the current composer.

- [db47014](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db47014)

## Generic Library Provider Registration

Jisho now exposes a dedicated registration adapter that accepts the generic `study:library:provider` capability and delegates directly to `registerLookupProvider`. Bootstrap uses that adapter, preserves the returned remover, and unwinds already registered providers in reverse order if any later registration or content ingestion fails. The integration no longer depends on a Jisho-specific host capability.

- [0056f4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0056f4d)

## Packaged Registration Entry Point

Refreshed the packaged manifest digest for the generic Jisho registration entry point and its regression coverage.

- [b2a1e34](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2a1e34)

## Self-Contained Stroke Runtime

Removed the undeployed `svg-path-properties` production dependency that prevented Cognis from importing the module during enable validation. The module now packages its own bounded SVG path tokenizer, curve sampler, and distance-based resampler for KanjiVG strokes. Regression coverage runs bootstrap, stroke lookup, and uninstall tests from a copied module tree with no `node_modules`, matching the external-module installation environment.

- [6133b70](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6133b70)

## Inverse Library Capability Resolution

Bootstrap now consumes the required Library registration surface through `ctx.capabilities.require("study:library:provider")`, matching the inverse provider pattern used by SSO authentication modules. It no longer uses the convenience getter that returned `undefined` for this required capability, while provider shape validation and lifecycle cleanup remain intact.

- [a3e2b35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a3e2b35)

## Library Provider Visibility Bridge

Bootstrap now prefers the injected public `study:library:provider` capability, but when Cognis PR #226 exposes it only to enable validation, it uses the injected `study:library` service as a carrier for the exact same generic `registerLookupProvider` and `ingestContentPack` interface. This fixes activation without creating a second provider protocol, and tests cover both host visibility shapes.

- [f9c29d8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9c29d8)

## Fully Resolvable Sentence and Kanji Links

Audited title-detail links with the host's exact alias-composition algorithm. Every sentence pronunciation now proves that its ordered Kana spans open the intended Vocabulary and Particle records. Every Kanji exposes one complete primary reading matching one adjacent Vocabulary target, while additional readings use a separate non-title relationship and retain all atomic-Kana dependencies for inverse navigation.

- [2a5f23f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a5f23f)

## Packaged Audio Contract Alignment

Removed external placeholder audio URLs that the latest Library content-pack validator correctly rejects as `invalid_asset_reference`. Writing-unit pronunciation remains required, while audio is now an optional upload field until an authentic audio file is bundled in the pack.

- [80c7a20](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/80c7a20)

## Direct Kana Usage Relationships

Removed the synthetic Kanji-to-Kana dependency relationship. Kana cards now list only immediate reading records under Used By, preserving the intended `あ` → `あめ` → `雨` navigation instead of presenting unrelated words and Kanji as direct parents.

- [13d11ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13d11ce)

## Kanji-Only Pronunciation Boundaries

Kanji pronunciation links now target dedicated Kana-only reading records rather than complete visible words. `好` therefore presents and links `す`, while the separate `好き` pronunciation wrapper composes `す` with the suffix `き`; standalone Kanji words use the same two-level boundary without duplicate-labelled parents.

- [6cb7ca7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6cb7ca7)

## Curve-Faithful Kana Stroke Patterns

Regenerated every packaged Kana and Kanji stroke pattern from pinned Unicode-named KanjiVG SVG paths. The module-owned sampler now subdivides cubic and quadratic curves before distance sampling, preserving directional turns and loops such as the second stroke of `え` instead of reducing them to misleading straight segments.

- [1668b5f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1668b5f)
- [5002586](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5002586)

## Recursive Kana-Derived Pronunciation

Removed all 84 hidden character-only Vocabulary pronunciation wrappers. Atomic Kana are now the sole pronunciation leaves: Kanji and the 37 real Vocabulary cards reference ordered Kana directly, while sentences reference only real Vocabulary and particles. Vocabulary and sentence pronunciation values are materialized from that graph for display and marked as pronunciation relationships, preventing the written sentence from being repeated beneath its title.

- [40ce8d8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/40ce8d8)

## Ordered Sentence Validation

Aligned sentence relationships with the latest Cognis PR #226 ingestion preflight. Ordered `words` and `particles` are composition relationships again, allowing the host to reconstruct and validate every sentence label while pronunciation remains recursively derived from those constituents.

- [aff5962](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/aff5962)

## Visible Kana Pronunciations

Restored the romanized pronunciation shown on compact Kana cards without breaking recursive Japanese readings. Every Kana now keeps its native form first for pronunciation derivation and exposes its Hepburn-style romanization as the distinct display value retained by the latest Library renderer.

- [d6c2c48](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d6c2c48)

## Learner-Facing Kana Sounds

Corrected Kana pronunciation to contain only Hepburn-style romanization. Learners now see `a` as the pronunciation of `あ` or `ア`, never the same symbol repeated as its own pronunciation; higher-layer Japanese spellings continue to use ordered Kana labels.

- [46d74ae](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/46d74ae)

## Grouped Kana Pronunciation References

Restored alternate Kanji readings and represented every Kanji and Vocabulary pronunciation as its own nested sequence of ordered Kana references. The schema marks these fields as `multi_value` and their relationships as grouped, while Jisho suggestions preserve the same structure for the forthcoming Cognis core support.

- [9bbe068](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9bbe068)

## Hidden Vocabulary Pronunciation Shims

Restored hidden pronunciation records only where a Vocabulary meaning differs from its written Kanji definitions. Each shim carries the lexical definition, links the relevant Kanji spelling, and resolves through grouped Kana references; equal-definition words keep their direct Kana path, and lookup suggestions exclude the hidden records.

- [448f99e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/448f99e)

## Complete Kanji Pronunciation Links

Corrected every Kanji pronunciation to link through its own hidden complete-reading record before resolving to ordered atomic Kana. All six readings of `来` (`く`, `きた`, `き`, `こ`, `らい`, and `たい`) now have working deep links, and the same invariant is enforced for every packaged Kanji.

- [f919fa1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f919fa1)

## Complete Word and Sentence Pronunciation Paths

Connected every Kanji-spelled word to its packaged writing records and one hidden complete-pronunciation record, preserving authored Kanji-reading segments before atomic Kana. Sentence pronunciations now traverse complete hidden records assembled from word readings and particle Kana. Jisho suggestions also enforce layer-specific scripts, retain available Kanji spelling links, and omit incomplete Kana groups.

- [8f5a3e5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f5a3e5)

## Shared Homophone Pronunciation Cards

Replaced duplicate hidden pronunciation cards for `はな`, `はし`, `あめ`, and `かみ` with one shared card per complete Kana reading. Each shared card aggregates the relevant lexical definitions and is used by the distinct visible Kanji words, preventing identically labeled cards from linking to each other while preserving each homophone as its own study word.

- [111ec59](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/111ec59)

## Stable Inter-Layer Reading Navigation

Made authored relationships the only source of reading-card traversal. Vocabulary reading paths can no longer target an identically labeled Vocabulary card: complete single-Kanji pronunciations now resolve directly to ordered Kana, while compounds retain only strictly smaller reading segments. Hidden structural readings no longer copy semantic definitions. Visible vocabulary keeps a localized definition only when its meaning differs from its Kanji; identical meanings fall back through the spelling parent, and definitions identical to the primary label remain suppressed by Cognis.

- [1d37ccf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1d37ccf)

## Verified Kanji Readings and Beginner Content

Locked pronunciation coverage to the reviewed KANJIDIC on- and kun-reading inventory, with deterministic normalization, one hidden reading record per result, and an explicit contextual exception for `達` as `だち`. Added localized definitions for divergent lexical cards and a reviewed batch of nine location, existence, description, manner, and copula words with eight natural example sentences and complete pronunciation paths.

- [69fad5d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/69fad5d)

## Stage Delete Hitbox Ownership

Confirmed that staged-card removal is implemented and styled by the Cognis Study Library composer rather than this external Japanese content module. Recorded the exact host selectors, required sizing fix, and browser regression test in `TODO.md`; the module does not inject an unsafe CSS override into a host-owned editor.

- [c1a4b7b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c1a4b7b)

## Kana-Only Romanization Resolution

Confirmed that the Japanese pack already keeps Hepburn romanization on atomic Kana while higher-layer readings are authored as Japanese Kana labels. Recorded the exact Cognis composer correction needed to stop recursive pronunciation derivation from promoting Kana romanization into Vocabulary and sentence readings; the external module does not override host-owned derivation behavior.

- [2324f5b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2324f5b)

## Explicit Destructive Uninstall Cleanup

Added the administrative module-config delete endpoint expected by Cognis and made it a content-safe `204` compatibility route. Packaged Japanese records are now deleted through the Study Library provider only when the uninstall request explicitly carries `deleteContent: true`; disabling, ordinary uninstall, missing cleanup support, and cleanup failures cannot silently remove or strand established learning data.

- [eb8583f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eb8583f)

## Restored Vocabulary Card Definitions

Added direct definition relationships to every visible Kanji-spelled Vocabulary record that previously depended on its spelling parent. This matches the Cognis card renderer, which displays only directly referenced definitions, and restores meanings for cards including `川`, `空`, `花`, `鼻`, `橋`, `箸`, `雨`, `飴`, `水`, `犬`, `猫`, `山`, `紙`, and `髪`.

- [c045f5e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c045f5e)

## Working Jisho Vocabulary Searches

Corrected the Jisho composer flow so Vocabulary searches accept bounded English and other Latin-script terms instead of returning immediately without a request. Exact packaged Japanese entries remain native-first; remote Japanese queries prefer exact forms, while meaning searches use Jisho's highest-ranked result. Kana and Kanji layers still require one valid Japanese character, and unsafe or oversized input is rejected before network access.

- [f14901a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f14901a)

## Base Verb and Adverb Transformation Views

Aligned the Japanese pack with the latest Cognis transformation contract. Vocabulary now separates base verbs and invariant adverbs into dedicated views; verbs distinguish ichidan, regular godan endings, exceptional `行く` and `ある`, and irregular `来る`. Provider-declared rules derive reviewed polite, negative, past, and te forms at presentation time, while the pack stores only the twelve canonical base verb/adverb records and no generated duplicates.

- [097eab5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/097eab5)

## Segmented Sentence Pronunciation Links

Sentence pronunciation details now link each ordered reading segment directly to its visible Vocabulary or Particle card. Removed the 25 hidden whole-sentence Vocabulary wrappers and the sentence-level `pronunciation-readings` relationship, so `はなはとてもきれいです` opens `花`, `は`, `とても`, `きれい`, and `です` independently instead of presenting one Vocabulary card for the complete sentence.

- [0002eee](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0002eee)

## Complete Japanese Pronunciation Guard

Audited every packaged higher-layer pronunciation and locked it to complete Japanese text, including full sentence reconstruction. The reported mixed romanization and missing final segment originate in Cognis PR #226: recursive derivation reads the Kana card's Hepburn field before its atomic label, and the host popup must preserve the complete grouped reading span. Recorded the exact upstream base-case and wrapping regression while keeping this external pack free of unsafe host UI overrides.

- [0906392](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0906392)

## Atomic Kana Reading-Title Navigation

Added explicit ordered atomic-Kana title compositions to every hidden Kanji-reading record. A multi-Kana reading such as `さん` now opens `さ` and `ん` directly, so the host cannot substitute the separate hidden `さ` Kanji-reading Vocabulary card used by `小`. Complete `kana-spelling` relationships remain intact for pronunciation semantics, while title navigation is deterministic and terminates at Kana.

- [8c48fa7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8c48fa7)

## Compound Kana Navigation and Small-Form Geometry

Added explicit atomic-Kana title composition to every multi-symbol Kana card, preventing compound Kana such as `きょ` from deep-linking to same-text hidden Vocabulary readings. Rebuilt compound stroke layouts with size-aware slots so small forms such as `ょ` retain their visibly reduced proportions alongside full-size Kana.

- [4c33d9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4c33d9e)

## Sentence Links Without Sentence Vocabulary Impostors

Restored sentence pronunciation links to their ordered visible Vocabulary and Particle constituents. Strengthened structural regression coverage so complete sentence readings, sentence composites, particle classes, particle references, and hidden sentence constituents are rejected from the Vocabulary layer without removing legitimate sentence links.

- [7cdb1ac](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7cdb1ac)

## Direct Kanji Readings Without Kana-Duplicate Vocabulary

Removed all 140 hidden `reading:kanji` Vocabulary records, including single-Kana stragglers such as `む`. Kanji pronunciation groups and remote Jisho Kanji suggestions now link directly to ordered atomic Kana, while complete lexical pronunciation wrappers remain available only when they do not duplicate a Kana writing-unit label.

- [d7a28e4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d7a28e4)

## Deep Branching Verb Transformations

Aligned the Japanese pack with Cognis' composable transformation-tree contract. All verb families now branch through polite, negative, past, connective, causative, passive, potential, and volitional pathways, including a four-step causative-desire chain. Written forms and pronunciations transform independently, localized definition overrides describe semantic branches, adverbs remain invariant base cards, and generated forms remain presentation-only.

- [d93ad3c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d93ad3c)

## Selective Kanji Reading Intermediates

Restored one hidden reading Vocabulary card per pronunciation only for Kanji with multiple readings; the sole single-reading Kanji continues directly to atomic Kana. Each intermediate links its title to exactly one source Kanji, reconstructs its pronunciation from atomic Kana, and may own a distinct definition when semantically narrower. Removed complete-word Kana wrappers such as `せんせい`; `先生` now composes its reading from the separate `せん` and `せい` intermediates.

- [91488aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/91488aa)

## Self-Contained Reading Definitions

Added direct definition links to every hidden Kanji-reading Vocabulary record so opening a reading from a pronunciation deep link shows the same meaning as opening it through the Kanji card's Used By section. Readings reuse the source Kanji definitions when meanings are identical and remain able to own narrower reading-specific definitions.

- [b0a83fb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0a83fb)

## Localized transformation markers

Causative-desire branches now publish localized `marker` metadata in German, English, Indonesian, and Japanese. Cognis can insert these phrases into definition templates while continuing to prefer explicit transformation-specific definitions.

## Vocabulary-native variant selection

The documented contract keeps canonical verbs and adverbs on the Vocabulary layer and presents their deep transformation trees through the host variant selector without storing generated forms as study entries.

## Version synchronization

The module advances to `2.2.72`, content revision `2026-09-30.10`, and Japanese schema revision `77`, with regenerated package hashes.

## Commits

- [d7b696b](../../commit/d7b696b) — Align transformation markers with Cognis.

## Definition Annotations for Every Transformation

Every authored verb transformation now carries localized marker metadata. Direct desire branches produce forms such as `見たい`, while negative, past, polite, connective, passive, potential, volitional, causative, and deeper branches each supply their own semantic annotation.

## Independent Polysemous Definitions

`見る` now references separate “to see” and “to watch” definition records. Regression coverage applies the desire marker to each definition independently; each localized verb definition now carries the required `{{ marker }}` slot.

## Structured Cognis Follow-Up

The pack follows the Cognis marker contract directly by placing one `{{ marker }}` slot in every localized verb definition and preserving separate definition records through transformation presentation.

## Commits

- [64ce852](../../commit/64ce852) — Annotate every verb transformation definition.

## Marker Slots Added to Verb Definitions

Every localized definition referenced by a verb now contains exactly one `{{ marker }}` slot at its grammatical insertion point. Cognis can therefore turn the two `見る` definitions into `to (want to) see` and `to (want to) watch` without guessing where the transformation annotation belongs.

## Polysemous Definitions Remain Independent

The combined `学ぶ` meaning was separated into “to learn” and “to study” definition records, matching the existing split for `見る`. Tests require every visible verb definition and every locale to retain exactly one marker slot.

## Version Synchronization

The module advances to `2.2.74`, content revision `2026-10-01.2`, and Japanese schema revision `79`, with regenerated package hashes.

## Commits

- [f6c7201](../../commit/f6c7201) — Place transformation markers in verb definitions.

## Composable Definition Transforms

Replaced fixed `marker` metadata and stored `{{ marker }}` slots with the Cognis 2.24 `definitionTransform` structure. Every rule now declares localized removable boundaries and templates using `{{ definition }}`, `{{ stem }}`, `{{ prefix }}`, and `{{ suffix }}`; templates compose in order along deep transformation paths.

## Clean Definitions and Deep-Path Coverage

Verb definitions are ordinary localized text again, while consistent infinitive boundaries let templates transform each polysemous definition independently. Tests cover `見る` desire output and a four-step causative-desire path without flattening meanings.

## Version Synchronization

The module advances to `2.2.75`, content revision `2026-10-01.3`, and Japanese schema revision `80`, with regenerated package hashes.

## Commits

- [739beba](../../commit/739beba) — Adopt composable definition transforms.

## Contextual Definition Replacements

Definition transforms now use Cognis 2.24.1 ordered localized `replacements` before fallback templates. Past and negative branches can rewrite earlier desire, causative, polite, and conditional semantics, while connective branches append to the complete transformed definition through `{{ definition }}`.

## Contextual Chain Coverage

Tests verify `to (want to) see` becomes `to (have wanted to) see`, connective desire becomes `to (want to) see (and then)`, and the deepest causative-desire path preserves its complete contextual meaning.

## Version Synchronization

The module advances to `2.2.76`, content revision `2026-10-01.4`, and Japanese schema revision `81`, with regenerated package hashes.

## Commits

- [a5539e6](../../commit/a5539e6) — Add contextual definition replacements.

## Aspect-Correct Drawing Patterns

Every packaged stroke pattern now declares its logical column count. Cognis Drawing Practice can fit single and multi-character patterns into its aspect-preserving viewport instead of stretching the canvas or distributing characters through incorrectly sized cells.

## Character-Aware Stroke Testing

Stroke patterns now publish ordered per-character group lengths, and remotely fetched multi-character patterns preserve the same metadata. This lets next-stroke guidance and hidden-guide testing retain character boundaries. A host follow-up records that compound patterns must preserve authored groups and vocabulary composition should use bounds-aware optical spacing.

## Version Synchronization

The module advances to `2.2.77`, content revision `2026-10-01.5`, and Japanese schema revision `82`, with regenerated package hashes.

## Commits

- [7c2c0db](../../commit/7c2c0db) — Preserve drawing aspect and stroke groups.

## Label-Based Kanji Identity

Kanji lookup now normalizes and compares the entered character label directly instead of allowing a shared pronunciation to act as identity. Regression coverage proves that `券` remains distinct from packaged Kanji such as `犬` even though both can use `けん`, while genuine same-label conflicts can resolve through the conflict entry supplied by Cognis Library 2.24.3.

## Version Synchronization

The module advances to `2.2.78` and content revision `2026-10-01.6`, with regenerated package hashes.

## Commits

- [ab10be0](../../commit/ab10be0) — Keep Kanji identity separate from pronunciation.
- [19424fc](../../commit/19424fc) — Remove duplicated identity guidance.

## Sentence Structure Composition

The Japanese sentence constructor now follows Cognis Library 2.24.9 with separate word and particle inputs, a provider-owned Sentence Structure carousel, and repeatable Japanese punctuation. The visible copula `です` is tagged `sentence-structure`, keeping it as meaningful Vocabulary while making it directly selectable, orderable, removable, and restorable during sentence authoring.

## Version Synchronization

The module advances to `2.2.79`, content revision `2026-10-02.1`, and Japanese schema revision `83`, with regenerated package hashes.

## Commits

- [244e048](../../commit/244e048) — Expose sentence structure composer entries.
