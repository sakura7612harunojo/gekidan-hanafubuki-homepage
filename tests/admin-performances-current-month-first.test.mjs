import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(
  "app/admin/(protected)/performances/page.tsx",
  "utf8",
);

test("管理画面は日本時間の今月を基準に並べ替える", () => {
  assert.match(source, /Asia\/Tokyo/);
  assert.match(source, /currentMonth/);
  assert.match(source, /sortPerformancesForAdmin/);
});

test("今月を最優先、次に未来、最後に過去へ分ける", () => {
  assert.match(source, /month === currentMonth/);
  assert.match(source, /month > currentMonth/);
  assert.match(source, /return 2/);
});

test("登録済み公演はsortedPerformancesを描画する", () => {
  const heading = source.indexOf("登録済み公演");
  assert.ok(heading >= 0, "登録済み公演の見出しがありません");
  const afterHeading = source.slice(heading);
  assert.match(afterHeading, /sortedPerformances\.map/);
});

test("過去公演は新しい日付から表示する", () => {
  assert.match(source, /groupA === 2/);
  assert.match(source, /b\.performance_date\.localeCompare\(a\.performance_date\)/);
});
