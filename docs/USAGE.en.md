# Usage

Study Japanese Kana, Kanji, vocabulary and sentences in Cognis Study.

## Prerequisites

Enable the Japanese language pack and enroll through Study. Dictionary lookup and optional generated speech depend on configured services; bundled content remains separate.

## Examples

Select Japanese in Study and choose an Explore layer. Open a card to follow its authored readings and related entries, or open Flashcards to practise a deck.

### Usage

Enable the Study gateway and Library adapter, then enable this module. Its bootstrap resolves `study:library:provider` from `ctx` and ingests `data/library`. Administrators and learners use the Library adapter's generated Study interface rather than a module-owned route.

Learner layers appear in the Explore side menu at `/study/<ISO language>/<navigationSlug>`. Modules declare the optional unique `navigationSlug` on each layer; its layer ID is used when omitted. Library and Requests keep their existing routes. Only sentence previews truncate long titles and definitions; other layers retain their rendering.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library:provider` capability rather than treating the adapter UUID as an independently installable component.

### Kanji-to-Kana Usage Dependencies

Kanji must never reference atomic Kana directly. A Kanji reaches Kana only through its complete reading record, so inverse Used By navigation exposes the immediate reading first (`あ` → `あめ` → `雨`) instead of incorrectly listing every Kanji that happens to contain that Kana.

### Use The Guide

Enroll in the language through Study settings. Visit its Explore page for the first-time guide, or choose the language guide from ? on the Study overview. That deliberate choice opens the language contents. Starting from Explore preserves the current layer. Completed guides only replay through ?.

Open the highlighted card to inspect its details, and choose Draw when available to try writing and its tools. Next skips branches you leave unopened. The creation branch opens the card-type chooser and editor; it may switch to a layer where cards can be created. No card is submitted automatically. Back, Restart and completion close tutorial surfaces while retaining normal discard confirmation.

## Expected Results

Cards retain their authored meanings and complete reading links. Drawing and audio use the matching content; generated transformations are resolved by Cognis.

## Troubleshooting

Check enrollment and module enablement when Japanese is missing. A missing reading or recording must remain unavailable rather than substituting an unrelated card or base-form recording.
