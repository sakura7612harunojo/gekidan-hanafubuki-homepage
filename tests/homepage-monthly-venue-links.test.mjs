import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("app/page.tsx", "utf8");

test("今月の公演情報に公式サイトと地図ボタンを表示する", () => {
  const monthlyStart = source.indexOf('id="monthly-venue"');
  const galleryStart = source.indexOf('id="hanabuki-today"');
  assert.ok(monthlyStart >= 0);
  assert.ok(galleryStart > monthlyStart);

  const monthly = source.slice(monthlyStart, galleryStart);
  assert.match(monthly, />\s*公式サイト\s*</);
  assert.match(monthly, />\s*地図を見る\s*</);
});

test("ボタンは共通会場データのURLを使う", () => {
  assert.match(source, /currentVenue\.websiteUrl/);
  assert.match(source, /currentVenue\.mapUrl/);
});

test("外部リンクは新しいタブで安全に開く", () => {
  const monthlyStart = source.indexOf('id="monthly-venue"');
  const galleryStart = source.indexOf('id="hanabuki-today"');
  const monthly = source.slice(monthlyStart, galleryStart);

  assert.match(monthly, /target="_blank"/);
  assert.match(monthly, /rel="noreferrer"/);
});
