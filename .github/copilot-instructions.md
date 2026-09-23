# AI Instructions for Cognis Japanese

These instructions are the module-relevant subset of the Cognis repository guidance. They apply to this entire repository.

## Session Startup

Before development, run `npm install`. Use `rg` rather than recursive `grep` for searches.

## External Module Contract

This repository delivers exactly one external Cognis module. Keep `manifest.json`, `package.json`, `routes.json`, `bootstrap.js`, and every declared entrypoint at the repository root or its declared repository-relative path. Preserve the module UUID permanently and use component UUIDs for every `requires` entry.

Keep versions in `manifest.json`, `package.json`, and `package-lock.json` synchronized. Keep `package.json` configured with `type: module`, keep `routes.json` as an array, and use exact filename casing. After the final file change, run `npm run manifest:hashes`; never include `manifest.json` in its own digest inventory.

Pace the module's semantic version conservatively alongside the Cognis module ecosystem. Use patch releases for content additions, corrections, schema revisions that preserve the external contract, and documentation changes. Use a minor release only for a backwards-compatible external capability or entrypoint addition. Use a major release only for an intentionally breaking external module contract coordinated with the host; never derive the module major version from the content schema revision or the number of iterative changes in a pull request.

Always set `ui.stringsBaseUrl` in `manifest.json` to the module-owned locale bundle base URL so Cognis can resolve localized manifest metadata before the module UI loads.

Do not add secrets or personal data. Review new capabilities and dependencies carefully.

## Component Isolation and ctx

`bootstrap.js` is the sole system integration entrypoint. Runtime code and tests must not import Cognis internals, sibling components, or private package implementations.

Treat `ctx` as the complete cross-component bus:

- Obtain external behavior through capabilities.
- Register exported behavior through capabilities and named flow stages.
- Detect optional components through their capabilities.
- Extend flows instead of importing or editing another component.
- Keep registrations removable across disable, enable, and uninstall cycles.
- Pass authentication, authorization, request, and persistence helpers through a ctx-derived route context.

Route handlers orchestrate and validate; capabilities perform provider-specific work. Never access another component's database, gateway, adapter, or service implementation directly.

## Structure and Reuse

Keep API code in `api/`, browser resources in `ui/`, CLI controls in `cli/`, documentation in `docs/`, datasets in `data/`, and artwork in `assets/`. Put genuinely reusable layer-local code in `reuse/`. Do not create `shared`, `utils`, `helpers`, or `common` directories.

Keep files at or below 1000 lines. Prefer descriptive names over abbreviations and one- or two-letter bindings, except conventional coordinates, loop counters, row or column counters, `_`, and `id`.

## Library Relationship Authoring

- Composition references must target the closest available structural record. Prefer a complete lexical unit over rebuilding it from individual compound or atomic writing units.
- Use ordered relationships with shared positions when one composition spans multiple target layers. For example, `日本語` links to the word `日本` at position 0 and the Kanji `語` at position 1; `日本` links to `日` and `本`.
- Put Kana readings in `kana-spelling` relationships with `presentationRole: "alternateSpelling"`. Each referenced Kana record must exactly reconstruct the reading in order.
- Set a pronunciation field's `input.linkRelationship` when provider-authored references should supply its deep links. Never rely on label guessing when a direct relationship exists.
- For a Kanji card with multiple pronunciations, make that link relationship target one hidden reading-vocabulary record per complete reading. Each reading record must then reconstruct itself from atomic Kana through `kana-spelling`; ordinary vocabulary records must remain visible.
- For an opinionated compound-word pronunciation, link the largest authored reading segments through `pronunciation-readings` rather than linking every displayed Kana directly. For example, `日本語` uses hidden `にほん` and `ご` reading records; those records alone resolve onward to atomic Kana.
- Give a vocabulary record its own localized definition whenever its reading or usage has a narrower meaning than the writing unit that references it. Omit that definition only when the meanings are genuinely identical and navigation occurs through a related-entry card that can supply the source definition; title-composition, previous, and next navigation do not carry fallback definitions.
- Use multiple definition references for genuine polysemy of one lexical record. Represent homophones with distinct meanings as separate vocabulary records, each with its own definition set; do not collapse them merely because their Kana labels match.
- Store Japanese characters, vocabulary, particles, sentences, and localized meanings only in `data/library/content/` JSON files. Runtime and bootstrap code must remain language-data agnostic.
- Keep the particle inventory comprehensive rather than pruning currently unused forms. Every packaged particle must be referenced by at least one ordered example sentence so learners can inspect it in context.
- Definition records must describe the meaning of their content. Never use a definition to label a record as an example, exercise, demonstration, placeholder, or other authoring artifact; study entries and their localized definitions must be meaningful on their own.
- Never mass-produce study records by substituting particles or vocabulary into a template. Author and review every sentence for natural Japanese, exact pronunciation, localized meaning, and complete ordered composition before adding it.
- Keep sentence collections lexically and structurally varied. A content expansion must not repeatedly anchor most records on one noun, verb, or sentence frame; tests should enforce diversity for large authored batches.
- Use the conventional written form intended for study. When a sentence displays Kanji such as `猫` or `犬`, its composition must reference visible Kanji-spelled vocabulary; that vocabulary must reference the Kanji and complete hidden reading vocabulary, and those readings must reconstruct through atomic Kana. Never bypass an available Kanji or vocabulary layer by linking a sentence directly to atomic Kana.
- Treat labels, pronunciations, and relationships as one invariant graph. After changing any displayed form, update and validate every pronunciation segment and deep link end to end; stale readings or links that describe different text are release-blocking defects.
- Provider-supplied content packs must set `protected: true` in their content manifest so imported records cannot be moved or deleted as user-authored content.
- Follow the installed Study Library external-package contract. Provider metadata on manifests, schemas, layers, fields, relationships, constructors, and options must be JSON-compatible and must survive round trips. Use only built-in field types unless a custom type declares a supported declarative `validation` rule; use `assetList` and `audioList` for multiple media references. Mark non-badge learner filters with `detail.filterable: true`; badge fields remain filterable by default.
- Every schema field must declare an `input.control`. Select options and field labels must be localized in German, English, Indonesian, and Japanese. Provider-controlled classification fields should be immutable.
- Do not keep a broad `related` edge when a more precise composition, spelling, pronunciation, definition, variant, or child relationship expresses the connection.

## Changelog Entries

Store changelog entries in `docs/changelog/`; do not create or append to a root monolithic changelog. Every pull request must add one localized file for each supported language (`de`, `en`, `id`, and `ja`) using `<branch-name>.<lang>.md`, with any `copilot/` prefix removed from the branch name.

Changelog files are host-discovered documentation and must never be added to the `manifest.json` file inventory or SHA-256 digest list. `npm run manifest:hashes` must always exclude `docs/changelog/`.

Each localized changelog must use this structure:

- `# ...` — the localized release-summary title.
- `**Feature Branch:** ...` — the exact feature branch, or `N/A` for an entry with no branch provenance.
- `## ...` — one localized change point per heading for release-popup summaries.
- Body content beneath each `##` — the localized details shown on the full changelog page.
- A localized commits heading — canonical commit links associated with the change; leave the list empty only when the feature branch is `N/A`.

Translate the content of each file into its declared language. Existing changelog entries are immutable historical records except when a factual correction is required.

Every implementation commit described by the current pull request's changelog must ensure that the changelog commit list links the immediately preceding implementation commit. When this provenance update is requested immediately before implementation, finish with a dedicated final commit that changes only the localized changelog files, records the preceding implementation commit, and does not link itself.

## UI Requirements

Use the Cognis page composer and host router; never navigate with `window.location.href`, `window.location.replace`, or `window.location.reload`. Resolve user-facing text through all four XML locale files and preserve German, English, Indonesian, and Japanese key parity. Use host capabilities for timestamps, feedback, theme, fonts, and cross-component data. Do not use `alert`, `confirm`, or `prompt`. Do not add CSS comments.

## API, Security, and Logging

Validate at API boundaries and authorize before business logic. Use least privilege and safe defaults. Do not expose internal errors.

Log caught failures at `error` level with structured safe metadata including component, operation, and relevant identifiers. Log state changes at `info` level. Do not leave silent catch blocks. Do not use `Math.random()` for generated values; use Web Crypto or Node Crypto.

## Tests and Quality

Tests must run in this standalone repository and use local fakes for external capabilities. Test public routes, capabilities, and flows instead of sibling Cognis implementations.

Before committing, run:

```sh
npm install
npm test
npm run lint
npm run check:manifest
git diff --check
```

Use the repository Prettier configuration: four-space indentation, double quotes in JavaScript, and trailing commas in multiline structures. Avoid tabs and trailing whitespace. Never wrap imports in `try`/`catch`.

Every behavior change requires tests, safe logging, and synchronized documentation. Do not put AI reasoning, session notes, or process commentary in product-facing files.

## Review Discipline

Treat review comments as actionable unless they conflict with higher-priority instructions. Record intentionally deferred items in root `TODO.md` with a concrete technical reason. Keep changes focused and leave touched areas cleaner than you found them.
