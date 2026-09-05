import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("写真ページにファン投稿フォームを表示する", () => {
  const galleryPage = readFileSync("app/gallery/page.tsx", "utf8");

  assert.match(galleryPage, /FanPhotoSubmitForm/);
});

test("ファン投稿は保留・非公開で受け付ける", () => {
  const formPath = "components/FanPhotoSubmitForm.tsx";

  assert.equal(
    existsSync(formPath),
    true,
    "FanPhotoSubmitForm.tsx がまだありません"
  );

  const source = readFileSync(formPath, "utf8");

  assert.match(source, /name="nickname"/);
  assert.match(source, /name="title"/);
  assert.match(source, /type="file"/);
  assert.match(source, /gallery-private/);
  assert.match(source, /status:\s*"pending"/);
  assert.match(source, /is_public:\s*false/);
  assert.match(source, /10\s*\*\s*1024\s*\*\s*1024/);
  assert.match(
    source,
    /投稿ありがとうございます。確認後、掲載させていただきます。/
  );
});
