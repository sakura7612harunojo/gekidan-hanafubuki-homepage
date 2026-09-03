import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";


const page = fs.readFileSync("app/page.tsx", "utf8");
const admin = fs.readFileSync(
  "app/admin/(protected)/members/page.tsx",
  "utf8",
);
const home = fs.readFileSync("app/page.tsx", "utf8");

test("管理画面に劇団員写真アップロード処理がある", () => {
  assert.match(admin, /async function updateMemberPhoto/);
  assert.match(admin, /\.storage\s*\.from\("gallery"\)\s*\.upload\(/s);
  assert.match(admin, /\.update\(\{\s*photo_path:\s*photoPath\s*\}\)/s);
});

test("既存劇団員カードから写真を選択できる", () => {
  assert.match(admin, /name="member_photo"/);
  assert.match(admin, /type="file"/);
  assert.match(admin, /accept="image\/\*"/);
  assert.match(admin, />\s*写真を保存\s*</);
});

test("画像以外と10MB超を拒否する", () => {
  assert.match(admin, /photo\.type\.startsWith\("image\/"\)/);
  assert.match(admin, /10\s*\*\s*1024\s*\*\s*1024/);
});

test("公開側はphoto_pathがある人だけ写真表示する", () => {
  const castStart = home.indexOf('id="cast"');
  const repertoireStart = home.indexOf('id="repertoire"', castStart);
  assert.ok(castStart >= 0);
  const renderMemberCardStart = page.indexOf("const renderMemberCard");
  const castSectionStart = page.indexOf('id="cast"');
  const castSectionEnd = page.indexOf("</section>", castSectionStart);
  const cast = [
    renderMemberCardStart >= 0 && castSectionStart >= 0
      ? page.slice(renderMemberCardStart, castSectionStart)
      : "",
    castSectionStart >= 0 && castSectionEnd >= 0
      ? page.slice(castSectionStart, castSectionEnd + "</section>".length)
      : "",
  ].join("\n");
  assert.match(page, /member\.photo_path\s*\?/);
  assert.match(cast, /variant="member"/);
});
