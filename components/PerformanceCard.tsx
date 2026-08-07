import { formatPerformanceDate } from "@/lib/date";

export type Performance = {
  id: string;
  performance_date: string;
  venue_name: string;
  session_type: string;
  event_name: string | null;
  play_title: string | null;
  last_show_title: string | null;
};

type Props = {
  performance: Performance;
  featured?: boolean;
};

function splitPlayTitle(title: string | null) {
  if (!title) return [];
  const normalized = title.replace(/／夜[:：]?/g, "|夜|").replace(/昼[:：]?/g, "|昼|");
  const tokens = normalized.split("|").map((item) => item.trim()).filter(Boolean);

  if (tokens.length >= 3) {
    const result: Array<{ label: string; value: string }> = [];
    for (let i = 0; i < tokens.length; i += 2) {
      const label = tokens[i];
      const value = tokens[i + 1];
      if (value) result.push({ label, value });
    }
    return result;
  }

  return [{ label: "芝居", value: title }];
}

export function PerformanceCard({ performance, featured = false }: Props) {
  const date = formatPerformanceDate(performance.performance_date);
  const isClosed = performance.session_type === "休演";
  const plays = splitPlayTitle(performance.play_title);

  return (
    <article className={`performance-card${featured ? " performance-card-featured" : ""}${isClosed ? " is-closed" : ""}`}>
      <div className="performance-card-top">
        <time dateTime={performance.performance_date}>{date.display}</time>
        <span className="session-badge">{performance.session_type}</span>
      </div>

      <div className="performance-card-body">
        <p className="venue-name">{performance.venue_name}</p>
        <h3>{performance.event_name || (isClosed ? "休演日" : "通常公演")}</h3>

        {isClosed ? (
          <p className="closed-message">本日は休演です。</p>
        ) : (
          <div className="program-list">
            {plays.length > 0 ? plays.map((play, index) => (
              <div className="program-row" key={`${play.label}-${index}`}>
                <span>{play.label}</span>
                <strong>{play.value}</strong>
              </div>
            )) : (
              <div className="program-row"><span>芝居</span><strong>未定</strong></div>
            )}
            <div className="program-row last-show-row">
              <span>ラスト</span>
              <strong>{performance.last_show_title || "未定"}</strong>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
