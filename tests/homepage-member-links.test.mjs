import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("app/page.tsx", "utf8");

test("トップページに会員限定予約リンクがある", () => {
  assert.match(
    home,
    /https:\/\/select-type\.com\/member\/login\/\?mi=kugQA_2_3CY&w_flg=0/
  );
  assert.match(home, /会員限定予約/);
});

test("トップページに劇団花吹雪ファンクラブリンクがある", () => {
  assert.match(
    home,
    /https:\/\/gekidanhanafubuki\.amebaownd\.com/
  );
  assert.match(home, /劇団花吹雪ファンクラブ/);
});
