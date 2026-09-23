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

## 入れ子のかなバリアント

かなバリアントは同じ文字種内に限定し、濁点・半濁点、小書きかな、標準的な拗音、一般的な促音形を収録します。各拗音は主音を持つかなへ直接リンクします。`きゃ`・`きゅ`・`きょ` はすべて `き` の子、`じゃ`・`じゅ`・`じょ` はすべて `じ` の子です。有声の親は清音形へのリンクを維持するため、意味のある `し` → `じ` → `じゃ` の入れ子も保たれます。

## 最新のライブラリ表示契約

バリアント関係には Resolver ロールも固定方向も設定しません。ライブラリが左・上・右の空き位置を動的に割り当て、入れ子の子文字を再帰的に展開します。漢字の読みと単語の表記は、移動可能な構成要素の Resolver ロールを維持します。

## 構成と定義

リゾルバーロールは、漢字の読み、単語の表記、順序付きの文の単語または助詞という実際の構成だけに使用します。意味上の定義レイヤーへの関係はリゾルバーを宣言しないため、主定義と代替定義のリンクは構成グループではなく意味として表示されます。必須の文字種および習熟度フィルターには、最新のライブラリ絞り込み契約に合わせて意図した既定タグも宣言します。

## 完全な仮名表

各文字種の基本五十音 46 項目と濁点・半濁点形 25 項目に加え、小書きかな、標準的な拗音の全系列、一般的な促音形を収録します。`ひゃ`、`しゅ`、`じゃ`、`って` と、それぞれのカタカナ形を含みます。

## 動的なバリアント配置

すべての文字親子関係は `variant: true` だけを宣言し、`variantDirection` は指定しません。ライブラリが実行時に空き位置を選択できるため、モジュール指定スロットの衝突なく入れ子チェーンを表示できます。

## 標準かな表のグリッド

文字レイヤーは 1 行 5 枚を指定し、各文字種をちょうど 10 行にします。最終行では `を`/`ヲ` を中央、`ん`/`ン` を末尾に配置します。拡張形はグリッド外に置き、文字の親子チェーンから展開します。

## 定義ベースのカード

最新のライブラリ表示契約に合わせ、単語・助詞・文はローカライズされた定義をカード表示に使うよう指定し、各項目に必須の定義参照を追加しました。

## 日本語固有のレイヤー名

生成されるライブラリのタブに、モジュール固有の名称を指定しました。基本文字は「かな」、複合文字は「漢字」、単語は「語彙」と表示します。漢字の読みは、平坦化した文字参照の列ではなく、一つの読みとしてまとまった語彙レコードを参照します。

## 表示されるかな表の空白

各文字種には明示的な `{ "blank": true }` セルを 4 個だけ割り当てます。`や` 行に 2 個、`わ`/`ん` 統合行に 2 個です。これにより、ひらがなの末尾に空白行が残らず、カタカナも先頭空白を引き継がず次の行境界から始まります。

## コンパクトなかなカード

かな文字レイヤーだけに `minimal: true` を設定し、かな表を主ラベルのみのコンパクトなカードで表示します。漢字・語彙・文のレイヤーは、発音・定義・メタデータ・構成を含む通常の表示を維持します。

## 完全に解決される複合項目

順序付き複合項目を最新のライブラリ事前検証制約に合わせました。文中のすべての文字を、位置が連続した単語または助詞の参照で構成し、`日本語が好き` には不足していた語彙項目 `好き` を追加しました。Resolver 関係には、構成を表示するのか完全な読みを表示するのかも明示します。

## 非表示の促音形

単独または複合の `っ`・`ッ` を含む全項目に `hidden: true` を設定しました。解決や詳細表示に使う既存の親参照は保持したまま、これらの項目とその子孫が直接閲覧するかな表の末尾に漏れないようにします。

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

- [a8e559e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a8e559e3bfad5bbf1c1778dd4a9505c83bc04f8d)

- [7f8cc35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7f8cc35b43f92480c77dba4807bf4f237e4ebd8d)

- [e5eae65](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e5eae656076a0bcb31c74e7f388c06b4ed790815)

- [6677a4f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6677a4f80b97c2d3f056b189002e2c0f30f88e22)

- [b314603](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b314603e775c02a12ee16c3c718618a4077125bc)

## フィルターに追従する仮名の空欄

4 つの明示的な表の空欄を、対応するひらがなとカタカナのグリッド位置で共有します。各文字種の対応項目を交互に配置することで、ライブラリのフィルターが非選択の文字種を除外しても、その空欄が選択中の表の先頭や末尾に残りません。

- [eaae470](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eaae470ad48226b0f1c3e931748511eae7178bb1)

## 完全な仮名削除グラフ

語彙項目 `好き` に、順序付きの仮名表記 `す` と `き` を宣言しました。これにより、他のすべての語彙項目と同じ参照依存グラフに含まれ、Cognis が仮名表をカスケード削除するときのプレビューと実行の対象になります。

- [408a5c9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/408a5c957033a9200286e9fed7e9a6d0fbfa3873)

## 安定した仮名バリアント識別子

最新のライブラリ識別子保護に合わせてパックを再公開します。すべての仮名レコードは異なるコンテンツ識別子を持ち、各バリアント参照は自身とは異なる親レコードを対象とします。再取り込み時に古いエッジを再構築しても、親文字が自身の子として表示されません。

- [01606c4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/01606c49ade781db72f6652ca779517732eed7a6)

## 明示的な仮名の子階層

最新のライブラリ関係契約に合わせ、仮名の親関係をバリアントかつ空間的な子として明示しました。重複する関係セクションが抑制されるため、明示的な `usage_note` フィールドは不要となり、4 レコードの値とともに削除しました。

- [6734506](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/67345060175f87f4a73e1f07598efcb2df814edb)

## 正規化された漢字読み語彙

重複していた語彙レコード `人` を削除しました。漢字項目は、異なる語彙読み `じん`、`にん`、`ひと` のみを参照します。各読みは対応するひらがなレコードで構成され、それぞれが定義を直接参照します。

- [986261f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/986261f57188d939eb014e4f07eb2d90ed85059d)

## PR 220 のモジュール所有権契約

標準化された `study:language:ja` ケイパビリティをモジュール所有名前空間の外で公開するため、信頼済み特権を明示的に要求するようにしました。Cognis Labs リポジトリの来歴をホストが検証でき、ライブラリへのアクセスは引き続きケイパビリティ経由で、すべての登録はライフサイクル管理下にあります。

- [d1efe4b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d1efe4b52184c4cdc77843441c2dfa7948339afe)

## 最も近い宣言済みライブラリ関係

合成は利用可能な最も近いレコードを使用します。`日本語` は語彙 `日本` と漢字 `語` を参照し、`日本` は漢字 `日` と `本` を参照します。順序付きの仮名代替表記が発音への直接リンクを提供し、すべてのフィールドがプロバイダー所有の編集コントロールとローカライズ済み選択肢を宣言します。

- [8e8323e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8e8323e9d435685a54cbdd0ae87b56391d637ff2)

## 漢字の発音から仮名への直接リンク

複数の読みを持つ漢字カードでは、表示する各発音を構成するひらがなレコードへ直接解決するようになりました。語彙の読みレコードは、再帰的な発音リンクを生むことなく、定義と学習用として引き続き利用できます。

- [f3faf6c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f3faf6ccbd41bd5709996a9b7d6fb31174a2c437)

## 漢字用の非表示読み語彙

漢字の各発音は完全な読みを表す1件の語彙レコードへリンクし、その読みから順序付きの原子的な仮名綴りへリンクするようになりました。読み専用語彙はブラウザーでは非表示ですが直接参照でき、通常の語彙はすべて表示したままです。

- [cb5c46a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/cb5c46a541006afea645504178fd86f788b4565f)

## 宣言済みの複合語発音区間

読みを特定した複合語の発音は、原子的な仮名へ直接リンクせず、最長の宣言済み非表示読みレコードを経由するようになりました。`日本語` の `にほんご` は、`日本` に対応する非表示の `にほん`、続いて `語` に対応する `ご` として解決され、それらのレコードから順序付きの仮名へ解決されます。

- [eff02dd](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eff02dd26396e0198e63e51b24758701f05d00d2)

## 文脈別の語彙定義

非表示の漢字読み語彙は、広い漢字の意味を再利用せず、人数助数詞の `にん` や国籍接尾表現の `じん` など狭い用法について4言語の固有定義を持つようになりました。作成標準では、Cognis の移動元定義フォールバックを、関連エントリ移動で開かれ、意味が本当に同一の場合だけに限定します。タイトル構成と前後移動では、この文脈が意図的に消去されるためです。

- [d52fcb2](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d52fcb2578d7854a9e36361a5077dc2276e05115)

## 宣言的データセットの大幅な拡張

日常語彙を30件以上、助詞を10件、完全に構成された文を8件追加し、4言語の定義を含めてすべてデータ専用JSONとして収録しました。真の多義語は1件のレコードで複数定義を使用し（`なおす`）、橋／箸の `はし`、雨／飴の `あめ`、紙／髪／神の `かみ` のような同音異義語は、独立した意味を持つ別々の語彙レコードとして保持します。

- [a538833](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a538833e990505cad9b817cb9995b1cf2b8bab5e)

## 網羅的な助詞一覧

格助詞、係助詞、接続助詞、列挙、限定、複合、終助詞を含む60件以上へ拡張しました。各助詞にローカライズ済み機能データ、順序付き仮名綴り、少なくとも1件の順序付き例文を収録しています。

- [5921d4e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5921d4eafc7a0f0a64fa59db2dec53ea259c1647)

## 完全な助詞ナビゲーション経路

助詞例文に、漢字で構成された学校の語彙と、学校を順序付きの原子的な仮名から再構成する専用の非表示読みを追加しました。これにより、追加されたすべての助詞例文を、文から語彙、漢字、正確な仮名読みまでたどれます。

- [0353386](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/03533863e162d223ac9a77782ec146668d5c154b)

## 保守的なモジュールバージョン運用

モジュールとコンテンツパックをバージョン `2.2.2` に戻しました。互換性のあるコンテンツおよびスキーマ変更にはパッチ、互換性のある外部機能追加にはマイナー、ホストと調整した破壊的な外部契約変更にのみメジャーを使用する方針を追加し、スキーマ改訂数からモジュールのメジャーバージョンを決めないようにしました。

- [1966bc1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1966bc11b02f49729c29544cd78e710c133f0366)

## 意味のある助詞学習コンテンツ

助詞文カードには、「助詞の例」のようなメタデータではなく、意味を直接ローカライズした簡潔な日本語の文や表現を収録するようになりました。コピュラや活用形は、仮名に基づく非表示語彙として作成され、順序付きの文関係から実際の学習内容を再構成できます。

- [4f281e3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4f281e3bec4e63d79c9c8c07f7d79ccf541dc172)

## 監査済みのプロバイダーコンテンツグラフ

プロバイダーパックを最新のライブラリ契約に従って保護しました。猫と犬の学習内容には表示語彙 `猫` と `犬` を使用し、対応する漢字と完全な非表示読みを経由して原子的な仮名へリンクします。また、すべての文ラベルと発音を単一の順序付き関係グラフから導出します。「例」を示すプレースホルダーIDを削除し、新しい契約テストで古い読みや書記階層の省略を拒否します。

- [2eb4742](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2eb474286b59e1828d4e2f266029820334d0334c)

## Cognis PR 226 の外部パッケージ契約

日本語プロバイダーパックは、検証済みのカタログメタデータを公開し、bootstrap を通じてプロバイダー所有メタデータを維持し、表記体系とJLPTのフィールドを明示的な学習者フィルターとして指定するようになりました。スキーマ改訂40とモジュールバージョン2.2.5で、保護されたコンテンツと検証済み組み込みフィールド型を維持しながら外部パッケージ契約を採用しました。

- [1a38b26](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1a38b267037f144157fcd20ed575edf3af0b1452)

## 漢字を優先した多様な学習コーパス

表示語彙では、適切な場合に一般的な漢字を含む表記を使用し、完全な非表示読みから原子的な仮名までたどれるようになりました。51件の助詞文コーパスを、人、動物、天気、食事、移動、読書、音楽、時間、仕事にまたがる多様な内容へ書き直しました。学校語彙を使う文は5分の1未満で、同じラベルを持つ助詞文はありません。

- [2673d35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2673d35913bd7534b4dc9aed468280dc598b4c88)
