import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const admin = readFileSync(
  "app/admin/(protected)/members/page.tsx",
  "utf8"
);

const cast = readFileSync(
  "app/cast/page.tsx",
  "utf8"
);

test("劇団員管理でX・ツイキャス・TikTokを登録編集できる", () => {
  assert.match(admin, /name="x_url"/);
  assert.match(admin, /name="twitcasting_url"/);
  assert.match(admin, /name="tiktok_url"/);
});

test("公開プロフィールでX・ツイキャス・TikTokを表示できる", () => {
  assert.match(cast, /member\.x_url/);
  assert.match(cast, /member\.twitcasting_url/);
  assert.match(cast, /member\.tiktok_url/);
  assert.match(cast, />X</);
  assert.match(cast, />ツイキャス</);
  assert.match(cast, />TikTok</);
});

test("SNSリンクは別タブで開く", () => {
  assert.match(cast, /target="_blank"/);
});
