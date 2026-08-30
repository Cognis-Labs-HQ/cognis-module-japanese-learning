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

## Commits

- [18a509c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/18a509c0ea6d760c0699473f4a92a5d5f61f6d62)
- [04448b6](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/04448b6899204e5495e37f702200027a967ce717)
