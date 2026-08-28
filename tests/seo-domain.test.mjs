import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const r = (p) => readFileSync(p, "utf8");

test("official domain", () => {
  assert.match(r("app/layout.tsx"), /https:\/\/www\.gekidan-hanafubuki\.com/);
});

test("canonicals", () => {
  assert.match(r("app/page.tsx"), /canonical:\s*["']\/["']/);
  assert.match(r("app/performances/page.tsx"), /canonical:\s*["']\/performances["']/);
  assert.match(r("app/news/page.tsx"), /canonical:\s*["']\/news["']/);
});

test("robots sitemap", () => {
  const robots = r("app/robots.ts");
  assert.match(robots, /\/admin\//);
  assert.match(robots, /https:\/\/www\.gekidan-hanafubuki\.com/);
  assert.match(robots, /sitemap/);

  const sitemap = r("app/sitemap.ts");
  assert.match(sitemap, /https:\/\/www\.gekidan-hanafubuki\.com/);
});

test("og jsonld", () => {
  assert.ok(existsSync("app/opengraph-image.tsx"));
  assert.match(r("app/opengraph-image.tsx"), /1200/);
  assert.match(r("app/opengraph-image.tsx"), /630/);
  assert.match(r("app/template.tsx"), /application\/ld\+json/);
});
