import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function createNews(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const publishedAt = String(formData.get("published_at") || "").trim();

  const { error } = await supabase.from("news").insert({
    category: String(formData.get("category") || "お知らせ"),
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
    status: String(formData.get("status") || "draft"),
    published_at: publishedAt || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}


async function updateNews(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const id = String(formData.get("id") ?? "");
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publishedAt = String(formData.get("published_at") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!id || !title) {
    return;
  }

  const { error } = await supabase
    .from("news")
    .update({
      category,
      title,
      body,
      published_at: publishedAt || null,
      status,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

async function deleteNews(formData: FormData) {
  "use server";

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export default async function NewsPage() {
  const supabase = createAdminClient();

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080706",
        color: "#eee7dc",
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/admin" style={{ color: "#d4a83d" }}>
            ← 管理ダッシュボード
          </Link>
        </div>

        <p
          style={{
            color: "#d4a83d",
            letterSpacing: "0.2em",
            fontSize: 12,
          }}
        >
          NEWS CMS
        </p>

        <h1 style={{ fontSize: 36, marginBottom: 32 }}>
          お知らせ管理
        </h1>

        <section
          style={{
            border: "1px solid #302b24",
            background: "#13110e",
            padding: 24,
            marginBottom: 40,
          }}
        >
          <h2 style={{ marginTop: 0 }}>新しいお知らせを登録</h2>

          <form
            action={createNews}
            style={{ display: "grid", gap: 16 }}
          >
            <label>
              カテゴリ
              <input
                name="category"
                defaultValue="お知らせ"
                required
                style={inputStyle}
              />
            </label>

            <label>
              タイトル
              <input
                name="title"
                required
                style={inputStyle}
              />
            </label>

            <label>
              本文
              <textarea
                name="body"
                rows={6}
                style={inputStyle}
              />
            </label>

            <label>
              公開日時
              <input
                name="published_at"
                type="datetime-local"
                style={inputStyle}
              />
            </label>

            <label>
              状態
              <select
                name="status"
                defaultValue="draft"
                style={inputStyle}
              >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
              </select>
            </label>

            <button type="submit" style={goldButton}>
              登録する
            </button>
          </form>
        </section>

        <section>
          <h2>登録済みのお知らせ</h2>

          {!news || news.length === 0 ? (
            <p style={{ color: "#aaa39a" }}>
              まだお知らせは登録されていません。
            </p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {news.map((item) => (
                <article
                  key={item.id}
                  style={{
                    border: "1px solid #302b24",
                    background: "#13110e",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      color: "#d4a83d",
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  >
                    {item.category || "お知らせ"}
                  </div>

                  <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>
                    {item.title}
                  </h3>

                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#c9c1b7",
                    }}
                  >
                    {item.body}
                  </p>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#8e877e",
                      marginTop: 16,
                    }}
                  >
                    状態：{item.status || "draft"}
                  </div>

            <form
              action={updateNews}
              style={{
                display: "grid",
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: "1px solid #302b24",
              }}
            >
              <input type="hidden" name="id" value={item.id} />

              <label>
                カテゴリ
                <input
                  name="category"
                  defaultValue={item.category ?? ""}
                  required
                  style={inputStyle}
                />
              </label>

              <label>
                タイトル
                <input
                  name="title"
                  defaultValue={item.title ?? ""}
                  required
                  style={inputStyle}
                />
              </label>

              <label>
                本文
                <textarea
                  name="body"
                  defaultValue={item.body ?? ""}
                  rows={6}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              <label>
                公開日
                <input
                  type="date"
                  name="published_at"
                  defaultValue={
                    item.published_at
                      ? String(item.published_at).slice(0, 10)
                      : ""
                  }
                  style={inputStyle}
                />
              </label>

              <label>
                状態
                <select
                  name="status"
                  defaultValue={item.status ?? "draft"}
                  style={inputStyle}
                >
                  <option value="draft">下書き</option>
                  <option value="published">公開</option>
                </select>
              </label>

              <button type="submit" style={goldButton}>
                変更を保存
              </button>
            </form>



                  <form
                    action={deleteNews}
                    style={{ marginTop: 16 }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />
                    <button type="submit" style={deleteButton}>
                      削除
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: 8,
  padding: "12px 14px",
  background: "#080706",
  border: "1px solid #3a342c",
  color: "#eee7dc",
  fontSize: 16,
};

const goldButton = {
  padding: "14px 18px",
  background: "#d4a83d",
  color: "#080706",
  border: "none",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
};

const deleteButton = {
  padding: "10px 16px",
  background: "transparent",
  color: "#d77a70",
  border: "1px solid #703a35",
  cursor: "pointer",
};
