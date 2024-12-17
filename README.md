## 前提条件

1. [Node.js](https://nodejs.org/en/) (v18)をインストールする
2. [yarn](https://yarnpkg.com/getting-started/install)をインストールする

## はじめに

1. `git clone https://gitlab.com/infinitalk/infinitalk/<repo-url>.git`
2. `cd repo-url`
3. ルート ディレクトリに.env.localファイルを作成
4. 依存関係をインストール
   ```bash
   # コマンド実行
   yarn install
   ```
5. アプリケーションを開始
   ```bash
   # Android向け
   yarn android

   # iOS向け
   yarn ios
   ```

## Git フロー
### PR 作成

1. develop から開発ブランチを切ります

- 通常タスク: `git branch feature/<タスク ID>/ブランチ名`
- バグ修正タスク: `git branch bugfix/<バグ ID>/ブランチ名`

2. ESLint でコードを修正
   ```bash
   # コマンド実行
   yarn lint:fix
   ```
3. 実装できたら commit/push
4. PR 作成(develop に向けて下さい)
5. レビュアーにレビュー依頼(テストケース作成を依頼したときはテストケースのレビューも粂に投げて下さい)

### コミットのメッセージのルール

`<タスク ID> - <タイプ>: <メッセージ>`

タイプは上記のいずれか

```
build   ：ビルドシステムや依存関係に関する変更
chore   ：コードや依存関係に影響しない雑務の変更
ci      ：CI（継続的インテグレーション）関連の変更
docs    ：ドキュメントのみの変更
feature ：新しい機能の追加
bugfix  ：バグの修正
refactor：リファクタリング（動作には影響しないコードの改善）
revert  ：以前のコミットを取り消す変更
test    ：テストコードの追加や修正

例: NFNTLKDVLP-1111 - feature: add new feature
```

### PR のルール

`[タスク ID] <プルリクエストのタイトル>`

## アプリの変更
Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## ディレクトリ構造

### 概要

```
├── public
├── src
│   ├── app
│   │   ├── components
│   │   │   ├── atoms
│   │   │   ├── molecules
│   │   │   ├── organisms
│   │   │   └── templates
│   │   │       └── layouts
│   │   ├── pages
│   │   └── routes
│   ├── constants
│   ├── hooks
│   ├── locales
│   ├── services
│   ├── store
│   ├── styles
│   ├── types
│   └── utils
└── package.json
```

### 詳細

- **app**
   - **components** - コンポーネント
   - **pages** - ページ
   - **routes** - ルート
- **constants** - 定数の定義
- **hooks** - カスタムフック
- **locales** - 多言語翻訳
- **services** - API 連携サービス
- **store** - グローバルストア
- **styles** - CSS スタイル
- **types** - Typescript のタイプ及び列挙の定義
- **utils** - ヘルパー関数(ソート、フィルタリングなど)
- **package.json** - プロジェクトの依存関係が含まれています

### 全ての未知の単語を見つけて無視一覧に追加方法

   ```
   # 全ての未知の単語を見つける
   $ npx cspell-cli "path_to_folder_or_file" --words-only --unique --no-progress > words.txt

   # テキストを json 形式に変換
   $ awk 'NF' words.txt | awk '{print "\"" $0 "\","}' >> words.json

   # 無視する単語を spell.json ファイルにコピー
   ```

## ライセンス

このプロジェクトはジェイエムエス・ユナイテッド株式会社に登録されています。
