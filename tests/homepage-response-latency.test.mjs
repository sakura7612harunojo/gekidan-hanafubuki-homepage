import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const home = fs.readFileSync("app/page.tsx", "utf8");
const venueHelper = fs.readFileSync("lib/performance-venue-cms.ts", "utf8");
const nextNotice = fs.readFileSync("components/NextPerformanceNotice.tsx", "utf8");

test("トップページは5分キャッシュし、管理画面の再検証と両立する", () => {
  assert.doesNotMatch(home, /dynamic\s*=\s*["']force-dynamic["']/);
  assert.doesNotMatch(home, /revalidate\s*=\s*0/);
  assert.match(home, /revalidate\s*=\s*300/);
});

test("トップページの会場情報は他の公開データと同時に取得する", () => {
  const promiseAllStart = home.indexOf("await Promise.all([");
  const promiseAllEnd = home.indexOf("]);", promiseAllStart);
  const venueFetch = home.indexOf("getPerformanceVenueForMonth(currentMonth, supabase)");

  assert.ok(promiseAllStart >= 0, "並列データ取得がありません");
  assert.ok(venueFetch > promiseAllStart, "会場情報が並列取得に含まれていません");
  assert.ok(venueFetch < promiseAllEnd, "会場情報が後追いで取得されています");
  assert.match(venueHelper, /getPerformanceVenueForMonth\([\s\S]*supabase/);
});

test("次回公演表示は取得済みの予定を再利用し、追加通信しない", () => {
  assert.match(home, /<NextPerformanceNotice\s+performance=\{upcoming\[0\]\}/);
  assert.doesNotMatch(nextNotice, /createClient|\.from\(["']performances["']\)/);
  assert.match(nextNotice, /performance:\s*Performance\s*\|\s*null\s*\|\s*undefined/);
});
