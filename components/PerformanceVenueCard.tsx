import type {
  PerformanceVenueInfo,
} from "@/lib/performance-venues";

export function PerformanceVenueCard({
  venue,
}: {
  venue: PerformanceVenueInfo;
}) {
  return (
    <aside className="venue-info-card">
      <style>{`
        .venue-info-card {
          margin: 0 0 22px;
          padding: 20px;
          border: 1px solid #4a4032;
          background:
            linear-gradient(
              145deg,
              #17130d,
              #0d0b09
            );
        }

        .venue-info-eyebrow {
          margin: 0 0 8px;
          color: #d4a83d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .venue-info-name {
          margin: 0 0 14px;
          color: #eee7dc;
          font-size: 23px;
        }

        .venue-info-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 14px 24px;
        }

        .venue-info-item {
          color: #c8c0b6;
          font-size: 14px;
          line-height: 1.7;
        }

        .venue-info-label {
          display: block;
          margin-bottom: 3px;
          color: #8f877d;
          font-size: 11px;
          font-weight: 800;
        }

        .venue-info-special {
          margin: 18px 0 0;
          padding: 14px;
          border-left: 3px solid #d4a83d;
          background: #0a0907;
        }

        .venue-info-special p {
          margin: 5px 0;
          color: #eee7dc;
          font-size: 14px;
        }

        .venue-info-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .venue-info-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid #d4a83d;
          color: #eee7dc;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .venue-info-card {
            padding: 16px;
          }

          .venue-info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .venue-info-name {
            font-size: 20px;
          }

          .venue-info-button {
            flex: 1 1 auto;
          }
        }
      `}</style>

      <p className="venue-info-eyebrow">
        PERFORMANCE VENUE
      </p>

      <h3 className="venue-info-name">
        {venue.name}
      </h3>

      <div className="venue-info-grid">
        <div className="venue-info-item">
          <span className="venue-info-label">
            住所
          </span>
          {venue.address}
        </div>

        {venue.access ? (
          <div className="venue-info-item">
            <span className="venue-info-label">
              アクセス
            </span>
            {venue.access}
          </div>
        ) : null}

        {venue.tel ? (
          <div className="venue-info-item">
            <span className="venue-info-label">
              電話
            </span>
            <a
              href={`tel:${venue.tel}`}
              style={{ color: "#d9c18a" }}
            >
              {venue.tel}
            </a>
          </div>
        ) : null}

        {venue.reservationTel ? (
          <div className="venue-info-item">
            <span className="venue-info-label">
              観劇予約
            </span>
            <a
              href={`tel:${venue.reservationTel}`}
              style={{ color: "#d9c18a" }}
            >
              {venue.reservationTel}
            </a>
          </div>
        ) : null}

        {venue.schedule?.length ? (
          <div className="venue-info-item">
            <span className="venue-info-label">
              公演時間
            </span>

            {venue.schedule.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ) : null}
      </div>

      {venue.specialDates?.length ? (
        <div className="venue-info-special">
          <span className="venue-info-label">
            今月のご案内
          </span>

          {venue.specialDates.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      <div className="venue-info-actions">
        {venue.websiteUrl ? (
          <a
            className="venue-info-button"
            href={venue.websiteUrl}
            target="_blank"
            rel="noreferrer"
          >
            公式サイト
          </a>
        ) : null}

        {venue.mapUrl ? (
          <a
            className="venue-info-button"
            href={venue.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            地図を見る
          </a>
        ) : null}
      </div>
    </aside>
  );
}
