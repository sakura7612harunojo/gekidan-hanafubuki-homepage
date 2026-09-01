import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const header = fs.readFileSync("components/Header.tsx", "utf8");

test("公開ヘッダーに管理画面リンクを表示しない", () => {
  assert.doesNotMatch(header, /href=["']\/admin["']/);
  assert.doesNotMatch(header, />\s*管理画面\s*</);
});

test("公開ヘッダーの必要な主要リンクは残し演目リンクは出さない", () => {
  assert.match(header, /本日の公演/);
  assert.match(header, /公演予定/);
  assert.match(header, /劇団員/);
  assert.doesNotMatch(header, /演目/);
  assert.match(header, /お知らせ/);
});
