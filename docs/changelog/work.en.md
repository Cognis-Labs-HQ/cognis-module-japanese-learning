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
