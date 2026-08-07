import { Header } from "@/components/Header";
import { PerformanceCard, type Performance } from "@/components/PerformanceCard";
import { createClient } from "@/lib/supabase/server";
import { getJapanDateParts } from "@/lib/date";

export const revalidate = 60;

export default async function PerformancesPage() {
  const supabase = await createClient();
  const today = getJapanDateParts();
  const monthStart = `${today.year}-${String(today.month).padStart(2, "0")}-01`;
  const nextMonth = today.month === 12
    ? `${today.year + 1}-01-01`
    : `${today.year}-${String(today.month + 1).padStart(2, "0")}-01`;

  const { data } = await supabase
    .from("performances")
    .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title")
    .gte("performance_date", monthStart)
    .lt("performance_date", nextMonth)
    .order("performance_date");

  const performances = (data || []) as Performance[];

  return (
    <>
      <Header />
      <main>
        <section className="schedule-hero">
          <p className="eyebrow">PERFORMANCE SCHEDULE</p>
          <h1>公演予定</h1>
          <p>{today.year}年{today.month}月の公演情報です。</p>
        </section>

        <section className="section schedule-section">
          {performances.length > 0 ? (
            <div className="performance-grid">
              {performances.map((performance) => (
                <PerformanceCard key={performance.id} performance={performance} />
              ))}
            </div>
          ) : (
            <div className="empty-state">今月の公演情報はまだ登録されていません。</div>
          )}
        </section>
      </main>
    </>
  );
}
