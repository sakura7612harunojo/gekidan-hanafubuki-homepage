import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

const galleryStart = page.indexOf('id="hanabuki-today"');
const upcomingStart = page.indexOf('id="schedule"', galleryStart);
const gallery = page.slice(
  galleryStart,
  upcomingStart > galleryStart ? upcomingStart : page.length,
);

test("トップページのギャラリーでは写真タイトルを表示しない", () => {
  assert.ok(galleryStart >= 0, "花吹雪ギャラリーが見つかりません");
  assert.doesNotMatch(gallery, /<h3>\{photo\.title\s*\|\|\s*"投稿写真"\}<\/h3>/);
});

test("ギャラリー専用の2列レイアウトを使う", () => {
  assert.match(gallery, /className="hanabuki-gallery-grid"/);
  assert.match(gallery, /className="hanabuki-gallery-card"/);
  assert.match(
    css,
    /\.hanabuki-gallery-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
});

test("スマホでは1列にする", () => {
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.hanabuki-gallery-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/,
  );
});

test("写真の縦横比を崩さない", () => {
  assert.match(
    css,
    /\.hanabuki-gallery-card img\s*\{[\s\S]*?width:\s*100%[\s\S]*?height:\s*auto/,
  );
});
