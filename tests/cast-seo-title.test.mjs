import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("劇団員紹介ページは桜春之丞と劇団花吹雪を主軸にする", () => {
  const source = readFileSync("app/cast/page.tsx", "utf8");

  assert.match(
    source,
    /absolute:\s*"桜春之丞｜劇団花吹雪｜劇団員紹介"/
  );

  assert.match(
    source,
    /description:\s*"桜春之丞が座長を務める劇団花吹雪/
  );
});
