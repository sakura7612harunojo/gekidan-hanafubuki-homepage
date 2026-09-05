import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { WorksSearch } from "@/components/admin/WorksSearch";

export const dynamic = "force-dynamic";

type WorkMutationError = {
  code?: string | null;
  message?: string | null;
} | null;

function workMutationErrorMessage(error: WorkMutationError) {
  if (error?.code === "23505") {
    return "同じ種類・同じ演目名はすでに登録されています。";
  }

  return error?.message || "演目の保存に失敗しました。";
}

async function createWork(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { error } = await supabase.from("works").insert({
    work_type: String(formData.get("work_type") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    is_public: formData.get("is_public") === "on",
  });

  if (error) throw new Error(workMutationErrorMessage(error));

  revalidatePath("/admin/works");
  revalidatePath("/");
}

async function updateWork(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { data: existing, error: loadError } = await supabase
    .from("works")
    .select("work_type,title,summary,is_public")
    .eq("id", id)
    .single();

  if (loadError) {
    throw new Error(loadError.message);
  }

  const nextWork = {
    work_type: formData.has("work_type")
      ? String(formData.get("work_type") || "").trim()
      : existing.work_type,

    title: formData.has("title")
      ? String(formData.get("title") || "").trim()
      : existing.title,

    summary: formData.has("summary")
      ? String(formData.get("summary") || "").trim()
      : existing.summary,

    is_public: formData.has("_is_public_present")
      ? formData.has("is_public")
      : existing.is_public,
  };

  const { error } = await supabase
    .from("works")
    .update(nextWork)
    .eq("id", id);

  if (error) {
    throw new Error(workMutationErrorMessage(error));
  }

  revalidatePath("/admin/works");
  revalidatePath("/");
}

async function deleteWork(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase.from("works").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/works");
  revalidatePath("/");
}

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const q = String(resolvedSearchParams?.q || "").trim();
  const type = String(resolvedSearchParams?.type || "").trim();

  let worksQuery = supabase
    .from("works")
    .select("id,work_type,title,summary,is_public")
    .order("title");

  if (q) {
    worksQuery = worksQuery.ilike("title", `%${q}%`);
  }

  if (type === "芝居") {
    worksQuery = worksQuery.in("work_type", ["芝居", "芝居・舞踊"]);
  } else if (type === "舞踊") {
    worksQuery = worksQuery.in("work_type", ["舞踊", "芝居・舞踊"]);
  } else if (type === "両方") {
    worksQuery = worksQuery.eq("work_type", "芝居・舞踊");
  }

  const { data } = await worksQuery;
  const works = data || [];

  return (
    <main className="admin-simple-shell">
      <section className="admin-simple-panel">
        <div style={{ marginBottom: 32 }}>
          <Link href="/admin" style={{ color: "#d4a83d" }}>
            ← 管理ダッシュボード
          </Link>
        </div>

        <p style={{ color: "#d4a83d", letterSpacing: "0.2em" }}>
          REPERTOIRE CMS
        </p>

        <h1 style={{ fontSize: 36 }}>演目管理</h1>

        <section style={panelStyle}>
          <h2>新しい演目を登録</h2>

          <form action={createWork} style={formStyle}>
            <label>
              種類
              <select name="work_type" required style={inputStyle}>
                <option value="芝居">芝居</option>
                <option value="舞踊">舞踊</option>
                <option value="芝居・舞踊">芝居・舞踊（両方）</option>
              </select>
            </label>

            <label>
              演目名
                            <input name="title" required style={inputStyle} />
            </label>

            <label>
              作品紹介
              <textarea
                name="summary"
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>

            <label>
              <input name="is_public" type="checkbox" defaultChecked /> 公開
            </label>

            <AdminSubmitButton pendingLabel="登録中…" style={goldButton}>
              登録
            </AdminSubmitButton>
          </form>
        </section>

        <section>
          <h2>登録済み演目</h2>

          <WorksSearch initialQuery={q} initialType={type} />

          {works.length === 0 ? (
            <div style={panelStyle}>演目データはまだありません。</div>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              {works.map((work) => (
                <article key={work.id} style={panelStyle}>
                  <form action={updateWork} style={formStyle}>
                    <input type="hidden" name="id" value={work.id} />

                    <label>
                      種類
                      <select
                        name="work_type"
                        defaultValue={work.work_type ?? "芝居"}
                        style={inputStyle}
                      >
                        <option value="芝居">芝居</option>
                        <option value="舞踊">舞踊</option>
                        <option value="芝居・舞踊">芝居・舞踊（両方）</option>
                      </select>
                    </label>

                    <label>
                      演目名
                      <input
                        name="title"
                        defaultValue={work.title ?? ""}
                        required
                        style={inputStyle}
                      />
                    </label>

                    <label>
                      作品紹介
                      <textarea
                        name="summary"
                        rows={5}
                        defaultValue={work.summary ?? ""}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </label>

                    <label>
                      <input type="hidden" name="_is_public_present" value="1" />
                      <input
                        name="is_public"
                        type="checkbox"
                        defaultChecked={Boolean(work.is_public)}
                      />{" "}
                      公開
                    </label>

                    <AdminSubmitButton pendingLabel="保存中…" style={goldButton}>
                      保存
                    </AdminSubmitButton>
                  </form>

                  <form action={deleteWork} style={{ marginTop: 12 }}>
                    <input type="hidden" name="id" value={work.id} />
                    <AdminSubmitButton pendingLabel="削除中…" style={deleteButton}>
                      削除
                    </AdminSubmitButton>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

const panelStyle = {
  border: "1px solid #302b24",
  background: "#13110e",
  padding: 24,
  marginBottom: 32,
};

const formStyle = {
  display: "grid",
  gap: 16,
};

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
