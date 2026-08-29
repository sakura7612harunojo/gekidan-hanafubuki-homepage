import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  "app/admin/(protected)/works/page.tsx",
  "utf8"
);

test("編集前に既存データを取得する", () => {
  assert.match(
    source,
    /\.select\(["']work_type,title,summary,is_public["']\)/
  );
});

test("フォームに無い項目は既存値を保持する", () => {
  assert.match(source, /formData\.has\(["']work_type["']\)/);
  assert.match(source, /formData\.has\(["']title["']\)/);
  assert.match(source, /formData\.has\(["']summary["']\)/);
});

test("公開チェックの意図的解除と項目欠落を区別する", () => {
  assert.match(source, /_is_public_present/);
  assert.match(
    source,
    /formData\.has\(["']_is_public_present["']\)/
  );
});

test("重複登録は分かりやすいエラーにする", () => {
  assert.match(source, /23505/);
  assert.match(
    source,
    /同じ種類・同じ演目名はすでに登録されています/
  );
});

test("送信ボタンは二重送信防止部品を使う", () => {
  assert.match(source, /AdminSubmitButton/);
});
