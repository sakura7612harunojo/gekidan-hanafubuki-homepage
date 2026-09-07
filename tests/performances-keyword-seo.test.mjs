import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("公演予定ページは劇団花吹雪と桜春之丞の予定検索を意識する", () => {
  const source = readFileSync("app/performances/page.tsx", "utf8");

  assert.match(
    source,
    /absolute:\s*"劇団花吹雪 公演予定｜桜春之丞・春之丞の出演予定"/
  );

  assert.match(source, /劇団花吹雪/);
  assert.match(source, /桜春之丞/);
  assert.match(source, /春之丞/);
});

