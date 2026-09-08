import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const performances = readFileSync("app/performances/page.tsx", "utf8");
const gallery = readFileSync("app/gallery/page.tsx", "utf8");

test("公演予定と写真を60秒キャッシュして表示を軽くする", () => {
  assert.doesNotMatch(performances, /force-dynamic/);
  assert.doesNotMatch(gallery, /force-dynamic/);

  assert.match(performances, /export const revalidate = 60/);
  assert.match(gallery, /export const revalidate = 60/);

  assert.doesNotMatch(performances, /@\/lib\/supabase\/server/);
  assert.match(performances, /@supabase\/supabase-js/);
});
