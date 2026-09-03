import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const header = readFileSync(new URL("../components/Header.tsx", import.meta.url), "utf8");
const venueCard = readFileSync(new URL("../components/PerformanceVenueCard.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("公開ページの文字色が既存CSSより確実に優先される", () => {
  assert.match(header, /<header className="header">/);
  assert.match(venueCard, /performance-venue-card-readability/);
  assert.match(venueCard, /venue-info-name/);
  assert.match(venueCard, /venue-info-item/);
  assert.match(venueCard, /venue-info-label/);

  assert.match(css, /HANABUKI_PUBLIC_READABILITY/);
  assert.doesNotMatch(css, /\.section-hero/);
  assert.match(
    css,
    /body:has\(\.header\) \.header \.brand,[\s\S]{0,180}?color:\s*#5b303a\s*!important/,
  );
  assert.match(css, /body:has\(\.header\) \.schedule-hero h1\s*\{\s*color:\s*#f2d6dd/);
  assert.match(css, /body:has\(\.header\) \.schedule-hero p:last-child\s*\{\s*color:\s*#f4e9ec/);
  assert.match(css, /body:has\(\.header\) \.schedule-hero \.eyebrow\s*\{\s*color:\s*#ddb23d/);
  assert.match(css, /performance-venue-card-readability \.venue-info-name\s*\{\s*color:\s*#f2d6dd/);
  assert.match(css, /performance-venue-card-readability \.venue-info-item\s*\{\s*color:\s*#f4e9ec/);
  assert.match(css, /performance-venue-card-readability \.venue-info-label\s*\{\s*color:\s*#d8cfd2/);
  assert.match(css, /performance-venue-card-readability a\s*\{\s*color:\s*#e0b642\s*!important/);
});
