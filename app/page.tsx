import { Header } from "@/components/Header";
import { PerformanceCard, type Performance } from "@/components/PerformanceCard";
import { createClient } from "@/lib/supabase/server";
import { getJapanDateParts } from "@/lib/date";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const today = getJapanDateParts();

  const [{ data: todayData }, { data: upcomingData }, { data: members }, { data: works }, { data: galleryData }] = await Promise.all([
    supabase
      .from("performances")
      .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title")
      .eq("performance_date", today.iso)
      .maybeSingle(),
    supabase
      .from("performances")
      .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title")
      .gt("performance_date", today.iso)
      .order("performance_date")
      .limit(5),
    supabase.from("members").select("*").eq("is_public", true).order("sort_order"),
    supabase.from("works").select("*").eq("is_public", true).order("title").limit(6),
    supabase
      .from("gallery")
      .select("id,title,storage_path,created_at")
      .eq("is_public", true)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const todayPerformance = todayData as Performance | null;
  const upcoming = (upcomingData || []) as Performance[];

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <p>GEKIDAN HANAFUBUKI</p>
            <h1>劇団花吹雪</h1>
            <p className="lead">華やかな舞踊と、人の情を描く芝居。劇場でしか味わえない舞台をお届けします。</p>
            <div className="actions">
              <a className="btn primary" href="#today">本日の公演</a>
              <a className="btn" href="/performances">公演予定</a>
            </div>
          </div>
        </section>

        <section className="section today-section" id="today">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TODAY&apos;S STAGE</p>
              <h2>本日の公演</h2>
            </div>
            <time className="today-date" dateTime={today.iso}>{today.month}月{today.day}日</time>
          </div>
          {todayPerformance ? (
            <PerformanceCard performance={todayPerformance} featured />
          ) : (
            <div className="empty-state">本日の公演情報はまだ登録されていません。</div>
          )}
        </section>

      <section className="section" id="hanabuki-today">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TODAY&apos;S HANABUKI</p>
            <h2>今日の花吹雪</h2>
          </div>
        </div>
        {(galleryData ?? []).length > 0 ? (
          <div className="grid">
            {(galleryData ?? []).map((photo) => (
              <article className="card" key={photo.id}>
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${photo.storage_path}`}
                  alt={photo.title || "投稿写真"}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <h3>{photo.title || "投稿写真"}</h3>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">写真はまだありません。</div>
        )}
      </section>

      <section className="section upcoming-section" id="schedule">
          <div className="section-heading">
            <div>
              <p className="eyebrow">UPCOMING STAGES</p>
              <h2>近日の公演</h2>
            </div>
            <a className="text-link" href="/performances">月間予定を見る →</a>
          </div>
          {upcoming.length > 0 ? (
            <div className="performance-grid upcoming-grid">
              {upcoming.map((performance) => (
                <PerformanceCard key={performance.id} performance={performance} />
              ))}
            </div>
          ) : (
            <div className="empty-state">近日の公演情報はまだ登録されていません。</div>
          )}
        </section>

        <section className="section" id="cast">
          <p className="eyebrow">CAST</p>
          <h2>劇団員紹介</h2>
          <div className="grid">
            {(members || []).map((member) => (
              <article className="card" key={member.id}>
                <small>{member.role_name}</small>
                <h3>{member.stage_name}</h3>
                <p>{member.profile || "プロフィール準備中"}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="repertoire">
          <p className="eyebrow">REPERTOIRE</p>
          <h2>演目紹介</h2>
          <div className="grid">
            {(works || []).map((work) => (
              <article className="card" key={work.id}>
                <small>{work.work_type}</small>
                <h3>{work.title}</h3>
                <p>{work.summary || "作品紹介準備中"}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
