# Scoped Study Library

**Feature Branch:** work

## Multi-Layer Library

Replaced the packaged-file library with the database-backed Study library from Cognis PR #196, including nine validated layers, reference tracing, scoped access, JSON and Anki interchange, and reviewed push requests.

## Library Browser

Updated the localized library page to browse populated global layers through the host page composer.

## Consumer-Selectable Templates

Consumers can clone only the canonical library layers they need. Relationship metadata retains valid links and required dependencies, while word and sentence creation can infer appropriate links.

## Module-Owned API Routes

Moved every library endpoint into the module-owned API namespace so Cognis can enable the module without rejecting protected Study gateway routes.

## Localized Study Navigation

Restored the Japanese Study sub-navigation on the library page, localized all three child-page labels from the module bundle, and routed clicks through the Cognis host router on every Japanese Study page.

## Commits

- [8dc42b2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8dc42b26ee4c0fdf71e3b6e3961d2d5c22e60583)
- [9c0119a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9c0119a1f9b9cd4df94c4b941786698ca37a04c1)
