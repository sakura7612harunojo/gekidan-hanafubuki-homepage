import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const componentPath = path.join(
  process.cwd(),
  "components/PublicResponsiveImage.tsx",
);

function loadTypeScriptComponent(filename) {
  assert.equal(
    fs.existsSync(filename),
    true,
    "公開ページ用の最適化画像コンポーネントがありません",
  );

  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  const loadedModule = new Module(filename);
  loadedModule.filename = filename;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(filename));
  loadedModule._compile(compiled, filename);
  return loadedModule.exports;
}

test("公開写真はスマホ幅に合う画像候補を遅延読み込みする", () => {
  const { PublicResponsiveImage } = loadTypeScriptComponent(componentPath);
  const html = renderToStaticMarkup(
    React.createElement(PublicResponsiveImage, {
      src: "/images/hanabuki-haru-mark.png",
      alt: "舞台写真",
      variant: "gallery",
    }),
  );

  assert.match(html, /loading="lazy"/);
  assert.match(html, /sizes="\(max-width: 760px\) calc\(100vw - 64px\), 43vw"/);
  assert.match(html, /srcSet="[^"]*\/_next\/image\?/);
});

test("劇団員写真は4対5の表示領域を読み込み前から確保する", () => {
  const { PublicResponsiveImage } = loadTypeScriptComponent(componentPath);
  const html = renderToStaticMarkup(
    React.createElement(PublicResponsiveImage, {
      src: "/images/hanabuki-haru-mark.png",
      alt: "劇団員写真",
      variant: "member",
    }),
  );

  assert.match(html, /width="1200"/);
  assert.match(html, /height="1500"/);
  assert.match(html, /sizes="\(max-width: 760px\) calc\(100vw - 80px\), 29vw"/);
  assert.match(html, /object-fit:cover/);
  assert.match(html, /object-position:top center/);
});
