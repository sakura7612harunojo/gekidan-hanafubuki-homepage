# 劇団花吹雪 OS — Next.js / Supabase版

## 採用構成

- 公開サイト・管理画面: Next.js App Router + TypeScript
- データベース・認証・画像保存: Supabase
- 公開先: Vercel
- 将来のモバイルアプリ: Expo / React Native

## 現在入っているもの

- ファン向けトップページ
- 本日の公演
- 公演予定
- 劇団員紹介
- 演目紹介
- Supabase接続
- 管理画面ログイン
- 管理ダッシュボード
- 初期SQLスキーマ
- ヘルスチェックAPI

## Macでの開始手順

1. Node.jsをインストール
2. このフォルダをターミナルで開く
3. `npm install`
4. `.env.example`を`.env.local`へコピー
5. SupabaseのURLとPublishable keyを入力
6. Supabase SQL Editorで `supabase/migrations/0001_initial_schema.sql` を実行
7. `npm run dev`
8. ブラウザで `http://localhost:3000`

## 重要

- `SUPABASE_SECRET_KEY`はブラウザへ渡さないでください。
- 管理者のメールアドレスとパスワードはSupabase Authで作成します。
- 管理者用の更新RLSポリシーは、管理者UUIDが確定してから追加します。
- 現段階では管理画面の各編集フォームと写真アップロードは土台のみです。
