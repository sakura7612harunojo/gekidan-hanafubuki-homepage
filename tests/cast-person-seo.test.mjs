import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("桜春之丞をPerson構造化データで示す", () => {
  const source = readFileSync("app/cast/page.tsx", "utf8");

  assert.match(source, /"@type": "Person"/);
  assert.match(source, /jobTitle: "座長"/);
  assert.match(source, /worksFor:/);
});
