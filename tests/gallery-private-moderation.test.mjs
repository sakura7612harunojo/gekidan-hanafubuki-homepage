import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  "app/admin/(protected)/gallery/page.tsx",
  "utf8"
);

test("新規写真はprivateへ保存する", () => {
  assert.match(
    source,
    /from\("gallery-private"\)[\s\S]*?upload\(storagePath,\s*bytes/
  );
});

test("審査中と非表示は署名URLで管理者だけプレビューする", () => {
  assert.match(
    source,
    /from\("gallery-private"\)[\s\S]*?createSignedUrl\(photo\.storage_path,\s*600\)/
  );
});

test("公開時はprivateからpublicへ移す", () => {
  assert.match(
    source,
    /moveGalleryObject\([\s\S]*?"gallery-private"[\s\S]*?"gallery"[\s\S]*?photo\.storage_path/
  );
});

test("非表示時はpublicからprivateへ戻す", () => {
  assert.match(
    source,
    /moveGalleryObject\([\s\S]*?"gallery"[\s\S]*?"gallery-private"[\s\S]*?photo\.storage_path/
  );
});

test("削除時は状態に応じてbucketを選ぶ", () => {
  assert.match(
    source,
    /photo\.status\s*===\s*"published"\s*\?\s*"gallery"\s*:\s*"gallery-private"/
  );
});

test("公開サイトは既存のpublic gallery URLを維持する", () => {
  const home = readFileSync("app/page.tsx", "utf8");
  assert.match(home, /storage\/v1\/object\/public\/gallery/);
});
