import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("公演先情報を9月から12月まで持つ", async () => {
  assert.equal(
    existsSync("lib/performance-venues.ts"),
    true,
  );

  const source = await readFile(
    "lib/performance-venues.ts",
    "utf8",
  );

  for (const month of [
    "2026-09",
    "2026-10",
    "2026-11",
    "2026-12",
  ]) {
    assert.match(source, new RegExp(month));
  }

  assert.match(source, /湯守座/);
  assert.match(source, /羅い舞座/);
  assert.match(source, /後楽座/);
  assert.match(source, /四国健康村/);
});

test("10月の特別日程を保持する", async () => {
  const source = await readFile(
    "lib/performance-venues.ts",
    "utf8",
  );

  assert.match(source, /10月1日.*初日/);
  assert.match(source, /10月19日.*昼一回/);
  assert.match(source, /10月20日.*休演/);
  assert.match(source, /10月29日.*昼一回/);
  assert.match(source, /10月30日.*千穐楽.*昼一回/);
});

test("公演予定ページに公演先カードを表示する", async () => {
  const source = await readFile(
    "app/performances/page.tsx",
    "utf8",
  );

  assert.match(source, /PERFORMANCE_VENUES/);
  assert.match(source, /PerformanceVenueCard/);
  assert.match(source, /venueMonths/);
});
