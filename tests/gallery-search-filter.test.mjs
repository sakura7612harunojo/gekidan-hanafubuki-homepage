import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("写真管理でタイトル検索と状態絞り込みができる", () => {
  const searchPath = "components/admin/GallerySearch.tsx";

  assert.equal(
    existsSync(searchPath),
    true,
    "components/admin/GallerySearch.tsx がまだありません"
  );

  const searchSource = readFileSync(searchPath, "utf8");
  const pageSource = readFileSync(
    "app/admin/(protected)/gallery/page.tsx",
    "utf8"
  );

  assert.match(searchSource, /写真を検索/);
  assert.match(searchSource, /全部/);
  assert.match(searchSource, /公開/);
  assert.match(searchSource, /非公開/);
  assert.match(searchSource, /保留/);
  assert.match(searchSource, /params\.set\("status"/);
  assert.match(searchSource, /params\.delete\("status"\)/);

  assert.match(pageSource, /searchParams/);
  assert.match(pageSource, /\.ilike\("title"/);
  assert.match(pageSource, /\.eq\("status", "published"\)/);
  assert.match(pageSource, /\.eq\("status", "hidden"\)/);
  assert.match(pageSource, /\.eq\("status", "pending"\)/);
  assert.match(pageSource, /<GallerySearch/);
});
