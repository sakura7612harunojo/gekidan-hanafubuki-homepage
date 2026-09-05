import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pagePath = "app/gallery/page.tsx";
const headerPath = "components/Header.tsx";

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

test("公開サイトのメニューから写真ページへ移動できる", () => {
  const source = readFileSync(headerPath, "utf8");
  assert.match(source, /<Link href="\/gallery">写真<\/Link>/);
});

test("ギャラリー写真はPCで大きくなりすぎず中央に並ぶ", () => {
  const source = readFileSync(pagePath, "utf8");

  assert.match(
    source,
    /gridTemplateColumns:\s*"repeat\(auto-fit, minmax\(240px, 360px\)\)"/
  );
  assert.match(source, /justifyContent:\s*"center"/);
  assert.match(source, /maxWidth:\s*1120/);
});
