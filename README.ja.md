# Cognis 日本語

[English](README.en.md) · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · **日本語**

Cognis 日本語は、Cognis Study ライブラリ向けの宣言型日本語コンテンツパックです。API ルート、永続化、ブラウザー画面を所有せず、バージョン付きスキーマと検証済みの文字・定義・単語・文データを提供します。

## 要件

- Study ゲートウェイとライブラリアダプターが有効な Cognis。
- ホストの `study:library` ケイパビリティ。

外部モジュールは Study ゲートウェイをコンポーネント依存関係として宣言します。ライブラリアダプターの UUID を単独で導入可能なコンポーネントとして扱わず、必須の `study:library` ケイパビリティを通じて検出します。

## 開発

```sh
npm install
npm test
npm run check:manifest
```

ブートストラップ時に、モジュールは `ctx` から `study:library` を取得し、`data/library` に対して `ingestContentPack` を呼び出します。パスの安全性、グラフ検証、安定した内部 ID、トランザクション、冪等性、永続化、API ルート、スキーマ生成 Study 画面は Cognis が所有します。

コンテンツパックマニフェストには、発行者、不変のパッケージバージョン、コンテンツリビジョン、スキーマとコンテンツのパス、ライセンスを記録します。`schema.json` は日本語固有の階層、型付きフィールド、関係、基数、順序、リゾルバーを宣言します。コンテンツファイルは安定したパック内 ID と明示的な参照を使用します。

外部モジュールマニフェストは `/static/modules/study-language-ja/languages` を公開し、Cognis がモジュールのブートストラップ前に Marketplace メタデータを翻訳できるようにします。
