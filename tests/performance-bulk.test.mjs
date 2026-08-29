import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  normalizeBulkPerformance,
  rowsFromBulkFormData,
} from "../lib/performance-bulk.ts";

test("未登録の行は保存対象にしない", () => {
  const row = normalizeBulkPerformance({
    performance_date: "2026-09-01",
    venue_name: "",
    default_venue: "",
    session_type: "",
    event_name: "",
    play_title: "",
    last_show_title: "",
    night_show_title: "",
    has_first_part: false,
    is_public: true,
  });

  assert.equal(row, null);
});

test("休演日は演目を自動的に空にする", () => {
  const row = normalizeBulkPerformance({
    performance_date: "2026-09-10",
    venue_name: "湯守座",
    default_venue: "",
    session_type: "休演",
    event_name: "休演日",
    play_title: "消える芝居",
    last_show_title: "消えるラスト",
    night_show_title: "消える夜",
    has_first_part: true,
    is_public: true,
  });

  assert.ok(row);
  assert.equal(row.play_title, null);
  assert.equal(row.last_show_title, null);
  assert.equal(row.night_show_title, null);
  assert.equal(row.has_first_part, false);
});

test("月共通の劇場名を適用できる", () => {
  const form = new FormData();

  form.set("default_venue", "湯守座");
  form.set("session_type__2026-09-01", "昼・夜");
  form.set("venue_name__2026-09-01", "");
  form.set("play_title__2026-09-01", "坪井金五郎");
  form.set("last_show_title__2026-09-01", "DANCE DANCE DANCE");
  form.set("night_show_title__2026-09-01", "アジアの海賊");
  form.set("has_first_part__2026-09-01", "on");
  form.set("is_public__2026-09-01", "on");

  const rows = rowsFromBulkFormData(form);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].venue_name, "湯守座");
  assert.equal(rows[0].performance_date, "2026-09-01");
  assert.equal(rows[0].has_first_part, true);
  assert.equal(rows[0].is_public, true);
});

test("同一日付をupsertする", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/bulk/page.tsx",
    "utf8",
  );

  assert.match(source, /upsert\s*\(\s*rows/);
  assert.match(source, /onConflict:\s*"performance_date"/);
});

test("通常の公演管理から月間一括編集へ移動できる", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/page.tsx",
    "utf8",
  );

  assert.match(source, /\/admin\/performances\/bulk/);
});
