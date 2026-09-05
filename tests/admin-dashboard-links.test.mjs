import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("管理ダッシュボードから会場管理と公演一括登録へ移動できる", () => {
  const source = readFileSync(
    "app/admin/(protected)/page.tsx",
    "utf8"
  );

  assert.match(source, /href="\/admin\/venues"/);
  assert.match(source, /会場管理/);

  assert.match(source, /href="\/admin\/performances\/bulk"/);
  assert.match(source, /公演一括登録/);
});
