import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { MembersSearch } from "@/components/admin/MembersSearch";

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

  if (error) {
    if (error.code === "23505") {
      revalidatePath("/admin/members");
      revalidatePath("/");
      return;
    }

    throw new Error(error.message);
  }

  revalidatePath("/admin/members");
  revalidatePath("/");
}

async function updateMember(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { data: current, error: currentError } = await supabase
    .from("members")
    .select("role_name,profile,photo_path")
    .eq("id", id)
    .single();

  if (currentError) throw new Error(currentError.message);

  const { error } = await supabase
    .from("members")
    .update({
      stage_name: String(formData.get("stage_name") || "").trim(),
      role_name: formData.has("role_name")
        ? String(formData.get("role_name") ?? "").trim()
        : current.role_name ?? "",
      profile: formData.has("profile")
        ? String(formData.get("profile") ?? "").trim()
        : current.profile ?? "",
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


async function updateMemberPhoto(formData: FormData) {
  "use server";

  const memberId = String(formData.get("member_id") ?? "");
  const photo = formData.get("member_photo");

  if (!memberId) {
    throw new Error("劇団員IDがありません。");
  }

  if (!(photo instanceof File) || photo.size === 0) {
    throw new Error("写真を選択してください。");
  }

  if (!photo.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください。");
  }

  if (photo.size > 10 * 1024 * 1024) {
    throw new Error("写真は10MB以下にしてください。");
  }

  const supabase = await createClient();
  const safeName = (photo.name || "member-photo")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");
  const photoPath = `members/${memberId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(photoPath, photo, {
      contentType: photo.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { error: updateError } = await supabase
    .from("members")
    .update({ photo_path: photoPath })
    .eq("id", memberId);

  if (updateError) {
    await supabase.storage.from("gallery").remove([photoPath]);
    throw new Error(updateError.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/members");
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const q = String(resolvedSearchParams?.q || "").trim();

  let membersQuery = supabase
    .from("members")
    .select("id,stage_name,role_name,profile,sort_order,is_public,photo_path")
    .order("sort_order")
    .order("stage_name");

  if (q) {
    const safeQ = q.replace(/[,%()]/g, "");
    membersQuery = membersQuery.or(
      `stage_name.ilike.%${safeQ}%,role_name.ilike.%${safeQ}%`
    );
  }

  const { data } = await membersQuery;
  const members = data || [];

  return (
    <main className="admin-simple-shell">
      <section className="admin-simple-panel">
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

          <MembersSearch initialQuery={q} />

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
                
                {member.photo_path ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${member.photo_path}`}
                    alt={`${member.stage_name}の写真`}
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: 320,
                      height: "auto",
                      marginTop: 18,
                      border: "1px solid #39342c",
                    }}
                  />
                ) : (
                  <p style={{ marginTop: 18, color: "#aaa29a" }}>写真未登録</p>
                )}

                <form
                  action={updateMemberPhoto}
                  style={{
                    ...formStyle,
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: "1px solid #302b24",
                  }}
                >
                  <input type="hidden" name="member_id" value={member.id} />
                  <label>
                    写真
                    <input
                      name="member_photo"
                      type="file"
                      accept="image/*"
                      required
                      style={inputStyle}
                    />
                  </label>
                  <AdminSubmitButton pendingLabel="保存中…" style={goldButton}>
                    写真を保存
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
