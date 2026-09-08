import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync("app/page.tsx", "utf8");

test("トップページで表示しないworksを取得しない", () => {
  assert.doesNotMatch(home, /\.from\(["']works["']\)/);
});

test("トップページの劇団員取得は必要な項目だけにする", () => {
  assert.match(
    home,
    /\.from\(["']members["']\)\.select\(["']id,role_name,stage_name,profile,photo_path["']\)/
  );
  assert.doesNotMatch(
    home,
    /\.from\(["']members["']\)\.select\(["']\*,photo_path["']\)/
  );
});
