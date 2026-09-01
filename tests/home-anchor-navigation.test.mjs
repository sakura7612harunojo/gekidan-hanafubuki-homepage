import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("劇団員はアンカーリンクで移動し演目セクションは表示しない", () => {
  const header = readFileSync("components/Header.tsx", "utf8");
  const home = readFileSync("app/page.tsx", "utf8");

  assert.match(header, /<a href="\/#cast">劇団員<\/a>/);
  assert.doesNotMatch(header, /#repertoire|演目/);
assert.match(home, /id="cast"/);
  assert.doesNotMatch(home, /id="repertoire"/);
});
