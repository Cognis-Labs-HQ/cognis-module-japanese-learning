# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

Explore and Flashcards routes are resolved by Study’s public `study:tutorialTargets` capability. The language module contributes language data and plays only; Cognis retains route, enrollment, cache and learning UI ownership. English and Japanese use the same provider implementation. Cached content can be explained offline. Targets that are missing after navigation follow the host missing-target policy.

## Technical Specification

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

Tutorial regions and Next cues are authored explicitly. Menus follow the shared queued host contract and component lifetime. Missing-target views provide Next and Restart Tutorial; replay also provides Cancel.

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.
