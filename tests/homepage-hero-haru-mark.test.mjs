import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const header = fs.readFileSync("components/Header.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");
const brandImages = fs.readFileSync(
  "components/PublicBrandImages.tsx",
  "utf8",
);

test("上部ヘッダーには春マークを表示しない", () => {
  assert.doesNotMatch(header, /hanabuki-haru-mark\.png/);
  assert.doesNotMatch(header, /header-brand-mark/);
});

test("大きい劇団花吹雪の右横に春マークを表示する", () => {
  assert.match(page, /hero-title-with-mark/);
  assert.match(page, /<h1>劇団花吹雪<\/h1>/);
  assert.match(page, /HeroTitleMark/);
  assert.match(brandImages, /hero-title-mark/);
  assert.match(brandImages, /\/images\/hanabuki-haru-mark\.png/);
});

test("大見出しと春マークは横並び", () => {
  assert.match(
    css,
    /\.hero-title-with-mark\s*\{[\s\S]*?display:\s*flex[\s\S]*?align-items:\s*center/,
  );
});

test("春マークはPCで大きめ、スマホで小さめ", () => {
  assert.match(
    css,
    /\.hero-title-mark\s*\{[\s\S]*?width:\s*clamp\(/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.hero-title-mark\s*\{[\s\S]*?width:/,
  );
});
