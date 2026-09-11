import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const gallery = readFileSync(
  "app/admin/(protected)/gallery/page.tsx",
  "utf8"
);

test("投稿写真管理に写真・アルバムから選ぶボタンを表示する", () => {
  assert.match(gallery, /写真・アルバムから選ぶ/);
});

test("投稿写真はJPEG・PNG・WebPを選択できる", () => {
  assert.match(
    gallery,
    /accept="image\/jpeg,image\/png,image\/webp"/
  );
});

test("投稿写真選択をカメラ専用にはしない", () => {
  assert.doesNotMatch(gallery, /\bcapture=/);
});
