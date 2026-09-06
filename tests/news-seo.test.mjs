import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/news/page.tsx", "utf8");

test("お知らせページは劇団花吹雪と桜春之丞を中心にする", () => {
  assert.match(
    source,
    /absolute:\s*"劇団花吹雪｜桜春之丞｜お知らせ・公演情報"/
  );
});

test("説明文も劇団花吹雪と桜春之丞を中心にする", () => {
  assert.match(
    source,
    /大衆演劇 劇団花吹雪・桜春之丞のお知らせ・公演情報。公演、イベント、ゲスト出演などの最新情報をご案内します。/
  );
});
