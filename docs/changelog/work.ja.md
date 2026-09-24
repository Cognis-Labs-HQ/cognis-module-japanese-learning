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

## レビュー済みコアとかなリンクの復元

未レビューだった包括的な助詞、生成漢字、文、読みの追加を削除し、パックを小規模なレビュー済み内容へ戻しました。保持した全レコードに契約上のクラスを設定し、レイヤー構造に基づくリンク検査を通過させました。かな主体のカードはかなのままです。`せんせい` は `せ`、`ん`、`せ`、`い` へ直接リンクし、切断された教師の読みカードは表示されません。

- [70b6951](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/70b6951274722f1506bb75dfd9db0bc808f70651)

## 漢字からかなまでの完全な経路

表示されるすべてのコア語彙が一般的な漢字表記を使用し、作成済みの完全なグラフで接続されるようになりました。文は表示語彙と助詞だけを参照し、語彙は漢字と非表示の読み分節を参照し、非表示読みは順序付きの原子的なかなから再構成されます。`私は学生` は `私` → `わたし` → `わ`・`た`・`し`、`は`、`学生` → `がく`・`せい` → `が`・`く`・`せ`・`い` の経路をたどります。回帰テストはいずれかのレイヤーを飛ばすデータを拒否します。

- [65ff45a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/65ff45affebb7a647d7ee3012eb9e8999e4de7b0)

## PR 226 の最新レコード制御

プロバイダーレコードを最新の Study Library 外部パッケージ契約へ合わせました。定義はホスト予約クラス `definition` を使用して明示的に非表示となり、文は `composite`、助詞は `editable: false` を伴う `particle` クラスを使用します。インストール済みレコードとプロバイダーハッシュの整合性を保つため、取り込み前に契約テストでこれらの正規化値を検証します。

- [e74c036](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e74c0362e8a1fb9e15bdc58b80c2e1c7eb0d07f3)

## 活用読み構成の修正

完全な非表示読みでは、非語彙的なかな接尾部に構成専用の `reading-kana` 関係を使用し、部分的な `kana-spelling` を代替発音として誤用しないようにしました。`なおす` の読みは、意味を持つ `なお` を非表示の `直` 読み語彙から構成し、単一の接尾部 `す` を原子的なかなへ直接リンクします。そのため、カードで後半だけが発音として表示されることはありません。

- [1bb8457](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1bb84576d96472bba37b33163a9fbc3b292954ab)

## 読みの参照元重複を解消

単一漢字の語彙レコードは、基になる漢字読み語彙から構成される専用の完全発音非表示ラッパーを参照するようになりました。そのため `ねこ` のような読みは、見分けられない2枚の `猫` カードではなく、漢字 `猫` と異なるラベルの非表示 `ねこ` ラッパーから使用されます。グラフ全体の回帰テストで、すべての非表示読みに同一ラベルの参照元がないことを検証します。

- [d5c257d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d5c257df1f91978090c7e9ea9f85ded883847c06)

## 文の発音を完全にリンク

すべての文の発音を、完全な発音を表す非表示レコードから解決するようにしました。語彙部分は最も近い非表示の語彙読みを使い、助詞など語彙ではない単一かなは `reading-kana` で直接リンクします。テストは再構成できない文字列を拒否します。レビュー済みで多様な練習文8件と、リンクを完備した `学ぶ`、`歩く` の語彙により、テンプレート生成の水増しを行わず教材を拡充しました。

- [d90876c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d90876c607bf4a34f628d27429e38264943f1c2d)

## 循環しない読みの意味付け

語彙的な日数助数の `か` を、非表示の漢字読み実装レコードではなく、表示対象の `lexical:counter` 語彙にしました。新しいグラフ全体の検査は、前向きの構成リンクにおける循環を拒否し、かなで学習リンクの探索が終了することを要求します。単語から漢字への必須の綴り関係はモジュールに残す必要があるため、同じラベル間の逆方向ナビゲーションは Study Library ホスト側のフォローアップとして記録しました。

- [07f7a0c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/07f7a0c2e298debdc71965f63a380f5f84fc8c37)

## 読みからかなへの直接ナビゲーション

非表示の発音タイトルを、個々の原子的なかなリンクから直接構成するようにしました。漢字の読みを開いても、別の漢字由来の読みカードへ戻ることがなく、カードタイトルの詳細に代替表記も表示されません。

- [631e76b6c2471aff02f37e982ece772fe7ad266c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/631e76b6c2471aff02f37e982ece772fe7ad266c)

## 有効化可能な読み構成

読みタイトルには専用の構成関係 `reading-kana` を使用し、`kana-spelling` はサポートされる代替表記ロールに戻しました。これにより、コンテンツパック検証でモジュールの有効化が拒否されることなく、かなへの直接タイトル移動を維持します。

- [2187c82db49d331797cbb015e4665ad7ccb5264b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2187c82db49d331797cbb015e4665ad7ccb5264b)

## 正規の語彙・かなカード

冗長な発音語彙ラッパーを削除しました。表示される漢字語彙は漢字と原子的なかなへ直接リンクし、漢字の読みは `猫` のような一致する表示語彙項目を優先します。残る非表示の読みは漢字として表示せず、発音クラスを使用します。かなカードの文字体系バッジは、クラスと重複しない一つだけになりました。

- [697459a2379a0d11ce7fcc1ad947dacbe7d556a3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/697459a2379a0d11ce7fcc1ad947dacbe7d556a3)

## 取り込み可能なコンテンツファイル

読みの正規化後に残っていた空の語彙 JSON ファイルを2件削除しました。検出されるすべてのコンテンツファイルに1件以上のレコードが含まれるようになり、モジュール有効化時に Study Library インポーターが未定義レコードを調べることを防ぎます。

- [423a3250facb90f3435fc28faee469aa63bacceb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/423a3250facb90f3435fc28faee469aa63bacceb)

## 取り込み可能な読みグラフの復元

Study Library の有効化がデータベーストランザクション内で失敗する原因となった広範な語彙グラフ変更を取り消しました。サポートされる `reading-kana` 構成修正は維持しつつ、以前に取り込み可能だった階層型の読み構造へ戻し、ホストが取り込みを再試行するよう新しいコンテンツリビジョンへ進めました。

- [3ab7d2577f18d204465863ce3c820b8fe153d8be](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3ab7d2577f18d204465863ce3c820b8fe153d8be)

## 正規カードの段階的移行

既存インストールに存在する可能性があるプロバイダーレコードを削除せず、簡素化したカードグラフを適用しました。現在の漢字・語彙カードは、意図した語彙・漢字・かなの終端へ直接リンクします。置き換えられた非表示の読みは切り離しつつ、安全なデータベース更新のため保持します。読み専用カードは漢字クラスを名乗らず、かなカードは文字体系タグを重複表示しません。

- [997392f71fd178e43599bc8d27be786839b98b8b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/997392f71fd178e43599bc8d27be786839b98b8b)

## スキーマ更新によるインストール回避策

日本語コンテンツスキーマをリビジョン46へ進め、Cognis が PR #226 の壊れた同一バージョンスキーマ更新コマンドを通らず、整理済みスキーマを新規登録するようにしました。ホスト側の修正点も明記しました。このコマンドは構造化 DB ゲートウェイが要求する `set` ではなく `values` を渡しており、PostgreSQL で報告された `Object.entries(undefined)` エラーを発生させます。

- [bb20511152a80522055af67e6895ff28e5d9b8c8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bb20511152a80522055af67e6895ff28e5d9b8c8)

## 廃止された読みデータの完全削除

切り離した互換データとして残していた48件の古い非表示読みレコードをすべて削除しました。パッケージには現在使用する正規グラフだけが含まれ、語彙レコード数は133件から85件になりました。漢字・語彙・原子的なかなへの直接ナビゲーションは維持されます。

- [b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b5ae5ad6e5ec9acf67c7ebf22d2d984ff4bdbad4)

## 漢字とかなの対称的な使用関係

各漢字から、その読みに使われるすべての原子的なかなへ、表示用ではない依存関係を追加しました。`日` から語彙的な日数助数詞 `か` を経て原子的な `か` へ移動した後も、かなカードの使用元に `日` が表示されます。同じ不変条件をすべての漢字に適用しています。

- [0fcae71e11836dbce3361184c378e46a2ee0d430](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0fcae71e11836dbce3361184c378e46a2ee0d430)
