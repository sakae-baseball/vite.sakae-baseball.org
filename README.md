# 春季市民野球大会 公式サイト

VitePress を使用して構築された春季市民野球大会の公式サイトです。大会トップページ、日程・試合結果、協会概要/役員一覧の情報を提供します。

## 必要要件

- Node.js 18 以上
- npm 9 以上

## セットアップ

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

コマンド実行後、表示される URL にアクセスするとローカル環境でサイトを確認できます。

## 本番ビルド

```bash
npm run build
```

生成された静的ファイルは `docs/.vitepress/dist` に出力されます。ビルド完了後に `dist` 配下の画像（jpg/jpeg/png/webp）を自動で最適化します。プレビューする場合は下記コマンドを利用できます。

```bash
npm run serve
```

## GitHub Actions デプロイ

`main` ブランチへ push（または Actions の手動実行）で、静的サイトをビルドして `sakae-jsbb.sakura.ne.jp:/home/sakae-jsbb/www/new/` へ `rsync` 配備します。

事前に GitHub リポジトリの Secrets に以下を設定してください。

- `SAKURA_SSH_PRIVATE_KEY`: `sakae-jsbb` ユーザーで接続可能な秘密鍵

## コンテンツ構成

- `docs/index.md`: トップページ (ホームレイアウト)
- `docs/schedule.md`: 日程・試合結果のお知らせ
- `docs/association.md`: 協会概要と役員一覧
- `docs/.vitepress/config.ts`: サイト設定・ナビゲーション

## ライセンス

プロジェクト内のコンテンツの著作権は春季市民野球大会実行委員会に帰属します。
