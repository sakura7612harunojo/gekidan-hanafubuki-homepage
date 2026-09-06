import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("劇団員専用ページ /cast がある", () => {
  assert.equal(existsSync("app/cast/page.tsx"), true);
});

test("ヘッダーの劇団員は /cast へ移動する", () => {
  const source = readFileSync("components/Header.tsx", "utf8");

  assert.match(source, /<Link href="\/cast">劇団員<\/Link>/);
  assert.doesNotMatch(source, /href="\/#cast"/);
});
