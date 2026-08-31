import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(
  "components/admin/BulkPerformanceEditor.tsx",
  "utf8",
);

const desktopCss = source.split("@media")[0];

test("月間一括編集はPCでも全入力欄を画面内に並べる", () => {
  assert.match(
    desktopCss,
    /HANABUKI_BULK_VISIBLE_LAYOUT/,
    "PC向けの全項目表示レイアウトが未実装です",
  );
  assert.match(
    desktopCss,
    /\.performance-header\s*\{\s*display:\s*none;/s,
  );
  assert.match(
    desktopCss,
    /\.performance-list\s*\{\s*min-width:\s*0;/s,
  );
  assert.match(
    desktopCss,
    /\.performance-row\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s,
  );
  assert.match(
    desktopCss,
    /\.field-label\s*\{[^}]*display:\s*block;/s,
  );
});

test("夜の部入力は既存のnight_show_titleを使う", () => {
  assert.match(source, /night_show_title_/);
  assert.match(source, /row\?\.night_show_title/);
});
