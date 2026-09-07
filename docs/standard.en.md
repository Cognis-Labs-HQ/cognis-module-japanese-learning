# Japanese content pack standard

The Cognis Japanese module installs declarative Japanese learning records into the host-owned Study Library while remaining isolated from Library internals, databases, APIs, and browser code.

## Usage

Enable the Study gateway and Library adapter, then enable this module. Its bootstrap resolves `study:library` from `ctx` and ingests `data/library`. Administrators and learners use the Library adapter's generated Study interface rather than a module-owned route.

Because the language descriptor declares no executable child pages, Cognis Study supplies the generated Library destination at `/study/library?language=ja`. The validated language query remains attached to Library links, detail navigation, direct loads, and browser history; authenticated learners may browse while Library scope rules continue to protect authoring and publishing.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library` capability rather than treating the adapter UUID as an independently installable component.

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

Kanji pronunciation presents on-readings in katakana and kun-readings in hiragana, and every seeded reading now expands into ordered references to its actual kana character records. Character-class metadata keeps hiragana and katakana variants distinguishable, while the Library renderer can show referenced kana as navigable component boxes.

## Current Library activation contract

Character-script and JLPT badge filters now declare named, mutually exclusive filter groups supported by Library 2.6. The module intentionally does not enable `allowBootstrapFailure`: content ingestion and publication of `study:language:ja` are its essential runtime work, and keeping it enabled without them would expose a nonfunctional module. Cognis PR #216 now updates existing entries, assets, and references during repeated content-pack imports, which addresses the reported duplicate-reference failure at its persistence boundary.

## Directional tenten variants

Only dakuten (tenten) forms use the directional parent/child relationship. The seeded `じ`/`ご` and `ジ`/`ゴ` records reference `し`/`こ` and `シ`/`コ` respectively within their own character table. Hiragana and katakana counterparts remain independent records and are not modeled as parent and child.

## Latest Library presentation contract

Directional tenten links no longer declare a resolver role, so the Library uses them only to unfold child cards and does not duplicate the parent as a constituent box. Kanji reading and word spelling relationships retain resolver roles for navigable constituents. The current Library places writing-unit pronunciation beside labels in cards and detail titles, and restores missing module content on the next enable unless a user explicitly blacklists its content hash.
