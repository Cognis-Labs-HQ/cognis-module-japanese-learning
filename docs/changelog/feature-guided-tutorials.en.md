# Guided tutorial

**Feature Branch:** feature-guided-tutorials

Study separates its general navigation guide from language content guides. Enrolled language guides replace generic Explore and walk through real card details, drawing and card creation using conditional branches and scoped lifetimes.

## Technical Specification

Explore and Flashcards routes are resolved by Study’s public `study:tutorialTargets` capability. The language module contributes language data and plays only; Cognis retains route, enrollment, cache and learning UI ownership. English and Japanese use the same provider implementation. Cached content can be explained offline. Targets that are missing after navigation follow the host missing-target policy.

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

## Page-bound First Visits

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

## Module Translation Keys

Tutorial translation keys use the complete manifest module ID as one namespace segment, including its hyphens.

## Actionable Tutorial Copy

Tutorial steps focus on the controls and tasks available on the page, without unrelated reassurances about permissions or actions the guide does not perform.

## Author Next cues per step

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.

Tutorial coverage is required for every UI-facing component. Contributor guidance requires user-first, task-focused walkthroughs and a review of existing tutorials whenever features or UI behavior change.

## Visible tutorial regions

Tutorial regions and Next cues are authored explicitly.

## Shared floating-menu queue

Menus follow the shared queued host contract and component lifetime.

## Documented recovery controls

Missing-target views provide Next and Restart Tutorial; replay also provides Cancel.

## Intentional tutorial guidance

Tutorials explain distinct visible controls in UI order. Shared guidance covers active-view discovery, stable examples, empty states, conditional branches and lifecycle cleanup. Replay controls and reduced-motion documentation match the shared host.

## Focused Walkthrough

Language guides are available only after explicit enrollment in Study settings. The redundant enrollment introduction is removed; the guide begins with Explore and continues to practice tools.

## Consistent Translation Catalogs

Translation keys use lowercase period-delimited words throughout the module metadata and tutorials. Catalog entries retain their original translated values and match the surrounding XML indentation. Strict namespace checks reject hyphens and underscores in translation keys. Module IDs, UUIDs, capabilities and tutorial completion identities remain unchanged.

## Commits

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
- [6429024](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64290246cd5ef8567402e71e22921a3e28f36d76)
- [e6768d1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e6768d18e5e9e78eb456e25ce2c8d935214683b8)
- [8696a30](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8696a3069f18388c39b7c13bd2ea59f569c25a85)
- [8946fb9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8946fb98097d13ebd923e1c2354d13ef1e0545c3)
- [0c2bcf9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0c2bcf9e65dc2bf8c27b533d77b9456d73985070)
- [646a16c12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/646a16c12d8bfa98ca71b09a074fa70d505851e5)
- [028167419](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/028167419f103c6d3b2bb9df4ff25a47f3e06080)
- [3aa7d0981](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3aa7d0981544552f9cbb1fbf153328b5ff064ede)
- [f102f36dc](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f102f36dc038d1858c0fcd89afae3da0298aeea4)
- [a17bea4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a17bea405b1ea24c516b570dce1838600eafbed3)
