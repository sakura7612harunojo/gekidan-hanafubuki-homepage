import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");

const home = read("app/page.tsx");
const performances = read("app/performances/page.tsx");
const helperPath = "lib/performance-venue-cms.ts";
const adminPath = "app/admin/(protected)/venues/page.tsx";
const helper = exists(helperPath) ? read(helperPath) : "";
const admin = exists(adminPath) ? read(adminPath) : "";

const notice =
  "※演目・出演者・公演内容は、都合により予告なく変更となる場合がございます。";
const endNotice = "※終演時間は公演内容により異なります。";

test("月別公演先をSupabaseから取得し、静的データをフォールバックにする", () => {
  assert.equal(exists(helperPath), true, "公演先CMS取得ヘルパーがありません");
  assert.match(helper, /\.from\(["']performance_venues["']\)/);
  assert.match(helper, /PERFORMANCE_VENUES/);
  assert.match(helper, /getPerformanceVenueForMonth/);
  assert.match(helper, /getPerformanceVenueMap/);
});

test("公開用の公演時間は開演時刻だけを組み立てる", () => {
  assert.match(helper, /day_start_time/);
  assert.match(helper, /night_start_time/);
  assert.match(helper, /昼の部.*開演/s);
  assert.match(helper, /夜の部.*開演/s);
  assert.doesNotMatch(helper, /15:00|20:00/);
});

test("管理画面から1か月1件の公演先情報を保存・削除できる", () => {
  assert.equal(exists(adminPath), true, "公演先情報の管理画面がありません");
  assert.match(admin, /\.from\(["']performance_venues["']\)/);
  assert.match(admin, /\.upsert\(/);
  assert.match(admin, /onConflict:\s*["']performance_month["']/);
  assert.match(admin, /name=["']performance_month["']/);
  assert.match(admin, /name=["']venue_name["']/);
  assert.match(admin, /name=["']day_start_time["']/);
  assert.match(admin, /name=["']night_start_time["']/);
  assert.match(admin, /AdminSubmitButton/);
});

test("トップページはCMSの今月公演先を優先する", () => {
  assert.match(home, /getPerformanceVenueForMonth/);
  assert.match(home, /getPerformanceVenueForMonth\(currentMonth,\s*supabase\)/);
});

test("公演予定ページはCMSの月別公演先を利用できる", () => {
  assert.match(performances, /getPerformanceVenueMap/);
  assert.match(performances, /await\s+getPerformanceVenueMap\(\)/);
});

test("注意事項をトップの本日の公演と公演予定の両方に表示する", () => {
  const todayStart = home.indexOf('id="today"');
  assert.ok(todayStart >= 0, "本日の公演 section がありません");
  const todayEnd = home.indexOf("</section>", todayStart);
  const today = home.slice(todayStart, todayEnd);

  assert.match(today, new RegExp(notice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(today, new RegExp(endNotice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(
    performances,
    new RegExp(notice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.match(
    performances,
    new RegExp(endNotice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
});
