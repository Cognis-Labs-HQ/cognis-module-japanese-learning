# Optional JLPT Filters

**Feature Branch:** feature-replace-library-with-new-implementation

## Ship seeded pronunciation recordings

Spoken seed cards include deduplicated offline-generated MP3 files and voice attribution. Sentences continue using ordered constituent playback.

## Register scoped audio retrieval

Both Study modules expose the same removable audio-provider contract and retrieve bundled recordings with bounded local reads. The host owns authorization, cache policy and composite playback.

## Package targets and developer guidance

Release 2.2.107 — Package validation checks that entrypoints, icons, banners and screenshots are regular files inside the checkout, including resolved paths. Documentation describes public contracts and refers to manifests for release metadata; changelogs retain release provenance.

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

## Unify Study pronunciation presentation

Study provides public pronunciation classification and styles reused by Library previews, detail headings, variants, flashcard answers and reading choices, and the drawing pad. IPA keeps its authored notation; ordinary readings keep the selected app typography. Both Japanese and English sentence schemas require at least two word references.

## Require language keys without literal fallbacks

AI instructions prohibit hardcoded English user-facing strings in every path. Missing preferred-language values may use the same keys from English XML resources; absent or empty English fallback values must fail explicitly instead of rendering literal English, raw keys, or blank text. Missing-translation errors must not be suppressed.

## Return complete dictionary graphs

Jisho candidates without a complete Kana reconstruction are rejected. Multi-reading Kanji children link directly to definition siblings in the same import graph, while Kanji and unmapped vocabulary receive semantic classes.

## Preserve Kanji reading stems

Dotted Kun notation retains only the Kanji stem: `おし.える` produces `おし`, while the original notation stays in hidden metadata.

## Sample smooth quadratic curves

Smooth quadratic SVG commands reflect the previous quadratic control point, and cubic/quadratic histories remain separate.

## Bound remote stroke requests

Stroke lookup accepts at most sixteen writing units, shares one fifteen-second deadline across the glyph requests, and cancels bodies exceeding one million bytes.

## Study module layout

The content pack lives in `data/library/`: its manifest, schema, and content shards form one ingestion and deletion boundary. Starter decks remain in `data/starter-decks.json`. Runtime providers live in `api/dictionary/` and `api/strokes/`; deterministic shard loading and byte-bounded response decoding live in `api/reuse/`. Cross-layer content and lifecycle tests live in `tests/`, while provider, transport, and API tests live in `api/tests/`. The manifest declares `api/routes/config/index.js` as `disabledApi`; that entrypoint registers only the administrator-only configuration DELETE route and does not ingest content or activate providers. Published flow identifiers remain stable.

## Paced composition and replacement

Seed recordings use the offline Kokoro multilingual neural model with the English `bf_emma` and Japanese `jf_alpha` voices. Clips are encoded at 128 kbps with a 200 ms lead-in, a 180 ms tail, bounded peak normalization and slower speech. Model attribution and Apache licensing are recorded in `data/audio/VOICE-LICENSE.txt`; the recording inventory records the voice and processing settings.

An audio field is optional on sentence cards. On first playback Cognis authorizes every constituent, selects only the first pronunciation group, applies selected transformations, and creates one continuous WAV with a quiet lead-in and deliberate word, comma and sentence pauses. The generated recording is cached privately; constituent bytes, reading changes, transformations and pacing affect its identity. It is generated on demand for new cards as well as existing cards. Uploading an audio file in the normal composer replaces generated playback immediately. Removing that explicit file restores automatic composition. Providers supply lexical clips; Cognis owns composition and cache policy.

## Reference inventory coverage

The Japanese reference catalog includes all 13,108 characters in the packaged official KANJIDIC2 snapshot. The English catalog includes all 135,969 Open English WordNet lexical entries (127,311 normalized keys). These are separate lazy dictionary providers, not 149,077 eagerly imported seed cards. Choose Reference Dictionary in Study search to import supported entries through the normal graph validation. Source records without meanings or usable readings remain unknown; no pronunciation, translation or stroke diagram is fabricated. This inventory is not all Unicode Han and is not a claim to enumerate every possible English word.

Japanese Kanji readings are ranked from common JMdict attestations and available frequency markers, including okurigana forms; grouped links and seed audio follow that exact order. Kanji playback always uses the first authored pronunciation. Existing English word cards have one authored IPA reading; reference entries preserve authoritative order within the preferred British variety before other varieties. Pronunciation frequency depends on context, and the sources do not provide a universal frequency rank for every reading.

## Whole-reading reference audio

Japanese additionally ships 2,913 whole-reading neural clips in bounded banks under `data/audio/reference/`. Together with seed recordings they cover the primary readings of all 12,356 source characters that have a reading; the remaining 752 source characters have no recorded reading and do not receive invented audio. The bank index selects the first authored reading and checks file bounds and cancellation. Generate a plan with `python3 scripts/reference-audio.py plan --work <directory>`, render its inventories with the synthesis script, then use `pack` to write the bounded banks.

The Japanese ranking tool accepts `--dictionary <JMdict.gz> --kanji-dictionary <KANJIDIC2.xml.gz> --output <priorities.json>` and optional `--content-root data/library/content`. It prefers common standalone lexical readings, ranks other readings from frequency-weighted alignments of attested words, and preserves reviewed isolated-card choices from `data/audio/primary-readings.json`. Voicing and gemination map back to canonical source readings. Kun, on and name readings remain available; a selected first reading alone determines playback and lookup cache identity. Source frequency markers are an ordering aid, not a universal pronunciation-frequency measurement.

## Optional speech integration

ElevenLabs is declared as an optional module dependency. Installation can offer it for speech synthesis, but Study enablement and manual or composite audio remain available without it.

## Publish speech without privilege

Publish `elevenlabs-tts:synthesis` within the module-owned namespace and remove the privileged flag. English and Japanese Study resolve this capability through ctx using their existing optional module dependency. The Study bridge receives the live capability getter from its caller, preserving provider disable/re-enable and configured voice handling.

## Keep speech optional

The published capability reports live `configured` readiness. Study enables automatic speech only after both the API key and default voice are saved. If ElevenLabs is absent, disabled, or unconfigured, language registration still succeeds and uploaded audio and composite fallback remain available; no synthesis is requested.

## Fix installation without bundled media

Remove the unused asset-directory declaration from the data-only content pack and advance its version. Validate declared pack paths against a temporary installation built solely from packaged files, preventing activation from depending on empty checkout directories.

## Ship consistent voice recordings

Package designated-language recordings for every spoken curated card and reachable plural or verb/adverb variant. Sentence WAV files reuse exact ordered constituent PCM, including selected transformations. Voice/model/request provenance, digests and silence checks are recorded; no credentials are bundled.

## Saved Study Controls

Japanese small-kana word recordings, including 学校, are regenerated using kanji spelling where available, with the designated Japanese voice and stable settings. Packaged sentences are rebuilt from those exact clips. I- and na-adjective transformations include adverbial, negative and past forms, with dedicated recordings for curated forms. English plural recordings remain dedicated assets and are reached by selected-form playback.

## Reference Images

Add optional image-list fields, private image uploads and detail galleries. Both language modules bundle a licensed reference photograph and expose the same field on every layer.

## Direct Sentence Audio

Shipped sentences use directly generated whole-sentence recordings before composite audio. New or unrecorded sentences use host composition with the exact ordered constituent PCM and selected transformations; missing variants never substitute their base form. Recordings cover the curated pack, not every lazy dictionary entry or possible user-authored sentence. Includes 34 newly generated sentence recordings using voice `xya0RvcJtofTcFTOdX4E`. Japanese regenerates 124 kana clips and sends kana/kanji rather than romaji. Requests retain documented stable model, speed, similarity, seed and voice provenance.

## Vocabulary Reference Photos

33 curated vocabulary cards now have bundled reference photographs (32 image files). Coverage includes every concrete noun plus visually clear actions and qualities; grammar, pronouns and other abstract concepts do not receive misleading filler images. Japanese homophones such as 花/鼻, 橋/箸, 雨/飴 and 紙/髪/神 use distinct references. Images load locally through the existing card detail gallery and full-image preview. Source titles, creators, individual Creative Commons/public-domain licenses and file checksums are recorded in [the image catalog](../../data/library/assets/images/catalog.json) and [photo credits](../../data/library/assets/images/LICENSE.md). Existing custom card images remain protected by the host during provider reloads.

## Vocabulary Illustrations

Every shipped vocabulary card now has its own generated anime-style illustration (70 cards). Concrete objects, actions and contextual scenes for abstract concepts use the existing card-detail gallery and full-image popup. The old source photographs have been replaced. [The image catalog](../../data/library/assets/images/catalog.json) records generation source, style, crop provenance, checksums and card assignments; [image licensing](../../data/library/assets/images/LICENSE.md) describes the bundled artwork. Images load locally, and the host preserves custom user images during provider reloads.

## Household Vocabulary

Fifteen everyday nouns cover furniture, clothing, objects and food, with four-language meanings, pronunciation links, dedicated recordings and a Household Essentials deck. English countable nouns include recorded plural transformations, including unchanged plural fish; rice remains a mass noun. Japanese beginner spellings link complete readings to atomic kana, including the long-vowel mark ー used in テーブル and コート.

## Food and Body Vocabulary

Add 32 illustrated nouns: sixteen food items and sixteen body terms, with four-language meanings and separate Food and Body starter decks. English includes 25 recorded number transformations, including feet, teeth, potatoes and voiced mouths, while mass-noun senses such as chicken meat, beef, butter and skin have no plural family. Japanese keeps complete atomic-Kana paths, distinguishes both meanings of あし with separate foot and leg definitions, and reuses existing native recordings when pronunciation inputs are identical. Four individually authored example sentences per language have direct neural recordings that take priority over exact-constituent composite fallbacks. All illustrations are bundled locally in the established language-specific art style.

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
- [2476657](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2476657ff36854d1a0688680cb9097f2585dad16)
- [5df0f61](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5df0f611c9161f100508565013ea6d43edb2e897)
- [4d7712d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4d7712d1eacf7bbfecf6a48bf6bffc3133afc046)
- [0d7a90cf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0d7a90cf679be17bfc39d430ca7552e2a679c74b)
- [6a0ed76b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6a0ed76b5c9afa7d7ab1352cd002630b0b334f90)
- [4b2be811](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4b2be81112494881d4e87e56d19bf94bc1ea801d)
- [293ce22](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/293ce2259636c1c527f4e8b477782f6fc2153198)
- [c6fa056](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c6fa05621ba5a97c218d2aafab91e10e6a2d305c)
- [35759eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/35759eb887310f2bec217c4e4335b0a07323c2f6)
- [13244eb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13244eb79d34f999d74def0e47fe67700fbfb42e)
- [4f906f3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4f906f37c3a33d8b38352f917fd771413c4e98e5)
- [b2de30f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2de30f212b0b9ae28a67008c0393c1116b2fca0)
- [b0b657d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0b657d09fdc6d8c8ce9ac1388907f25a89304a3)
- [f729231](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f72923181dd412aa76c7501056b19318367524e4)
- [97b6e4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/97b6e4d20c01a036f30309663731342f7941ad10)
- [5e5849b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5e5849bf9218b5441070a81ac661b7498b684c59)
- [e4c848b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e4c848bcb8d331facdd92f4696b1009de4f1f1d9)
- [544892a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/544892a8987304d982b2953676f5ddc39eb9c728)
