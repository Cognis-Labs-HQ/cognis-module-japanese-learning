# Guided Tutorial

The Study overview guide explains navigation and general features. This language guide explores actual learning content: layers, filters, a stable favourite/card example, card details, available audio, drawing practice and creating a card.

## Use The Guide

Enroll in the language through Study settings. Visit its Explore page for the first-time guide, or choose the language guide from ? on the Study overview. That deliberate choice opens the language contents. Starting from Explore preserves the current layer. Completed guides only replay through ?.

Open the highlighted card to inspect its details, and choose Draw when available to try writing and its tools. Next skips branches you leave unopened. The creation branch opens the card-type chooser and editor; it may switch to a layer where cards can be created. No card is submitted automatically. Back, Restart and completion close tutorial surfaces while retaining normal discard confirmation.

## Technical Specification

The module registers its stable `introduction` guide through `study:libraryTutorials` version 1, using its scoped ctx and module-owned four-language catalogs. Library owns targets, workflows and surface lifetimes; the module supplies language-specific content copy. The guide is offered only for explicit enrollment and replaces generic Library Explore on this language's pages, avoiding stacked duplicates. Removal releases its registration and restores the fallback.
