import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("劇団員管理は重複登録と編集時の欠落から保護される", () => {
  const source = readFileSync(
    "app/admin/(protected)/members/page.tsx",
    "utf8"
  );

  assert.match(source, /error\.code === "23505"/);
  assert.match(source, /formData\.has\("role_name"\)/);
  assert.match(source, /formData\.has\("profile"\)/);
  assert.match(source, /defaultValue=\{member\.role_name \?\? ""\}/);
});
