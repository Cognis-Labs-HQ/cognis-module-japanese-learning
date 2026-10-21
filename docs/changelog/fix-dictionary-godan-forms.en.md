# Complete Godan Verb Forms

**Feature Branch:** fix-dictionary-godan-forms

## Resolve Regular Verb Forms

Regular Japanese Godan verbs ending in ru, u, tsu and nu now have provider-owned transformation sets and exact dictionary class mappings. For example, 帰る offers 帰ります, 帰らない, 帰った and 帰って. The special ある paradigm remains separate. The content revision updates the host Library schema on enable.

## Use Explicit Transformation Flags

Japanese base cards and dictionary results declare explicit transformation flags. Collective plural uses one productive, optional family; 私 generates 私たち without a separate card. Existing rule paths retain their packaged recordings and generated character patterns.

## Preserve Recordings and Writing

Existing path-bound recordings retain the designated Japanese voice and exact constituent audio. Coverage tests require matching recordings for every enabled source and rule, including newly added flagged cards. The host resolves stroke patterns from generated spelling.

Regular Godan-gu and Suru rules cover new dictionary verbs. Suru uses ordered suffix alternatives to support both 勉強する and the nominal stem 勉強, without creating a separate root card. Exact spelling and reading checks cover polite, negative, past, te, potential and chained causative forms.

## Commits

- [5b21f1d5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5b21f1d569cac8d037c0c62503c96839d2e5056f)
