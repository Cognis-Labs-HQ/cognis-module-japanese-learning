# Guided tutorial

The account menu lists this module’s introductory play when its UI provider is enabled and the current account has access. The host must provide the version-one `ui:tutorials` contract.

## Usage Examples

Explore and Flashcards routes are resolved by Study’s public `study:tutorialTargets` capability. The language module contributes language data and plays only; Cognis retains route, enrollment, cache and learning UI ownership. English and Japanese use the same provider implementation. Cached content can be explained offline. Targets that are missing after navigation follow the host missing-target policy.

## Technical Specification

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.
