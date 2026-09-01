export const metadata: Metadata = {
  title: { absolute: "劇団花吹雪｜大衆演劇 公式サイト" },
  description: "劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。",
  alternates: { canonical: "/" },
  openGraph: { type:"website", locale:"ja_JP", url:"/", siteName:"劇団花吹雪", title:"劇団花吹雪｜大衆演劇 公式サイト", description:"劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。", images:[{url:"/opengraph-image",width:1200,height:630,alt:"劇団花吹雪"}] },
  twitter: { card:"summary_large_image", title:"劇団花吹雪｜大衆演劇 公式サイト", description:"劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。", images:["/opengraph-image"] },
};

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PerformanceCard, type Performance } from "@/components/PerformanceCard";
import { createClient as createPublicSupabaseClient } from "@supabase/supabase-js";
import { getJapanDateParts } from "@/lib/date";

import { NextPerformanceNotice } from "@/components/NextPerformanceNotice";
import { PERFORMANCE_VENUES } from "@/lib/performance-venues";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// HANABUKI_MONTHLY_VENUE_HELPERS
type VenueInfoEntry = {
  label: string;
  value: string;
};

function venueFieldLabel(key: string) {
  const normalized = key.toLowerCase().replace(/[_\-\s]/g, "");

  if (normalized.includes("url") || normalized.includes("website") || normalized.includes("maplink")) return null;
  if (normalized === "name" || normalized === "title" || normalized.includes("venuename")) return "公演先";
  if (normalized.includes("address")) return "住所";
  if (normalized.includes("reserv")) return "観劇予約";
  if (normalized.includes("phone") || normalized.includes("tel")) return "電話";
  if (normalized.includes("access")) return "アクセス";
  if (normalized.includes("time") || normalized.includes("hour") || normalized.includes("schedule")) return "公演時間";
  if (normalized.includes("guide") || normalized.includes("notice") || normalized.includes("highlight")) return "今月のご案内";
  if (normalized === "day" || normalized.includes("lunch") || normalized.includes("noon")) return "昼";
  if (normalized === "night" || normalized.includes("evening")) return "夜";

  return null;
}

function venueFieldValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (Array.isArray(value)) {
    const lines = value
      .map((item) => venueFieldValue(item))
      .filter((item): item is string => Boolean(item));
    return lines.length > 0 ? lines.join("\n") : null;
  }

  if (value && typeof value === "object") {
    const lines = Object.entries(value as Record<string, unknown>)
      .map(([key, nested]) => {
        const formatted = venueFieldValue(nested);
        if (!formatted) return null;
        const nestedLabel = venueFieldLabel(key);
        return nestedLabel ? `${nestedLabel}：${formatted}` : formatted;
      })
      .filter((item): item is string => Boolean(item));
    return lines.length > 0 ? lines.join("\n") : null;
  }

  return null;
}

function getVenueInfoEntries(venue: unknown): VenueInfoEntry[] {
  if (!venue || typeof venue !== "object") return [];

  const seen = new Set<string>();

  return Object.entries(venue as Record<string, unknown>)
    .map(([key, value]) => {
      const label = venueFieldLabel(key);
      const formatted = venueFieldValue(value);
      return label && formatted ? { label, value: formatted } : null;
    })
    .filter((entry): entry is VenueInfoEntry => Boolean(entry))
    .filter((entry) => {
      if (seen.has(entry.label)) return false;
      seen.add(entry.label);
      return true;
    });
}

const AUGUST_2026_TODAY_FALLBACK = {
  "2026-08-21": {
    id: "fallback-today-0821",
    performance_date: "2026-08-21",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "江戸の十手風",
    last_show_title: "月影舞華",
  },
  "2026-08-22": {
    id: "fallback-today-0822",
    performance_date: "2026-08-22",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "昼：恩愛二つ星／夜：刺青奇遇",
    last_show_title: "シャナナ",
  },
  "2026-08-23": {
    id: "fallback-today-0823",
    performance_date: "2026-08-23",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "花吹雪祭り",
    play_title: "昼：神奈川水滸伝／夜：三人吉三",
    last_show_title: "ジパングの風",
  },
  "2026-08-24": {
    id: "fallback-today-0824",
    performance_date: "2026-08-24",
    venue_name: "三吉演芸場",
    session_type: "休演",
    event_name: "休演日",
    play_title: null,
    last_show_title: null,
  },
  "2026-08-25": {
    id: "fallback-today-0825",
    performance_date: "2026-08-25",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "雪の夜話",
    last_show_title: "権八小紫",
  },
  "2026-08-26": {
    id: "fallback-today-0826",
    performance_date: "2026-08-26",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "故郷の峠",
    last_show_title: "伊達政宗",
  },
  "2026-08-27": {
    id: "fallback-today-0827",
    performance_date: "2026-08-27",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: "TAILCOAT × GEISHA",
    play_title: "下北の弥太郎",
    last_show_title: "HANABI",
  },
  "2026-08-28": {
    id: "fallback-today-0828",
    performance_date: "2026-08-28",
    venue_name: "三吉演芸場",
    session_type: "昼・夜",
    event_name: null,
    play_title: "恋貫き候",
    last_show_title: "飛行艇",
  },
  "2026-08-29": {
    id: "fallback-today-0829",
    performance_date: "2026-08-29",
    venue_name: "三吉演芸場",
    session_type: "昼一回",
    event_name: "関東大千穐楽",
    play_title: "流転兄弟花道",
    last_show_title: "アミーゴ",
  },
} as unknown as Record<string, Performance>;

function getCastRoleRank(roleName: string | null | undefined) {
  const role = roleName ?? "";
  if (role.includes("座長")) return 0;
  if (role.includes("花形")) return 1;
  if (role.includes("劇団員")) return 2;
  if (role.includes("サポート")) return 3;
  if (role.includes("裏方")) return 4;
  return 99;
}

export default async function HomePage() {
  const supabase = createPublicSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  const today = getJapanDateParts();

  const [{ data: todayData }, { data: upcomingData }, { data: members }, { data: works }, { data: galleryData }] = await Promise.all([
    supabase
      .from("performances")
      .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title")
      .eq("performance_date", today.iso)
      .maybeSingle(),
    supabase
      .from("performances")
      .select("id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title")
      .gt("performance_date", today.iso)
      .order("performance_date")
      .limit(5),
    supabase.from("members").select("*,photo_path").eq("is_public", true).order("sort_order"),
    supabase.from("works").select("*").eq("is_public", true).order("title").limit(6),
    supabase
      .from("gallery")
      .select("id,title,storage_path,created_at")
      .eq("is_public", true)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const todayPerformance =
    (todayData as Performance | null) ??
    AUGUST_2026_TODAY_FALLBACK[today.iso] ??
    null;
  const upcoming =
    upcomingData && upcomingData.length > 0
      ? (upcomingData as Performance[])
      : Object.values(AUGUST_2026_TODAY_FALLBACK)
          .filter((performance) => performance.performance_date > today.iso)
          .sort((a, b) => a.performance_date.localeCompare(b.performance_date))
          .slice(0, 5);


  const currentMonth = today.iso.slice(0, 7);
  const currentVenue =
    PERFORMANCE_VENUES[currentMonth as keyof typeof PERFORMANCE_VENUES];
  const currentVenueEntries = getVenueInfoEntries(currentVenue);

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <p>GEKIDAN HANAFUBUKI</p>
            <div className="hero-title-with-mark">
              <h1>劇団花吹雪</h1>
              <img
                className="hero-title-mark"
                src="/images/hanabuki-haru-mark.png"
                alt="春"
              />
            </div>
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
            <div className="empty-state">本日の公演情報はまだ登録されていません。
              <NextPerformanceNotice />
            </div>
          )}
        </section>

        <section className="section" id="monthly-venue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THIS MONTH</p>
              <h2>今月の公演情報</h2>
            </div>
            <a className="text-link" href={`/performances#month-${currentMonth}`}>月間予定を見る →</a>
          </div>

          {currentVenueEntries.length > 0 ? (
            <div
              style={{
                border: "1px solid #5b4720",
                background: "#13110e",
                padding: "24px",
              }}
            >
              <div style={{ display: "grid", gap: "0" }}>
                {currentVenueEntries.map((entry) => (
                  <div
                    key={entry.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px minmax(0, 1fr)",
                      gap: "16px",
                      padding: "12px 0",
                      borderBottom: "1px solid #302b24",
                    }}
                  >
                    <span style={{ color: "#aaa29a", fontSize: "13px" }}>{entry.label}</span>
                    <strong style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>{entry.value}</strong>
                  </div>
                ))}
              </div>

              {(currentVenue.websiteUrl || currentVenue.mapUrl) ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #302b24",
                  }}
                >
                  {currentVenue.websiteUrl ? (
                    <a
                      href={currentVenue.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "44px",
                        padding: "0 18px",
                        border: "1px solid #c79c38",
                        color: "#f2dfac",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      公式サイト
                    </a>
                  ) : null}

                  {currentVenue.mapUrl ? (
                    <a
                      href={currentVenue.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "44px",
                        padding: "0 18px",
                        border: "1px solid #c79c38",
                        color: "#f2dfac",
                        textDecoration: "none",
                        fontWeight: 700,
                      }}
                    >
                      地図を見る
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="empty-state">
              今月の会場情報は公演予定ページでご案内しています。
            </div>
          )}
        </section>



      <section className="section" id="hanabuki-today">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANABUKI GALLERY</p>
            <h2>花吹雪ギャラリー</h2>
          </div>
        </div>
        {(galleryData ?? []).length > 0 ? (
          <div className="hanabuki-gallery-grid">
            {(galleryData ?? []).map((photo) => (
              <article className="hanabuki-gallery-card" key={photo.id}>
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${photo.storage_path}`}
                  alt={photo.title || "投稿写真"}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
              <strong>舞台写真</strong>
              <p>舞台写真は順次掲載しています。</p>
            </div>
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
          <div className="cast-heading-with-signature">
              <h2>劇団員紹介</h2>
              <img
                className="cast-heading-signature"
                src="/images/harunojo-signature.png"
                alt="桜春之丞 サイン"
              />
            </div>
          <div className="grid members-grid">
            {((members && members.length > 0)
              ? members
              : [
                  {
                    id: "fallback-harunojo",
                    role_name: "劇団花吹雪 座長",
                    stage_name: "桜春之丞",
                    profile: "劇団花吹雪 座長",
                  },
                ]
            ).slice().sort((a, b) => getCastRoleRank(a.role_name) - getCastRoleRank(b.role_name)).map((member) => (
              <article className="card member-card" key={member.id}>
                {member.photo_path ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${member.photo_path}`}
                    alt={`${member.stage_name}の写真`}
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "4 / 5",
                      objectFit: "cover",
                      objectPosition: "top center",
                      marginBottom: 18,
                      border: "1px solid #302b24",
                    }}
                  />
                ) : null}
                <small>{member.role_name}</small>
                <h3>{member.stage_name}</h3>
                {member.profile && member.profile !== "プロフィール準備中" && <p>{member.profile}</p>}
              </article>
            ))}
          </div>
        </section>

</main>
    </>
  );
}
