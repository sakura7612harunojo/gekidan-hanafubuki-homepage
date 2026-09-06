import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("サイトマップに劇団員ページを含める", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  assert.match(source, /\$\{U\}\/cast/);
});

test("公式サイトを示すOrganization構造化データがある", () => {
  const source = readFileSync("app/layout.tsx", "utf8");

  assert.match(source, /"@type":\s*"Organization"/);
  assert.match(source, /"name":\s*"劇団花吹雪"/);
  assert.match(
    source,
    /"url":\s*"https:\/\/www\.gekidan-hanafubuki\.com"/
  );
});

test("劇団員ページのSEOタイトルと説明を強化する", () => {
  const source = readFileSync("app/cast/page.tsx", "utf8");

  assert.match(
    source,
    /absolute:\s*"劇団員紹介｜劇団花吹雪 大衆演劇 公式サイト"/
  );
  assert.match(source, /description:[\s\S]*大衆演劇/);
  assert.match(source, /桜春之丞/);
});
