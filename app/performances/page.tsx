import type { Metadata } from "next";

import { Header } from "@/components/Header";
import { PerformanceVenueCard } from "@/components/PerformanceVenueCard";
import { PERFORMANCE_VENUES } from "@/lib/performance-venues";
import {
  PerformanceCard,
  type Performance,
} from "@/components/PerformanceCard";
import { createClient } from "@/lib/supabase/server";

import { getPerformanceVenueMap } from "@/lib/performance-venue-cms";
export const metadata: Metadata = {
  title: {
    absolute: "公演予定 | 劇団花吹雪",
  },
  description:
    "劇団花吹雪の公演予定。公演日、劇場、芝居、ラストショー、イベント・ゲスト情報を掲載しています。",
  alternates: {
    canonical: "/performances",
  },
};

export const dynamic = "force-dynamic";

function getJapanToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function shiftMonth(month: string, amount: number) {
  const [year, monthNumber] = month.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, monthNumber - 1 + amount, 1),
  );

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

function monthLabel(month: string, currentYear: string) {
  const [year, monthNumber] = month.split("-");

  return year === currentYear
    ? `${Number(monthNumber)}月`
    : `${year}年${Number(monthNumber)}月`;
}

export default async function PerformancesPage() {
  const performanceVenues = await getPerformanceVenueMap();

  const today = getJapanToday();
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);
  const nextMonth = shiftMonth(currentMonth, 1);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("performances")
    .select(
      "id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title,has_first_part,is_public",
    )
    .eq("is_public", true)
    .gte("performance_date", today)
    .order("performance_date", {
      ascending: true,
    })
    .limit(400);

  if (error) {
    console.error("Performances fetch error:", error.message);
  }

  const performances = (data ?? []) as Performance[];

  const performanceMonths = performances.map(
    (performance) =>
      performance.performance_date.slice(0, 7),
  );

  const venueMonths = Object.keys(
    performanceVenues,
  ).filter((month) => month >= currentMonth);

  const monthKeys = Array.from(
    new Set([
      ...performanceMonths,
      ...venueMonths,
    ]),
  ).sort();

  const performancesByMonth = new Map<string, Performance[]>();

  for (const month of monthKeys) {
    performancesByMonth.set(
      month,
      performances.filter((performance) =>
        performance.performance_date.startsWith(month),
      ),
    );
  }

  const currentMonthExists = monthKeys.includes(currentMonth);
  const nextMonthExists = monthKeys.includes(nextMonth);
  return (
    <>
      <Header />

      <main>
        <section className="schedule-hero">
          <p className="eyebrow">PERFORMANCE SCHEDULE</p>
          <h1>公演予定</h1>
        <div
          data-hanabuki-public-notice
          style={{
            margin: "14px 0 24px",
            padding: "14px 16px",
            border: "1px solid #ead8dc",
            background: "rgba(255,255,255,0.68)",
            color: "#72545b",
            fontSize: "13px",
            lineHeight: 1.8,
          }}
        >
          <div>※演目・出演者・公演内容は、都合により予告なく変更となる場合がございます。</div>
          <div>※終演時間は公演内容により異なります。</div>
        </div>

          <p>劇団花吹雪の今後の公演予定をご案内します。</p>
        </section>

        <section className="section">
          {performances.length > 0 ? (
            <>
              <nav
                className="performance-month-navigation"
                aria-label="公演予定の月選択"
              >
                <div className="performance-quick-links">
                  {currentMonthExists ? (
                    <a
                      href={`#month-${currentMonth}`}
                      className="performance-quick-button performance-quick-button-primary"
                    >
                      今月
                    </a>
                  ) : (
                    <span className="performance-quick-button performance-quick-button-disabled">
                      今月
                    </span>
                  )}

                  {nextMonthExists ? (
                    <a
                      href={`#month-${nextMonth}`}
                      className="performance-quick-button"
                    >
                      翌月
                    </a>
                  ) : (
                    <span className="performance-quick-button performance-quick-button-disabled">
                      翌月
                    </span>
                  )}
                </div>

                <div className="performance-month-tabs">
                  {monthKeys.map((month) => (
                    <a
                      key={month}
                      href={`#month-${month}`}
                      className="performance-month-tab"
                    >
                      {monthLabel(month, currentYear)}
                    </a>
                  ))}
                </div>
              </nav>

              <div className="performance-month-groups">
                {monthKeys.map((month) => {
                  const monthPerformances =
                    performancesByMonth.get(month) ?? [];

                  return (
                    <section
                      key={month}
                      id={`month-${month}`}
                      className="performance-month-section"
                    >
                      <div className="performance-month-heading">
                        <span>{monthLabel(month, currentYear)}</span>
                        <small>{(monthPerformances.length) > 0 ? `${monthPerformances.length}日分` : ""}</small>
                      </div>

                      {performanceVenues[month] ? (
                        <PerformanceVenueCard
                          venue={performanceVenues[month]}
                        />
                      ) : null}

                      {monthPerformances.length === 0 ? (
                        <div className="empty-state">
                          <p>
                            演目・日程は決まり次第掲載します。
                          </p>
                        </div>
                      ) : null}

                      <div className="schedule-grid">
                        {monthPerformances.map((performance) => (
                          <PerformanceCard
                            key={performance.id}
                            performance={performance}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <strong>現在、今後の公演予定はありません。</strong>
              <p>
                新しい予定が決まり次第、こちらでご案内します。
              </p>
            </div>
          )}
        </section>
      </main>

      <style>{`
        .performance-month-navigation {
          position: sticky;
          top: 0;
          z-index: 20;
          margin-bottom: 32px;
          padding: 14px 0;
          background: rgba(8, 7, 6, 0.96);
        }

        .performance-quick-links {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }

        .performance-quick-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 92px;
          min-height: 46px;
          padding: 0 18px;
          border: 1px solid #d4a83d;
          color: #eee7dc;
          background: transparent;
          font-weight: 700;
          text-decoration: none;
        }

        .performance-quick-button-primary {
          color: #080706;
          background: #d9ad3d;
        }

        .performance-quick-button-disabled {
          opacity: 0.35;
        }

        .performance-month-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 0 8px;
          -webkit-overflow-scrolling: touch;
        }

        .performance-month-tab {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 72px;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid #4c4030;
          background: #13110e;
          color: #d9c18a;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .performance-month-section {
          scroll-margin-top: 145px;
          margin-bottom: 48px;
        }

        .performance-month-heading {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin: 0 0 18px;
          padding-bottom: 10px;
          border-bottom: 1px solid #3a342c;
          color: #d9ad3d;
        }

        .performance-month-heading span {
          font-size: 28px;
          font-weight: 700;
        }

        .performance-month-heading small {
          color: #8f877d;
          font-size: 13px;
        }

        @media (max-width: 760px) {
          .performance-month-navigation {
            padding-top: 10px;
          }

          .performance-quick-links {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .performance-quick-button {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            min-height: 50px;
            font-size: 16px;
          }

          .performance-month-tabs {
            gap: 7px;
          }

          .performance-month-tab {
            min-width: 68px;
            min-height: 44px;
            padding: 0 14px;
            font-size: 15px;
          }

          .performance-month-section {
            scroll-margin-top: 150px;
            margin-bottom: 38px;
          }

          .performance-month-heading span {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}
