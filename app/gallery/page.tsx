import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FanPhotoSubmitForm } from "@/components/FanPhotoSubmitForm";
import { createClient as createPublicSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "写真｜劇団花吹雪" },
  description: "劇団花吹雪の公開写真をご覧いただけます。",
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/gallery",
    siteName: "劇団花吹雪",
    title: "写真｜劇団花吹雪",
    description: "劇団花吹雪の公開写真をご覧いただけます。",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "劇団花吹雪",
      },
    ],
  },
};

type GalleryPhoto = {
  id: string;
  title: string | null;
  storage_path: string;
  created_at: string | null;
  status: string | null;
  is_public: boolean | null;
};

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = [];
  const photoUrls = new Map<string, string>();

  try {
    const supabase = createPublicSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data, error } = await supabase
      .from("gallery")
      .select("id,title,storage_path,created_at,status,is_public")
      .eq("status", "published")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    photos = (data || []) as GalleryPhoto[];

    for (const photo of photos) {
      if (!photo.storage_path) continue;

      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(photo.storage_path);

      photoUrls.set(photo.id, publicUrlData.publicUrl);
    }
  } catch (error) {
    console.error("Gallery fetch error:", error);
    photos = [];
  }

  return (
    <>
      <Header />

      <main>
        <section className="schedule-hero">
          <p className="eyebrow">GALLERY</p>
          <h1>写真</h1>
          <p>劇団花吹雪の公開写真をご覧いただけます。</p>
        </section>

        <section className="section">
          <FanPhotoSubmitForm />

          {photos.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 360px))",
                gap: 24,
                justifyContent: "center",
                maxWidth: 1120,
                margin: "0 auto",
              }}
            >
              {photos.map((photo) => {
                const imageUrl = photoUrls.get(photo.id);

                if (!imageUrl) return null;

                return (
                  <article
                    key={photo.id}
                    className="card"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      src={imageUrl}
                      alt={photo.title || "劇団花吹雪 写真"}
                      loading="lazy"
                      style={{
                        display: "block",
                        width: "100%",
                        aspectRatio: "4 / 3",
                        objectFit: "contain",
                        background: "#000",
                      }}
                    />

                    <div style={{ paddingTop: 16 }}>
                      <h2 style={{ margin: 0, fontSize: 18 }}>
                        {photo.title || "劇団花吹雪"}
                      </h2>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <strong>現在、公開中の写真はありません。</strong>
              <p>写真は準備ができ次第、こちらでご案内します。</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
