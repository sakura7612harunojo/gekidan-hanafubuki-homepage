import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const helper = fs.readFileSync("lib/performance-venue-cms.ts", "utf8");
const schedule = fs.readFileSync("app/performances/page.tsx", "utf8");

test("CMS会場データは公開表示に必要な文字列型を明示する", () => {
  assert.match(helper, /type PublicPerformanceVenue\s*=\s*\{/);
  for (const key of [
    "month",
    "name",
    "address",
    "tel",
    "access",
    "websiteUrl",
    "mapUrl",
  ]) {
    assert.match(
      helper,
      new RegExp(`${key}:\\s*string`),
      `${key} が string として定義されていません`,
    );
  }

  assert.match(helper, /schedule:\s*string\[\]/);
});

test("公演予定ページはperformanceVenuesを最初の利用より前に取得する", () => {
  const fn = schedule.indexOf("export default async function");
  assert.ok(fn >= 0);
  const body = schedule.slice(fn);
  const declaration = body.indexOf(
    "const performanceVenues = await getPerformanceVenueMap();",
  );
  assert.ok(declaration >= 0, "CMS会場データ取得がありません");

  const afterDeclaration = body.slice(declaration + 1);
  const nextUsage = afterDeclaration.indexOf("performanceVenues");
  assert.ok(nextUsage >= 0, "CMS会場データが利用されていません");

  const beforeDeclaration = body.slice(0, declaration);
  assert.doesNotMatch(
    beforeDeclaration,
    /\bperformanceVenues\b/,
    "宣言より前にperformanceVenuesを使っています",
  );
});
