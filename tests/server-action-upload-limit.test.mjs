import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const config = fs.readFileSync("next.config.ts", "utf8");

test("Server Actionのアップロード上限を10MBにする", () => {
  assert.match(
    config,
    /experimental\s*:\s*\{[\s\S]*?serverActions\s*:\s*\{[\s\S]*?bodySizeLimit\s*:\s*["']10mb["']/,
  );
});
