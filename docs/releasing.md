# Releasing

The release process keeps the external-module metadata, integrity inventory, and verification results synchronized for publication.

## Usage Examples

Run `npm install`, `npm test`, `npm run lint`, `npm run manifest:hashes`, `npm run check:manifest`, and `git diff --check` before committing a release.

## Technical Specification

### Versioning

Keep the versions in `package.json`, `package-lock.json`, and `manifest.json` synchronized. Preserve the module UUID permanently.

### Integrity Inventory

Regenerate `manifest.files` after the final file change and commit the updated SHA-256 inventory with every changed file. The manifest must not inventory itself.
