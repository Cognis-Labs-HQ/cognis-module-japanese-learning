# Cognis Japanese

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Cognis Japanese is the external Japanese learning content module for the Cognis Study gateway. It packages the Japanese language descriptor, hiragana activity, scoped library browser, classroom surface, and Japanese learning datasets.

## Consumer Templates

Consumers obtain the library through the `study:library` capability and call `cloneTemplate` with exactly the layers they need. Clones retain canonical ordering and layer relationship metadata, discard links to omitted layers, and identify required dependencies. Word and sentence creation can infer links from normalized characters and whitespace-delimited words; explicit references remain authoritative.

## Requirements

- Cognis with the Study gateway enabled.
- The `auth:requireAuth` host capability.
- An administrator or owner account to change library records.

## Development

```sh
npm install
npm test
npm run check:manifest
```

The module registers `/study/hiragana`, `/study/library`, and `/study/ja-classroom`. Its authenticated, multi-layer library API is available below `/api/v1/study/library`; it supports global, class, and user scopes, dependency tracing, JSON and Anki interchange, and reviewed push requests.

The manifest publishes `/static/modules/study-language-ja/languages` as its module-owned locale bundle so Cognis can translate marketplace metadata before loading the UI.

This repository was extracted from the Japanese language module on Cognis's `feature-remove-modules-from-administration-page` branch, following the external-module packaging established by [Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) and [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1).

## License

AGPL-3.0-or-later. See [LICENSE](LICENSE).
