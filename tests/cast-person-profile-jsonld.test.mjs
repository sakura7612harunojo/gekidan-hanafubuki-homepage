import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("桜春之丞のPerson構造化データに本人プロフィール情報を含める", () => {
  const source = readFileSync("app/cast/page.tsx", "utf8");

  assert.match(source, /alternateName: "春之丞"/);
  assert.match(
    source,
    /description: "劇団花吹雪 座長・桜春之丞。大衆演劇の役者として活動。"/
  );
  assert.match(source, /sameAs:/);
  assert.match(source, /https:\/\/twitcasting\.tv\/oresama5776/);
});

test("桜春之丞のPerson構造化データに公式SNSを含める", () => {
  const source = readFileSync("app/cast/page.tsx", "utf8");

  assert.match(source, /https:\/\/x\.com\/oresama5776/);
  assert.match(source, /https:\/\/www\.instagram\.com\/sakura_harunojo\//);
});
