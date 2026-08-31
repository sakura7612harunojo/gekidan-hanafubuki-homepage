import {
  PerformanceCard,
  type Performance,
} from "@/components/PerformanceCard";

import { createClient } from "@/lib/supabase/server";

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(
    new Date(`${date}T00:00:00+09:00`),
  );
}

export async function NextPerformanceNotice() {
  const today = getJapanToday();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("performances")
    .select(
      "id,performance_date,venue_name,session_type,event_name,play_title,last_show_title,night_show_title,has_first_part,is_public",
    )
    .eq("is_public", true)
    .gt("performance_date", today)
    .order("performance_date", {
      ascending: true,
    })
    .limit(1);

  if (error) {
    console.error(
      "Next performance fetch error:",
      error.message,
    );
    return null;
  }

  const nextPerformance =
    (data?.[0] ?? null) as Performance | null;

  if (!nextPerformance) {
    return null;
  }

  return (
    <section className="next-stage-box">
      <style>{`
        .next-stage-box {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #3a342c;
          text-align: left;
        }

        .next-stage-label {
          margin: 0 0 8px;
          color: #d4a83d;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .next-stage-title {
          margin: 0 0 8px;
          color: #eee7dc;
          font-size: 26px;
          font-weight: 700;
        }

        .next-stage-date {
          margin: 0 0 18px;
          color: #d9c18a;
          font-size: 17px;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .next-stage-box {
            margin-top: 20px;
            padding-top: 20px;
          }

          .next-stage-title {
            font-size: 22px;
          }
        }
      `}</style>

      <p className="next-stage-label">
        NEXT STAGE
      </p>

      <h3 className="next-stage-title">
        次回公演
      </h3>

      <p className="next-stage-date">
        {formatDate(nextPerformance.performance_date)}
      </p>

      <PerformanceCard
        performance={nextPerformance}
      />
    </section>
  );
}
