import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("トップページの検索タイトルで公式サイトと座長名を明確にする", () => {
  const source = readFileSync("app/page.tsx", "utf8");

  assert.match(
    source,
    /劇団花吹雪 公式サイト｜大衆演劇｜桜春之丞・櫻京之介/
  );
});

test("トップページ本文に公式サイト説明がある", () => {
  const source = readFileSync("app/page.tsx", "utf8");

  assert.match(source, /劇団花吹雪の公式サイト/);
  assert.match(source, /桜春之丞/);
  assert.match(source, /櫻京之介/);
});

test("WebSite構造化データがある", () => {
  const source = readFileSync("app/layout.tsx", "utf8");

  assert.match(source, /"@type":\s*"WebSite"/);
  assert.match(source, /"name":\s*"劇団花吹雪"/);
});
