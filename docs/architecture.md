# Architecture

`bootstrap.js` is the module lifecycle entrypoint. It registers authenticated API and UI surfaces, contributes the immutable `study:language:ja` descriptor, exposes a read-only library capability, and contributes the descriptor to the platform bootstrap flow.

The API owns the boundary checks and delegates Japanese content loading, graph validation, querying, and persistence to `api/store.js`. Packaged source datasets live under `data/`.

The three browser entrypoints remain independently mountable Study pages under `ui/components/`. They use Cognis's Study page primitives and are exposed exclusively through the host's static-directory and SPA-route registries.
