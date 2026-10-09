# Optional JLPT Filters

**Feature Branch:** feature-replace-library-with-new-implementation

## Select Any JLPT Levels

JLPT filtering now starts without a selected level and permits multiple selections, matching the optional verb type filter. Clearing all levels shows every vocabulary card, including cards without a JLPT level.

## Pack Revision

Schema revision 87 and module/content-pack version 2.2.83 publish the revised selection policy through the existing Study Library contract.

## Complete Jisho results

The Jisho provider now returns every reading with ordered Kana groups, a separate importable definition for each sense, lexical classification, JLPT/common-word tags, and its source URL. It declares the dictionary capability through `study:library:provider` registration. Full source records—including alternate forms, parts of speech, sense notes, restrictions, dialects, related terms, and attribution—are retained as JSON in the optional hidden `dictionary_data` schema field.

Cognis PR #226 supplies the common result preview, definition import, and missing-language translation action. Providers supply authentic source translations; Cognis requests German, English, Indonesian, and Japanese through its optional localization capability. The module does not invent translations or copy English into other languages. Native content lookup still precedes the network and now preserves class and tags.

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

The Jisho provider now returns every usable word result with its own canonical label, readings, definitions, class, tags, relationships, and hidden source record. Cognis presents multiple matches for selection and confirmation before importing a candidate. Native matches still precede network lookup; Kanji lookup remains a dedicated single-character request. Module/content-pack version 2.2.89 keeps schema revision 88.

## Dictionary search and caching

Dictionary providers opt into navigation search with `searchable: true` and the `dictionary` capability. Search uses only supported layers that allow dictionary lookup; sentences remain excluded. Results open on the dedicated Search Results page, with card previews, full definitions, hidden source metadata, and the normal card composer for deliberate imports. Cognis persists results by provider, schema revision, and normalized query for 24 hours, coalesces concurrent queries, and retains the cache across restarts. Refresh explicitly retrieves the provider again. Fresh local cards and pronunciation links resolve against the current accessible Library rather than cached entry permissions. Provider enablement and schema changes control availability. Jisho has no incremental change feed, so new upstream entries are discovered by refresh or expiry, not by an unsupported delta query.

## Sentence import requirements

Jisho’s documented word API (`/api/v1/search/words`) returns lexical forms, readings, senses, tags, and parts of speech. A whole-sentence query can return constituent dictionary matches, but the JSON contains neither sentence translations nor token offsets, inflection alignment, or particle attachment. Example-sentence search is a corpus lookup, not translation of arbitrary input. Reliable one-click sentence import therefore requires a Japanese morphological analyzer with surface offsets, lemma, part of speech, and contextual reading; a sentence translation provider; and a module-owned graph planner that maps lemmas and inflections to Cognis transformation descriptors. It must reconstruct the exact original sentence, preserve punctuation, resolve each pronunciation to existing Kana, prefer existing vocabulary/particle/character records, and create only editable missing Vocabulary or Kanji plus definitions. Characters and particles remain provider-owned. The host must validate the whole graph, scope and ACLs, ambiguity, duplicate identities, and rollback before committing. Jisho can enrich the lexical and Kanji nodes, but cannot provide this pipeline by itself. No sentence-import capability is advertised until that pipeline exists.

## Commits

- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/48b4d1aab97d3cce49a7a653d65058d5fc74b6f4
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/253824ced22f7925a032af37cada4a917331bb8b
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f7dc3d4e7fd2e1289279776bbd4e0fb0c5b5d7e
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1cebe54686f65998585f0f2c0d54fab0c2a55cd3
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/89e41b48892eda01034870c030c621ee7163a1c6

## Authoritative Search and Refresh

Word and Kanji searches retrieve complete Jisho records even when bundled content already matches. Kana resolution remains provider-owned and local. Bundled lookups are available when network fetching is explicitly unavailable. Word and Kanji requests share a bounded, expiring cache utility; a failed older request cannot discard a newer refreshed result.

- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/edef816c8438941f2976e892ef9a65c2c95b8fae
