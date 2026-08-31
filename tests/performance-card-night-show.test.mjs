import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("components/PerformanceCard.tsx", "utf8");

test("公開公演カードが夜の部を表示できる", () => {
  assert.match(source, /night_show_title:\s*string\s*\|\s*null/);
  assert.match(source, /performance\.night_show_title/);
  assert.match(source, />夜の部</);
});

test("夜の部が空なら不要な行を表示しない", () => {
  assert.match(
    source,
    /\{performance\.night_show_title\s*\?\s*\(/s,
  );
});
