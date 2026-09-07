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

Kanji pronunciation presents on-readings in katakana and kun-readings in hiragana, and every seeded reading now expands into ordered references to its actual kana character records. Character-class metadata keeps hiragana and katakana variants distinguishable, while the Library renderer can show referenced kana as navigable component boxes.

## Current Library activation contract

Character-script and JLPT badge filters now declare named, mutually exclusive filter groups supported by Library 2.6. The module intentionally does not enable `allowBootstrapFailure`: content ingestion and publication of `study:language:ja` are its essential runtime work, and keeping it enabled without them would expose a nonfunctional module. Cognis PR #216 now updates existing entries, assets, and references during repeated content-pack imports, which addresses the reported duplicate-reference failure at its persistence boundary.

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
