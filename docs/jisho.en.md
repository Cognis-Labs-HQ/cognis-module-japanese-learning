# Dictionary integration

Module/content-pack version 2.2.93 retains schema revision 88. Jisho registers through the host `study:library:provider` capability with `searchable: true` and the `dictionary` capability. It supports Kana, Kanji and Vocabulary; sentences and provider-owned particle creation are excluded.

## Authoritative lookup

Word and Kanji requests retrieve authoritative Jisho results even when bundled records match. Native content is a fallback only when network fetching is explicitly unavailable; Kana resolution remains local and provider-owned. Dedicated single-character Kanji lookup retrieves Kun/On readings, meanings, stroke count, grade, JLPT level and frequency. Requests include a Cognis User-Agent, a 15-second timeout and safe failure logs. Transport failures are errors, not empty matches.

## Composer imports

One match fills the open composer. Multiple matches use a horizontal preview chooser with selection and confirmation. Vocabulary lookup preserves authored input and composition tokens. Pronunciations and definitions are committed immediately; each gloss, including semicolon-separated meanings, is a separate definition. Cognis supplies optional missing-language translation through its localization capability; the module neither invents translations nor copies English into other languages. Source URLs and complete original records are retained only in hidden `dictionary_data` metadata.

## Reading graphs

Multi-reading Kanji imports use one hidden Vocabulary record per complete reading, with a backlink to its source Kanji, ordered Kana pronunciation links and direct definitions. Single-reading Kanji links directly to Kana. Word pronunciation wrappers prefer the nearest authored Kanji-reading segments and remaining Kana. Cognis resolves installed identities, reuses matching hidden intermediates on repeated imports, and validates fields, scope and ACLs before committing the entire graph atomically. Characters and particles remain provider-owned. Redundant Katakana echoes of Hiragana are filtered unless the dictionary declares that spelling; authoritative on-readings and genuine loanword readings are preserved.

## Core cache ownership

Cognis core owns dictionary caching through `core:cache`. Queries become cold after one hour and are probed on subsequent use. Changed results are published at twelve-hour boundaries; unchanged results retain their content. Concurrent queries share a probe, failed probes retain successful cached data, and persisted cache survives restarts. Modules neither schedule dictionary queries nor maintain dictionary-response caches. Jisho has no lightweight change feed, so a probe uses its ordinary search response. There is no manual Refresh control. Local links resolve against currently accessible Library entries.

## Stroke asset caching

KanjiVG stroke assets use a separate module-local bounded lookup cache: at most 512 labels, successful responses for 24 hours and missing assets for five minutes. Concurrent lookups share requests and failures are discarded. This asset cache does not govern dictionary search or app navigation. Jisho and KanjiVG share the deterministic content-shard loader in `reuse/content.js`; the stroke provider consumes `reuse/lookup-cache.js`.

## Sentence import limits

Jisho’s word API provides forms, readings, senses and parts of speech, but no arbitrary sentence translation, token offsets, inflection alignment or particle attachment. Reliable one-click sentence import still requires a morphological analyzer, sentence translation provider and module-owned graph planner that preserves original surfaces, punctuation and transformed readings. Jisho can enrich lexical nodes but cannot provide this pipeline alone. No sentence-import capability is advertised.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

## Common dictionary entries

For equally exact matches, Jisho entries marked is_common rank ahead of uncommon entries. Exact matches still outrank related matches. Jisho provides no per-sense frequency marker: definitions retain its original sense order, including room first for 室, rather than being reversed by the composer.

## Dictionary transformations

Transformation choices align titles, readings and definitions in a single column within each card. The base-form action uses the neutral button style. Dragging displays a vertical insertion marker before or after the destination placement. Jisho imports retain supported conjugation-family tags on vocabulary cards; newly created verbs enter the transformation chooser before being added to a parent composition. Adverbs retain their lexical classification; the current Japanese schema declares no adverb transform sets.

Dictionary providers may return prerequisites: an array of { key, layer, label } lookup targets. After a composer match is selected, Cognis resolves existing compound-writing cards at the intended scope or retrieves and creates missing cards with their definitions and reading graph. Atomic characters and particles cannot be created through this path. Alias keys resolve to canonical IDs in root and hidden-reading references. Vocabulary input remains unchanged, and imported spelling references are used only while the input still matches the lookup. Search result browsing never creates prerequisites.

Missing required fields are completed through registered auxiliary lookup providers before persistence; Kanji stroke patterns come from KanjiVG. Each Kanji, its definitions and hidden readings commit as one validated scoped graph.
