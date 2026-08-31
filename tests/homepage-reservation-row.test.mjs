import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const home = fs.readFileSync("app/page.tsx", "utf8");
const venues = fs.readFileSync("lib/performance-venues.ts", "utf8");

test("reservationTelは電話ではなく観劇予約として判定する", () => {
  const fnStart = home.indexOf("function venueFieldLabel");
  const fnEnd = home.indexOf("function venueFieldValue", fnStart);
  const body = home.slice(fnStart, fnEnd);

  const reserv = body.indexOf('normalized.includes("reserv")');
  const tel = body.indexOf('normalized.includes("phone") || normalized.includes("tel")');

  assert.ok(reserv >= 0, "観劇予約の判定がありません");
  assert.ok(tel >= 0, "電話の判定がありません");
  assert.ok(reserv < tel, "reservationTelが先に電話判定へ吸われています");
});

test("2026年9月のアクセスと観劇予約を別項目で持つ", () => {
  const start = venues.indexOf('"2026-09"');
  const end = venues.indexOf('"2026-10"', start);
  const sep = end >= 0 ? end : venues.length;
  const block = venues.slice(start, sep);

  assert.match(block, /access:\s*"近鉄四日市駅からアクセス。"/);
  assert.doesNotMatch(block, /access:[^\n]*観劇予約/);
  assert.match(
    block,
    /reservationTel:\s*"059-332-0489\\n公演日の10日前から受付。"/,
  );
});
