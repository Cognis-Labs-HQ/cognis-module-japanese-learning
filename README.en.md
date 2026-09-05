# Cognis Japanese

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanese is a declarative Japanese content pack for the Cognis Study Library. It provides a versioned schema and validated character, definition, word, and sentence records without owning API routes, persistence, or browser interfaces.

## Requirements

- Cognis with the Study gateway and Library adapter enabled.
- The `study:library` host capability.

The external module declares the Study gateway as its component dependency. It discovers the Library adapter through the required `study:library` capability rather than treating the adapter UUID as an independently installable component.

## Development

```sh
npm install
npm test
npm run check:manifest
```

During bootstrap, the module obtains `study:library` through `ctx` and calls `ingestContentPack` for `data/library`. Cognis owns path safety, graph validation, stable internal IDs, transactions, idempotency, persistence, API routes, and schema-generated Study interfaces.

The content-pack manifest records its publisher, immutable package version, content revision, schema and content paths, and license. `schema.json` declares Japanese-specific layers, typed fields, relationships, cardinality, ordering, and resolvers. Content files use stable pack-local IDs and explicit references.

Pack-local record IDs use only portable ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

The external module manifest publishes `/static/modules/study-language-ja/languages` so Cognis can translate marketplace metadata before module bootstrap.
