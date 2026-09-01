import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const header = fs.readFileSync("components/Header.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("トップページから演目紹介を完全に外す", () => {
  assert.doesNotMatch(page, /演目紹介/);
  assert.doesNotMatch(page, /id=["']repertoire["']/);
});

test("演目紹介を消したのでヘッダーの演目リンクも外す", () => {
  assert.doesNotMatch(header, /#repertoire/);
  assert.doesNotMatch(header, />\s*演目\s*</);
});

test("ヘッダーの劇団花吹雪の横に春マークを置く", () => {
  assert.doesNotMatch(header, /brand-with-mark/);
  assert.doesNotMatch(header, /brand-with-mark/);
  assert.doesNotMatch(css, /\.header-brand-mark/);
});
