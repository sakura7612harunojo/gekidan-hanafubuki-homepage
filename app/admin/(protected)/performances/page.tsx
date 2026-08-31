import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

async function createPerformance(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const performanceDate = textValue(formData, "performance_date");
  const venueName = textValue(formData, "venue_name");
  const sessionType = textValue(formData, "session_type");

  if (!performanceDate || !venueName || !sessionType) {
    throw new Error("日付・劇場名・公演区分は必須です。");
  }

  const { error } = await supabase.from("performances").insert({
    performance_date: performanceDate,
    venue_name: venueName,
    session_type: sessionType,
    event_name: textValue(formData, "event_name"),
    play_title: textValue(formData, "play_title"),
    last_show_title: textValue(formData, "last_show_title"),
    night_show_title: textValue(formData, "night_show_title"),
    has_first_part: formData.get("has_first_part") === "on",
    is_public: formData.get("is_public") === "on",
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);



  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/performances");
}

async function updatePerformance(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const id = textValue(formData, "id");
  const performanceDate = textValue(formData, "performance_date");
  const venueName = textValue(formData, "venue_name");
  const sessionType = textValue(formData, "session_type");

  if (!id) throw new Error("公演IDがありません。");
  if (!performanceDate || !venueName || !sessionType) {
    throw new Error("日付・劇場名・公演区分は必須です。");
  }

  const { error } = await supabase
    .from("performances")
    .update({
      performance_date: performanceDate,
      venue_name: venueName,
      session_type: sessionType,
      event_name: textValue(formData, "event_name"),
      play_title: textValue(formData, "play_title"),
      last_show_title: textValue(formData, "last_show_title"),
      night_show_title: textValue(formData, "night_show_title"),
      has_first_part: formData.get("has_first_part") === "on",
      is_public: formData.get("is_public") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/performances");
}

async function deletePerformance(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = textValue(formData, "id");

  if (!id) throw new Error("公演IDがありません。");

  const { error } = await supabase
    .from("performances")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/performances");
}

const fieldStyle = {
  width: "100%",
  background: "#090806",
  color: "#efe8dc",
  border: "1px solid #39342c",
  borderRadius: 4,
  padding: "12px 12px",
  fontSize: 16,
} as const;

const labelStyle = {
  display: "grid",
  gap: 7,
  fontSize: 15,
  fontWeight: 700,
  color: "#efe8dc",
} as const;

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
} as const;


function getCurrentJapanMonth() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}`;
}

function sortPerformancesForAdmin<T extends { performance_date: string }>(
  rows: T[],
  currentMonth: string,
) {
  const group = (row: T) => {
    const month = row.performance_date.slice(0, 7);
    if (month === currentMonth) return 0;
    if (month > currentMonth) return 1;
    return 2;
  };

  return [...rows].sort((a, b) => {
    const groupA = group(a);
    const groupB = group(b);

    if (groupA !== groupB) return groupA - groupB;
    if (groupA === 2) {
      return b.performance_date.localeCompare(a.performance_date);
    }

    return a.performance_date.localeCompare(b.performance_date);
  });
}

export default async function PerformancesPage() {
  const supabase = await createClient();

  const { data: performances, error } = await supabase
    .from("performances")
    .select("*")
    .order("performance_date", { ascending: true });

  if (error) throw new Error(error.message);

  const currentMonth = getCurrentJapanMonth();
  const sortedPerformances = sortPerformancesForAdmin(
    performances ?? [],
    currentMonth,
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080706",
        color: "#efe8dc",
        display: "grid",
        gridTemplateColumns: "220px minmax(0, 1fr)",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #29251f",
          padding: "32px 22px",
          position: "sticky",
          top: 0,
          height: "100vh",
          alignSelf: "start",
        }}
      >
        <h2 style={{ marginBottom: 28 }}>劇団花吹雪 CMS</h2>

        <nav style={{ display: "grid", gap: 18, fontSize: 14 }}>
          <Link href="/admin">ダッシュボード</Link>
          <Link href="/admin/performances">公演管理</Link>
          <Link href="/admin/news">お知らせ</Link>
          <Link href="/admin/members">劇団員</Link>
          <Link href="/admin/works">演目</Link>
          <Link href="/admin/gallery">写真</Link>
          <Link href="/">公開サイト</Link>
        </nav>
      </aside>

      <section style={{ padding: "42px", overflowX: "auto" }}>
        <p
          style={{
            color: "#d2a93d",
            letterSpacing: "0.18em",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          PERFORMANCE CMS
        </p>
        <h1 style={{ fontSize: 34, margin: "0 0 34px" }}>公演管理</h1>
        <div style={{ margin: "12px 0 24px" }}>
          <a
            href="/admin/performances/bulk"
            style={{
              display: "inline-block",
              padding: "11px 16px",
              background: "#d9ad3d",
              color: "#080706",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            月間一括編集
          </a>
        </div>

        <form
          action={createPerformance}
          style={{
            border: "1px solid #332f28",
            background: "#15130f",
            padding: 22,
            marginBottom: 34,
            maxWidth: 980,
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 22 }}>新規公演を登録</h2>

          <div className="performance-grid" style={gridStyle}>
            <label style={labelStyle}>
              日付
              <input
                type="date"
                name="performance_date"
                required
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              劇場名
              <input
                name="venue_name"
                defaultValue="湯守座"
                required
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              公演区分
              <select
                name="session_type"
                defaultValue="昼・夜"
                style={fieldStyle}
              >
                <option value="昼・夜">昼・夜</option>
                <option value="昼一回">昼一回</option>
                <option value="夜一回">夜一回</option>
                <option value="休演">休演</option>
              </select>
            </label>

            <label style={labelStyle}>
              イベント名・ゲスト・不在情報
              <input name="event_name" style={fieldStyle} />
            </label>

            <label style={labelStyle}>
              芝居（昼の部）
              <input name="play_title" style={fieldStyle} />
            </label>

            <label style={labelStyle}>
              ラストショー（昼の部）
              <input name="last_show_title" style={fieldStyle} />
            </label>

            <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
              夜の部（花吹雪舞踊ショー）
              <input
                name="night_show_title"
                placeholder="例：アジアの海賊"
                style={fieldStyle}
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: 22,
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="has_first_part" />
              1部あり
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="is_public" defaultChecked />
              公開する
            </label>

            <AdminSubmitButton
              pendingLabel="登録中…"
              style={{
                marginLeft: "auto",
                background: "#d6a93d",
                color: "#090806",
                border: 0,
                borderRadius: 4,
                padding: "13px 54px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              登録する
            </AdminSubmitButton>
          </div>
        </form>

        <h2 style={{ marginBottom: 20 }}>登録済み公演</h2>

        <div style={{ display: "grid", gap: 14, maxWidth: 1100 }}>
          {sortedPerformances.map((performance) => (
            <form
              key={performance.id}
              action={updatePerformance}
              style={{
                border: "1px solid #332f28",
                background: "#15130f",
                padding: 18,
              }}
            >
              <input type="hidden" name="id" value={performance.id} />

              <div className="performance-grid" style={gridStyle}>
                <label style={labelStyle}>
                  日付
                  <input
                    type="date"
                    name="performance_date"
                    defaultValue={performance.performance_date ?? ""}
                    required
                    style={fieldStyle}
                  />
                </label>

                <label style={labelStyle}>
                  劇場名
                  <input
                    name="venue_name"
                    defaultValue={performance.venue_name ?? ""}
                    required
                    style={fieldStyle}
                  />
                </label>

                <label style={labelStyle}>
                  公演区分
                  <select
                    name="session_type"
                    defaultValue={performance.session_type ?? "昼・夜"}
                    style={fieldStyle}
                  >
                    <option value="昼・夜">昼・夜</option>
                    <option value="昼一回">昼一回</option>
                    <option value="夜一回">夜一回</option>
                    <option value="休演">休演</option>
                  </select>
                </label>

                <label style={labelStyle}>
                  イベント名・ゲスト・不在情報
                  <input
                    name="event_name"
                    defaultValue={performance.event_name ?? ""}
                    style={fieldStyle}
                  />
                </label>

                <label style={labelStyle}>
                  芝居（昼の部）
                  <input
                    name="play_title"
                    defaultValue={performance.play_title ?? ""}
                    style={fieldStyle}
                  />
                </label>

                <label style={labelStyle}>
                  ラストショー（昼の部）
                  <input
                    name="last_show_title"
                    defaultValue={performance.last_show_title ?? ""}
                    style={fieldStyle}
                  />
                </label>

                <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                  夜の部（花吹雪舞踊ショー）
                  <input
                    name="night_show_title"
                    defaultValue={performance.night_show_title ?? ""}
                    style={fieldStyle}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: 16,
                }}
              >
                <label
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    name="has_first_part"
                    defaultChecked={Boolean(performance.has_first_part)}
                  />
                  1部あり
                </label>

                <label
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    name="is_public"
                    defaultChecked={Boolean(performance.is_public)}
                  />
                  公開
                </label>

                <AdminSubmitButton
                  pendingLabel="保存中…"
                  style={{
                    background: "#d6a93d",
                    color: "#090806",
                    border: 0,
                    borderRadius: 4,
                    padding: "11px 20px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  保存
                </AdminSubmitButton>

                <AdminSubmitButton
                  pendingLabel="削除中…"
                  formAction={deletePerformance}
                  style={{
                    background: "transparent",
                    color: "#f06d6d",
                    border: "1px solid #773b3b",
                    borderRadius: 4,
                    padding: "10px 18px",
                    cursor: "pointer",
                  }}
                >
                  削除
                </AdminSubmitButton>
              </div>
            </form>
          ))}
        </div>
      </section>

      <style>{`
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          color: #d6a93d;
        }
        @media (max-width: 820px) {
          main {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
            height: auto !important;
            border-right: 0 !important;
            border-bottom: 1px solid #29251f !important;
          }
          section {
            padding: 22px !important;
          }
          .performance-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
