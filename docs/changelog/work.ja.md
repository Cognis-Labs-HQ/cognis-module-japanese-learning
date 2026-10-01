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

## 論理的な複合発音リンク

文タイトルの文字単位リンクを、確認済みの語彙・助詞セグメントへ置き換えました。完全な発音は、正規の非表示語彙読みセグメントと助詞全体を再利用します。たとえば `ちいさいねこがすき` は `ちいさい`・`ねこ`・`が`・`すき` とリンクし、各語彙はさらに原子的なかなへ解決されます。

- [973980b8e821218608836970f51a0eefc75bfb11](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/973980b8e821218608836970f51a0eefc75bfb11)

## 親文が所有する構成

並行していた完全かな文読みチェーンを削除しました。`猫が好き` のような文は表示される `猫`・`が`・`好き` だけを参照し、各漢字語彙は完全なかなの子（`ねこ` または `すき`）を1件だけ所有します。その子は文内の兄弟へリンクせず、原子的なかなだけへ解決されます。

- [274238c377ebb0a5ce4759456a0d433df83810da](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/274238c377ebb0a5ce4759456a0d433df83810da)

## 語彙にリンクする文の読み

文のタイトル詳細は既存の `words` 関係を使用するようになり、`いぬ`、`やま`、`くる` のような完全な仮名部分が表示中の語彙レコード `犬`、`山`、`来る` をリンク先とします。各語彙レコードは自身の完全な読みだけを経由して原子的な仮名へ進み、並行する文読みチェーンや兄弟読み同士のリンクは作成しません。

- [3bc0779](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/3bc0779)

## 語彙が所有する漢字の発音

漢字の発音リンクは、その読みを使う表示対象の語彙を優先するようになりました。完全な発音ラッパーを所有するのはその語彙だけであり、意味のある漢字読み部分を再利用し、残る一文字の仮名接尾辞を原子的な仮名へ直接つなぎます。たとえば `好` は `好き` にリンクし、その完全な読み `すき` は漢字部分の `す` と原子的な `き` を使い、`き` 単独の発音カードは作りません。

- [b20b4e3](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b20b4e3)

## 完全な文発音リンク

文の発音メタデータは、単語関係と助詞関係の両方をディープリンク元として宣言するようになりました。その結果 `がっこうにいく` は、表示対象の語彙 `学校`、助詞 `に`、表示対象の語彙 `行く` に解決され、合成された完全読みレコードを追加せずに文所有のグラフを維持します。

- [860a01e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/860a01e)

## 筆順に沿った書き取りカード

仮名カードと漢字カードを Cognis PR #226 の最新描画契約に合わせ、順序付き時刻サンプルと練習許容値を持つ必須の正規化 `strokePattern` メタデータを追加しました。KanjiVG 由来のパターンには CC BY-SA 3.0 の帰属情報を保持し、リポジトリのファイルサイズ制限を守るためコンテンツを分割しました。

- [ba7857b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/ba7857b)

## 語彙の仮名リンクを復元

発音を持つすべてのレイヤーが、Cognis PR #226 が使用する現在の `input.linkRelationships` 配列を公開するようになりました。`猫` のような語彙はこの契約を通じて `pronunciation-readings` の対象を公開するため、表示された `ねこ` から作成済みの発音エントリを開けます。漢字の読みと助詞の仮名リンクも同じ現在のメタデータ形式を使用します。

- [046b335](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/046b335)

## 現行契約だけを使う発音リンク

ベータ版コンテンツスキーマに互換経路を残さず、非推奨の単数 `linkRelationship` メタデータを削除しました。発音フィールドは Cognis が使用する現在の `linkRelationships` 配列だけを公開し、回帰テストは旧プロパティの再導入を拒否します。

- [29d7b90](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/29d7b90)

## 実行時の筆順パターンプロバイダー

日本語の書記単位に対して、最新の Cognis Library lookup プロバイダー契約を実装しました。完全一致する仮名・漢字ラベルは、安定した KanjiVG 出典と信頼度 `1` を伴う、パッケージ内で検証済みの `stroke_pattern` を返し、不明なラベルは推測しません。プロバイダーはネットワークサービスや OCR を使わず完全にローカルで動作し、無効化時または取り込み失敗直後に登録を解除します。

- [bbc6d84](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/bbc6d84)

## かな・漢字の完全な筆順検索

検索プロバイダーを同梱カリキュラム以外にも拡張しました。同梱パターンは従来どおり即時かつオフラインで利用できます。それ以外の日本語のかな・漢字は、Unicode コードポイントから正規の KanjiVG SVG データを取得し、範囲制限付きの正規化された筆画サンプルへ変換してキャッシュし、正確な出典と信頼度 `1` を付けて返します。未対応または取得不能な文字は推測せず、正確なテキスト入力に OCR は意図的に使用しません。

- [e040cf0](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e040cf0)

## ネイティブ優先の Jisho カード検索

最新の Cognis 検索コントラクトに対応した、かな・漢字・語彙カード用のローカライズ済み Jisho Composer プロバイダーを追加しました。同梱レコードに完全一致する場合は、ネットワークへ接続せず、レビュー済みの全フィールドと関係を返します。ネイティブ検索で見つからない場合は、Jisho へ問い合わせる前に上限付きリクエストキャッシュを使用し、正規ラベル、発音、JLPT レベル、およびプロバイダーグラフに既に存在する漢字・読み・かな・定義へのリンクだけを入力します。筆順プロバイダーも、現在の Composer が要求するローカライズ済みメタデータを公開するようになりました。

- [db47014](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/db47014)

## 汎用 Library プロバイダーによる登録

Jisho は、汎用 `study:library:provider` ケイパビリティを受け取り、`registerLookupProvider` へ直接委譲する専用登録アダプターを公開するようになりました。Bootstrap はこのアダプターを使用し、返された解除関数を保持します。後続の登録またはコンテンツ取り込みに失敗した場合、登録済みプロバイダーを逆順で解除します。この統合は Jisho 専用のホストケイパビリティに依存しません。

- [0056f4d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0056f4d)

## パッケージ済み登録エントリーポイント

汎用 Jisho 登録エントリーポイントとその回帰テストに対応するパッケージマニフェストのダイジェストを更新しました。

- [b2a1e34](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b2a1e34)

## 自己完結型の筆順ランタイム

Cognis の有効化検証時にモジュールを import できなくしていた、配備されない本番依存関係 `svg-path-properties` を削除しました。モジュール自身が、KanjiVG の筆画に対応する上限付き SVG パストークナイザー、曲線サンプラー、距離ベースの再サンプラーを同梱します。回帰テストでは、外部モジュールのインストール環境に合わせて、`node_modules` のないコピー済みモジュールツリーから Bootstrap、筆順検索、アンインストールのテストを実行します。

- [6133b70](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6133b70)

## 逆向き Library ケイパビリティの解決

Bootstrap は、SSO 認証モジュールと同じ逆向きプロバイダーパターンに従い、`ctx.capabilities.require("study:library:provider")` から必須の Library 登録インターフェイスを取得するようになりました。この必須ケイパビリティに `undefined` を返していた簡易 getter は使用せず、プロバイダー形状の検証とライフサイクルのクリーンアップは維持します。

- [a3e2b35](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/a3e2b35)

## Library プロバイダー可視性ブリッジ

Bootstrap は注入済みの公開 `study:library:provider` ケイパビリティを優先しますが、Cognis PR #226 が有効化検証にだけ公開している場合は、注入済み `study:library` サービスを、まったく同じ汎用 `registerLookupProvider` と `ingestContentPack` インターフェイスの搬送手段として使用します。第 2 のプロバイダープロトコルを作らずに有効化を修正し、両方のホスト可視性形態をテストします。

- [f9c29d8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f9c29d8)

## 完全に解決可能な文・漢字リンク

ホストと同一の別名合成アルゴリズムでタイトル詳細リンクを監査しました。すべての文の発音について、順序付きのかな区間が意図した語彙および助詞レコードを開くことを検証します。各漢字は、隣接する 1 つの語彙ターゲットと一致する完全な主要読みを 1 つ公開します。追加の読みはタイトルに使わない別の関係を使用し、逆引き用の全原子的かな依存関係を維持します。

- [2a5f23f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2a5f23f)

## パッケージ音声契約への整合

最新の Library コンテンツパック検証で `invalid_asset_reference` として正しく拒否される外部プレースホルダー音声 URL を削除しました。表記単位の発音は引き続き必須とし、真正な音声ファイルをパックに同梱するまでは音声を任意のアップロード欄にします。

- [80c7a20](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/80c7a20)

## かなの直接使用関係

漢字からかなへの人工的な依存関係を削除しました。かなカードの「使用元」には直近の読みレコードだけが表示され、無関係な単語や漢字を直接の親として示さず、意図した `あ` → `あめ` → `雨` のナビゲーションを維持します。

- [13d11ce](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/13d11ce)

## 漢字だけの発音境界

漢字の発音リンクは、表示語彙全体ではなく、その漢字専用の純粋なかな読みレコードを参照するようになりました。そのため `好` は `す` を表示してリンクし、別の `好き` 発音ラッパーが `す` と接尾辞 `き` を構成します。単独漢字語も同じ二段階の境界を使い、同名の親が重複しません。

- [6cb7ca7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6cb7ca7)

## 曲線に忠実なかな筆順パターン

パッケージ内のすべてのかな・漢字の筆順パターンを、固定した Unicode 名の KanjiVG SVG パスから再生成しました。モジュール内のサンプラーは距離サンプリング前に三次・二次曲線を分割し、`え` の第2画のような折り返しや輪を、誤解を招く直線へ単純化せず保持します。

- [1668b5f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1668b5f)
- [5002586](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/5002586)

## かなから再帰的に導出する発音

文字だけで構成された84件の非表示語彙発音ラッパーをすべて削除しました。原子的なかなだけを発音経路の終端とし、漢字と37件の実体語彙カードは順序付きかなを直接参照し、文は実体語彙と助詞だけを参照します。語彙と文の発音値は表示用にこのグラフから生成し、関係を発音表示として指定するため、表記文がタイトル直下に重複表示されません。

- [40ce8d8](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/40ce8d8)

## 順序付き文の検証

文の関係を Cognis PR #226 の最新取り込み事前検査に合わせました。順序付き `words` と `particles` を再び構成関係とし、発音を構成要素から再帰的に導出したまま、ホストが各文のラベルを再構成して検証できるようにしました。

- [aff5962](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/aff5962)

## かな発音の再表示

再帰的な日本語の読みを壊さずに、コンパクトなかなカードへローマ字発音を再表示しました。各かなは発音導出用の元表記を第 1 値として維持し、最新の Library レンダラーが表示する別値としてヘボン式ローマ字を提供します。

- [d6c2c48](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d6c2c48)

## 学習者向けのかな発音

かなの発音値をヘボン式ローマ字だけに修正しました。学習者には `あ` や `ア` の発音として `a` が表示され、同じ記号を発音として繰り返すことはありません。上位層の日本語綴りは引き続き順序付きかなラベルを使用します。

- [46d74ae](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/46d74ae)

## グループ化したかな発音参照

漢字の別読みを復元し、漢字と語彙の各発音を、順序付きかな参照の独立した入れ子シーケンスとして表現しました。スキーマはこれらのフィールドを `multi_value`、関係をグループ化済みとして宣言し、Jisho の候補も今後の Cognis コア対応に向けて同じ構造を保持します。

- [9bbe068](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9bbe068)

## 非表示の語彙発音シム

語彙の意味が表記漢字の定義と異なる場合に限り、非表示の発音レコードを復元しました。各シムは語彙固有の定義を持ち、該当する漢字表記をリンクし、グループ化されたかな参照へ解決します。定義が同一の語は直接かな経路を維持し、Lookup 候補には非表示レコードを含めません。

- [448f99e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/448f99e)

## 漢字の発音リンクを完全化

すべての漢字の発音が、読みごとの非表示の完全読みレコードを経由して、順序付きの最小かなへ解決されるよう修正しました。`来` の6つの読み（`く`、`きた`、`き`、`こ`、`らい`、`たい`）はすべて深いリンクが機能し、同じ不変条件を収録済みの全漢字に適用しています。

- [f919fa1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f919fa1)

## 単語と文の完全な発音経路

漢字表記のすべての単語を、収録済みの表記レコードと 1 件の非表示の完全発音レコードへ接続し、原子的な仮名へ進む前に収録済みの漢字読み区間を保持しました。文の発音は、単語の読みと助詞の仮名から構成した非表示の完全レコードをたどるようになりました。Jisho 候補もレイヤーごとの文字種を検証し、利用できる漢字表記リンクを保持し、不完全な仮名グループを除外します。

- [8f5a3e5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8f5a3e5)

## 同音語で共有する発音カード

`はな`、`はし`、`あめ`、`かみ` に重複していた非表示発音カードを、完全な仮名読みごとに 1 件の共有カードへ置き換えました。各共有カードは関連する語彙定義を集約し、異なる表示対象の漢字語彙から使用されます。同じラベルのカード同士が相互にリンクすることを防ぎながら、各同音語は個別の学習語彙として維持されます。

- [111ec59](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/111ec59)

## 安定したレイヤー間の読み遷移

収録済みの関係だけを読みカード遷移の情報源にしました。語彙の読み経路は同じラベルの別語彙カードを参照できません。単一漢字の完全発音は順序付き仮名へ直接解決し、複合語は厳密に小さい読み区間だけを保持します。非表示の構造的な読みは意味定義を複製しません。表示対象の語彙は漢字と意味が異なる場合だけ固有のローカライズ定義を保持し、同じ意味は表記の親から引き継ぎます。主ラベルと同一の定義は Cognis によって引き続き非表示になります。

- [1d37ccf](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/1d37ccf)

## 検証済み漢字読みと初級コンテンツ

発音の網羅性を、確認済み KANJIDIC 音読み・訓読み一覧、決定的な正規化、各結果につき 1 件の非表示読みレコード、`達` を `だち` と読む明示的な文脈例外に固定しました。漢字親と意味が異なる語彙カードのローカライズ定義に加え、場所・存在・描写・様態・コピュラを扱う 9 語と、完全な発音経路を持つ自然な例文 8 文の確認済みバッチを追加しました。

- [69fad5d](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/69fad5d)

## ステージカード削除範囲の所有元

ステージ上のカード削除処理とスタイルは、この外部日本語コンテンツモジュールではなく Cognis Study Library コンポーザーが所有することを確認しました。正確なホスト側セレクター、必要なサイズ修正、ブラウザー回帰テストを `TODO.md` に記録し、ホスト所有のエディターへ安全でない CSS 上書きを注入しない方針としました。

- [c1a4b7b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c1a4b7b)

## かな限定のローマ字解決

日本語パックではヘボン式ローマ字を原子的なかなに限定し、上位レイヤーの読みを日本語のかなラベルとして作成済みであることを確認しました。再帰的な発音導出によってかなのローマ字が語彙や文の読みに持ち上がらないようにするため、Cognis コンポーザーに必要な修正箇所を正確に記録しました。外部モジュールからホスト所有の導出動作を上書きすることはありません。

- [2324f5b](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/2324f5b)

## 明示的な破壊的アンインストールクリーンアップ

Cognis が要求する管理用モジュール設定削除エンドポイントを、コンテンツに影響しない `204` 互換ルートとして追加しました。パッケージ提供の日本語レコードは、アンインストール要求に `deleteContent: true` が明示された場合に限り Study Library プロバイダー経由で削除されます。無効化、通常のアンインストール、クリーンアップ機能の欠如、またはクリーンアップ失敗によって、既存の学習データが黙って削除されたり孤立したりすることはありません。

- [eb8583f](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/eb8583f)

## 語彙カードの定義を復元

これまで表記親に依存していた、表示対象の漢字表記語彙レコードすべてに直接の定義関係を追加しました。直接参照された定義だけを表示する Cognis のカードレンダラーに合わせ、`川`、`空`、`花`、`鼻`、`橋`、`箸`、`雨`、`飴`、`水`、`犬`、`猫`、`山`、`紙`、`髪` などのカードで意味を復元しました。

- [c045f5e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/c045f5e)

## 動作する Jisho 語彙検索

Jisho コンポーザーのフローを修正し、語彙検索で長さを制限した英語などのラテン文字検索語を受け付け、リクエスト前に即座に該当なしとなる問題を解消しました。パッケージ内の日本語完全一致を引き続き優先し、リモートの日本語クエリでは完全一致を、意味検索では Jisho の最上位結果を使用します。かな・漢字レイヤーは有効な日本語 1 文字に限定し、安全でない入力や長すぎる入力はネットワークアクセス前に拒否します。

- [f14901a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/f14901a)

## 動詞・副詞の基本形変換ビュー

日本語パックを最新の Cognis 変換契約に合わせました。語彙では動詞の基本形と活用しない副詞を専用ビューに分け、動詞は一段、通常の五段語尾、例外の `行く` と `ある`、不規則な `来る` を区別します。プロバイダー宣言の規則により、確認済みの丁寧形・否定形・過去形・て形を表示時に導出し、パックには 12 件の正規の動詞・副詞基本形だけを保存して生成形の重複は収録しません。

- [097eab5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/097eab5)

## 文発音リンクの分割

文の発音詳細では、順序付けられた読みの各区間を、対応する表示語彙または助詞カードへ直接リンクするようになりました。文全体を表す 25 件の非表示語彙ラッパーと、文レベルの `pronunciation-readings` 関係を削除したため、`はなはとてもきれいです` は文全体の語彙カード 1 枚ではなく、`花`、`は`、`とても`、`きれい`、`です` を個別に開きます。

- [0002eee](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0002eee)

## 完全な日本語発音の保護

パッケージ内の上位レイヤー発音をすべて監査し、文全体の再構成を含む完全な日本語テキストとして固定しました。報告されたローマ字混在と末尾区間の欠落は Cognis PR #226 に由来します。再帰導出が原子的なラベルより先にかなカードのヘボン式フィールドを読み、ホストのポップアップがグループ化された読み全体を保持する必要があります。外部パックからホスト UI を危険に上書きせず、必要な上流の基本ケース修正と折り返し回帰テストを正確に記録しました。

- [0906392](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0906392)

## 原子的なかなへの読みタイトルナビゲーション

すべての非表示漢字読みレコードに、原子的なかなから成る明示的で順序付きのタイトル構成を追加しました。`さん` のような複数かなの読みは `さ` と `ん` を直接開くため、ホストが `小` で使われる別の非表示漢字読み語彙カード `さ` に置き換えることはありません。発音の意味を表す完全な `kana-spelling` 関係は維持しつつ、タイトルナビゲーションは決定的にかなで終端します。

- [8c48fa7](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8c48fa7)

## 複合かなのナビゲーションと小書き字形

複数記号から成るすべてのかなカードに、原子的なかなによる明示的なタイトル構成を追加しました。これにより、`きょ` のような複合かなが同じ表記の非表示語彙読みカードへ深くリンクすることを防ぎます。複合文字の筆順配置を文字サイズに応じた領域で再構築し、`ょ` のような小書き文字が通常サイズのかなと並んでも明確に小さい比率を保つようにしました。

- [4c33d9e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/4c33d9e)

## 文を装う語彙カードを作らない文リンク

文の発音から、順序付きの表示語彙および助詞構成要素へのリンクを復元しました。正当な文リンクを削除せず、文全体の読み、文の複合クラス、助詞クラス、助詞参照、非表示の文構成要素が語彙レイヤーへ混入することを強化した構造回帰テストで拒否します。

- [7cdb1ac](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/7cdb1ac)

## かな重複語彙を作らない直接漢字読み

`む` のような単一かなの残存項目を含む、140 件すべての非表示 `reading:kanji` 語彙レコードを削除しました。漢字発音グループとリモート Jisho 漢字候補は順序付きの原子的なかなへ直接リンクし、完全な語彙発音ラッパーはかな書記単位のラベルと重複しない場合だけ残します。

- [d7a28e4](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d7a28e4)

## 深く分岐する動詞変形

日本語パックを Cognis の合成可能な変形ツリー契約に合わせました。すべての動詞活用族が丁寧、否定、過去、接続、使役、受身、可能、意向の経路へ分岐し、4 段階の使役希望連鎖も含みます。表記と発音は個別に変形され、ローカライズされた定義上書きが意味上の分岐を説明します。副詞は不変の基本カードのままで、生成形は表示時にのみ存在します。

- [d93ad3c](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/d93ad3c)

## 選択的な漢字読み中間カード

複数の読みを持つ漢字だけに、発音ごと一つの非表示読み語彙カードを復元しました。唯一の単一読み漢字は引き続き原子的なかなへ直接リンクします。各中間カードはタイトルを一つの元漢字だけにリンクし、原子的なかなから発音を再構成し、意味がより狭い場合は独自の定義を持てます。`せんせい` のような語全体のかなラッパーは削除し、`先生` の読みは個別の `せん` と `せい` 中間カードから構成します。

- [91488aa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/91488aa)

## 単独で意味を表示できる読み定義

すべての非表示漢字読み語彙レコードに定義を直接リンクしました。これにより、発音のディープリンクから読みを開いても、漢字カードの「使用元」から開いた場合と同じ意味が表示されます。意味が同じ場合は元漢字の定義を再利用し、読みの意味が狭い場合は引き続き読み固有の定義を持たせられます。

- [b0a83fb](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/b0a83fb)

## ローカライズ済み変換マーカー

使役希望形の分岐が、ドイツ語・英語・インドネシア語・日本語のローカライズ済み `marker` メタデータを公開するようになりました。Cognis はこの語句を定義テンプレートへ挿入しつつ、明示的な変換固有定義を引き続き優先できます。

## 語彙内での派生形選択

文書化した契約では、基本の動詞・副詞を語彙レイヤーに保持し、生成形を学習項目として保存せず、ホストの派生形選択から深い変換ツリーを表示します。

## バージョン同期

モジュールを `2.2.72`、コンテンツリビジョンを `2026-09-30.10`、日本語スキーマをリビジョン `77` に更新し、パッケージハッシュを再生成しました。

## コミット

- [d7b696b](../../commit/d7b696b) — 変換マーカーを Cognis に整合。

## すべての変換に対する定義注釈

提供するすべての動詞変換にローカライズ済みマーカーメタデータを追加しました。直接の希望形分岐は `見たい` のような形を生成し、否定・過去・丁寧・接続・受身・可能・意向・使役および深い分岐も、それぞれ固有の意味注釈を提供します。

## 多義語の定義を個別に保持

`見る` は「to see」と「to watch」に相当する定義レコードを別々に参照するようになりました。回帰テストは希望マーカーを各定義へ個別に適用します。ローカライズ済みの各動詞定義には、必須の `{{ marker }}` スロットを保存します。

## 構造化した Cognis 側の改善案

パックは、ローカライズ済みの各動詞定義に `{{ marker }}` スロットをちょうど 1 つ配置し、変換表示でも個別の定義レコードを維持することで、Cognis のマーカー契約へ直接適合します。

## コミット

- [64ce852](../../commit/64ce852) — すべての動詞変換定義へ注釈を追加。

## 動詞定義へマーカースロットを追加

動詞が参照するローカライズ済みの各定義に、文法的に正しい挿入位置で `{{ marker }}` スロットをちょうど 1 つ追加しました。これにより Cognis は、変換注釈の位置を推測せず、`見る` の 2 つの定義を `to (want to) see` と `to (want to) watch` に変換できます。

## 多義語の定義を個別に維持

`学ぶ` の結合済み意味を「to learn」と「to study」に相当する別々の定義レコードへ分割し、既存の `見る` の分割と一致させました。テストは、表示対象の各動詞定義と各言語にマーカースロットがちょうど 1 つあることを要求します。

## バージョン同期

モジュールを `2.2.74`、コンテンツリビジョンを `2026-10-01.2`、日本語スキーマをリビジョン `79` に更新し、パッケージハッシュを再生成しました。

## コミット

- [f6c7201](../../commit/f6c7201) — 動詞定義へ変換マーカーを配置。

## 合成可能な定義変換

固定の `marker` メタデータと保存済み `{{ marker }}` スロットを、Cognis 2.24 の `definitionTransform` 構造へ置き換えました。各規則は、取り外せるローカライズ済み境界と、`{{ definition }}`、`{{ stem }}`、`{{ prefix }}`、`{{ suffix }}` を使うテンプレートを宣言し、深い変換経路に沿って順番に合成します。

## 通常の定義と深い経路のテスト

動詞定義を通常のローカライズ済み文面へ戻し、統一した不定詞境界によって各多義語定義を個別に変換できるようにしました。テストは `見る` の希望形と 4 段階の使役希望経路を、意味を平坦化せず検証します。

## バージョン同期

モジュールを `2.2.75`、コンテンツリビジョンを `2026-10-01.3`、日本語スキーマをリビジョン `80` に更新し、パッケージハッシュを再生成しました。

## コミット

- [739beba](../../commit/739beba) — 合成可能な定義変換を導入。

## 文脈対応の定義置換

定義変換は、フォールバックテンプレートより先に Cognis 2.24.1 の順序付きローカライズ済み `replacements` を使用するようになりました。過去・否定の分岐は以前の希望・使役・丁寧・条件の意味を書き換え、接続分岐は `{{ definition }}` を使って完全な変換済み定義へ意味を追加します。

## 文脈連鎖のテスト

テストは `to (want to) see` が `to (have wanted to) see` へ変わること、接続希望形が `to (want to) see (and then)` になること、最も深い使役希望経路が完全な文脈的意味を維持することを検証します。

## バージョン同期

モジュールを `2.2.76`、コンテンツリビジョンを `2026-10-01.4`、日本語スキーマをリビジョン `81` に更新し、パッケージハッシュを再生成しました。

## コミット

- [a5539e6](../../commit/a5539e6) — 文脈対応の定義置換を追加。

## 正しいアスペクト比の描画パターン

パッケージ内のすべてのストロークパターンが論理列数を宣言するようになりました。Cognis の描画練習は、キャンバスを引き伸ばしたり誤った大きさのセルへ文字を分散したりせず、単一文字・複数文字のパターンをアスペクト比維持の表示領域へ収められます。

## 文字境界を認識するストロークテスト

ストロークパターンは文字ごとの順序付きグループ長を公開し、リモート取得した複数文字パターンも同じメタデータを維持します。これにより、次のストロークの案内やガイド非表示テストでも文字境界を保持できます。ホスト側のフォローアップとして、複合パターンの作成済みグループを保持し、語彙の合成では境界に基づく光学的な文字間隔を使う必要も記録しました。

## バージョン同期

モジュールを `2.2.77`、コンテンツリビジョンを `2026-10-01.5`、日本語スキーマをリビジョン `82` に更新し、パッケージハッシュを再生成しました。

## コミット

- [7c2c0db](../../commit/7c2c0db) — 描画のアスペクト比とストロークグループを保持。
