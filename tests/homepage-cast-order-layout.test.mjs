import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("app/page.tsx", "utf8");

test("劇団員紹介は 座長・花形・劇団員・サポート・裏方 の順に並べる", () => {
  assert.match(page, /function getCastRoleRank/);
  assert.match(page, /role\.includes\("座長"\)\) return 0/);
  assert.match(page, /role\.includes\("花形"\)\) return 1/);
  assert.match(page, /role\.includes\("劇団員"\)\) return 2/);
  assert.match(page, /role\.includes\("サポート"\)\) return 3/);
  assert.match(page, /role\.includes\("裏方"\)\) return 4/);
  assert.match(
    page,
    /\.sort\(\(a, b\) => getCastRoleRank\(a\.role_name\) - getCastRoleRank\(b\.role_name\)\)/,
  );
});

test("劇団員紹介は旧 members-grid ではなく新レイアウトを使う", () => {
  assert.doesNotMatch(page, /className="grid members-grid"/);
  assert.match(page, /className="members-layout"/);
  assert.match(page, /className="members-rest-grid"/);
});
