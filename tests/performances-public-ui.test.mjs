import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

test("公開ヘッダーの文字を明るく表示する", () => {
  const css = read("app/globals.css");
  assert.match(css, /public-header-contrast/);
  assert.match(css, /header[\s\S]*color:\s*#f5f0e6\s*!important/);
});

test("上へ戻るボタンを公開サイトに設置する", () => {
  assert.equal(fs.existsSync("components/BackToTopButton.tsx"), true);

  const component = read("components/BackToTopButton.tsx");
  const layout = read("app/layout.tsx");

  assert.match(component, /window\.scrollY\s*>\s*400/);
  assert.match(component, /behavior:\s*["']smooth["']/);
  assert.match(component, /safe-area-inset-bottom/);
  assert.match(layout, /<BackToTopButton\s*\/>/);
});

test("0件の月では「0日分」を表示しない", () => {
  const source = read("app/performances/page.tsx");

  assert.match(
    source,
    /\(monthPerformances\.length\)\s*>\s*0[\s\S]*?日分/
  );
});
