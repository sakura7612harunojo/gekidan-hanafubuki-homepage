import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  copyRowsToMonth,
  normalizeBulkPerformance,
  rowsFromBulkFormData,
} from "../lib/performance-bulk.ts";

test("未登録は保存対象にしない", () => {
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

test("休演は演目と1部ありを消す", () => {
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
  form.set(
    "session_type__2026-09-01",
    "昼・夜",
  );
  form.set(
    "venue_name__2026-09-01",
    "",
  );
  form.set(
    "play_title__2026-09-01",
    "坪井金五郎",
  );
  form.set(
    "is_public__2026-09-01",
    "on",
  );

  const rows =
    rowsFromBulkFormData(form);

  assert.equal(rows.length, 1);
  assert.equal(
    rows[0].venue_name,
    "湯守座",
  );
});

test("前月コピーは日付と劇場を変更する", () => {
  const rows = copyRowsToMonth(
    [
      {
        performance_date:
          "2026-08-01",
        venue_name: "三吉演芸場",
        session_type: "昼・夜",
        event_name: "初日",
        play_title: "花笠文治",
        last_show_title:
          "CALL CALL CALL!",
        night_show_title: null,
        has_first_part: false,
        is_public: true,
      },
    ],
    "2026-09",
    "湯守座",
  );

  assert.equal(
    rows[0].performance_date,
    "2026-09-01",
  );

  assert.equal(
    rows[0].venue_name,
    "湯守座",
  );
});

test("存在しない31日はコピーしない", () => {
  const rows = copyRowsToMonth(
    [
      {
        performance_date:
          "2026-08-31",
        venue_name: "三吉演芸場",
        session_type: "昼・夜",
        event_name: null,
        play_title: null,
        last_show_title: null,
        night_show_title: null,
        has_first_part: false,
        is_public: true,
      },
    ],
    "2026-09",
    "湯守座",
  );

  assert.equal(rows.length, 0);
});

test("同一日付はupsertする", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/bulk/page.tsx",
    "utf8",
  );

  assert.match(
    source,
    /onConflict:\s*"performance_date"/,
  );
});

test("一括公開・非公開がある", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/bulk/page.tsx",
    "utf8",
  );

  assert.match(
    source,
    /setMonthPublicity/,
  );

  assert.match(
    source,
    /一括公開/,
  );

  assert.match(
    source,
    /一括非公開/,
  );
});

test("保存前に変更日数を確認する", async () => {
  const source = await readFile(
    "components/admin/BulkPerformanceActions.tsx",
    "utf8",
  );

  assert.match(
    source,
    /changedCount/,
  );

  assert.match(
    source,
    /window\.confirm/,
  );
});

test("公演管理から月間一括編集へ行ける", async () => {
  const source = await readFile(
    "app/admin/(protected)/performances/page.tsx",
    "utf8",
  );

  assert.match(
    source,
    /\/admin\/performances\/bulk/,
  );
});
