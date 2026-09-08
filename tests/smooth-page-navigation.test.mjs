import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("ページ切り替えでは全体スムーズスクロールを使わない", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.doesNotMatch(css, /html\s*\{\s*scroll-behavior:\s*smooth;\s*\}/);
});

test("同じページ内のリンクだけスムーズに移動する", () => {
  assert.equal(existsSync("components/SmoothHashLinks.tsx"), true);

  const source = readFileSync("components/SmoothHashLinks.tsx", "utf8");
  assert.match(source, /scrollIntoView/);
  assert.match(source, /behavior:\s*["']smooth["']/);
});

test("全ページでページ内スムーズ移動を有効にする", () => {
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /SmoothHashLinks/);
});
