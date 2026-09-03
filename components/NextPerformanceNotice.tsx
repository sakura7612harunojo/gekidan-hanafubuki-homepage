import {
  PerformanceCard,
  type Performance,
} from "@/components/PerformanceCard";

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

type NextPerformanceNoticeProps = {
  performance: Performance | null | undefined;
};

export function NextPerformanceNotice({
  performance,
}: NextPerformanceNoticeProps) {
  if (!performance) {
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
        {formatDate(performance.performance_date)}
      </p>

      <PerformanceCard
        performance={performance}
      />
    </section>
  );
}
