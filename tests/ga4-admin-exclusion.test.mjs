import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("管理画面ではGA4を計測せず公開ページだけ計測する", () => {
  assert.equal(
    existsSync("app/google-analytics.tsx"),
    true,
    "GA4専用コンポーネントがありません"
  );

  const ga = readFileSync("app/google-analytics.tsx", "utf8");
  const layout = readFileSync("app/layout.tsx", "utf8");

  assert.match(ga, /pathname === "\/admin"/);
  assert.match(ga, /pathname\.startsWith\("\/admin\/"\)/);
  assert.match(ga, /send_page_view:\s*false/);
  assert.match(ga, /ga-disable-/);
  assert.match(ga, /page_view/);

  assert.match(layout, /GoogleAnalytics/);
  assert.doesNotMatch(layout, /googletagmanager\.com\/gtag\/js/);
});
