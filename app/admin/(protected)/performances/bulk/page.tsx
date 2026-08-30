import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  BulkPerformanceForm,
  ConfirmForm,
  PendingButton,
} from "@/components/admin/BulkPerformanceActions";

import {
  PERFORMANCE_SESSION_TYPES,
  copyRowsToMonth,
  monthDates,
  safeMonth,
  shiftMonth,
  type BulkPerformanceRow,
} from "@/lib/performance-bulk";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

type ExistingPerformance = {
  id: string;
  performance_date: string;
  venue_name: string | null;
  session_type: string;
  event_name: string | null;
  play_title: string | null;
  last_show_title: string | null;
  night_show_title: string | null;
  has_first_part: boolean | null;
  is_public: boolean | null;
};

function redirectNotice(
  month: string,
  notice: string,
): never {
  redirect(
    `/admin/performances/bulk?month=${month}&notice=${encodeURIComponent(
      notice,
    )}`,
  );
}

function redirectError(
  month: string,
  message: string,
): never {
  redirect(
    `/admin/performances/bulk?month=${month}&error=${encodeURIComponent(
      message,
    )}`,
  );
}

async function saveBulkPerformances(formData: FormData) {
  "use server";

  const month = safeMonth(
    String(formData.get("month") ?? ""),
  );

  const {
    rowsFromBulkFormData,
  } = await import("@/lib/performance-bulk");

  let rows: BulkPerformanceRow[];

  try {
    rows = rowsFromBulkFormData(formData);
  } catch (error) {
    redirectError(
      month,
      error instanceof Error
        ? error.message
        : "入力内容を確認してください。",
    );
  }

  if (rows.length === 0) {
    redirectError(
      month,
      "保存対象の公演がありません。",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("performances")
    .upsert(rows, {
      onConflict: "performance_date",
    });

  if (error) {
    redirectError(month, error.message);
  }

  revalidatePath("/admin/performances");
  revalidatePath("/admin/performances/bulk");
  revalidatePath("/");
  revalidatePath("/performances");

  redirectNotice(
    month,
    `${rows.length}日分を保存しました。`,
  );
}

async function setMonthPublicity(
  formData: FormData,
) {
  "use server";

  const month = safeMonth(
    String(formData.get("month") ?? ""),
  );

  const isPublic =
    String(formData.get("publicity") ?? "") ===
    "public";

  const dates = monthDates(month);
  const supabase = await createClient();

  const { error } = await supabase
    .from("performances")
    .update({
      is_public: isPublic,
    })
    .gte("performance_date", dates[0])
    .lte(
      "performance_date",
      dates[dates.length - 1],
    );

  if (error) {
    redirectError(month, error.message);
  }

  revalidatePath("/admin/performances");
  revalidatePath("/admin/performances/bulk");
  revalidatePath("/");
  revalidatePath("/performances");

  redirectNotice(
    month,
    isPublic
      ? `${month}を一括公開しました。`
      : `${month}を一括非公開にしました。`,
  );
}

async function copyPreviousMonth(
  formData: FormData,
) {
  "use server";

  const month = safeMonth(
    String(formData.get("month") ?? ""),
  );

  const venueName = String(
    formData.get("copy_venue_name") ?? "",
  ).trim();

  if (!venueName) {
    redirectError(
      month,
      "コピー先の劇場名を入力してください。",
    );
  }

  const sourceMonth = shiftMonth(month, -1);
  const sourceDates = monthDates(sourceMonth);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("performances")
    .select(
      "performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title,has_first_part,is_public",
    )
    .gte(
      "performance_date",
      sourceDates[0],
    )
    .lte(
      "performance_date",
      sourceDates[sourceDates.length - 1],
    )
    .order("performance_date");

  if (error) {
    redirectError(month, error.message);
  }

  if (!data || data.length === 0) {
    redirectError(
      month,
      `${sourceMonth}にコピー元の公演がありません。`,
    );
  }

  const sourceRows: BulkPerformanceRow[] =
    data.map((row) => ({
      performance_date: row.performance_date,
      venue_name: row.venue_name ?? "",
      session_type:
        row.session_type as BulkPerformanceRow["session_type"],
      event_name: row.event_name ?? null,
      play_title: row.play_title ?? null,
      last_show_title:
        row.last_show_title ?? null,
      night_show_title:
        row.night_show_title ?? null,
      has_first_part: Boolean(
        row.has_first_part,
      ),
      is_public: row.is_public !== false,
    }));

  let copiedRows: BulkPerformanceRow[];

  try {
    copiedRows = copyRowsToMonth(
      sourceRows,
      month,
      venueName,
    );
  } catch (error) {
    redirectError(
      month,
      error instanceof Error
        ? error.message
        : "コピーできませんでした。",
    );
  }

  const { error: copyError } = await supabase
    .from("performances")
    .upsert(copiedRows, {
      onConflict: "performance_date",
    });

  if (copyError) {
    redirectError(month, copyError.message);
  }

  revalidatePath("/admin/performances");
  revalidatePath("/admin/performances/bulk");
  revalidatePath("/");
  revalidatePath("/performances");

  redirectNotice(
    month,
    `${sourceMonth}から${copiedRows.length}日分をコピーしました。`,
  );
}

export default async function BulkPerformancesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const month = safeMonth(
    typeof params.month === "string"
      ? params.month
      : undefined,
  );

  const notice =
    typeof params.notice === "string"
      ? params.notice
      : "";

  const errorMessage =
    typeof params.error === "string"
      ? params.error
      : "";

  const dates = monthDates(month);
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("performances")
    .select(
      "id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title,has_first_part,is_public",
    )
    .gte("performance_date", firstDate)
    .lte("performance_date", lastDate)
    .order("performance_date");

  if (error) {
    throw new Error(error.message);
  }

  const existingRows =
    (data ?? []) as ExistingPerformance[];

  const byDate = new Map(
    existingRows.map((row) => [
      row.performance_date,
      row,
    ]),
  );

  const defaultVenue =
    existingRows.find(
      (row) => row.venue_name?.trim(),
    )?.venue_name ?? "";

  const initialRows: BulkPerformanceRow[] =
    existingRows.map((row) => ({
      performance_date: row.performance_date,
      venue_name: row.venue_name ?? "",
      session_type:
        row.session_type as BulkPerformanceRow["session_type"],
      event_name: row.event_name ?? null,
      play_title: row.play_title ?? null,
      last_show_title:
        row.last_show_title ?? null,
      night_show_title:
        row.night_show_title ?? null,
      has_first_part: Boolean(
        row.has_first_part,
      ),
      is_public: row.is_public !== false,
    }));

  const previousMonth = shiftMonth(month, -1);
  const nextMonth = shiftMonth(month, 1);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080706",
        color: "#eee7dc",
        padding: "32px 24px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <a
          href="/admin/performances"
          style={{
            color: "#d4a83d",
          }}
        >
          ← 公演管理へ戻る
        </a>

        <p
          style={{
            color: "#d4a83d",
            letterSpacing: "0.2em",
            marginTop: 32,
          }}
        >
          MONTHLY PERFORMANCE CMS
        </p>

        <h1
          style={{
            fontSize: 36,
            marginBottom: 8,
          }}
        >
          月間一括編集
        </h1>

        <p
          style={{
            color: "#aaa29a",
            lineHeight: 1.8,
          }}
        >
          月単位で公演をまとめて管理できます。
          未登録日は既存データを削除しません。
          休演日は保存時に芝居・ラストショー・夜の部・1部ありを自動的に空にします。
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            margin: "24px 0",
          }}
        >
          <a
            href={`/admin/performances/bulk?month=${previousMonth}`}
            style={navButtonStyle}
          >
            ← 前月
          </a>

          <form
            method="get"
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              type="month"
              name="month"
              defaultValue={month}
              style={inputStyle}
            />

            <button
              type="submit"
              style={navButtonStyle}
            >
              表示
            </button>
          </form>

          <a
            href={`/admin/performances/bulk?month=${nextMonth}`}
            style={navButtonStyle}
          >
            翌月 →
          </a>
        </div>

        {notice ? (
          <div style={successStyle}>
            ✅ {notice}
          </div>
        ) : null}

        {errorMessage ? (
          <div style={errorStyle}>
            ⚠️ {errorMessage}
          </div>
        ) : null}

        <section style={actionPanelStyle}>
          <h2 style={{ marginTop: 0 }}>
            月間操作
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            <div style={smallPanelStyle}>
              <strong>
                前月をこの月へコピー
              </strong>

              <p style={helpStyle}>
                {previousMonth}の内容を、
                同じ日付番号で{month}へコピーします。
                31日が存在しない月などは自動的に除外します。
              </p>

              <ConfirmForm
                action={copyPreviousMonth}
                message={
                  existingRows.length > 0
                    ? `${month}には既に${existingRows.length}日分あります。\n前月の内容で同じ日付を上書きします。よろしいですか？`
                    : `${previousMonth}の内容を${month}へコピーします。よろしいですか？`
                }
              >
                <input
                  type="hidden"
                  name="month"
                  value={month}
                />

                <label>
                  コピー先劇場名
                  <input
                    name="copy_venue_name"
                    required
                    defaultValue={
                      defaultVenue
                    }
                    placeholder="例：湯守座"
                    style={inputStyle}
                  />
                </label>

                <div
                  style={{
                    marginTop: 12,
                  }}
                >
                  <PendingButton
                    pendingLabel="コピー中…"
                  >
                    前月をコピー
                  </PendingButton>
                </div>
              </ConfirmForm>
            </div>

            <div style={smallPanelStyle}>
              <strong>
                一括公開・非公開
              </strong>

              <p style={helpStyle}>
                現在の{month}に登録済みの
                {existingRows.length}
                日分をまとめて切り替えます。
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <ConfirmForm
                  action={setMonthPublicity}
                  message={`${month}の登録済み${existingRows.length}日分を公開します。よろしいですか？`}
                >
                  <input
                    type="hidden"
                    name="month"
                    value={month}
                  />
                  <input
                    type="hidden"
                    name="publicity"
                    value="public"
                  />

                  <PendingButton
                    pendingLabel="公開中…"
                    disabled={
                      existingRows.length === 0
                    }
                  >
                    一括公開
                  </PendingButton>
                </ConfirmForm>

                <ConfirmForm
                  action={setMonthPublicity}
                  message={`${month}の登録済み${existingRows.length}日分を非公開にします。よろしいですか？`}
                >
                  <input
                    type="hidden"
                    name="month"
                    value={month}
                  />
                  <input
                    type="hidden"
                    name="publicity"
                    value="private"
                  />

                  <PendingButton
                    pendingLabel="変更中…"
                    disabled={
                      existingRows.length === 0
                    }
                    danger
                  >
                    一括非公開
                  </PendingButton>
                </ConfirmForm>
              </div>
            </div>
          </div>
        </section>

        <BulkPerformanceForm
          action={saveBulkPerformances}
          initialRows={initialRows}
        >
          <input
            type="hidden"
            name="month"
            value={month}
          />

          <section style={panelStyle}>
            <label
              style={{
                display: "block",
                maxWidth: 600,
              }}
            >
              <strong>
                月共通の劇場名
              </strong>

              <input
                name="default_venue"
                defaultValue={defaultVenue}
                placeholder="この月の劇場名"
                style={inputStyle}
              />
            </label>

            <p
              style={{
                color: "#aaa29a",
                marginBottom: 0,
              }}
            >
              各日の劇場名が空欄の場合は、
              ここに入力した劇場名を使用します。
            </p>
          </section>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #302b24",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 1550,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  {[
                    "日付",
                    "公演区分",
                    "劇場名",
                    "イベント・ゲスト・不在",
                    "芝居",
                    "ラストショー",
                    "夜の部",
                    "1部",
                    "公開",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={thStyle}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dates.map((date) => {
                  const row =
                    byDate.get(date);

                  return (
                    <tr key={date}>
                      <td style={tdStyle}>
                        <strong>
                          {Number(
                            date.slice(-2),
                          )}
                          日
                        </strong>

                        <div
                          style={{
                            fontSize: 12,
                            color: "#888",
                            marginTop: 4,
                          }}
                        >
                          {date}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <select
                          name={`session_type__${date}`}
                          defaultValue={
                            row?.session_type ??
                            ""
                          }
                          style={smallInputStyle}
                        >
                          <option value="">
                            未登録
                          </option>

                          {PERFORMANCE_SESSION_TYPES.map(
                            (session) => (
                              <option
                                value={session}
                                key={session}
                              >
                                {session}
                              </option>
                            ),
                          )}
                        </select>
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`venue_name__${date}`}
                          defaultValue={
                            row?.venue_name ??
                            ""
                          }
                          placeholder="共通劇場なら空欄可"
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`event_name__${date}`}
                          defaultValue={
                            row?.event_name ??
                            ""
                          }
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`play_title__${date}`}
                          defaultValue={
                            row?.play_title ??
                            ""
                          }
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`last_show_title__${date}`}
                          defaultValue={
                            row?.last_show_title ??
                            ""
                          }
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`night_show_title__${date}`}
                          defaultValue={
                            row?.night_show_title ??
                            ""
                          }
                          style={smallInputStyle}
                        />
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          name={`has_first_part__${date}`}
                          defaultChecked={Boolean(
                            row?.has_first_part,
                          )}
                        />
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          name={`is_public__${date}`}
                          defaultChecked={
                            row
                              ? row.is_public !==
                                false
                              : true
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              position: "sticky",
              bottom: 16,
              marginTop: 20,
              padding: 16,
              background:
                "rgba(8,7,6,.94)",
              border:
                "1px solid #302b24",
              zIndex: 10,
            }}
          >
            <div
              style={{
                marginBottom: 10,
                color: "#aaa29a",
                fontSize: 13,
              }}
            >
              保存前に変更日数を確認します。
            </div>

            <PendingButton
              pendingLabel="一括保存中…"
            >
              {month} を一括保存
            </PendingButton>
          </div>
        </BulkPerformanceForm>
      </div>
    </main>
  );
}

const panelStyle = {
  border: "1px solid #302b24",
  background: "#13110e",
  padding: 20,
  margin: "24px 0",
};

const actionPanelStyle = {
  ...panelStyle,
  marginBottom: 24,
};

const smallPanelStyle = {
  border: "1px solid #302b24",
  padding: 16,
  background: "#0d0b09",
};

const helpStyle = {
  color: "#aaa29a",
  lineHeight: 1.7,
  fontSize: 13,
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "11px 12px",
  border: "1px solid #3a342c",
  background: "#080706",
  color: "#eee7dc",
  fontSize: 15,
};

const smallInputStyle = {
  width: "100%",
  minWidth: 150,
  boxSizing: "border-box" as const,
  padding: "9px 10px",
  border: "1px solid #3a342c",
  background: "#080706",
  color: "#eee7dc",
};

const thStyle = {
  padding: "12px 10px",
  textAlign: "left" as const,
  background: "#17130d",
  borderBottom: "1px solid #3a342c",
  color: "#d9ad3d",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: 8,
  borderBottom: "1px solid #302b24",
  verticalAlign: "top" as const,
};

const navButtonStyle = {
  display: "inline-block",
  padding: "10px 14px",
  color: "#eee7dc",
  background: "#13110e",
  border: "1px solid #4a4032",
  textDecoration: "none",
  cursor: "pointer",
};

const successStyle = {
  padding: 14,
  margin: "16px 0",
  border: "1px solid #526f46",
  background: "#142010",
};

const errorStyle = {
  padding: 14,
  margin: "16px 0",
  border: "1px solid #8b493f",
  background: "#28120f",
};
