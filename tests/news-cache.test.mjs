import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const news = readFileSync("app/news/page.tsx", "utf8");

test("お知らせを60秒キャッシュして表示を軽くする", () => {
  assert.doesNotMatch(news, /force-dynamic/);
  assert.match(news, /export const revalidate = 60/);
});
