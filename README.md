# noda-tandf-club

野田学園陸上競技部のウェブサイト

## セットアップ

### インストール

```bash
npm install
```

### 開発環境で実行

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## Google Analyticsの設定

1. `.env.local` ファイルをプロジェクトのルートディレクトリに作成
2. Google Analytics 4の測定ID（G-XXXXXXXXXX形式）を取得
3. `.env.local` に以下を追加：

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

測定IDは、Google Analyticsの管理画面 > プロパティ設定 > データストリーム から確認できます。

**注意：** `.env.local` ファイルはGitにコミットされません（.gitignoreに含まれています）。

## ビルド

```bash
npm run build
```

## デプロイ

本番環境へのデプロイ時は、デプロイ先の環境変数設定画面で `NEXT_PUBLIC_GA_ID` を設定してください。