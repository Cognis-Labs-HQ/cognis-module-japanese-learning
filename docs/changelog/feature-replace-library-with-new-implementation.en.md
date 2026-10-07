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

## Commits

- [26eeb3e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/26eeb3e8b152bb7ee22f5bb9dee7ba67f430cbf6)
- [941f2b4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/941f2b43d74698a049a57b125f9de3199c2b0afe)
- https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fdf23190c35562d4e355844b807986e32b67f594
