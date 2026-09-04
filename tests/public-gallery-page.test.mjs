import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pagePath = "app/gallery/page.tsx";

test("公開ギャラリーは公開済み写真だけを表示するページを持つ", () => {
  assert.equal(
    existsSync(pagePath),
    true,
    "app/gallery/page.tsx がまだありません"
  );

  const source = readFileSync(pagePath, "utf8");

  assert.match(source, /\.eq\("status",\s*"published"\)/);
  assert.match(source, /\.eq\("is_public",\s*true\)/);
  assert.match(source, /from\("gallery"\)[\s\S]*?getPublicUrl/);
  assert.match(source, /現在、公開中の写真はありません/);
});
