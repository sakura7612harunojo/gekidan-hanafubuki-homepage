import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const header = readFileSync("components/Header.tsx", "utf8");

test("ヘッダーに座員募集リンクがある", () => {
  assert.match(header, /href=["']\/recruit["']/);
  assert.match(header, />座員募集</);
});

test("座員募集ページがある", () => {
  assert.equal(existsSync("app/recruit/page.tsx"), true);
});

test("座員募集ページに募集内容と応募SNSがある", () => {
  assert.equal(existsSync("app/recruit/page.tsx"), true);
  const page = readFileSync("app/recruit/page.tsx", "utf8");

  assert.match(page, /座員募集/);
  assert.match(page, /役者/);
  assert.match(page, /裏方・スタッフ/);
  assert.match(page, /入団したら3年/);
  assert.match(page, /辞める時は3ヶ月前/);
  assert.match(page, /辞めた後は3年間/);

  assert.match(page, /https:\/\/www\.instagram\.com\/sakura_harunojo/);
  assert.match(page, /https:\/\/x\.com\/oresama5776/);
  assert.match(page, /InstagramでDM/);
  assert.match(page, /XでDM/);
});
