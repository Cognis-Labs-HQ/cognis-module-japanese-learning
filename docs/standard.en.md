# Cognis Japanese Module

The Cognis Japanese module provides an installable Japanese learning experience for the Cognis Study gateway, including kana and kanji data, a learning library, and classroom entry points.

## Usage Examples

- Open `/study/hiragana` to explore the hiragana alphabet.
- Open `/study/library` as an administrator to review and extend the module's learning records.
- Open `/study/ja-classroom` to start a Japanese classroom session through Study.
- Request `/api/v1/study/library/entries?scope=global` with a valid Cognis access token to read global library entries.
- Resolve the `study:language:ja` capability to integrate the language descriptor without importing module internals.

## Technical Specification

The module is an external Cognis extension. Its permanent UUID identifies it across releases, and its `requires` entry declares the Study gateway by UUID.

### Integration Contract

- `bootstrap.js` is the only platform integration entrypoint.
- The supplied `ctx` is the only cross-component bus for routes, UI registrations, capabilities, and flow hooks.
- Runtime imports remain repository-relative and never access Cognis internals or sibling components.
- Scoped registrations are removable when the module is disabled or uninstalled.
- The uninstall hook records the requested lifecycle cleanup without directly deleting packaged learning dataset files; those files remain owned by the module package and are removed with the package itself.

### Security

- Library endpoints authenticate requests before reading or changing data.
- Global library writes require an administrator or owner. User and class writes are scope-authorized, while all entries validate layers, fields, and reference relationships at the API boundary.
- API responses use stable public errors without exposing implementation details.
- Failures are sent to the host logger with safe structured metadata.

### Release Process

- Keep the versions in `manifest.json`, `package.json`, and `package-lock.json` synchronized, and never change the module UUID.
- Run `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest`, and `git diff --check` before committing a release.
- Regenerate `manifest.files` after the final shipped-file change so every repository-relative path and SHA-256 digest remains verifiable.
