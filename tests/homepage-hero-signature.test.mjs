import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("トップページのヒーローに桜春之丞サインを表示する", () => {
  assert.match(page, /harunojo-signature\.png/);
  assert.match(page, /className="hero-signature"/);
});

test("サインはトップの主役文字を邪魔しない大きさにする", () => {
  assert.match(css, /\.hero-signature\s*\{[\s\S]*?max-width:\s*360px/);
  assert.match(css, /opacity:\s*0\.92/);
});

test("スマホではさらに小さくする", () => {
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.hero-signature\s*\{[\s\S]*?max-width:\s*260px/,
  );
});
