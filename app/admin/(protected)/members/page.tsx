import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

export const dynamic = "force-dynamic";

async function createMember(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { error } = await supabase.from("members").insert({
    stage_name: String(formData.get("stage_name") || "").trim(),
    role_name: String(formData.get("role_name") || "").trim(),
    profile: String(formData.get("profile") || "").trim(),
    sort_order: Number(formData.get("sort_order") || 0),
    is_public: formData.get("is_public") === "on",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
  revalidatePath("/");
}

async function updateMember(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("members")
    .update({
      stage_name: String(formData.get("stage_name") || "").trim(),
      role_name: String(formData.get("role_name") || "").trim(),
      profile: String(formData.get("profile") || "").trim(),
      sort_order: Number(formData.get("sort_order") || 0),
      is_public: formData.get("is_public") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
  revalidatePath("/");
}

async function deleteMember(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
  revalidatePath("/");
}

export default async function MembersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("members")
    .select("id,stage_name,role_name,profile,sort_order,is_public")
    .order("sort_order")
    .order("stage_name");

  const members = data || [];

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <div style={{ marginBottom: 32 }}>
          <Link href="/admin" style={{ color: "#d4a83d" }}>
            ← 管理ダッシュボード
          </Link>
        </div>

        <p style={{ color: "#d4a83d", letterSpacing: "0.2em" }}>
          CAST CMS
        </p>

        <h1 style={{ fontSize: 36 }}>劇団員管理</h1>

        <section style={panelStyle}>
          <h2>新しい劇団員を登録</h2>

          <form action={createMember} style={formStyle}>
            <label>
              芸名
              <input name="stage_name" required style={inputStyle} />
            </label>

            <label>
              役職
              <input
                name="role_name"
                placeholder="例：座長・花形"
                style={inputStyle}
              />
            </label>

            <label>
              プロフィール
              <textarea
                name="profile"
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>

            <label>
              表示順
              <input
                name="sort_order"
                type="number"
                defaultValue="0"
                style={inputStyle}
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
          <h2>登録済み劇団員</h2>

          {members.length === 0 ? (
            <div style={panelStyle}>劇団員データはまだありません。</div>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              {members.map((member) => (
                <article key={member.id} style={panelStyle}>
                  <form action={updateMember} style={formStyle}>
                    <input type="hidden" name="id" value={member.id} />

                    <label>
                      芸名
                      <input
                        name="stage_name"
                        defaultValue={member.stage_name ?? ""}
                        required
                        style={inputStyle}
                      />
                    </label>

                    <label>
                      役職
                      <input
                        name="role_name"
                        defaultValue={member.role_name ?? ""}
                        style={inputStyle}
                      />
                    </label>

                    <label>
                      プロフィール
                      <textarea
                        name="profile"
                        rows={5}
                        defaultValue={member.profile ?? ""}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </label>

                    <label>
                      表示順
                      <input
                        name="sort_order"
                        type="number"
                        defaultValue={member.sort_order ?? 0}
                        style={inputStyle}
                      />
                    </label>

                    <label>
                      <input
                        name="is_public"
                        type="checkbox"
                        defaultChecked={Boolean(member.is_public)}
                      />{" "}
                      公開
                    </label>

                    <AdminSubmitButton pendingLabel="保存中…" style={goldButton}>
                      保存
                    </AdminSubmitButton>
                  </form>

                  <form action={deleteMember} style={{ marginTop: 12 }}>
                    <input type="hidden" name="id" value={member.id} />
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
