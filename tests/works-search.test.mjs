import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("演目管理に演目名の検索欄があり入力中に絞り込める", () => {
  const searchPath = "components/admin/WorksSearch.tsx";

  assert.equal(
    existsSync(searchPath),
    true,
    "components/admin/WorksSearch.tsx がまだありません"
  );

  const searchSource = readFileSync(searchPath, "utf8");
  const pageSource = readFileSync(
    "app/admin/(protected)/works/page.tsx",
    "utf8"
  );

  assert.match(searchSource, /演目名で検索/);
  assert.match(searchSource, /router\.replace/);
  assert.match(searchSource, /name="q"/);

  assert.match(pageSource, /searchParams/);
  assert.match(pageSource, /\.ilike\("title"/);
  assert.match(pageSource, /<WorksSearch/);
});
