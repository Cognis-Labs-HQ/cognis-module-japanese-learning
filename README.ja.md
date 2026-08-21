# Cognis 日本語

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis 日本語は、Cognis Study ゲートウェイ向けの日本語学習コンテンツを提供する外部モジュールです。日本語の言語記述、ひらがなアクティビティ、ライブラリ管理画面、教室画面に加え、文字、定義、単語、文のデータセットを収録しています。

## 要件

- Study ゲートウェイが有効な Cognis。
- ホストケイパビリティ `auth:requireAuth`。
- ライブラリのレコードを変更するための管理者または所有者アカウント。

## 開発

```sh
npm install
npm test
npm run check:manifest
```

このモジュールは `/study/hiragana`、`/study/library`、`/study/ja-classroom` を登録します。認証が必要なライブラリ API は `/api/v1/study/languages/ja/library` 以下で利用できます。

manifest はモジュール所有の言語バンドルとして `/static/modules/study-language-ja/languages` を公開し、Cognis が UI の読み込み前にマーケットプレイスのメタデータを翻訳できるようにします。

このリポジトリは、Cognis の `feature-remove-modules-from-administration-page` ブランチにある日本語モジュールから抽出され、[Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) と [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1) で確立された外部モジュールのパッケージ形式に従っています。

## ライセンス

AGPL-3.0-or-later。[LICENSE](LICENSE) を参照してください。
