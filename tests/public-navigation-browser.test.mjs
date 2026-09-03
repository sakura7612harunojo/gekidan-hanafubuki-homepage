import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));

function inspectNavigation() {
  const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const pageSource = readFileSync(new URL("../app/performances/page.tsx", import.meta.url), "utf8");
  const pageCssMatch = pageSource.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
  assert.ok(pageCssMatch, "公演予定ページのCSSを読み取れません");

  const directory = mkdtempSync(join(tmpdir(), "hanabuki-navigation-"));
  const htmlPath = join(directory, "index.html");
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>${globalCss}\n${pageCssMatch[1]}</style></head>
<body>
  <header class="header"><a class="brand">劇団花吹雪</a><nav class="nav"><a>公演予定</a></nav></header>
  <main>
    <nav class="performance-month-navigation">
      <div class="performance-quick-links">
        <a class="performance-quick-button performance-quick-button-primary">今月</a>
        <a class="performance-quick-button" id="next-month">翌月</a>
      </div>
      <div class="performance-month-tabs"><a class="performance-month-tab" id="month-tab">9月</a></div>
    </nav>
  </main>
  <pre id="result"></pre>
  <script>
    const navigation = document.querySelector('.performance-month-navigation');
    const nextMonth = document.querySelector('#next-month');
    const monthTab = document.querySelector('#month-tab');
    document.querySelector('#result').textContent = JSON.stringify({
      position: getComputedStyle(navigation).position,
      nextMonthColor: getComputedStyle(nextMonth).color,
      monthTabColor: getComputedStyle(monthTab).color,
    });
  </script>
</body></html>`;

  writeFileSync(htmlPath, html, "utf8");
  const result = spawnSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--dump-dom",
    `file://${htmlPath}`,
  ], { encoding: "utf8" });

  try {
    assert.equal(result.status, 0, result.stderr || "Chromeの検査に失敗しました");
    const outputMatch = result.stdout.match(/<pre id="result">([^<]+)<\/pre>/);
    assert.ok(outputMatch, "Chromeの検査結果を読み取れません");
    return JSON.parse(outputMatch[1].replaceAll("&quot;", '"'));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("月選択欄はスクロール時に上部メニューへ重ならない", { skip: !chrome }, () => {
  const result = inspectNavigation();
  assert.equal(result.position, "static");
});

test("黒い月選択欄の通常ボタンを明るい色で表示する", { skip: !chrome }, () => {
  const result = inspectNavigation();
  assert.equal(result.nextMonthColor, "rgb(238, 231, 220)");
  assert.equal(result.monthTabColor, "rgb(217, 193, 138)");
});
