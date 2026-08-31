import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const home = fs.readFileSync("app/page.tsx", "utf8");
const schedule = fs.readFileSync("app/performances/page.tsx", "utf8");
const sharedExists = fs.existsSync("lib/performance-venues.ts");
const shared = sharedExists
  ? fs.readFileSync("lib/performance-venues.ts", "utf8")
  : "";

test("会場情報は共通モジュールを1つの正本として使う", () => {
  assert.equal(sharedExists, true, "共通会場情報ファイルがありません");
  assert.match(shared, /export const PERFORMANCE_VENUES(?:\s*:[^=]+)?\s*=/);
  assert.match(home, /from "@\/lib\/performance-venues"/);
  assert.match(schedule, /from "@\/lib\/performance-venues"/);
  assert.doesNotMatch(schedule, /const PERFORMANCE_VENUES\s*[:=]/);
});

test("本日の公演の直後に今月の公演情報、その次にギャラリーを表示する", () => {
  const today = home.indexOf('id="today"');
  const monthly = home.indexOf('id="monthly-venue"');
  const gallery = home.indexOf('id="hanabuki-today"');
  const upcoming = home.indexOf('id="schedule"');

  assert.ok(today >= 0);
  assert.ok(monthly > today);
  assert.ok(gallery > monthly);
  assert.ok(upcoming > gallery);
  assert.match(home, />今月の公演情報</);
});

test("写真欄は今日限定ではなく花吹雪ギャラリーと表示する", () => {
  assert.match(home, /HANABUKI GALLERY/);
  assert.match(home, />花吹雪ギャラリー</);
  assert.doesNotMatch(home, />今日の花吹雪</);
});

test("今月の会場情報を現在月から選び、公演時間などを表示できる", () => {
  assert.match(home, /const currentMonth = today\.iso\.slice\(0,\s*7\)/);
  assert.match(home, /getVenueInfoEntries\(currentVenue\)/);
  assert.match(home, /公演時間/);
  assert.match(home, /公演先/);
});
