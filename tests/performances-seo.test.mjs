import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/performances/page.tsx", "utf8");

test("公演予定ページの検索タイトルを強化する", () => {
  assert.match(
    source,
    /absolute:\s*"劇団花吹雪 公演予定｜桜春之丞・春之丞の出演予定"/
  );
});

test("公演予定ページの説明文に主要検索語を含める", () => {
  assert.match(source, /劇団花吹雪予定/);
  assert.match(source, /桜春之丞予定/);
  assert.match(source, /春之丞予定/);
});
