import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();

    const { data } = await supabase
      .from("news")
      .select("id,category,title,body,published_at,status")
      .eq("status", "published")
      .order("published_at", { ascending: false });

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
