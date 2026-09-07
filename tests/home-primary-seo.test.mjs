import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("トップページは劇団花吹雪と桜春之丞を主軸にする", () => {
  const source = readFileSync("app/page.tsx", "utf8");

  assert.match(
    source,
    /absolute:\s*"劇団花吹雪｜桜春之丞｜大衆演劇 公式サイト"/
  );

  assert.match(
    source,
    /description:\s*"劇団花吹雪の公式サイト。座長 桜春之丞を中心に、公演予定・劇団員・お知らせ・写真など最新情報をご案内します。"/
  );
});
