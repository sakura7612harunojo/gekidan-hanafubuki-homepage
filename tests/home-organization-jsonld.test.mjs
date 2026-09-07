import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("トップページで劇団花吹雪と座長桜春之丞の関係を構造化データで示す", () => {
  const source = readFileSync("app/page.tsx", "utf8");

  assert.match(source, /const organizationJsonLd =/);
  assert.match(source, /"@type": "PerformingGroup"/);
  assert.match(source, /name: "劇団花吹雪"/);
  assert.match(source, /"@type": "Person"/);
  assert.match(source, /name: "桜春之丞"/);
  assert.match(source, /jobTitle: "座長"/);
  assert.match(source, /type="application\/ld\+json"/);
  assert.match(source, /JSON\.stringify\(organizationJsonLd\)/);
});
