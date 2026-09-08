import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("全画面の共通読み込み画面を表示しない", () => {
  assert.equal(existsSync("app/loading.tsx"), false);
});
