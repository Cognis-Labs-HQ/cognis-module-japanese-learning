# 技術情報

日本語パックは、Study の公開プロバイダーを通じて教材、辞書補完、筆順パターン、録音を提供します。

## インターフェース

`bootstrapModule(ctx)` は `transformationModel: "generated"`、`ingestContentPack`、`registerLookupProvider`、`deleteContentPack` を持つ `study:library:provider` と、`study:audio:provider` を必要とします。内容とメディアの検索を登録して `data/library/` を取り込み、`study:language:ja` を公開します。言語の記述子にはパックと初期デッキが含まれ、画面遷移、権限確認、学習画面は Cognis が所有します。

管理者用の `GET`、`PUT`、`DELETE /api/v1/modules/study-language-ja/config` は、モジュールの読み取り・保存・削除フローを実行します。PUT の `voiceId` は文字列で、空なら上書き設定を解除し、値があれば英数字・アンダースコア・ハイフンの1〜128文字とします。リクエスト本文は2048バイトまでです。無効状態用の API 入口は宣言していません。

## 設定

任意の `voiceId` は生成音声の声を選び、同梱録音の出典を変更しません。設定は `db:executor` を通じてモジュール所有の `module_study_language_ja_config` テーブルに保存します。無効化や再起動後も保持し、アンインストールで消去します。スキーマ、内容マニフェスト、初期デッキ、参照資料の目録は `data/` 以下にあり、利用可能な内容は手順書に固定した件数ではなく目録で確認します。

## 動作

### 内容と関係

`data/library/schema.json` は `characters`, `alt-characters`, `definitions`, `words`, `particles`, `sentences` を宣言します。レコードには安定したパック内 ID と4言語の意味があります。順序付き参照は実在するレコードを指し、構成順を維持します。UUID の解決、スキーマ検証、ACL、取り込み、書き込み、生成画面は Study が所有します。言語コード、固定のモジュール UUID、ガイド完了 ID は翻訳キーではありません。

生成形には適用可能な基本カードのフラグが必要で、ホストの変形モデルで解決します。基本の識別子と変形経路に基づく表示であり、独立したカードとして同梱しません。不明または適用不能な変形は基本形に置き換えず、拒否します。

### 録音と筆順

`data/audio/recordings.json` は目録形式2を宣言します。`data/audio/indexes/` の用途別索引が `data/audio/inventories/` のチェックサム付き分割データを参照し、読み込み時にハッシュと件数を検証します。`data/audio/unavailable.json` は同梱音声がない項目を記録します。記載された読みと変形経路で対応を調べ、変形音声がなければ基本形の録音で代用しません。文の合成には構成要素の音声を再利用します。任意の `elevenlabs-tts:synthesis` は設定済みの場合だけ使い、Study の権限確認は呼び出し側が行います。

筆順パターンは画順と文字ごとのグループを維持します。同梱メディアはホストの認可されたパック資産として配信します。無効化では検索・音声プロバイダーと静的な提供内容を解放し、起動失敗では途中の登録を取り消します。アンインストールは学習内容を保持しますが、`deleteContent` が真なら Library の `deleteContentPack` で削除します。

### 辞書と参照資料

Jisho はモジュールが検証した要求で日本語の単語と漢字を補完します。要求の期限は15秒で、拒否した応答本文はキャンセルします。KANJIDIC2 の分割資料には EDRDG の出典と、許諾された読み・意味を保持します。仮名に基づく読み全体と順序付き語彙構成を正とし、出典にない値を作りません。検索キャッシュと結果の公開は Cognis が管理します。

### ガイドのライフサイクル

言語ガイドには明示的な学習登録が必要で、`study:libraryTutorials` を通じて登録します。対象と編集画面の寿命はホストが所有します。検出だけでは移動せず、明示的な開始で教材を開けます。ホストはアカウントと固定のガイド ID に対して完了を保存します。戻る、再開始、プロバイダー削除ではカードを送信せず、担当する画面を解放します。

## セキュリティ

パックが特権を持つ場合も Library の権限確認は有効です。検索とメディアは宣言された範囲内で解決します。辞書の出典とライセンスを結果に保持し、読みや意味が不明なら作り出しません。ログには安全なイベント情報だけを記録し、資格情報、完全な応答、私的な学習内容を含めません。

## リファレンス

以下の実装とデータが実行時の契約を定義します。共通の描画と永続化の境界はホストの手順書を参照してください。

- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/bootstrap.js)
- [api/routes/config/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/routes/config/index.js)
- [api/dictionary/index.js](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/api/dictionary/index.js)
- [data/library/schema.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/library/schema.json)
- [data/audio/recordings.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/audio/recordings.json)
- [data/reference/manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/blob/HEAD/data/reference/manifest.json)

### 名前の検証

`npm test` はローカルの構文木検出器で、bootstrap、スクリプト、テスト、フィクスチャを含むバインディング名を検証します。構文解析エラーがある場合、検証は失敗します。回帰検証用フィクスチャは、宣言、引数、プライベートメンバー、TypeScript の型アサーション、有効な型専用名を検証します。共通方針は[ホストの命名標準](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.ja.md#バインディング名)を参照してください。
