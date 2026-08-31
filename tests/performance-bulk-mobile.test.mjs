import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

test("月間一括編集はスマホで1日1カード表示になる", async () => {
  const path = "components/admin/BulkPerformanceEditor.tsx";

  assert.equal(
    existsSync(path),
    true,
    "スマホ対応編集コンポーネントが必要です",
  );

  const source = await readFile(path, "utf8");

  assert.match(source, /performance-row/);
  assert.match(source, /field-label/);
  assert.match(source, /@media\s*\(max-width:\s*760px\)/);
  assert.match(source, /grid-template-columns:\s*1fr/);
  assert.doesNotMatch(source, /<table/);
});

test("月間一括編集ページからスマホ対応Editorを使用する", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/bulk/page.tsx",
    "utf8",
  );

  assert.match(source, /BulkPerformanceEditor/);
});
