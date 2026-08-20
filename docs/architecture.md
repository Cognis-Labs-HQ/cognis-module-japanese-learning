# Architecture

The Japanese learning module contributes Japanese study content and independently mountable Study pages through Cognis's external-module contracts.

## Usage Examples

- Resolve `study:language:ja` to read the immutable Japanese language descriptor.
- Resolve `study:language:ja:library` to query the packaged Japanese learning datasets.
- Mount `/study/hiragana`, `/study/library`, or `/study/ja-classroom` through the host SPA router.

## Technical Specification

### Lifecycle and Integration

`bootstrap.js` is the module lifecycle entrypoint. It registers authenticated API and UI surfaces, contributes the immutable descriptor, exposes a read-only library capability, and contributes the descriptor to the platform bootstrap flow. The bootstrap `ctx` is the only cross-component integration bus.

### Data Ownership

The API owns boundary checks and delegates Japanese content loading, graph validation, querying, and persistence to `api/store.js`. Packaged source datasets live under `data/`.

### Browser Surfaces

The three browser entrypoints remain independently mountable Study pages under `ui/components/`. They use host-provided page contracts and are exposed exclusively through the host's static-directory and SPA-route registries.
