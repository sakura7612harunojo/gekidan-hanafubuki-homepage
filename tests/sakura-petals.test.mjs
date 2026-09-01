import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const layout = fs.readFileSync("app/layout.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");
const componentExists = fs.existsSync("components/SakuraPetals.tsx");
const component = componentExists
  ? fs.readFileSync("components/SakuraPetals.tsx", "utf8")
  : "";

test("公開レイアウトに桜の花びらを追加する", () => {
  assert.match(layout, /SakuraPetals/);
  assert.match(layout, /<SakuraPetals\s*\/>/);
});

test("花びらは操作を邪魔しない固定レイヤー", () => {
  assert.match(css, /\.sakura-petals-layer\s*\{/);
  assert.match(css, /position:\s*fixed/);
  assert.match(css, /pointer-events:\s*none/);
});

test("花びらはCSSアニメーションで舞う", () => {
  assert.ok(componentExists, "SakuraPetals.tsx がありません");
  assert.match(component, /sakura-petal/);
  assert.match(css, /@keyframes\s+sakura-fall/);
});

test("動きを減らす設定に配慮する", () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.sakura-petals-layer[\s\S]*display:\s*none/);
});

test("花びら枚数は過剰にしない", () => {
  const matches = component.match(/<span/g) ?? [];
  assert.ok(matches.length >= 10 && matches.length <= 18);
});
