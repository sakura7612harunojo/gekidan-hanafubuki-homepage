import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/performances/page.tsx", "utf8");

test("千穐楽の翌日から次月をメインにして終了月を過去へ送る", () => {
  assert.match(page, /千穐楽\|千秋楽/);
  assert.match(page, /currentMonthClosingDate/);
  assert.match(page, /today > currentMonthClosingDate/);
  assert.match(page, /shiftMonth\(currentMonth,\s*1\)/);
  assert.match(page, /performance_date\.slice\(0,\s*7\) < mainMonth/);
  assert.match(page, /month >= mainMonth/);
  assert.match(page, /href=\{`#month-\$\{mainMonth\}`\}/);
});
