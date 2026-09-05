import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const searchSource = readFileSync(
  "components/admin/WorksSearch.tsx",
  "utf8"
);

const pageSource = readFileSync(
  "app/admin/(protected)/works/page.tsx",
  "utf8"
);

test("演目管理で全部・芝居・舞踊・両方を絞り込める", () => {
  assert.match(searchSource, /全部/);
  assert.match(searchSource, /芝居/);
  assert.match(searchSource, /舞踊/);
  assert.match(searchSource, /両方/);

  assert.match(searchSource, /params\.set\("type"/);
  assert.match(searchSource, /params\.delete\("type"\)/);

  assert.match(pageSource, /type\?: string/);
  assert.match(
    pageSource,
    /\.in\("work_type", \["芝居", "芝居・舞踊"\]\)/
  );
  assert.match(
    pageSource,
    /\.in\("work_type", \["舞踊", "芝居・舞踊"\]\)/
  );
  assert.match(
    pageSource,
    /\.eq\("work_type", "芝居・舞踊"\)/
  );
});
