import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("劇団員管理で芸名・役職を検索できる", () => {
  const searchPath = "components/admin/MembersSearch.tsx";

  assert.equal(
    existsSync(searchPath),
    true,
    "components/admin/MembersSearch.tsx がまだありません"
  );

  const searchSource = readFileSync(searchPath, "utf8");
  const pageSource = readFileSync(
    "app/admin/(protected)/members/page.tsx",
    "utf8"
  );

  assert.match(searchSource, /劇団員を検索/);
  assert.match(searchSource, /name="q"/);
  assert.match(searchSource, /router\.replace/);

  assert.match(pageSource, /searchParams/);
  assert.match(pageSource, /stage_name/);
  assert.match(pageSource, /role_name/);
  assert.match(pageSource, /\.or\(/);
  assert.match(pageSource, /<MembersSearch/);
});
