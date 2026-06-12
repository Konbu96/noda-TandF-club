# 付録: 技術メモ

> 本設計書は機能要件が主。ここでは現行コードベースを踏まえた技術方針を簡潔に記載。

---

## 現行スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 15（App Router） |
| UI | React 19, Tailwind CSS v4 |
| 言語 | TypeScript |
| DB | Firebase Firestore |
| 認証 | 未導入（Firebase Auth を追加予定） |
| デプロイ | Vercel |

## 現行データ

- Firestore: `news` コレクションのみ（読み取り専用）
- 静的: スケジュール、部員数、FAQ、部員の声

関連ファイル:

- `src/lib/firebase.ts` — Firebase 初期化
- `src/lib/news.ts` — 唯一のデータ層パターン

---

## 拡張方針（実装時）

### ルート構成（案）

```
src/app/
├── page.tsx              # 公開（現行）
├── news/
├── login/
├── member/               # 部員
└── admin/                # 管理者
```

### 認証

- Firebase Authentication（メール/パスワード or Google）
- ロール: Firestore `users/{uid}.role` + Custom Claims（要検討）
- Middleware で `/admin/*`, `/member/*` を保護

### データ層

- `src/lib/` にドメイン別モジュール（`members.ts`, `trainingMenus.ts` 等）
- 既存 `news.ts` パターンを踏襲

### Firestore Security Rules

- 公開読み取り: 週間スケジュール等のみ
- 部員: 自分のデータ read/write（体調・休み申請）
- 管理者: ロールに応じた read/write
- 体調: 厳格な read 制限

`firestore.rules` をリポジトリに追加（現在未管理）。

### 公開サイト連携

- `Schedule.tsx`, `Members.tsx` を Firestore 取得に切替
- 集計値のみ公開、個人データは非公開

---

## 実装フェーズ（参考）

| Phase | 内容 |
|-------|------|
| 1 | 認証 + スケジュール + 公開連携 |
| 2 | 名簿 + PB + 大会 + 休み + 個人ページ |
| 3 | 練習メニュー |
| 4 | 体調 + Security Rules 本番化 |

※ 詳細スケジュールは別途策定。
