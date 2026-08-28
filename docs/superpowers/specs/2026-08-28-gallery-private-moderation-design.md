# Gallery 非公開審査フロー設計

## 目的

写真投稿のうち、審査前・非表示中の画像ファイルを外部から直接閲覧できない状態にする。
既存の公開写真と公開サイトの表示方式は壊さない。

## 現状

- 公開用 Storage bucket: `gallery`
- `gallery` は public bucket
- 新規投稿も最初から `gallery` に保存される
- DB では新規投稿を `status=pending`, `is_public=false` にしている
- 公開サイトは `gallery` の public URL を直接表示している
- 管理画面も `getPublicUrl()` で画像を表示している

そのため、DB 上で非公開でも、画像ファイル自体は public bucket に存在する。

## 採用する構造

### 1. 非公開バケットを追加

新規 bucket:

`gallery-private`

設定:

- public: false
- 最大 10MB
- JPEG
- PNG
- WebP

### 2. 新規投稿

新規写真は `gallery-private` にアップロードする。

DB:

- `status = pending`
- `is_public = false`

### 3. 管理画面プレビュー

`pending` または `hidden` の画像は public URL を使わない。

管理者だけが閲覧できる短時間の signed URL をサーバー側で生成して表示する。

### 4. 公開

管理者が「公開」を押した場合:

1. `gallery-private` から画像を取得
2. public bucket `gallery` に同じ storage_path で保存
3. private 側を削除
4. DB を更新

DB:

- `status = published`
- `is_public = true`
- `approved_at = 現在時刻`

### 5. 非表示

公開中の写真を「非表示」にした場合:

1. `gallery` から画像を取得
2. `gallery-private` に保存
3. public 側を削除
4. DB を更新

DB:

- `status = hidden`
- `is_public = false`

### 6. 再公開

hidden の写真を再び公開する場合は、公開処理と同じ方法で private → public へ移動する。

### 7. 削除

状態に応じて画像本体を削除する。

- published → `gallery`
- pending / hidden → `gallery-private`

その後、DB レコードを削除する。

### 8. 既存データ

現在存在する承認済み公開写真は移動しない。
既存 public URL をそのまま使用する。

## 安全対策

- Storage 移動に失敗した場合は DB の公開状態を変更しない
- 同名ファイルの上書きは禁止
- signed URL は管理画面だけで生成
- public サイトは `status=published AND is_public=true` のみ表示
- private bucket を public にしない

## テスト

以下を自動テストする。

1. pending は private bucket を使用
2. published は public bucket を使用
3. hidden は private bucket を使用
4. 公開処理が private → public の順序で行われる
5. 非表示処理が public → private の順序で行われる
6. Storage エラー時に DB 状態を誤更新しない
7. 削除時に状態に応じた正しい bucket を使う
8. 既存公開写真の表示コードを壊さない
9. typecheck 成功
10. production build 成功

## 変更対象

- Supabase Storage
- `app/admin/(protected)/gallery/page.tsx`
- 必要に応じて gallery 用 helper
- gallery 関連テスト

