import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("ホームに次回公演表示を組み込む", async () => {
  assert.equal(
    existsSync("components/NextPerformanceNotice.tsx"),
    true,
  );

  const page = await readFile("app/page.tsx", "utf8");

  assert.match(page, /NextPerformanceNotice/);
});

test("次回公演は今日より後の公開公演を取得する", async () => {
  const source = await readFile(
    "components/NextPerformanceNotice.tsx",
    "utf8",
  );

  assert.match(
    source,
    /\.eq\(\s*"is_public"\s*,\s*true\s*\)/,
  );

  assert.match(
    source,
    /\.gt\(\s*"performance_date"\s*,\s*today\s*\)/,
  );

  assert.match(source, /次回公演/);
});

test("次回公演は本日の空表示枠の中に置く", async () => {
  const source = await readFile("app/page.tsx", "utf8");

  const messagePos = source.indexOf(
    "本日の公演情報はまだ登録されていません",
  );

  const noticePos = source.indexOf(
    "<NextPerformanceNotice",
    messagePos,
  );

  const closingDivPos = source.indexOf(
    "</div>",
    messagePos,
  );

  assert.ok(messagePos >= 0);
  assert.ok(noticePos > messagePos);
  assert.ok(closingDivPos > noticePos);
});
