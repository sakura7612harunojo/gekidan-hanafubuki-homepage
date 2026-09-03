import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const header = readFileSync(new URL("../components/Header.tsx", import.meta.url), "utf8");
const venueCard = readFileSync(new URL("../components/PerformanceVenueCard.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("公開ページの文字色を明示して読みやすくする", () => {
  assert.match(header, /<header className="header">/);
  assert.match(header, /<nav className="nav"/);
  assert.match(venueCard, /performance-venue-card-readability/);
  assert.match(css, /HANABUKI_PUBLIC_READABILITY/);
  assert.match(css, /\.header \.brand/);
  assert.match(css, /\.section-hero h1/);
  assert.match(css, /\.performance-venue-card-readability/);
});
