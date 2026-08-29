import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import {
  PERFORMANCE_SESSION_TYPES,
  rowsFromBulkFormData,
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

function currentJapanMonth() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 7);
}

function safeMonth(value: string | undefined) {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return currentJapanMonth();
  }
  return value;
}

function monthDates(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();

  return Array.from({ length: days }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${month}-${day}`;
  });
}

function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

async function saveBulkPerformances(formData: FormData) {
  "use server";

  const month = safeMonth(String(formData.get("month") ?? ""));

  let rows;

  try {
    rows = rowsFromBulkFormData(formData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "入力内容を確認してください。";

    redirect(
      `/admin/performances/bulk?month=${month}&error=${encodeURIComponent(
        message,
      )}`,
    );
  }

  if (rows.length === 0) {
    redirect(
      `/admin/performances/bulk?month=${month}&error=${encodeURIComponent(
        "保存対象の公演がありません。",
      )}`,
    );
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("performances")
    .upsert(rows, {
      onConflict: "performance_date",
    });

  if (error) {
    redirect(
      `/admin/performances/bulk?month=${month}&error=${encodeURIComponent(
        error.message,
      )}`,
    );
  }

  revalidatePath("/admin/performances");
  revalidatePath("/admin/performances/bulk");
  revalidatePath("/");
  revalidatePath("/performances");

  redirect(
    `/admin/performances/bulk?month=${month}&saved=1`,
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

  const saved = params.saved === "1";
  const errorMessage =
    typeof params.error === "string" ? params.error : "";

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

  const existingRows = (data ?? []) as ExistingPerformance[];

  const byDate = new Map(
    existingRows.map((row) => [row.performance_date, row]),
  );

  const defaultVenue =
    existingRows.find((row) => row.venue_name?.trim())
      ?.venue_name ?? "";

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
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <a
          href="/admin/performances"
          style={{ color: "#d4a83d" }}
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

        <h1 style={{ fontSize: 36, marginBottom: 8 }}>
          月間一括編集
        </h1>

        <p style={{ color: "#aaa29a", lineHeight: 1.8 }}>
          1か月分をまとめて編集できます。
          「未登録」の日は保存対象から外れ、既存データも削除されません。
          「休演」は保存時に芝居・ラストショー・夜の部・1部ありを自動的に空にします。
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
            <button type="submit" style={navButtonStyle}>
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

        {saved ? (
          <div style={successStyle}>
            ✅ {month} の公演を一括保存しました。
          </div>
        ) : null}

        {errorMessage ? (
          <div style={errorStyle}>⚠️ {errorMessage}</div>
        ) : null}

        <form action={saveBulkPerformances}>
          <input type="hidden" name="month" value={month} />

          <section style={panelStyle}>
            <label
              style={{
                display: "block",
                maxWidth: 600,
              }}
            >
              <strong>月共通の劇場名</strong>
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
              各日の劇場名が空欄の場合、ここに入力した劇場名を使用します。
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
                    <th key={heading} style={thStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dates.map((date) => {
                  const row = byDate.get(date);

                  return (
                    <tr key={date}>
                      <td style={tdStyle}>
                        <strong>
                          {Number(date.slice(-2))}日
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
                          defaultValue={row?.session_type ?? ""}
                          style={smallInputStyle}
                        >
                          <option value="">未登録</option>
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
                          defaultValue={row?.venue_name ?? ""}
                          placeholder="共通劇場なら空欄可"
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`event_name__${date}`}
                          defaultValue={row?.event_name ?? ""}
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`play_title__${date}`}
                          defaultValue={row?.play_title ?? ""}
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`last_show_title__${date}`}
                          defaultValue={
                            row?.last_show_title ?? ""
                          }
                          style={smallInputStyle}
                        />
                      </td>

                      <td style={tdStyle}>
                        <input
                          name={`night_show_title__${date}`}
                          defaultValue={
                            row?.night_show_title ?? ""
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
                              ? row.is_public !== false
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
              background: "rgba(8,7,6,.94)",
              border: "1px solid #302b24",
              zIndex: 10,
            }}
          >
            <AdminSubmitButton
              pendingLabel="一括保存中…"
              style={{
                width: "100%",
                padding: "16px 20px",
                border: 0,
                background: "#d9ad3d",
                color: "#080706",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {month} を一括保存
            </AdminSubmitButton>
          </div>
        </form>
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
