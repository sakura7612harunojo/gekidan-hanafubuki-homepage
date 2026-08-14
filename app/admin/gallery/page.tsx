import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

async function publishPhoto(formData: FormData) {
  "use server";

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("gallery")
    .update({
      status: "published",
      is_public: true,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

async function hidePhoto(formData: FormData) {
  "use server";

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");

  const { error } = await supabase
    .from("gallery")
    .update({
      status: "hidden",
      is_public: false,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

async function deletePhoto(formData: FormData) {
  "use server";

  const supabase = createAdminClient();
  const id = String(formData.get("id") || "");
  const storagePath = String(formData.get("storage_path") || "");

  if (storagePath) {
    await supabase.storage.from("gallery").remove([storagePath]);
  }

  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export default async function AdminGalleryPage() {
  const supabase = createAdminClient();

  const { data: photos, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080706",
        color: "#eee7dc",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p
          style={{
            color: "#d4a83d",
            letterSpacing: "0.2em",
            fontSize: 12,
          }}
        >
          GALLERY CMS
        </p>

        <h1 style={{ fontSize: 36, marginBottom: 8 }}>投稿写真管理</h1>

        <p style={{ color: "#aaa29a", marginBottom: 32 }}>
          ファン投稿は保留状態で届きます。確認後に公開・非公開を管理できます。
        </p>

        {!photos || photos.length === 0 ? (
          <div
            style={{
              border: "1px solid #302b24",
              background: "#13110e",
              padding: 28,
            }}
          >
            まだ投稿写真はありません。
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {photos.map((photo) => {
              const { data } = supabase.storage
                .from("gallery")
                .getPublicUrl(photo.storage_path);

              const imageUrl = data.publicUrl;

              return (
                <article
                  key={photo.id}
                  style={{
                    border: "1px solid #302b24",
                    background: "#13110e",
                    padding: 16,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={photo.title || "投稿写真"}
                    style={{
                      width: "100%",
                      height: 260,
                      objectFit: "cover",
                      display: "block",
                      marginBottom: 16,
                      background: "#000",
                    }}
                  />

                  <div style={{ marginBottom: 12 }}>
                    <strong>{photo.title || "投稿写真"}</strong>
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#aaa29a",
                      lineHeight: 1.8,
                      marginBottom: 16,
                    }}
                  >
                    <div>投稿者：{photo.submitted_by || "fan"}</div>
                    <div>状態：{photo.status}</div>
                    <div>
                      投稿日：
                      {photo.created_at
                        ? new Date(photo.created_at).toLocaleString("ja-JP")
                        : "-"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {photo.status !== "published" && (
                      <form action={publishPhoto}>
                        <input type="hidden" name="id" value={photo.id} />
                        <button
                          type="submit"
                          style={{
                            padding: "10px 16px",
                            background: "#d4a83d",
                            color: "#080706",
                            border: 0,
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          公開
                        </button>
                      </form>
                    )}

                    {photo.status === "published" && (
                      <form action={hidePhoto}>
                        <input type="hidden" name="id" value={photo.id} />
                        <button
                          type="submit"
                          style={{
                            padding: "10px 16px",
                            background: "transparent",
                            color: "#eee7dc",
                            border: "1px solid #706a62",
                            cursor: "pointer",
                          }}
                        >
                          非公開
                        </button>
                      </form>
                    )}

                    <form action={deletePhoto}>
                      <input type="hidden" name="id" value={photo.id} />
                      <input
                        type="hidden"
                        name="storage_path"
                        value={photo.storage_path}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "10px 16px",
                          background: "transparent",
                          color: "#d77a70",
                          border: "1px solid #703a35",
                          cursor: "pointer",
                        }}
                      >
                        削除
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
