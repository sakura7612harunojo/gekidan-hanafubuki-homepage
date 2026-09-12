import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("app/page.tsx", "utf8");

test("トップページで公開中のお知らせを最新3件取得する", () => {
  assert.match(home, /\.from\(["']news["']\)/);
  assert.match(home, /\.eq\(["']status["'],\s*["']published["']\)/);
  assert.match(home, /\.order\(["']published_at["'],\s*\{\s*ascending:\s*false\s*\}\)/);
  assert.match(home, /\.limit\(3\)/);
});

test("トップページにお知らせ一覧へのリンクを表示する", () => {
  assert.match(home, /href=["']\/news["']/);
  assert.match(home, /お知らせ一覧を見る/);
});
