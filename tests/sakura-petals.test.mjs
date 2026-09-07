import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const layout = fs.readFileSync("app/layout.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("公開サイトで桜の花びらアニメーションを表示しない", () => {
  assert.doesNotMatch(layout, /SakuraPetals/);
  assert.doesNotMatch(layout, /<SakuraPetals\s*\/>/);
  assert.doesNotMatch(css, /@keyframes\s+sakura-fall/);
});
