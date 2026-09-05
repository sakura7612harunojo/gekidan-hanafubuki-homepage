import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("サイトマップに写真ページを含める", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");

  assert.match(source, /\/gallery/);
});
