import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/performances/page.tsx", "utf8");

test("公演予定ページの検索タイトルを強化する", () => {
  assert.match(
    source,
    /absolute:\s*"劇団花吹雪 公演予定｜大衆演劇｜桜春之丞・櫻京之介"/
  );
});

test("公演予定ページの説明文に主要検索語を含める", () => {
  assert.match(source, /大衆演劇/);
  assert.match(source, /桜春之丞/);
  assert.match(source, /公演日程/);
  assert.match(source, /劇場/);
  assert.match(source, /芝居/);
});
