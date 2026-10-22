# Complete Godan Verb Forms

**Feature Branch:** fix-dictionary-godan-forms

## Resolve Regular Verb Forms

Regular Japanese Godan verbs ending in ru, u, tsu and nu now have provider-owned transformation sets and exact dictionary class mappings. For example, 帰る offers 帰ります, 帰らない, 帰った and 帰って. The special ある paradigm remains separate. The content revision updates the host Library schema on enable.

## Use Explicit Transformation Flags

Japanese base cards and dictionary results declare explicit transformation flags. Collective plural uses one productive, optional family; 私 generates 私たち without a separate card. Existing rule paths retain their packaged recordings and generated character patterns.

## Preserve Recordings and Writing

Existing path-bound recordings retain the designated Japanese voice and exact constituent audio. Coverage tests require matching recordings for every enabled source and rule, including newly added flagged cards. The host resolves stroke patterns from generated spelling.

Regular Godan-gu and Suru rules cover new dictionary verbs. Suru uses ordered suffix alternatives to support both 勉強する and the nominal stem 勉強, without creating a separate root card. Exact spelling and reading checks cover polite, negative, past, te, potential and chained causative forms.

## Keep sentence vocabulary discoverable

Sentence-structure carousels explicitly declare `excludeFromBrowse: false`, so their lexical words also appear in Vocabulary. Punctuation-only carousels remain excluded. Tests cover every sentence vocabulary reference, hidden pronunciation aliases and optional filter coverage, including unlevelled words such as ノート in Japanese.

## Meaningful pills and JLPT filtering

Learner pills show localized grammatical classes, common-use status and JLPT levels, while technical form and transformation tags stay internal. Vocabulary and Kanji now have source-checked levels for 225 and 190 cards respectively; unlisted or ambiguous items remain unclassified. The packaged proficiency inventory records Jisho evidence, matches authored readings and meanings, and selects the earliest learning level when several lists apply.

Kanji and Sentences offer the same compact N5–N1 filters as Vocabulary, with no automatic initial selection. Sentence levels are estimates based on the hardest referenced vocabulary, basic particle or selected transformation; an authored level can impose a grammar minimum. A sentence must include that level and no harder requirement to match it. Missing constituent levels remain unclassified and visible in the unfiltered view. Grammar estimates are provider-authored study targets, not official JLPT certification.

## Generic difficulty profiles

Both Study modules use the canonical `difficulty_level` field. Their identical normalizer and contract tests read `data/library/difficulty.json`; labels, ordered options, source tag mappings, basic-layer defaults and transformation requirements are data. Japanese presents JLPT N5–N1; English uses its existing beginner/intermediate/advanced categories. Unknown values remain unclassified. The host ranks declared fields without language-specific rules or alternate field names.

## Commits

- [5b21f1d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5b21f1d569cac8d037c0c62503c96839d2e5056f)
- [4233c508](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4233c508ff1357283bcb523b810adf076308a3ed)
- [4cd4b1cb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4cd4b1cb4c630b41ed6c577dfb159a4d6caa2566)
- [31035eeb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/31035eeb63b25a5f20bf3f507cd6d37c3a5adcfb)

Implementation reference: [`fe471e10010e1fb979701fa58970c1f9fe20a3ad`](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/fe471e10010e1fb979701fa58970c1f9fe20a3ad).
