export const metadata: Metadata = {
  title: { absolute: "お知らせ｜劇団花吹雪" },
  description: "劇団花吹雪からのお知らせ・最新情報を掲載しています。公演、イベント、ゲスト出演などの情報をご確認いただけます。",
  alternates: { canonical: "/news" },
  openGraph: { type:"website", locale:"ja_JP", url:"/news", siteName:"劇団花吹雪", title:"お知らせ｜劇団花吹雪", description:"劇団花吹雪からのお知らせ・最新情報を掲載しています。公演、イベント、ゲスト出演などの情報をご確認いただけます。", images:[{url:"/opengraph-image",width:1200,height:630,alt:"劇団花吹雪"}] },
  twitter: { card:"summary_large_image", title:"お知らせ｜劇団花吹雪", description:"劇団花吹雪からのお知らせ・最新情報を掲載しています。公演、イベント、ゲスト出演などの情報をご確認いただけます。", images:["/opengraph-image"] },
};

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { createClient as createPublicSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type NewsItem = {
  id: string;
  category: string | null;
  title: string;
  body: string | null;
  published_at: string | null;
  status: string | null;
};

export default async function NewsPage() {
  let news: NewsItem[] = [];

  try {
    const supabase = createPublicSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data, error } = await supabase
      .from("news")
      .select("id,category,title,body,published_at,status")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("News fetch error:", error.message);
      throw error;
    }

    news = (data || []) as NewsItem[];
  } catch {
    news = [];
  }

  return (
    <>
      <Header />

      <main>
        <section className="schedule-hero">
          <p className="eyebrow">NEWS</p>
          <h1>お知らせ</h1>
          <p>劇団花吹雪からのお知らせをご案内します。</p>
        </section>

        <section className="section">
          {news.length > 0 ? (
            <div className="grid">
              {news.map((item) => (
                <article className="card" key={item.id}>
                  <small>{item.category || "お知らせ"}</small>

                  <h2>{item.title}</h2>

                  {item.published_at ? (
                    <p>
                      {String(item.published_at).slice(0, 10).replaceAll("-", ".")}
                    </p>
                  ) : null}

                  {item.body ? (
                    <p style={{ whiteSpace: "pre-wrap" }}>{item.body}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <strong>現在、お知らせはありません。</strong>
              <p>最新情報はこちらでご案内します。</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
