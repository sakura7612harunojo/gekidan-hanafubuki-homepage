import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const admin = readFileSync("app/admin/(protected)/members/page.tsx", "utf8");
const cast = readFileSync("app/cast/page.tsx", "utf8");

test("劇団員管理でInstagram URLを登録・編集できる", () => {
  assert.match(admin, /instagram_url/);
  assert.match(admin, /name="instagram_url"/);
});

test("劇団員紹介でInstagramリンクを表示する", () => {
  assert.match(cast, /instagram_url/);
  assert.match(cast, /Instagram/);
  assert.match(cast, /target="_blank"/);
});

test("プロフィールの改行を保持して表示する", () => {
  assert.match(cast, /whiteSpace:\s*"pre-line"/);
});

test("劇団員更新時にcastページも再検証する", () => {
  assert.match(admin, /revalidatePath\("\/cast"\)/);
});
