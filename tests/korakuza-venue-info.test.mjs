import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const venues = readFileSync("lib/performance-venues.ts", "utf8");
const card = readFileSync("components/PerformanceVenueCard.tsx", "utf8");
const cms = readFileSync("lib/performance-venue-cms.ts", "utf8");

const start = venues.indexOf('"2026-11": {');
const end = venues.indexOf('"2026-12": {');
const korakuza = venues.slice(start, end);

test("後楽座の開場・開演時間を掲載し終演時間は掲載しない", () => {
  assert.match(korakuza, /昼の部 開場 11:30／開演 12:30/);
  assert.match(korakuza, /夜の部 開場 17:00／開演 17:30/);
  assert.doesNotMatch(korakuza, /終演/);
});

test("後楽座の入場料を掲載する", () => {
  assert.match(korakuza, /大人 2,100円/);
  assert.match(korakuza, /シルバー割引 1,800円（65才〜）/);
  assert.match(korakuza, /障害者割引 1,400円/);
  assert.match(korakuza, /前売券 1,600円/);
  assert.match(korakuza, /小人（4才〜）1,000円/);
  assert.match(korakuza, /ショー割引 1,000円/);
  assert.match(korakuza, /招待券（劇場にて配布）/);
  assert.match(korakuza, /サービスDAY（一律）1,200円/);
});

test("後楽座のサービスDAYを掲載する", () => {
  assert.match(korakuza, /11月6日 サービスDAY/);
  assert.match(korakuza, /11月17日 サービスDAY/);
});

test("会場カードに入場料を表示できる", () => {
  assert.match(card, /admissionFees/);
  assert.match(card, /入場料/);
});

test("CMS情報があっても月ごとの補足情報を保持する", () => {
  assert.match(cms, /\.\.\.fallbackVenue/);
  assert.match(cms, /\.\.\.cmsVenue/);
});
