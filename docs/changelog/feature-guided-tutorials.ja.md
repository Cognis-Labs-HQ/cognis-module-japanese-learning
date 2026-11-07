# ガイド付きチュートリアル

**Feature Branch:** feature-guided-tutorials

## 技術仕様

Explore と Flashcards の経路は Study の公開機能 `study:tutorialTargets` が解決します。言語モジュールは言語データと手順だけを提供し、経路、受講登録、キャッシュ、学習 UI は Cognis が担当します。英語と日本語のプロバイダー実装は同一です。キャッシュ済みコンテンツはオフラインでも説明できます。移動後に対象がない場合はホストの対象欠落ポリシーに従います。

モジュールは ctx 経由で手順と翻訳済みテキストを登録します。ホストが一覧、説明、矢印、強調表示、キーとポインターの制御、アクセス確認付き SPA ナビゲーション、アクセシビリティを担当します。閉じる操作、手順外への移動、権限の喪失、モジュールの無効化でセッションを終了します。プロバイダーのマウント失敗時は登録を取り消します。

プロバイダーテストでは公開契約、4 言語の翻訳、利用条件、失敗時の後処理、未対応ホストバージョンの拒否を確認します。

## ページ連動の初回ガイド

ホストは説明、矢印、強調表示、アクセシビリティ、共通のフローティング操作メニューを担当します。初回は常に「次へ」を表示し、中止とスキップは表示しません。再生時の中止には `btn-cancel` を使います。完了はブラウザー内でアカウント別に保存します。移動、アクセス喪失、プロバイダー解除でセッションを終了し、マウント失敗では登録を取り消します。

## モジュールの翻訳キー

チュートリアルの翻訳キーは、ハイフンを含むマニフェストのモジュールID全体を名前空間の単一の要素として使います。

## 操作に役立つ説明

各ステップではページの操作項目と作業を説明し、権限やガイドが実行しない操作についての不要な説明を省きます。

## ステップごとに次へ進む強調を指定

各ステップで `highlightNext` を明示します。「次へ」や「完了」が必要な説明では有効にし、操作や待機条件で進む練習では無効にします。動きを減らす設定では静的な枠を表示します。

すべての UI コンポーネントにチュートリアルを用意します。開発ガイドラインでは、利用者の目的に沿う操作説明と、機能や UI 動作の変更に伴う既存チュートリアルの見直しを求めます。

## 表示されるチュートリアル対象

強調する領域と「次へ」の強調を明示します。

## 共通のフローティングメニュー待ち行列

メニューはホスト共通の待ち行列とコンポーネントの寿命に従います。

## 復旧操作の説明

対象がない画面では「次へ」と最初からやり直す操作を提供し、再実行では中止も選べます。

## 目的の明確なガイド

表示順に沿って異なる可視操作を説明します。共通指針は画面状態の検出、安定した例、空の状態、条件付き分岐、ライフサイクルの後処理を扱います。再実行操作と動きを減らす設定の文書をホストと一致させます。

## コミット

- [9eb04a5](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/9eb04a52924608bec3a943121d169c9b09e5a59d)
- [6429024](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/64290246cd5ef8567402e71e22921a3e28f36d76)
- [e6768d1](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/e6768d18e5e9e78eb456e25ce2c8d935214683b8)
- [8696a30](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8696a3069f18388c39b7c13bd2ea59f569c25a85)
- [8946fb9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/8946fb98097d13ebd923e1c2354d13ef1e0545c3)
- [0c2bcf9](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/0c2bcf9e65dc2bf8c27b533d77b9456d73985070)
- [646a16c12](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/646a16c12d8bfa98ca71b09a074fa70d505851e5)
- [028167419](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/028167419f103c6d3b2bb9df4ff25a47f3e06080)
