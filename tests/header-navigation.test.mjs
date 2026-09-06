import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("components/Header.tsx", "utf8");

test("劇団員は別ページからトップの劇団員紹介へ移動できるLinkを使う", () => {
  assert.match(
    source,
    /<Link href="\/#cast">劇団員<\/Link>/
  );
});
