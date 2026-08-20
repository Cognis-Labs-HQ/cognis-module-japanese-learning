# AI Instructions for Cognis Japanese

These instructions are the module-relevant subset of the Cognis repository guidance. They apply to this entire repository.

## Session Startup

Before development, run `npm install`. Use `rg` rather than recursive `grep` for searches.

## External Module Contract

This repository delivers exactly one external Cognis module. Keep `manifest.json`, `package.json`, `routes.json`, `bootstrap.js`, and every declared entrypoint at the repository root or its declared repository-relative path. Preserve the module UUID permanently and use component UUIDs for every `requires` entry.

Keep versions in `manifest.json`, `package.json`, and `package-lock.json` synchronized. Keep `package.json` configured with `type: module`, keep `routes.json` as an array, and use exact filename casing. After the final file change, run `npm run manifest:hashes`; never include `manifest.json` in its own digest inventory.

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
