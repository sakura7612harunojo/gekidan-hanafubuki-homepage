import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const venues = readFileSync("lib/performance-venues.ts", "utf8");

const start = venues.indexOf('"2026-10": {');
const end = venues.indexOf('"2026-11": {');
const kyobashi = venues.slice(start, end);

test("京橋の10月10日から15日に神山大和ゲストを掲載する", () => {
  assert.match(
    kyobashi,
    /10月10日〜15日 神山大和ゲスト/
  );
});
