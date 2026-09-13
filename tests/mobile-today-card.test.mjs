import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

test("スマホの本日の公演カードをコンパクト表示する", () => {
  assert.match(css, /HANABUKI_MOBILE_TODAY_COMPACT/);
  assert.match(css, /\.today-section \.performance-card-featured \.performance-card-top[\s\S]*?padding:\s*15px 16px/);
  assert.match(css, /\.today-section \.performance-card-featured \.performance-card-body[\s\S]*?padding:\s*16px/);
  assert.match(css, /\.today-section \.program-row[\s\S]*?padding:\s*8px 0/);
});
