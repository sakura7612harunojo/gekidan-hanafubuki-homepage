import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const gallery = readFileSync(
  "app/admin/(protected)/gallery/page.tsx",
  "utf8"
);

test("写真管理から管理ダッシュボードへ戻れる", () => {
  assert.match(gallery, /import Link from ["']next\/link["']/);
  assert.match(gallery, /href=["']\/admin["']/);
  assert.match(gallery, /管理ダッシュボード/);
});
