# Cognis 日本語

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis 日本語は、Cognis Study ゲートウェイ向けの日本語学習コンテンツを提供する外部モジュールです。日本語の言語記述、ひらがなアクティビティ、スコープ別ライブラリブラウザー、教室画面、日本語学習データセットを収録しています。

## 利用側向けテンプレート

利用側は `study:library` ケイパビリティから、必要な階層だけを指定して `cloneTemplate` を呼び出します。複製されたテンプレートは標準順序と階層関係のメタデータを保ち、省略した階層へのリンクを除き、必須の依存関係を示します。単語や文の作成時には、正規化された文字や空白で区切られた単語からリンクを推定でき、明示的な参照が常に優先されます。

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

このモジュールは `/study/hiragana`、`/study/library`、`/study/ja-classroom` を登録します。認証が必要な多層ライブラリ API は `/api/v1/modules/study-language-ja/study/library` 以下で利用でき、グローバル・クラス・ユーザーの各スコープ、依存関係の追跡、JSON・Anki 交換、審査付きプッシュリクエストに対応します。

manifest はモジュール所有の言語バンドルとして `/static/modules/study-language-ja/languages` を公開し、Cognis が UI の読み込み前にマーケットプレイスのメタデータを翻訳できるようにします。

このリポジトリは、Cognis の `feature-remove-modules-from-administration-page` ブランチにある日本語モジュールから抽出され、[Jitsi Meet](https://github.com/Cognis-Labs-HQ/cognis-module-jitsi-meet/pull/1) と [Nextcloud Whiteboard](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/pull/1) で確立された外部モジュールのパッケージ形式に従っています。

## ライセンス

AGPL-3.0-or-later。[LICENSE](LICENSE) を参照してください。
