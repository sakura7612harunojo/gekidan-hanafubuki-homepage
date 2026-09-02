import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("app/globals.css", "utf8");

test("公開サイトにスマホ専用レイアウト調整がある", () => {
  assert.match(css, /HANABUKI_MOBILE_PUBLIC/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.members-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr/,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.members-rest-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/,
  );
  assert.match(css, /header nav[\s\S]*flex-wrap:\s*wrap/);
  assert.match(css, /img[\s\S]*height:\s*auto\s*!important/);
});
