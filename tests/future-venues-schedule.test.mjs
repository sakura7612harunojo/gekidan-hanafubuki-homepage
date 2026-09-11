import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const venues = readFileSync("lib/performance-venues.ts", "utf8");

test("2026年11月後楽座の日程を掲載する", () => {
  assert.match(venues, /11月1日（日） 初日/);
  assert.match(venues, /11月18日（水） 昼一回/);
  assert.match(venues, /11月19日（木） 休演/);
  assert.match(venues, /11月20日（金） 休演/);
  assert.match(venues, /11月28日（土） 千穐楽・昼一回/);
});

test("2027年1月やま幸を掲載する", () => {
  assert.match(venues, /"2027-01"/);
  assert.match(venues, /瀬戸大橋温泉「やま幸」/);
  assert.match(venues, /岡山県倉敷市下庄140-1/);
  assert.match(venues, /086-462-1126/);
});

test("2027年2月ホテル龍登園を掲載する", () => {
  assert.match(venues, /"2027-02"/);
  assert.match(venues, /ホテル龍登園/);
  assert.match(venues, /佐賀県佐賀市大和町大字梅野120/);
  assert.match(venues, /0952-62-3111/);
});
