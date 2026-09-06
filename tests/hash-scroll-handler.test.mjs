import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("URLのハッシュ位置へ確実にスクロールする処理がある", () => {
  assert.equal(existsSync("components/HashScrollHandler.tsx"), true);

  const source = readFileSync("components/HashScrollHandler.tsx", "utf8");

  assert.match(source, /window\.location\.hash/);
  assert.match(source, /document\.getElementById/);
  assert.match(source, /scrollIntoView/);
});

test("ページの読み込み後もハッシュ位置を再調整する", () => {
  const source = readFileSync("components/HashScrollHandler.tsx", "utf8");

  assert.match(source, /setTimeout/);
  assert.match(source, /window\.addEventListener\("load"/);
});
