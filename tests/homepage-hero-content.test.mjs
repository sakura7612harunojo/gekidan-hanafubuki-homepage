import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");

function heroSlice(source) {
  const marker = 'className="hero"';
  const at = source.indexOf(marker);
  assert.ok(at >= 0, "hero section が見つかりません");
  const start = source.lastIndexOf("<section", at);
  const end = source.indexOf("</section>", at);
  assert.ok(start >= 0 && end > at, "hero section の範囲を特定できません");
  return source.slice(start, end + "</section>".length);
}

test("トップの大見出し・説明・主要ボタンを表示する", () => {
  const hero = heroSlice(page);
  assert.match(hero, /GEKIDAN HANAFUBUKI/);
  assert.match(hero, /<h1>劇団花吹雪<\/h1>/);
  assert.match(hero, /劇団花吹雪の公式サイト。座長 桜春之丞・櫻京之介を中心に、華やかな舞踊と人の情を描く芝居をお届けします。/);
  assert.match(hero, /href="#today">本日の公演<\/a>/);
  assert.match(hero, /href="\/performances">公演予定<\/a>/);
});

test("トップのheroには桜春之丞サインを置かない", () => {
  const hero = heroSlice(page);
  assert.doesNotMatch(hero, /harunojo-signature\.png/);
});
