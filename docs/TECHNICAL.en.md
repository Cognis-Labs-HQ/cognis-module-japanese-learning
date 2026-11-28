# Technical Reference

The Japanese pack contributes language content, dictionary enrichment, writing patterns and recordings through public Study providers.

## Interfaces

`bootstrapModule(ctx)` requires `study:library:provider` with `transformationModel: "generated"`, `ingestContentPack`, `registerLookupProvider` and `deleteContentPack`, plus `study:audio:provider`. It registers content/media lookups, ingests `data/library/` and publishes `study:language:ja`. The language descriptor includes the package and starter decks; Cognis owns navigation, authorization and the learning interface.

Administrator-only `GET`, `PUT` and `DELETE /api/v1/modules/study-language-ja/config` execute the module’s read, save and clear flows. PUT accepts `voiceId` as a string: empty clears the override; nonempty values contain 1–128 letters, digits, underscores or hyphens. The request body is limited to 2048 bytes. The module declares no disabled API entrypoint.

## Configuration

Optional `voiceId` selects generated speech without changing bundled recording provenance. Configuration uses the module-owned `module_study_language_ja_config` table through `db:executor`, survives disable/restart and is cleared on uninstall. Library schema, content manifest, starter decks and reference inventories are declared under `data/`; deployed availability comes from those inventories, not hardcoded totals in this manual.

## Behavior

### Content and relationships

`data/library/schema.json` declares `characters`, `alt-characters`, `definitions`, `words`, `particles`, `sentences`. Records use stable pack-local IDs and four-language meanings. Ordered references point to real records and preserve composition order. Study owns canonical UUID resolution, schema validation, ACLs, imports, writes and generated interfaces. Language code, immutable module UUID and tutorial completion IDs are not translation keys.

Generated forms require an applicable base-card flag and resolve through the host transformation model. They are views identified by base identity and transformation path, not separately packaged cards. Unknown or inapplicable transformations reject rather than silently selecting a base form.

### Recordings and writing

`data/audio/recordings.json` declares inventory format 2. Purpose indexes in `data/audio/indexes/` reference checksummed shards in `data/audio/inventories/`; the loader verifies digests and counts before exposing audio. `data/audio/unavailable.json` records missing bundled audio. Matching uses the authored reading and transformation path; unavailable transformed audio never substitutes a base-form recording. Sentence composition reuses constituent audio. Optional `elevenlabs-tts:synthesis` is used only when configured; callers retain Study authorization.

Writing patterns preserve stroke order and per-character groups. Bundled media is served through the host’s authorized pack assets. Disabling removes lookup/audio providers and static contributions; bootstrap failure rolls back partial providers. Uninstall retains learning content unless `deleteContent` is true, in which case it calls the Library’s `deleteContentPack` contract.

### Dictionary and reference data

Jisho supplies Japanese word and Kanji enrichment through module-owned request validation. Requests have a 15-second deadline and rejected bodies are cancelled. KANJIDIC2 reference shards preserve EDRDG attribution and licensed readings/meanings. Kana-backed complete readings and ordered lexical composition remain authoritative; absent source values are not invented. Cognis owns query caching and publication.

### Tutorial lifetime

The language guide requires explicit enrollment and registers through `study:libraryTutorials`. The host controls targets and editor lifetimes. Discovery does not navigate; explicit launch may enter language content. Completion is persisted by the host for the account and stable tutorial ID; Back, Restart and provider removal release owned surfaces without submitting cards.

## Security

Library permissions remain authoritative even when the content pack is privileged. Queries and media must resolve within the declared provider scope. Dictionary attribution and source licenses remain attached to results; incomplete readings or meanings remain unknown rather than invented. Logs contain safe event metadata, never provider credentials, full payloads or private study content.

## Reference

Implementation and data sources below define the supported runtime contract. The host documentation describes shared rendering and persistence boundaries.

- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/bootstrap.js)
- [api/routes/config/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/routes/config/index.js)
- [api/dictionary/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/dictionary/index.js)
- [data/library/schema.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/library/schema.json)
- [data/audio/recordings.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/audio/recordings.json)
- [data/reference/manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/reference/manifest.json)

### Naming validation

`npm test` checks binding names with the local syntax-tree detector, including bootstrap, scripts, tests and fixtures. Parsing errors fail validation. The detector regression fixtures cover declarations, parameters, private members, TypeScript assertions and legitimate type-only names. See the [host naming standard](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.en.md#binding-names) for the shared policy. Conventional vocabulary such as `args`, `db` and LDAP `dn` is accepted as standalone names. Composite identifiers, including upstream types and methods, use expanded words such as `DatabaseExecutor`, `createDatabaseExecutor` and `baseDistinguishedName`; owned APIs use one canonical name across declarations, exports and callers. Naming-only export aliases fail validation. Measurement-unit tokens (`ms`, `sec`, `px`, `rad`, `deg`) stay abbreviated within composites, such as `INVITE_EXPIRY_MS` and `widthPx`; other composite abbreviations still expand.
