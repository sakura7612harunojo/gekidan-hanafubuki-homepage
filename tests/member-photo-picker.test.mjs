import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const admin = readFileSync(
  "app/admin/(protected)/members/page.tsx",
  "utf8"
);

test("劇団員写真に写真・アルバムから選ぶボタンを表示する", () => {
  assert.match(admin, /写真・アルバムから選ぶ/);
});

test("写真選択は画像ファイルだけを受け付ける", () => {
  assert.match(admin, /accept="image\/\*"/);
});

test("写真選択をカメラ専用にはしない", () => {
  assert.doesNotMatch(admin, /\bcapture=/);
});
