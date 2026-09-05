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

## Declarative Japanese Content Pack

Realigned the module with the revised Cognis Library 2.1 contract. Japanese data now ships as a versioned schema and declarative content graph ingested through `study:library`; the host owns validation, persistence, routes, and generated UI, so the duplicated module Library service, database, APIs, and pages were removed.

## Capability-Based Library Dependency

Removed the Library adapter UUID from component dependencies because Study adapters are not independently installable components. The module now depends on the Study gateway component and discovers the Library exclusively through the required `study:library` capability.

## Portable Content Identifiers

Replaced kanji glyphs in record IDs with stable ASCII identifiers while retaining the glyphs as labels, then advanced the content-pack version and revision so corrected bytes can be ingested safely.

## Commits

- [bc9d634](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bc9d6340c32cf5bcc867b1ea4e7d58307a04e77f)
- [dc40e68](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/dc40e68bbfbd1927aecb5c27b14087a4d384b6ba)
- [dc825e6](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/dc825e6c9ea63b86137bcab8a1d4c9d84c95fef3)
- [8a3f1c2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8a3f1c27a7d7f605fa792e72be298f7bd175c7b3)
