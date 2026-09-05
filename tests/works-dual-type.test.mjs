import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/admin/(protected)/works/page.tsx", "utf8");

test("演目管理で芝居・舞踊の両方を選べる", () => {
  const matches =
    source.match(/<option value="芝居・舞踊">芝居・舞踊（両方）<\/option>/g) ?? [];

  assert.equal(matches.length, 2);
});
