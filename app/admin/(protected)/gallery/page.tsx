import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { GallerySearch } from "@/components/admin/GallerySearch";

export const dynamic = "force-dynamic";

type GalleryBucket = "gallery" | "gallery-private";
type GallerySupabaseClient = Awaited<ReturnType<typeof createClient>>;

function getGalleryMimeType(storagePath: string) {
  const extension = storagePath.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";

  return "application/octet-stream";
}

async function moveGalleryObject(
  supabase: GallerySupabaseClient,
  fromBucket: GalleryBucket,
  toBucket: GalleryBucket,
  storagePath: string,
) {
  const { data: file, error: downloadError } = await supabase.storage
    .from(fromBucket)
    .download(storagePath);

  if (downloadError) throw new Error(downloadError.message);

  const { error: uploadError } = await supabase.storage
    .from(toBucket)
    .upload(storagePath, file, {
      contentType: file.type || getGalleryMimeType(storagePath),
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { error: removeError } = await supabase.storage
    .from(fromBucket)
    .remove([storagePath]);

  if (removeError) {
    await supabase.storage.from(toBucket).remove([storagePath]);
    throw new Error(removeError.message);
  }
}


const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);


async function uploadPhoto(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const file = formData.get("file");

  if (!title || !(file instanceof File) || file.size === 0) {
    return;
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("JPEG・PNG・WebPの画像を選択してください。");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("画像は10MB以下にしてください。");
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

  const storagePath =
    `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("gallery-private")
    .upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { error: insertError } = await supabase
    .from("gallery")
    .insert({
      title,
      storage_path: storagePath,
      is_public: false,
      status: "pending",
    });

  if (insertError) {
    await supabase.storage.from("gallery-private").remove([storagePath]);
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

async function publishPhoto(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { data: photo, error: photoError } = await supabase
    .from("gallery")
    .select("id,storage_path,status,is_public")
    .eq("id", id)
    .single();

  if (photoError) throw new Error(photoError.message);

  if (photo.status === "published" && photo.is_public) return;

  await moveGalleryObject(
    supabase,
    "gallery-private",
    "gallery",
    photo.storage_path,
  );

  const { error } = await supabase
    .from("gallery")
    .update({
      status: "published",
      is_public: true,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    try {
      await moveGalleryObject(
        supabase,
        "gallery",
        "gallery-private",
        photo.storage_path,
      );
    } catch {}

    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

async function hidePhoto(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { data: photo, error: photoError } = await supabase
    .from("gallery")
    .select("id,storage_path,status,is_public")
    .eq("id", id)
    .single();

  if (photoError) throw new Error(photoError.message);

  if (photo.status === "published") {
    await moveGalleryObject(
      supabase,
      "gallery",
      "gallery-private",
      photo.storage_path,
    );
  }

  const { error } = await supabase
    .from("gallery")
    .update({
      status: "hidden",
      is_public: false,
    })
    .eq("id", id);

  if (error) {
    if (photo.status === "published") {
      try {
        await moveGalleryObject(
          supabase,
          "gallery-private",
          "gallery",
          photo.storage_path,
        );
      } catch {}
    }

    throw new Error(error.message);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

async function deletePhoto(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  const { data: photo, error: photoError } = await supabase
    .from("gallery")
    .select("id,storage_path,status")
    .eq("id", id)
    .single();

  if (photoError) throw new Error(photoError.message);

  const sourceBucket =
    photo.status === "published" ? "gallery" : "gallery-private";

  if (photo.storage_path) {
    const { error: removeError } = await supabase.storage
      .from(sourceBucket)
      .remove([photo.storage_path]);

    if (removeError) throw new Error(removeError.message);
  }

  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const q = String(resolvedSearchParams?.q || "").trim();
  const status = String(resolvedSearchParams?.status || "").trim();

  let photosQuery = supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    const safeQ = q.replace(/[,%()]/g, "");
    photosQuery = photosQuery.ilike("title", `%${safeQ}%`);
  }

  if (status === "published") {
    photosQuery = photosQuery.eq("status", "published");
  } else if (status === "hidden") {
    photosQuery = photosQuery.eq("status", "hidden");
  } else if (status === "pending") {
    photosQuery = photosQuery.eq("status", "pending");
  }

  const { data: photos, error } = await photosQuery;

  if (error) throw new Error(error.message);

  const photoUrls = new Map<string, string>();

  for (const photo of photos ?? []) {
    if (!photo.storage_path) continue;

    if (photo.status === "published") {
      const { data } = supabase.storage
        .from("gallery")
        .getPublicUrl(photo.storage_path);

      photoUrls.set(photo.id, data.publicUrl);
      continue;
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from("gallery-private")
      .createSignedUrl(photo.storage_path, 600);

    if (!signedUrlError && data?.signedUrl) {
      photoUrls.set(photo.id, data.signedUrl);
    }
  }

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

        
      <section
        style={{
          border: "1px solid #302b24",
          background: "#13110e",
          padding: 24,
          marginBottom: 40,
        }}
      >
        <h2 style={{ marginTop: 0 }}>新しい写真を追加</h2>

        <form
          action={uploadPhoto}
          style={{ display: "grid", gap: 16 }}
        >
          <label>
            タイトル
            <input
              type="text"
              name="title"
              required
              placeholder="例：8月公演 舞台写真"
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                padding: "12px 14px",
                background: "#080706",
                border: "1px solid #3a342c",
                color: "#eee7dc",
                fontSize: 16,
              }}
            />
          </label>

          <label>
            写真
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              required
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: 8,
                padding: 12,
                background: "#080706",
                border: "1px solid #3a342c",
                color: "#eee7dc",
              }}
            />
          </label>

          <p style={{ margin: 0, opacity: 0.7 }}>
            登録直後は非公開です。確認後に「公開」を押してください。
          </p>

          <AdminSubmitButton
            pendingLabel="アップロード中…"
            style={{
              padding: "14px 18px",
              background: "#d4a83d",
              color: "#080706",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            写真をアップロード
          </AdminSubmitButton>
        </form>
      </section>

      <GallerySearch initialQuery={q} initialStatus={status} />

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
              const imageUrl = photoUrls.get(photo.id) ?? "";

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
                      height: 180,
                      objectFit: "contain",
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
                        <AdminSubmitButton
                          pendingLabel="公開中…"
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
                        </AdminSubmitButton>
                      </form>
                    )}

                    {photo.status === "published" && (
                      <form action={hidePhoto}>
                        <input type="hidden" name="id" value={photo.id} />
                        <AdminSubmitButton
                          pendingLabel="変更中…"
                          style={{
                            padding: "10px 16px",
                            background: "transparent",
                            color: "#eee7dc",
                            border: "1px solid #706a62",
                            cursor: "pointer",
                          }}
                        >
                          非公開
                        </AdminSubmitButton>
                      </form>
                    )}

                    <form action={deletePhoto}>
                      <input type="hidden" name="id" value={photo.id} />
                      <input
                        type="hidden"
                        name="storage_path"
                        value={photo.storage_path}
                      />
                      <AdminSubmitButton
                        pendingLabel="削除中…"
                        style={{
                          padding: "10px 16px",
                          background: "transparent",
                          color: "#d77a70",
                          border: "1px solid #703a35",
                          cursor: "pointer",
                        }}
                      >
                        削除
                      </AdminSubmitButton>
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
