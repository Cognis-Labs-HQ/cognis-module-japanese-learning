# スコープ対応 Study ライブラリ

**Feature Branch:** work

## 多層ライブラリ

パッケージファイル形式のライブラリを Cognis PR #196 のデータベース対応 Study ライブラリに置き換えました。検証済みの 9 階層、参照追跡、スコープ別アクセス、JSON・Anki 交換、審査付きプッシュリクエストに対応します。

## ライブラリブラウザー

ホストのページコンポーザーを使用して、内容のあるグローバル階層を閲覧できるように、ローカライズ済みライブラリページを更新しました。

## 利用側が選択できるテンプレート

利用側は、標準ライブラリテンプレートから必要な階層だけを複製できます。関係メタデータは有効なリンクと必須の依存関係を保ち、単語や文の作成時には適切なリンクを推定できます。

## モジュール所有の API ルート

すべてのライブラリエンドポイントをモジュール所有の API 名前空間へ移動し、保護された Study ゲートウェイルートとして拒否されることなく Cognis でモジュールを有効化できるようにしました。

## ローカライズ済み Study ナビゲーション

ライブラリページに日本語 Study サブナビゲーションを復元し、3 つの子ページラベルをモジュールバンドルからローカライズするとともに、すべての日本語 Study ページでクリックを Cognis ホストルーターへ渡すようにしました。

## 宣言型日本語コンテンツパック

改訂された Cognis Library 2.1 契約に合わせてモジュールを再構成しました。日本語データは、`study:library` を通じて取り込むバージョン付きスキーマと宣言型コンテンツグラフとして提供します。検証、永続化、ルート、生成 UI はホストが所有するため、モジュール側で重複していたライブラリサービス、データベース、API、ページを削除しました。

## ケイパビリティベースのライブラリ依存関係

Study アダプターは単独で導入可能なコンポーネントではないため、ライブラリアダプターの UUID をコンポーネント依存関係から削除しました。モジュールは Study ゲートウェイコンポーネントに依存し、必須の `study:library` ケイパビリティだけを通じてライブラリを検出します。

## 移植可能なコンテンツ識別子

レコード ID 内の漢字を安定した ASCII 識別子に置き換え、字形はラベルとして保持しました。修正後のデータを安全に取り込めるよう、コンテンツパックのバージョンとリビジョンも更新しました。

## 言語スコープ対応の生成ナビゲーション

宣言型日本語記述子が実行可能な子ページを持たないことを明示し、Cognis PR #196 と #213 に合わせました。Study が学習者向けの生成済みライブラリ移動先を提供し、閲覧中と履歴移動中に検証済みの `ja` 言語コンテキストを維持します。

## バージョン付き中立スキーマ契約

Cognis PR #214 に合わせ、名前空間の所有権、ローカライズ済みスキーマメタデータ、階層のセマンティックロール、拡張フィールド型、詳細表示ヒント、アクティビティ・関心領域の検出タグ、必須の関係対象、明示的な削除動作、リゾルバーロール、厳密な位置を持つ順序付き参照を追加しました。言語記述子は不変のパッケージ識別情報も公開します。

## 小文字に統一したコンテンツ ID

カタカナのレコード ID を小文字 ASCII のみに統一し、ホストが `invalid_content_record` で有効化を中断せず、すべてのレコードを受け入れられるようにしました。修正済みデータを Cognis が再取り込みできるよう、パック版とコンテンツリビジョンも更新しました。

## 厳密な事前検証を伴う再公開

修正済みパックをバージョン `2.1.2`、コンテンツリビジョン `2026-09-05.4` として再公開し、インストール時にキャッシュ済みの無効なパックバイトが再利用されないようにしました。スタンドアロンテストでは、文字列 ID、`ja:` 接頭辞、小文字の移植可能文字、空でない文字列ラベルというホスト側の前提条件を検証します。

## Study サブナビゲーション用の言語コード

言語記述子は、互換用の `languageCode` に加えて正規の `code: "ja"` を公開するようになりました。これにより Cognis PR #215 は生成したアクティブ言語ボタンへ日本語コードを設定し、URL クエリパラメーターを使わずに、その選択をルーター履歴経由で後続の Study 移動先へ引き継げます。

## 解決可能なローカライズ済み辞書定義

`definitions` レイヤーを Cognis PR #196 の辞書契約に合わせました。`definitionLocalization`、モジュール所有の安定した文字列キー、型付きローカライズテキストフィールドを宣言します。事前収録された各定義にはドイツ語、英語、インドネシア語、日本語の文字列が含まれます。不変な構造変更に伴い、スキーマ版を `3`、パッケージ版を `2.2.0` に更新しました。

## 表記単位の音声と助詞

原子的および複合的な表記単位に、必須の発音一覧と HTTPS 音声参照を追加し、バイナリメディアを同梱しない構成にしました。専用の助詞レイヤーは文法機能のメタデータを保持し、文レコードは単語と助詞への順序付き参照を維持できます。

## ライブラリ標準の意味表現

重複していた `romanization`、`reading`、`readings`、`meaning`、`function`、定義言語フィールドを削除しました。発音はライブラリが認識する `pronunciation` フィールドに統一し、漢字・単語・助詞の意味はローカライズ済み定義レコードへの関係で表現します。

## 仮名レコードに基づく漢字の読み

各漢字の読みを個別の語彙レコードとして表し、その順序付き `kana-spelling` 参照で正確なひらがな文字を一つの読みとしてまとめます。漢字は発音順にこれらの読みレコードを参照するため、複数文字からなる読みと複数の読みを区別できます。カタカナ文字は固有の ID とリンクを維持し、実際にカタカナで書かれる内容に利用できます。

## 最新のライブラリ有効化契約

文字種と JLPT のバッジフィルターは、Library 2.6 が対応する名前付きの相互排他フィルターグループを宣言するようになりました。`allowBootstrapFailure` は意図的に有効化していません。コンテンツの取り込みと `study:language:ja` の公開はこのモジュールの必須ランタイム処理であり、これらがない状態で有効のままにすると機能しないモジュールが残るためです。Cognis PR #216 はコンテンツパックの再取り込み時に既存の項目・アセット・参照を更新するようになり、報告された参照重複エラーを永続化境界で解決します。

## 方向付き濁点バリアント

方向付きの親子関係は濁点（点々）付きの文字だけに使用します。初期データの `じ`/`ご` と `ジ`/`ゴ` は、それぞれ同じ文字テーブル内の `し`/`こ` と `シ`/`コ` を参照します。対応するひらがなとカタカナは独立したレコードのままとし、親子として扱いません。

## 最新のライブラリ表示契約

方向付きの濁点リンクはリゾルバーロールを宣言しなくなりました。そのため、ライブラリは子カードの展開だけに使用し、親を構成要素ボックスとして重複表示しません。漢字の読みと単語の表記の関係は、移動可能な構成要素のためにリゾルバーロールを維持します。現在のライブラリは表記単位の発音をカードのラベルと詳細タイトルの横に表示し、利用者がコンテンツハッシュを明示的に拒否しない限り、次回の有効化時に欠落したモジュール内容を復元します。

## 構成と定義

リゾルバーロールは、漢字の読み、単語の表記、順序付きの文の単語または助詞という実際の構成だけに使用します。意味上の定義レイヤーへの関係はリゾルバーを宣言しないため、主定義と代替定義のリンクは構成グループではなく意味として表示されます。必須の文字種および習熟度フィルターには、最新のライブラリ絞り込み契約に合わせて意図した既定タグも宣言します。

## 完全な仮名表

コンテンツパックに、ひらがなとカタカナそれぞれの五十音の基本 46 文字と、標準的な濁点・半濁点付き文字をすべて収録しました。各文字種の 25 個の濁音・半濁音の子文字は、同じ文字テーブル内の記号なしの親文字を参照します。たとえば `が` → `か`、`じ` → `し`、`ぱ` → `は` と、それぞれのカタカナ版です。

## 濁点と半濁点の配置分離

`variantDirection` を指定する際の必須条件に従い、両方の関係で `variant: true` を明示します。濁点付きの子文字は `dakuten-of` 関係を使い、清音の親文字の右側に展開されます。半濁点付きの子文字は `handakuten-of` 関係を使い、親文字の左側に展開されます。そのため、`は` や `ハ` のような親文字でも、2 種類の異体が同じ位置で重ならず、両方表示されます。

## 標準かな表のグリッド

文字レイヤーは 1 行 5 枚を指定し、ひらがなとカタカナを標準的な五十音順で並べます。グリッドには基本かなレコードのみを含め、濁点・半濁点付き文字は清音の親文字の周囲に方向付きの子文字として表示します。

## 定義ベースのカード

最新のライブラリ表示契約に合わせ、単語・助詞・文はローカライズされた定義をカード表示に使うよう指定し、各項目に必須の定義参照を追加しました。

## 日本語固有のレイヤー名

生成されるライブラリのタブに、モジュール固有の名称を指定しました。基本文字は「かな」、複合文字は「漢字」、単語は「語彙」と表示します。漢字の読みは、平坦化した文字参照の列ではなく、一つの読みとしてまとまった語彙レコードを参照します。

## フィルターに対応したかな順序

ひらがな列とカタカナ列の間にあった無条件の空白プレースホルダーを削除しました。文字種フィルターで一方を非表示にしたとき、選択した表は非表示側の空白を引き継がず、グリッドの先頭セルから始まります。

## コンパクトなかなカード

かな文字レイヤーだけに `minimal: true` を設定し、かな表を主ラベルのみのコンパクトなカードで表示します。漢字・語彙・文のレイヤーは、発音・定義・メタデータ・構成を含む通常の表示を維持します。

## 完全に解決される複合項目

順序付き複合項目を最新のライブラリ事前検証制約に合わせました。文中のすべての文字を、位置が連続した単語または助詞の参照で構成し、`日本語が好き` には不足していた語彙項目 `好き` を追加しました。Resolver 関係には、構成を表示するのか完全な読みを表示するのかも明示します。

## コミット

- [a6fa75d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a6fa75d15c478b1d8ef1930dcc3c5c29e3938b97)
- [33cf20c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/33cf20c040c55a177efe83fa6d14674491da2254)
- [ddd8464](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ddd84646f1930ea660f469e4b1776219558e1e5b)
- [7048e41](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7048e4155bb52132741016c35371f0e0c215d67e)
- [131afdf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/131afdf5125a3eebae584a2c4729bd0a1b144654)
- [db6df0a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db6df0a0d71e75892cac726991ab0d5fa9edf172)
- [530fdfd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/530fdfdb7cb55b05d316d404ab8e64c33ba0b04c)
- [549322e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/549322e5e597f186c36ada77d330921e7b335a4d)
- [1740b0b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1740b0b0da93d15c450ca82c452bb1fe8698b7e9)
- [4639371](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4639371d8fe55c71477aa70087cc4e8a18100438)
- [e9ae382](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e9ae382be9ed7fd23b4a323f081904ad9137410f)
- [92032ec](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/92032ecd30c7bee0dbcb76007108ef12e6a892e8)
- [b9f3e6e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b9f3e6eb6813d99d5ee76902729bc478fe36afd1)
- [90bac12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/90bac12fb8d4c90451b6a0ae2e9c0572be99cbd0)
- [4a0b288](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4a0b28830b5a1d6fcea2df490e74e99108d1e4dd)
- [32b43de](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32b43dec923a4fc7a62401bb21b5b01259cb311e)
- [c7a745f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c7a745f39078cb5cb4d4206ce20a855aed195a22)

- [5ab8006](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5ab80067e1e3151a86f648cedf7660167a1f6f15)

- [32ac841](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/32ac8416bbf3676b3cecdde536e645e24941f81a)

- [ed1fd35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ed1fd35e5235f79773ba91bd1d28377365509e2b)

- [e5c86a4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5c86a4cf17408e92c5021015ff4404c2e5802b6)

- [2a56248](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a562481c79002aa62a1ab51de91b7543c1acd18)

- [f6ace9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f6ace9e86c0c27634edeba5ffb98e429bfd2be4f)

- [64682aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64682aa25ecd32bf106613dec2b8a26812e1fba5)

- [06f4b09](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/06f4b09449d44ca464c31f11464fd474bddf4fcd)

- [0912c79](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0912c79cff5ba0fce67cd2c9ec6e10da11331a64)
