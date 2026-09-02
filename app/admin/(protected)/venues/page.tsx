import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

export const dynamic = "force-dynamic";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function nullable(formData: FormData, name: string) {
  const value = text(formData, name);
  return value || null;
}

function monthToDate(value: string) {
  if (!/^\d{4}-\d{2}$/.test(value)) {
    throw new Error("対象月を正しく入力してください。");
  }
  return `${value}-01`;
}

async function saveVenue(formData: FormData) {
  "use server";

  const performanceMonth = monthToDate(text(formData, "performance_month"));
  const venueName = text(formData, "venue_name");

  if (!venueName) {
    throw new Error("公演先を入力してください。");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("performance_venues").upsert(
    {
      performance_month: performanceMonth,
      venue_name: venueName,
      address: nullable(formData, "address"),
      phone: nullable(formData, "phone"),
      reservation_phone: nullable(formData, "reservation_phone"),
      reservation_note: nullable(formData, "reservation_note"),
      access: nullable(formData, "access"),
      day_start_time: nullable(formData, "day_start_time"),
      night_start_time: nullable(formData, "night_start_time"),
      website_url: nullable(formData, "website_url"),
      map_url: nullable(formData, "map_url"),
      is_public: formData.get("is_public") === "on",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "performance_month" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/venues");
}

async function deleteVenue(formData: FormData) {
  "use server";

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("performance_venues").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/performances");
  revalidatePath("/admin/venues");
}

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #d9c9c9",
  background: "#fff",
  color: "#3f292e",
  borderRadius: 6,
  fontSize: 15,
} as const;

const labelStyle = {
  display: "grid",
  gap: 6,
  fontWeight: 700,
  color: "#54343b",
} as const;

const cardStyle = {
  border: "1px solid #ead8dc",
  background: "#fffafa",
  padding: 20,
  borderRadius: 10,
} as const;

const buttonStyle = {
  border: "1px solid #c7a04b",
  background: "#c7a04b",
  color: "#fff",
  padding: "11px 18px",
  borderRadius: 7,
  fontWeight: 800,
  cursor: "pointer",
} as const;

export default async function VenuesPage() {
  const supabase = await createClient();
  const { data: venues, error } = await supabase
    .from("performance_venues")
    .select("*")
    .order("performance_month", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff7f8",
        color: "#40282e",
        padding: "32px 20px 64px",
      }}
    >
      <div style={{ width: "min(1080px, 100%)", margin: "0 auto" }}>
        <Link href="/admin" style={{ color: "#8f6570" }}>
          ← 管理画面へ戻る
        </Link>

        <p
          style={{
            marginTop: 28,
            marginBottom: 8,
            color: "#b28b43",
            fontWeight: 800,
            letterSpacing: ".14em",
          }}
        >
          VENUE CMS
        </p>
        <h1 style={{ margin: "0 0 8px", fontSize: 34 }}>公演先情報</h1>
        <p style={{ margin: "0 0 28px", color: "#73565d" }}>
          基本は1か月につき1件です。同じ月を保存すると、その月の情報を更新します。
        </p>

        <section style={{ ...cardStyle, marginBottom: 30 }}>
          <h2 style={{ marginTop: 0 }}>月の公演先を登録・更新</h2>
          <form action={saveVenue} style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <label style={labelStyle}>
                対象月
                <input type="month" name="performance_month" required style={inputStyle} />
              </label>
              <label style={labelStyle}>
                公演先
                <input name="venue_name" required style={inputStyle} />
              </label>
              <label style={labelStyle}>
                住所
                <input name="address" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                電話
                <input name="phone" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                観劇予約電話
                <input name="reservation_phone" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                観劇予約について
                <input name="reservation_note" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                昼の部 開演時間
                <input
                  type="time"
                  name="day_start_time"
                  style={inputStyle}
                  aria-label="昼の部 開演時間"
                />
              </label>
              <label style={labelStyle}>
                夜の部 開演時間
                <input
                  type="time"
                  name="night_start_time"
                  style={inputStyle}
                  aria-label="夜の部 開演時間"
                />
              </label>
              <label style={labelStyle}>
                公式サイト
                <input type="url" name="website_url" style={inputStyle} />
              </label>
              <label style={labelStyle}>
                地図URL
                <input type="url" name="map_url" style={inputStyle} />
              </label>
            </div>

            <label style={labelStyle}>
              アクセス
              <textarea name="access" rows={3} style={inputStyle} />
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
              <input type="checkbox" name="is_public" defaultChecked />
              公開する
            </label>

            <div>
              <AdminSubmitButton pendingLabel="保存中…" style={buttonStyle}>
                保存
              </AdminSubmitButton>
            </div>
          </form>
        </section>

        <section style={{ display: "grid", gap: 18 }}>
          <h2 style={{ marginBottom: 0 }}>登録済み</h2>
          {(venues ?? []).map((venue) => (
            <article key={venue.id} style={cardStyle}>
              <form action={saveVenue} style={{ display: "grid", gap: 14 }}>
                <input
                  type="hidden"
                  name="performance_month"
                  value={String(venue.performance_month).slice(0, 7)}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  <label style={labelStyle}>
                    対象月
                    <input
                      value={String(venue.performance_month).slice(0, 7)}
                      readOnly
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    公演先
                    <input
                      name="venue_name"
                      defaultValue={venue.venue_name ?? ""}
                      required
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    住所
                    <input name="address" defaultValue={venue.address ?? ""} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    電話
                    <input name="phone" defaultValue={venue.phone ?? ""} style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    観劇予約電話
                    <input
                      name="reservation_phone"
                      defaultValue={venue.reservation_phone ?? ""}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    観劇予約について
                    <input
                      name="reservation_note"
                      defaultValue={venue.reservation_note ?? ""}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    昼の部 開演時間
                    <input
                      type="time"
                      name="day_start_time"
                      defaultValue={venue.day_start_time ?? ""}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    夜の部 開演時間
                    <input
                      type="time"
                      name="night_start_time"
                      defaultValue={venue.night_start_time ?? ""}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    公式サイト
                    <input
                      type="url"
                      name="website_url"
                      defaultValue={venue.website_url ?? ""}
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    地図URL
                    <input
                      type="url"
                      name="map_url"
                      defaultValue={venue.map_url ?? ""}
                      style={inputStyle}
                    />
                  </label>
                </div>

                <label style={labelStyle}>
                  アクセス
                  <textarea
                    name="access"
                    rows={3}
                    defaultValue={venue.access ?? ""}
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
                  <input type="checkbox" name="is_public" defaultChecked={venue.is_public} />
                  公開する
                </label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <AdminSubmitButton pendingLabel="保存中…" style={buttonStyle}>
                    保存
                  </AdminSubmitButton>
                </div>
              </form>

              <form action={deleteVenue} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={venue.id} />
                <AdminSubmitButton
                  pendingLabel="削除中…"
                  style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#9d4453",
                    border: "1px solid #c99aa3",
                  }}
                >
                  削除
                </AdminSubmitButton>
              </form>
            </article>
          ))}

          {(venues ?? []).length === 0 ? (
            <p style={{ color: "#73565d" }}>まだ公演先情報はありません。</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
