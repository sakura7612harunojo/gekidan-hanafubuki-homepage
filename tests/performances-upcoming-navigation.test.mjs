import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pagePath = "app/performances/page.tsx";

test("今日以降の公演だけ取得する", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(
    source,
    /\.gte\(\s*"performance_date"\s*,\s*today\s*\)/,
  );
});

test("今月と翌月のクイックナビがある", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /今月/);
  assert.match(source, /翌月/);
  assert.match(source, /performance-quick-links/);
});

test("登録済み月から月タブを自動生成する", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /monthKeys\.map/);
  assert.match(source, /performance-month-tabs/);
});

test("月の位置へ移動できる", async () => {
  const source = await readFile(pagePath, "utf8");

  assert.match(source, /href=\{`#month-\$\{/);
  assert.match(source, /scroll-margin-top/);
});
