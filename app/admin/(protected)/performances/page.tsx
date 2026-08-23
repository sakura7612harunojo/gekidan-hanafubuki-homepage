import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function createPerformance(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionType = String(formData.get("session_type") || "昼・夜");
  const isPublic = formData.get("is_public") === "on";

  const { error } = await supabase.from("performances").insert({
    performance_date: String(formData.get("performance_date") || ""),
    venue_name: String(formData.get("venue_name") || "三吉演芸場"),
    session_type: sessionType,
    event_name: String(formData.get("event_name") || "") || null,
    play_title: String(formData.get("play_title") || "") || null,
    last_show_title: String(formData.get("last_show_title") || "") || null,
    is_public: isPublic,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/performances");
}

async function updatePerformance(formData: FormData) {
  "use server";

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("performances")
    .update({
      performance_date: String(formData.get("performance_date") || ""),
      venue_name: String(formData.get("venue_name") || ""),
      session_type: String(formData.get("session_type") || "昼・夜"),
      event_name: String(formData.get("event_name") || "") || null,
      play_title: String(formData.get("play_title") || "") || null,
      last_show_title: String(formData.get("last_show_title") || "") || null,
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

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("performances")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/performances");
}

export default async function PerformancesPage() {
  const supabase = createAdminClient();

  const { data: performances, error } = await supabase
    .from("performances")
    .select("*")
    .order("performance_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080706",
      color: "#eee7dc",
      display: "grid",
      gridTemplateColumns: "220px 1fr"
    }}>
      <aside style={{
        borderRight: "1px solid #29251f",
        padding: "32px 22px"
      }}>
        <h2 style={{ marginBottom: 28 }}>劇団花吹雪 CMS</h2>

        <nav style={{
          display: "grid",
          gap: 18,
          fontSize: 14
        }}>
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
        <p style={{
          color: "#c89b3c",
          fontSize: 12,
          letterSpacing: 3
        }}>
          PERFORMANCE CMS
        </p>

        <h1 style={{ fontSize: 34, margin: "8px 0 30px" }}>
          公演管理
        </h1>

        <section style={{
          border: "1px solid #302b24",
          background: "#13110e",
          padding: 24,
          marginBottom: 34
        }}>
          <h2 style={{ marginTop: 0 }}>新規公演を登録</h2>

          <form action={createPerformance} style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
            gap: 16
          }}>
            <label>
              日付
              <input
                required
                name="performance_date"
                type="date"
                style={inputStyle}
              />
            </label>

            <label>
              劇場名
              <input
                required
                name="venue_name"
                defaultValue="三吉演芸場"
                style={inputStyle}
              />
            </label>

            <label>
              公演区分
              <select name="session_type" defaultValue="昼・夜" style={inputStyle}>
                <option value="昼・夜">昼・夜</option>
                <option value="昼一回">昼一回</option>
                <option value="休演">休演</option>
              </select>
            </label>

            <label>
              イベント名
              <input name="event_name" style={inputStyle} />
            </label>

            <label>
              芝居
              <input name="play_title" style={inputStyle} />
            </label>

            <label>
              ラストショー
              <input name="last_show_title" style={inputStyle} />
            </label>

            <label style={{
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <input
                name="is_public"
                type="checkbox"
                defaultChecked
              />
              公開する
            </label>

            <button type="submit" style={goldButton}>
              登録する
            </button>
          </form>
        </section>

        <h2>登録済み公演</h2>

        <div style={{
          display: "grid",
          gap: 16
        }}>
          {performances?.map((performance) => (
            <form
              key={performance.id}
              action={updatePerformance}
              style={{
                border: "1px solid #302b24",
                background: "#13110e",
                padding: 20
              }}
            >
              <input type="hidden" name="id" value={performance.id} />

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
                gap: 14
              }}>
                <label>
                  日付
                  <input
                    name="performance_date"
                    type="date"
                    defaultValue={performance.performance_date}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  劇場名
                  <input
                    name="venue_name"
                    defaultValue={performance.venue_name}
                    required
                    style={inputStyle}
                  />
                </label>

                <label>
                  公演区分
                  <select
                    name="session_type"
                    defaultValue={performance.session_type}
                    style={inputStyle}
                  >
                    <option value="昼・夜">昼・夜</option>
                    <option value="昼一回">昼一回</option>
                    <option value="休演">休演</option>
                  </select>
                </label>

                <label>
                  イベント
                  <input
                    name="event_name"
                    defaultValue={performance.event_name ?? ""}
                    style={inputStyle}
                  />
                </label>

                <label>
                  芝居
                  <input
                    name="play_title"
                    defaultValue={performance.play_title ?? ""}
                    style={inputStyle}
                  />
                </label>

                <label>
                  ラストショー
                  <input
                    name="last_show_title"
                    defaultValue={performance.last_show_title ?? ""}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 18
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <input
                    name="is_public"
                    type="checkbox"
                    defaultChecked={performance.is_public}
                  />
                  公開
                </label>

                <button type="submit" style={goldButton}>
                  保存
                </button>

                <button
                  type="submit"
                  formAction={deletePerformance}
                  style={deleteButton}
                >
                  削除
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "11px 12px",
  background: "#090806",
  border: "1px solid #39332a",
  color: "#eee7dc",
  borderRadius: 4,
} as const;

const goldButton = {
  background: "#c89b3c",
  color: "#111",
  border: 0,
  padding: "11px 18px",
  fontWeight: 700,
  cursor: "pointer",
  borderRadius: 4,
} as const;

const deleteButton = {
  background: "transparent",
  color: "#dd7777",
  border: "1px solid #713838",
  padding: "10px 18px",
  cursor: "pointer",
  borderRadius: 4,
} as const;
