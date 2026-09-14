import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

test("スマホで本日の公演と今月の公演情報の空白を詰める", () => {
  assert.match(css, /HANABUKI_MOBILE_MONTHLY_SPACING/);
  assert.match(css, /\.today-section[\s\S]*?padding-bottom:\s*24px/);
  assert.match(css, /#monthly-venue[\s\S]*?padding-top:\s*24px/);
});
