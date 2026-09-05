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

Because the language descriptor declares no executable child pages, Cognis Study supplies the generated Library destination at `/study/library?language=ja`. The validated language query remains attached to Library links, detail navigation, direct loads, and browser history; authenticated learners may browse while Library scope rules continue to protect authoring and publishing.

The content-pack manifest records its publisher, immutable package version, content revision, schema and content paths, and license. `schema.json` declares Japanese-specific layers, typed fields, relationships, cardinality, ordering, and resolvers. Content files use stable pack-local IDs and explicit references.

Pack-local record IDs use only portable lowercase ASCII letters, numbers, separators, and colons; Japanese glyphs belong in `label`, never in `id`. This keeps ingestion compatible with the Library content-record identifier contract.

The schema and pack share the `ja` namespace, and every record ID begins with `ja:`. Schema, layer, field, and relationship metadata provide localized labels in German, English, Indonesian, and Japanese. Semantic roles, typed values, detail hints, activity compatibility, interest veins, required targets, ordered positions, deletion behavior, and resolver roles allow Cognis to generate neutral interfaces and enforce the complete contract.

The external module manifest publishes `/static/modules/study-language-ja/languages` so Cognis can translate marketplace metadata before module bootstrap.

The published language descriptor provides the canonical `code` value `ja` as well as the compatible `languageCode` value. Cognis PR #215 uses that code to annotate the active language button and preserve the selected language in router history when a Study sub-navigation destination is opened.
