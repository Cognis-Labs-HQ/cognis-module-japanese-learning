# Complete Jisho results

The Jisho provider now returns every reading with ordered Kana groups, a separate importable definition for each sense, lexical classification, JLPT/common-word tags, and its source URL. It declares the dictionary capability through `study:library:provider` registration. Full source records—including alternate forms, parts of speech, sense notes, restrictions, dialects, related terms, and attribution—are retained as JSON in the optional hidden `dictionary_data` schema field.

## Usage

Cognis PR #226 supplies the common result preview, definition import, and missing-language translation action. Providers supply authentic source translations; Cognis requests German, English, Indonesian, and Japanese through its optional localization capability. The module does not invent translations or copy English into other languages. Native content lookup still precedes the network and now preserves class and tags.

## Technical specification

Schema revision 88 and module/content-pack version 2.2.84 publish the source-data field. Import all returned senses through the host preview, or choose a subset within the host definition limit; the complete original result remains stored regardless of which senses are linked.

[StudySphere](https://gitlab.firehawk-systems.com/firehawk/studysphere/-/tree/development) · [Cognis PR #226](https://github.com/Cognis-Labs-HQ/Cognis/pull/226)

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
