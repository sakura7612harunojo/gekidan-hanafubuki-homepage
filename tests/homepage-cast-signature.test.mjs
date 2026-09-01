import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

function sectionSliceById(source, id) {
  const start = source.indexOf(`id="${id}"`);
  assert.ok(start >= 0, `${id} section が見つかりません`);
  const sectionStart = source.lastIndexOf("<section", start);
  const end = source.indexOf("</section>", start);
  assert.ok(sectionStart >= 0 && end > start, `${id} section の範囲を特定できません`);
  return source.slice(sectionStart, end + "</section>".length);
}

test("桜春之丞サインは劇団員紹介セクション内に置く", () => {
  const cast = sectionSliceById(page, "cast");
  assert.match(cast, /harunojo-signature\.png/);
  assert.match(cast, /cast-heading-with-signature/);
  assert.match(cast, /cast-heading-signature/);
});

test("桜春之丞サインはトップのヒーローから外す", () => {
  const heroIndex = page.indexOf('className="hero"');
  assert.ok(heroIndex >= 0, "hero が見つかりません");
  const heroStart = page.lastIndexOf("<section", heroIndex);
  const heroEnd = page.indexOf("</section>", heroIndex);
  const hero = page.slice(heroStart, heroEnd + "</section>".length);
  assert.doesNotMatch(hero, /harunojo-signature\.png/);
});

test("劇団員紹介タイトルとサインは横並び", () => {
  assert.match(
    css,
    /\.cast-heading-with-signature\s*\{[\s\S]*?display:\s*flex[\s\S]*?align-items:\s*center/,
  );
});
