import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("app/page.tsx", "utf8");

test("ホームの本日・近日公演でnight_show_titleも取得する", () => {
  const matches = source.match(
    /\.select\("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title"\)/g,
  ) ?? [];

  assert.equal(
    matches.length,
    2,
    `本日公演と近日公演の2クエリ両方でnight_show_titleを取得する必要があります。現在: ${matches.length}`,
  );
});
