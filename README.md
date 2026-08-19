# Cognis Japanese

Cognis Japanese is the external Japanese learning content module for the Cognis Study gateway. It packages the Japanese language descriptor, hiragana activity, library administration surface, classroom surface, and the language's character, definition, word, and sentence datasets.

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

The module registers `/study/hiragana`, `/study/library`, and `/study/ja-classroom`. Its authenticated library API is available below `/api/v1/study/languages/ja/library`.

This repository was extracted from the Japanese language module on Cognis's `feature-remove-modules-from-administration-page` branch, following the external-module packaging established by [Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) and [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1).

## License

AGPL-3.0-or-later. See [LICENSE](LICENSE).
