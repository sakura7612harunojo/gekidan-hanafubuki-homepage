import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

test("スマホのトップタイトルを1行で表示する", () => {
  assert.match(css, /HANABUKI_MOBILE_HERO_COMPACT/);
  assert.match(css, /\.hero-title-with-mark h1[\s\S]*?white-space:\s*nowrap/);
});

test("スマホのトップをコンパクトで読みやすくする", () => {
  assert.match(css, /body:has\(\.header\) \.hero[\s\S]*?min-height:\s*0/);
  assert.match(css, /body:has\(\.header\) \.hero \.lead[\s\S]*?color:\s*#6f4e5a/);
});
