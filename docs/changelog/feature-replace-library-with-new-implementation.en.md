# Optional JLPT Filters

**Feature Branch:** feature-replace-library-with-new-implementation

## Select Any JLPT Levels

JLPT filtering now starts without a selected level and permits multiple selections, matching the optional verb type filter. Clearing all levels shows every vocabulary card, including cards without a JLPT level.

## Pack Revision

Schema revision 87 and module/content-pack version 2.2.83 publish the revised selection policy through the existing Study Library contract.

## Complete Jisho results

The Jisho provider now returns every reading with ordered Kana groups, a separate importable definition for each sense, lexical classification, JLPT/common-word tags, and its source URL. It declares the dictionary capability through `study:library:provider` registration. Full source records—including alternate forms, parts of speech, sense notes, restrictions, dialects, related terms, and attribution—are retained as JSON in the optional hidden `dictionary_data` schema field.

One match fills the open composer. Multiple matches use a horizontal preview chooser with selection and confirmation. Vocabulary lookup preserves authored input and composition tokens. Pronunciations and definitions are committed immediately; each gloss, including semicolon-separated meanings, is a separate definition. Cognis supplies optional missing-language translation through its localization capability; the module neither invents translations nor copies English into other languages. Source URLs and complete original records are retained only in hidden `dictionary_data` metadata.

Schema revision 88 and module/content-pack version 2.2.84 publish the source-data field. Import all returned senses through the host preview, or choose a subset within the host definition limit; the complete original result remains stored regardless of which senses are linked.

## Dedicated Kanji lookup

Kanji outside the bundled content now use Jisho’s dedicated Kanji page instead of its lexical word API. The provider imports Kun/On readings, meanings, stroke count, grade, JLPT level, and frequency. Reading separators are removed for pronunciation while source notation remains in dictionary_data. Upstream failures report a lookup error instead of an empty result. The KanjiVG provider explicitly declares its stroke-pattern capability and field. Module/content-pack version 2.2.85 keeps schema revision 88.

## Identified Jisho requests

Jisho Kanji and word requests now send a descriptive Cognis User-Agent. This resolves HTTP 403 responses observed with Node’s default request identity, including lookup of 教. Failure logs include a safe failure code and HTTP status when available, separating upstream rejection, invalid response format, and transport failure without recording response bodies. Module/content-pack version 2.2.86 retains schema revision 88.

## Hidden dictionary provenance

Jisho suggestions now store their exact source URL inside the hidden dictionary_data field alongside the complete source record. Cognis imports this metadata directly while omitting visible source links and the result popup. Module/content-pack version 2.2.87 retains schema revision 88.

## Individual dictionary meanings

Jisho word results now emit each English gloss as a separate definition rather than joining glosses with semicolons. Semicolons inside a returned gloss are split as well. Each definition has distinct source provenance, while the hidden source record retains every sense and provider field. Module/content-pack version 2.2.88 retains schema revision 88.

## Dictionary pronunciation links

Dictionary imports resolve complete pronunciations to installed Kana using longest complete matches, preserving compound characters such as きょ and っく and repeated positions. Canonical entry IDs are stored in ordered reading groups; a reading with missing characters is never partially linked. Definitions reuse matching cards or create cards through the normal composer flow. Carousels remain the primary way to create downstream cards. Characters and particles remain provider-owned read-only layers. Sentence composers do not offer dictionary lookup.

## All dictionary candidates

One match fills the open composer. Multiple matches use a horizontal preview chooser with selection and confirmation. Vocabulary lookup preserves authored input and composition tokens. Pronunciations and definitions are committed immediately; each gloss, including semicolon-separated meanings, is a separate definition. Cognis supplies optional missing-language translation through its localization capability; the module neither invents translations nor copies English into other languages. Source URLs and complete original records are retained only in hidden `dictionary_data` metadata.

## Dictionary search and caching

Cognis core owns dictionary caching through `core:cache`. Queries become cold after one hour and are probed on subsequent use. Changed results are published at twelve-hour boundaries; unchanged results retain their content. Concurrent queries share a probe, failed probes retain successful cached data, and persisted cache survives restarts. Modules neither schedule dictionary queries nor maintain dictionary-response caches. Jisho has no lightweight change feed, so a probe uses its ordinary search response. There is no manual Refresh control. Local links resolve against currently accessible Library entries.

## Sentence import requirements

Jisho’s documented word API (`/api/v1/search/words`) returns lexical forms, readings, senses, tags, and parts of speech. A whole-sentence query can return constituent dictionary matches, but the JSON contains neither sentence translations nor token offsets, inflection alignment, or particle attachment. Example-sentence search is a corpus lookup, not translation of arbitrary input. Reliable one-click sentence import therefore requires a Japanese morphological analyzer with surface offsets, lemma, part of speech, and contextual reading; a sentence translation provider; and a module-owned graph planner that maps lemmas and inflections to Cognis transformation descriptors. It must reconstruct the exact original sentence, preserve punctuation, resolve each pronunciation to existing Kana, prefer existing vocabulary/particle/character records, and create only editable missing Vocabulary or Kanji plus definitions. Characters and particles remain provider-owned. The host must validate the whole graph, scope and ACLs, ambiguity, duplicate identities, and rollback before committing. Jisho can enrich the lexical and Kanji nodes, but cannot provide this pipeline by itself. No sentence-import capability is advertised until that pipeline exists.

## Authoritative lookup

Word and Kanji requests retrieve authoritative Jisho results even when bundled records match. Native content is a fallback only when network fetching is explicitly unavailable; Kana resolution remains local and provider-owned. Dedicated single-character Kanji lookup retrieves Kun/On readings, meanings, stroke count, grade, JLPT level and frequency. Requests include a Cognis User-Agent, a 15-second timeout and safe failure logs. Transport failures are errors, not empty matches.

## Stable dictionary searches

Jisho retrieves current lexical and Kanji data on host requests. Exact word/reading matches rank above related matches, kana-preferred entries keep their conventional Kana form, and Wikipedia-only title results are excluded. Missing readings never become definitions or invented pronunciations. The provider preserves definitions and source metadata separately; Cognis owns all cache policy.

Cognis core owns dictionary caching through `core:cache`. A cached query becomes cold after one hour; its next use probes the provider for changes. Changed results remain pending until the twelve-hour publication boundary, and unchanged results retain their content. Concurrent queries share one probe, and failed probes preserve the last successful result. Cache state survives restarts. Modules retrieve provider data without scheduling queries or maintaining provider-response caches. Jisho has no lightweight change feed, so a probe requires the ordinary search response. There is no manual Refresh control. Local pronunciation and card links always resolve against currently accessible content.

## Dictionary reading graphs

Dictionary source data remains invisible metadata in composers and detail views. Imported pronunciations use hidden Vocabulary readings with the same scope as their parent. Multi-reading Kanji uses one hidden record per reading, with a title link to its source Kanji and ordered Kana pronunciation links; single-reading Kanji links directly to Kana. Complete word readings compose from the nearest authored Kanji-reading segments and remaining Kana when available. Definitions are linked directly to hidden readings. Cognis resolves provider identities and commits the graph atomically through normal field, layer, dependency and ACL validation. Characters and particles remain provider-owned. Redundant Katakana echoes of an equivalent Hiragana reading are filtered unless the dictionary declares that Katakana spelling; authoritative Kanji on-readings and genuine loanword readings are preserved.

## Validated operation stages

KanjiVG stroke assets use a separate module-local bounded lookup cache: at most 512 labels, successful responses for 24 hours and missing assets for five minutes. Concurrent lookups share requests and failures are discarded. This asset cache does not govern dictionary search or app navigation. Jisho and KanjiVG share the deterministic content-shard loader in `api/reuse/content.js`; the stroke provider consumes `api/reuse/lookup-cache.js`. Module/content-pack version 2.2.96 retains schema revision 88. Jisho registers through the host `study:library:provider` capability with `searchable: true` and the `dictionary` capability. It supports Kana, Kanji and Vocabulary; sentences and provider-owned particle creation are excluded.

## Common dictionary entries

For equally exact matches, Jisho entries marked is_common rank ahead of uncommon entries. Exact matches still outrank related matches. Jisho provides no per-sense frequency marker: definitions retain its original sense order, including room first for 室, rather than being reversed by the composer.

## Dictionary transformations

Transformation choices align titles, readings and definitions in a single column within each card. The base-form action uses the neutral button style. Dragging displays a vertical insertion marker before or after the destination placement. Jisho imports retain supported conjugation-family tags on vocabulary cards; newly created verbs enter the transformation chooser before being added to a parent composition. Adverbs retain their lexical classification; the current Japanese schema declares no adverb transform sets.

Dictionary providers may return prerequisites: an array of { key, layer, label } lookup targets. After a composer match is selected, Cognis resolves existing compound-writing cards at the intended scope or retrieves and creates missing cards with their definitions and reading graph. Atomic characters and particles cannot be created through this path. Alias keys resolve to canonical IDs in root and hidden-reading references. Vocabulary input remains unchanged, and imported spelling references are used only while the input still matches the lookup. Search result browsing never creates prerequisites.

Missing required fields are completed through registered auxiliary lookup providers before persistence; Kanji stroke patterns come from KanjiVG. Each Kanji, its definitions and hidden readings commit as one validated scoped graph.

## Kanji pronunciation script

Kanji lookup converts Jisho’s Katakana On readings to Hiragana for card pronunciations and reading links. 僕 includes ぼく alongside しもべ. Identical Kun and On pronunciations are deduplicated after conversion; original notation such as ボク remains in hidden dictionary metadata. Vocabulary Katakana spellings and duplicate-query filtering keep their existing behavior.

The primary reading follows common exact word matches from Jisho: 僕 shows ぼく first, then しもべ. Related words and unattested Kanji readings do not change the order. If word lookup fails, the Kanji result remains usable and the failure is logged safely.

## Explore Navigation

Schema revision 89 declares Explore navigation slugs `kana`, `kanji`, `vocabulary`, and `sentences` under `/study/explore/ja/`. Module and content-pack versions are 2.2.99. Cognis owns imports, limits, deck sharing, and application navigation; the module supplies declarative layer names and dictionary content.

## Starter Flashcard Decks

The Japanese provider declares three starter decks in `data/starter-decks.json`: Hiragana Basics, Everyday Kanji, and First Japanese Words. Each deck has a stable key, localized names, a schema ID, and source record IDs. The language descriptor exposes this declarative data as `starterDecks`. Cognis resolves those records to current canonical Library IDs, hides incomplete decks and decks from disabled providers, and owns browsing, favourites, sharing, and learner progress. The module neither creates decks nor queries the host database.

## Review and lifecycle fixes

Japanese module 2.2.100 requires `study:library:provider` directly and removes lookup registrations when ingestion, capability publication or flow registration fails. Schema 89 and content pack 2.2.99 are retained; this release changes integration and readability, not language data.

## Expanded Starter Decks

Japanese now supplies six starter decks: complete hiragana and katakana sets of 46 cards, ten everyday kanji, nine first words, eight everyday verbs and twelve first sentences. Existing keys remain stable and every member resolves to a visible provider record.

## Content and Contract Corrections

Polite location questions include their final か, using a new canonical question-particle card with four localized definitions. Existing sentence identities stay stable. Activation failure removes lookup registrations and logs safe error metadata. Instructions establish ctx as the application backbone and preserve host-derived sentence pronunciations.

## Opt-in Japanese collective plurals

Schema 90 and content pack 2.2.102 declare six reviewed animate-noun and pronoun families using Cognis’ optional transformation contract (`optInTag: plural`). The `たち` suffix represents a group or associated people; it is not a universal English-style number suffix. Labels, readings and localized definitions transform together while sentence references retain the base card. Derived plural cards are not duplicated in the dataset. Module version: 2.2.102.

## Template contributor standard

Synchronize AGENTS.md with the external-module template while retaining domain-specific rules. Adopt the canonical release-note location and preserve historical content and permanent module identity.

## Standard structure and owned integration

Synchronize template guidance, domain route paths, localized integration documentation, executable structure checks and final package digests. Keep existing public URLs and module identity. Browser contributions follow their owning host lifecycle contracts.

## Study branding and artwork

Rebrand the module as Japanese Study and provide a matching PNG icon and banner, keeping essential artwork inside the marketplace’s center-crop safe area. Translate the visible module name and update integration documentation while preserving module UUIDs, language codes, package names and content identities.

## Consistent marketplace descriptions

Use short action summaries and concrete feature descriptions across marketplace metadata, keeping localized meanings aligned.

## Commits

- [7d529da8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d529da851a5301f3dd04ee4b1d71e17053248f9)
- [5f901fc4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5f901fc476e5b4e4e61f18ab612bbd8a3eb9c860)
- [f9105630](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9105630f0ee87cad60fc67c99f46a311bcdb68b)
- [785fb21b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/785fb21beeb8addd3160e4dc46e0052f69a5efa1)
- [26eeb3e8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b43](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- [fdf23190](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594)
- [48b4d1aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4)
- [253824ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b)
- [8f7dc3d4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e)
- [1cebe546](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3)
- [89e41b48](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6)
- [edef816c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae)
- [fc1f65d2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fc1f65d25aa2e4d52bef4dc5290eb127a7033a68)
- [618b1c90](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/618b1c901ac826fd81a584d5ff9baa98c8033d91)
- [84e49de4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/84e49de45b43f6f0b0cdb8087eeb03cc40f6389c)
- [94e57eb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/94e57eb29bdebb3e64e057e082608a25e72b33d0)
- [315dded4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/315dded455234476da36402728c09b9e64b3fd5d)
- [4db2d6f7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4db2d6f76a6328592520ef23528958b42d95e166)
- [fd7b3fa2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fd7b3fa218e80d8ce2657666adb544680d925fd5)
- [c0020778](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c00207784c18bfafe9548cf449176f74768f0a14)
- [f3d77c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3d77c941a7e44982c1cf60f04cfdbb8e26d2e36)
- [7d637de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7d637de2c5429fb58d95f2ad542540fbc7e458b7)
- [1e8c8df](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1e8c8dfcd5c7321519c0ea38d8a8fd788335441e)
- [25322ff](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/25322ff741a62e990f6c4664f0b6083415c649ea)
