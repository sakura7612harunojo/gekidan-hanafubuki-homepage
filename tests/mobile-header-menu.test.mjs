import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const header = readFileSync("components/Header.tsx", "utf8");
const css = readFileSync("app/globals.css", "utf8");

test("スマホ用メニューボタンがある", () => {
  assert.match(header, /["']use client["']/);
  assert.match(header, /useState/);
  assert.match(header, /aria-expanded/);
  assert.match(header, /aria-controls=["']mobile-navigation["']/);
  assert.match(header, /☰/);
});

test("スマホメニューは開閉できる", () => {
  assert.match(header, /mobile-menu-open/);
  assert.match(header, /setMenuOpen/);
  assert.match(header, /onClick/);
});

test("スマホではメニューを縦表示し、お知らせも隠さない", () => {
  assert.match(css, /mobile-menu-open/);
  assert.doesNotMatch(
    css,
    /\.nav a:nth-child\(6\)\s*\{\s*display:\s*none;\s*\}/
  );
});
