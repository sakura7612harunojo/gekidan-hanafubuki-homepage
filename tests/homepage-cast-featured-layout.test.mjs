import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("劇団員紹介は桜春之丞を左の注目カードに分離する", () => {
  assert.match(page, /const castMembers =/);
  assert.match(
    page,
    /const featuredMember\s*=\s*castMembers\.find\(\(member\)\s*=>\s*member\.stage_name\s*===\s*"桜春之丞"\)\s*\?\?\s*castMembers\[0\]/,
  );
  assert.match(
    page,
    /const otherMembers\s*=\s*castMembers\.filter\(\s*\(member\)\s*=>\s*member\.id\s*!==\s*featuredMember\?\.id,\s*\)/,
  );
  assert.match(page, /member-card-featured/);
});

test("劇団員紹介は左1列・右2列の専用レイアウトを使う", () => {
  assert.match(page, /className="members-layout"/);
  assert.match(page, /className="members-rest-grid"/);
  assert.doesNotMatch(page, /className="grid members-grid"/);

  assert.match(
    css,
    /\.members-layout\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(0,\s*2fr\)/,
  );
  assert.match(
    css,
    /\.members-rest-grid\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
  );
});

test("スマホでは劇団員紹介を1列に戻す", () => {
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.members-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.members-rest-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/,
  );
});
