import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("劇団員と演目は通常のアンカーリンクで各セクションへ移動する", () => {
  const header = readFileSync("components/Header.tsx", "utf8");
  const home = readFileSync("app/page.tsx", "utf8");

  assert.match(header, /<a href="\/#cast">劇団員<\/a>/);
  assert.match(header, /<a href="\/#repertoire">演目<\/a>/);
  assert.match(home, /id="cast"/);
  assert.match(home, /id="repertoire"/);
});
