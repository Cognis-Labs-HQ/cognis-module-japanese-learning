# Japanese content pack standard

The Cognis Japanese module installs declarative Japanese learning records into the host-owned Study Library while remaining isolated from Library internals, databases, APIs, and browser code.

## Usage

Enable the Study gateway and Library adapter, then enable this module. Its bootstrap resolves `study:library` from `ctx` and ingests `data/library`. Administrators and learners use the Library adapter's generated Study interface rather than a module-owned route.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library` capability rather than treating the adapter UUID as an independently installable component.

## Technical specification

### Package layout

`data/library/manifest.json` identifies the pack, immutable package version, content revision, schema, content root, publisher, and license. Each immediate content directory matches a layer in `schema.json`; JSON files contain arrays of stable records.

### Schema and graph

The schema defines `characters`, `alt-characters`, `definitions`, `words`, and `sentences`. Typed fields and directed relationships define target layers, required cardinality, ordering, and optional grapheme or longest-match resolution. Every reference targets another record in the same pack.

Pack-local record IDs use only portable ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

### Lifecycle and ownership

`bootstrap.js` obtains only public capabilities through `ctx`, asks the Library to ingest the pack, publishes the Japanese language descriptor, and logs the receipt. The host Library owns validation, namespaced IDs, transactions, idempotency, persistence, routes, and generated UI. This module registers no API or page routes and accesses no host database.

### Updates and licensing

Schema changes require a schema-version increase. Content changes require a new pack version or content revision. All bundled records use the license and attribution declared by the pack manifest.
