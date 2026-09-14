import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/performances/page.tsx", "utf8");

test("スマホの月ボタンは件数が増えても横にはみ出さない", () => {
  assert.match(
    page,
    /grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(82px,\s*1fr\)\)/
  );

  assert.match(
    page,
    /\.performance-month-tabs\s*\{[\s\S]*?overflow-x:\s*visible/
  );

  assert.match(
    page,
    /\.performance-month-tab\s*\{[\s\S]*?min-width:\s*0/
  );
});
