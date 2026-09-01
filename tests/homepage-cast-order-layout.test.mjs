import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");
const css = fs.readFileSync("app/globals.css", "utf8");

test("劇団員紹介は 座長・花形・劇団員・サポート・裏方 の優先順で並べる", () => {
  assert.match(page, /getCastRoleRank/);
  assert.match(page, /role\.includes\("座長"\).*return 0/s);
  assert.match(page, /role\.includes\("花形"\).*return 1/s);
  assert.match(page, /role\.includes\("劇団員"\).*return 2/s);
  assert.match(page, /role\.includes\("サポート"\).*return 3/s);
  assert.match(page, /role\.includes\("裏方"\).*return 4/s);
  assert.match(page, /\.slice\(\)\.sort\(\(a, b\) => getCastRoleRank\(a\.role_name\) - getCastRoleRank\(b\.role_name\)\)/);
});

test("劇団員紹介だけ専用のコンパクトレイアウトを使う", () => {
  assert.match(page, /className="grid members-grid"/);
  assert.match(page, /className="card member-card"/);
});

test("写真なしカードは写真ありカードの高さまで引き伸ばさない", () => {
  assert.match(
    css,
    /\.members-grid\s*\{[\s\S]*?display:\s*flex[\s\S]*?flex-wrap:\s*wrap[\s\S]*?align-items:\s*flex-start/,
  );
  assert.match(
    css,
    /\.members-grid\s+\.member-card\s*\{[\s\S]*?align-self:\s*flex-start[\s\S]*?min-height:\s*0/,
  );
});
