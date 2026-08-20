# リリース

リリース手順では、公開に向けて外部モジュールのメタデータ、整合性インベントリ、検証結果を同期します。

## 使用例

リリースをコミットする前に、`npm install`、`npm test`、`npm run lint`、`npm run manifest:hashes`、`npm run check:manifest`、`git diff --check` を実行します。

## 技術仕様

### バージョン管理

`package.json`、`package-lock.json`、`manifest.json` のバージョンを同期してください。モジュール UUID は永続的に保持します。

### 整合性インベントリ

最後のファイル変更後に `manifest.files` を再生成し、変更されたすべてのファイルとともに更新済み SHA-256 インベントリをコミットします。manifest 自体をインベントリに含めてはいけません。
