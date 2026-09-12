# Deferred work

## Filter-aware grid holes after content deletion

The Cognis Library renderer currently converts every schema grid ID whose record has been deleted into an anonymous blank card. Because the Kana grid interleaves Hiragana and Katakana IDs to keep its four intentional gojūon gaps stable under the character-class filter, deleting all Hiragana records leaves those missing IDs as unfilterable blanks in the Katakana view. This cannot be corrected by content-pack relationships or metadata: the supported grid item contract accepts only record IDs, numeric display IDs, `null`, and `{ "blank": true }`, and anonymous fallback blanks carry no filter values.

The host Library should omit unresolved record IDs during browsing while continuing to render explicit `null` or `{ "blank": true }` placeholders. Once that behavior is available, this module's existing four explicit placeholders will preserve the intended chart gaps without exposing deleted records as extra cells.

## Direct links for referenced pronunciation entries

Kanji records already point their `readings` references at complete Vocabulary records such as `ja:word:reading-nichi`; they do not point directly at the individual `に` and `ち` Kana records. The current Cognis Library popup independently resolves each string in the Kanji `pronunciation` field through writing-unit layers only, so it bypasses the declared `readings` reference and constructs links to individual Kana instead.

The host popup should first match a pronunciation string against the entry's direct references whose relationship has `presentationRole: "pronunciation"`, and use that complete referenced entry as the link. Generic writing-unit composition should remain only the fallback when no direct pronunciation reference matches.
