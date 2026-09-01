import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("app/globals.css", "utf8");

test("公開サイトだけに花吹雪テーマを適用する", () => {
  assert.match(css, /HANABUKI_PUBLIC_PINK_GOLD_THEME/);
  assert.match(css, /body:has\(\.header\)/);
});

test("白・ピンク・ゴールドの基調色を持つ", () => {
  assert.match(css, /--hanabuki-bg:\s*#fffafc/);
  assert.match(css, /--hanabuki-pink:\s*#d94f8a/);
  assert.match(css, /--hanabuki-gold:\s*#c9a227/);
  assert.match(css, /--hanabuki-text:\s*#4a2a35/);
});

test("公開ヘッダーとカードを明るくする", () => {
  assert.match(css, /body:has\(\.header\)\s+\.header\s*\{/);
  assert.match(css, /body:has\(\.header\)\s+\.performance-card/);
  assert.match(css, /body:has\(\.header\)\s+\.card/);
});

test("ボタンとリンクにピンク・ゴールドのアクセントを付ける", () => {
  assert.match(css, /body:has\(\.header\)\s+\.text-link/);
  assert.match(css, /body:has\(\.header\)\s+\.session-badge/);
});

test("管理画面を直接対象にするCSSを書かない", () => {
  const themeStart = css.indexOf("HANABUKI_PUBLIC_PINK_GOLD_THEME");
  const theme = css.slice(themeStart);
  assert.doesNotMatch(theme, /\.admin\b/);
  assert.doesNotMatch(theme, /#admin\b/);
});
