import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("会場管理で公演先名と対象月を絞り込める", () => {
  const searchPath = "components/admin/VenueSearch.tsx";

  assert.equal(
    existsSync(searchPath),
    true,
    "components/admin/VenueSearch.tsx がまだありません"
  );

  const searchSource = readFileSync(searchPath, "utf8");
  const pageSource = readFileSync(
    "app/admin/(protected)/venues/page.tsx",
    "utf8"
  );

  assert.match(searchSource, /公演先を検索/);
  assert.match(searchSource, /対象月で絞り込み/);
  assert.match(searchSource, /name="q"/);
  assert.match(searchSource, /name="month"/);
  assert.match(searchSource, /params\.set\("month"/);
  assert.match(searchSource, /params\.delete\("month"\)/);

  assert.match(pageSource, /searchParams/);
  assert.match(pageSource, /\.ilike\("venue_name"/);
  assert.match(pageSource, /\.eq\("performance_month"/);
  assert.match(pageSource, /<VenueSearch/);
});

test("会場管理の検索条件を一括クリアできる", () => {
  const searchSource = readFileSync(
    "components/admin/VenueSearch.tsx",
    "utf8"
  );

  assert.match(searchSource, /検索条件をクリア/);

  assert.match(
    searchSource,
    /function handleClear[\s\S]*?params\.delete\("q"\);[\s\S]*?params\.delete\("month"\);[\s\S]*?move\(params\);/
  );
});
