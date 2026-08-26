import { Header } from "@/components/Header";
import { PerformanceCard, type Performance } from "@/components/PerformanceCard";
import { createClient } from "@/lib/supabase/server";
import { getJapanDateParts } from "@/lib/date";


const AUGUST_2026_FALLBACK = [
  {
    id: "fallback-0801",
    performance_date: "2026-08-01",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "初日",
    play_title: "昼：花笠文治／夜：釣忍",
    last_show_title: "CALL CALL CALL!",
  },
  {
    id: "fallback-0802",
    performance_date: "2026-08-02",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "昼：鼠小僧と白鷺銀次／夜：江戸の華",
    last_show_title: "BLIZZARD",
  },
  {
    id: "fallback-0803",
    performance_date: "2026-08-03",
    venue_name: "三吉演芸場",
    session_type: "休演",
    event_name: "休演日",
    play_title: null,
    last_show_title: null,
  },
  {
    id: "fallback-0804",
    performance_date: "2026-08-04",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "源太の情け",
    last_show_title: "サンバDEわっしょい",
  },
  {
    id: "fallback-0805",
    performance_date: "2026-08-05",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "盲目の剣士",
    last_show_title: "真夜中過ぎの恋",
  },
  {
    id: "fallback-0806",
    performance_date: "2026-08-06",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "月の浜町岸",
    last_show_title: "俺は最高",
  },
  {
    id: "fallback-0807",
    performance_date: "2026-08-07",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "小鉄と金五郎",
    last_show_title: "鬼の宴",
  },
  {
    id: "fallback-0808",
    performance_date: "2026-08-08",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "花吹雪レビュー",
    play_title: "昼：波止場の狼／夜：瞼の母",
    last_show_title: "Beautiful Gorgeous Love",
  },
  {
    id: "fallback-0809",
    performance_date: "2026-08-09",
    venue_name: "三吉演芸場",
    session_type: "昼一回",
    event_name: "春＆京祭り（1部女舞踊・3部男舞踊）",
    play_title: "河内の兄弟",
    last_show_title: "夢神輿",
  },
  {
    id: "fallback-0810",
    performance_date: "2026-08-10",
    venue_name: "三吉演芸場",
    session_type: "休演",
    event_name: "休演日",
    play_title: null,
    last_show_title: null,
  },
  {
    id: "fallback-0811",
    performance_date: "2026-08-11",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "昼：かんざし／夜：千の風になって",
    last_show_title: "JUST BEGUN",
  },
  {
    id: "fallback-0812",
    performance_date: "2026-08-12",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "黒船ヤクザ",
    last_show_title: "阿国恋姿",
  },
  {
    id: "fallback-0813",
    performance_date: "2026-08-13",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "上州土産百両首",
    last_show_title: "PAN DE MIC",
  },
  {
    id: "fallback-0814",
    performance_date: "2026-08-14",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "人生無情",
    last_show_title: "男道",
  },
  {
    id: "fallback-0815",
    performance_date: "2026-08-15",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "浴衣祭り",
    play_title: "昼：馬の足玉三郎／夜：太助と家光",
    last_show_title: "夏祭り",
  },
  {
    id: "fallback-0816",
    performance_date: "2026-08-16",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "昼：華の舞／夜：幸助餅",
    last_show_title: "DANCE DANCE DANCE",
  },
  {
    id: "fallback-0817",
    performance_date: "2026-08-17",
    venue_name: "三吉演芸場",
    session_type: "休演",
    event_name: "休演日",
    play_title: null,
    last_show_title: null,
  },
  {
    id: "fallback-0818",
    performance_date: "2026-08-18",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "八咫烏の政",
    last_show_title: "博多人形",
  },
  {
    id: "fallback-0819",
    performance_date: "2026-08-19",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "笹川の花会",
    last_show_title: "SHIRANAMI",
  },
  {
    id: "fallback-0820",
    performance_date: "2026-08-20",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "喧嘩屋の恋",
    last_show_title: "愛の言霊",
  },
  {
    id: "fallback-0821",
    performance_date: "2026-08-21",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "江戸の十手風",
    last_show_title: "月影舞華",
  },
  {
    id: "fallback-0822",
    performance_date: "2026-08-22",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "昼：恩愛二つ星／夜：刺青奇遇",
    last_show_title: "シャナナ",
  },
  {
    id: "fallback-0823",
    performance_date: "2026-08-23",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "花吹雪祭り",
    play_title: "昼：神奈川水滸伝／夜：三人吉三",
    last_show_title: "ジパングの風",
  },
  {
    id: "fallback-0824",
    performance_date: "2026-08-24",
    venue_name: "三吉演芸場",
    session_type: "休演",
    event_name: "休演日",
    play_title: null,
    last_show_title: null,
  },
  {
    id: "fallback-0825",
    performance_date: "2026-08-25",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "雪の夜話",
    last_show_title: "権八小紫",
  },
  {
    id: "fallback-0826",
    performance_date: "2026-08-26",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "故郷の峠",
    last_show_title: "伊達政宗",
  },
  {
    id: "fallback-0827",
    performance_date: "2026-08-27",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "TAILCOAT × GEISHA",
    play_title: "下北の弥太郎",
    last_show_title: "HANABI",
  },
  {
    id: "fallback-0828",
    performance_date: "2026-08-28",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "恋貫き候",
    last_show_title: "飛行艇",
  },
  {
    id: "fallback-0829",
    performance_date: "2026-08-29",
    venue_name: "三吉演芸場",
    session_type: "昼一回",
    event_name: "関東大千穐楽",
    play_title: "流転兄弟花道",
    last_show_title: "アミーゴ",
  },
] as unknown as Performance[];

export const revalidate = 60;

export default async function PerformancesPage() {
  const supabase = await createClient();
  const today = getJapanDateParts();
  const monthStart = `${today.year}-${String(today.month).padStart(2, "0")}-01`;
  const rangeEndDate = new Date(Date.UTC(today.year, today.month + 1, 1));
  const nextMonth = `${rangeEndDate.getUTCFullYear()}-${String(
    rangeEndDate.getUTCMonth() + 1
  ).padStart(2, "0")}-01`;

  const { data } = await supabase
    .from("performances")
    .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title")
    .gte("performance_date", monthStart)
    .lt("performance_date", nextMonth)
    .order("performance_date");

  const performances =
    data && data.length > 0
      ? (data as Performance[])
      : today.year === 2026 && today.month === 8
        ? AUGUST_2026_FALLBACK
        : [];

  return (
    <>
      <Header />
      <main>
        <section className="schedule-hero">
          <p className="eyebrow">PERFORMANCE SCHEDULE</p>
          <h1>公演予定</h1>
          <p>今月・翌月の公演情報です。</p>
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
