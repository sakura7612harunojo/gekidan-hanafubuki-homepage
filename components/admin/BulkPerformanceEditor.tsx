import {
  PERFORMANCE_SESSION_TYPES,
} from "@/lib/performance-bulk";

type ExistingPerformanceRow = {
  performance_date: string;
  venue_name: string | null;
  session_type: string;
  event_name: string | null;
  play_title: string | null;
  last_show_title: string | null;
  night_show_title: string | null;
  has_first_part: boolean | null;
  is_public: boolean | null;
};

export function BulkPerformanceEditor({
  dates,
  rows,
}: {
  dates: string[];
  rows: ExistingPerformanceRow[];
}) {
  const byDate = new Map(
    rows.map((row) => [row.performance_date, row]),
  );

  return (
    <div className="bulk-editor">
      <style>{`
        .performance-header,
        .performance-row {
          display: grid;
          grid-template-columns:
            105px
            135px
            minmax(170px, 0.9fr)
            minmax(190px, 1fr)
            minmax(180px, 1fr)
            minmax(180px, 1fr)
            minmax(180px, 1fr)
            65px
            65px;
          gap: 8px;
          align-items: start;
        }

        .performance-header {
          min-width: 1500px;
          padding: 12px 10px;
          background: #17130d;
          border-bottom: 1px solid #3a342c;
          color: #d9ad3d;
          font-weight: 700;
        }

        .performance-list {
          min-width: 1500px;
        }

        .performance-row {
          padding: 9px 10px;
          border-bottom: 1px solid #302b24;
        }

        .performance-date {
          padding-top: 9px;
        }

        .performance-date small {
          display: block;
          margin-top: 4px;
          color: #888;
          font-size: 11px;
        }

        .performance-field {
          min-width: 0;
        }

        .field-label {
          display: none;
        }

        .bulk-input,
        .bulk-select {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 10px;
          border: 1px solid #3a342c;
          background: #080706;
          color: #eee7dc;
          font-size: 14px;
        }

        .bulk-checkbox {
          display: flex;
          justify-content: center;
          padding-top: 10px;
        }

        @media (max-width: 760px) {
          .bulk-editor {
            overflow: visible;
          }

          .performance-header {
            display: none;
          }

          .performance-list {
            min-width: 0;
            display: grid;
            gap: 14px;
          }

          .performance-row {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
            border: 1px solid #302b24;
            background: #13110e;
            border-radius: 4px;
          }

          .performance-date {
            padding: 0 0 10px;
            border-bottom: 1px solid #302b24;
            color: #d9ad3d;
            font-size: 20px;
          }

          .performance-field {
            display: block;
          }

          .field-label {
            display: block;
            margin-bottom: 6px;
            color: #aaa29a;
            font-size: 12px;
            font-weight: 700;
          }

          .bulk-input,
          .bulk-select {
            min-height: 44px;
            font-size: 16px;
          }

          .bulk-checkbox {
            justify-content: flex-start;
            padding-top: 0;
          }

          .bulk-checkbox label {
            display: flex;
            gap: 10px;
            align-items: center;
            min-height: 40px;
          }

          .bulk-checkbox input {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #302b24",
        }}
      >
        <div className="performance-header">
          <div>日付</div>
          <div>公演区分</div>
          <div>劇場名</div>
          <div>イベント・ゲスト・不在</div>
          <div>芝居</div>
          <div>ラストショー</div>
          <div>夜の部</div>
          <div>1部</div>
          <div>公開</div>
        </div>

        <div className="performance-list">
          {dates.map((date) => {
            const row = byDate.get(date);

            return (
              <div className="performance-row" key={date}>
                <div className="performance-date">
                  <strong>{Number(date.slice(-2))}日</strong>
                  <small>{date}</small>
                </div>

                <div className="performance-field">
                  <span className="field-label">公演区分</span>
                  <select
                    className="bulk-select"
                    name={`session_type__${date}`}
                    defaultValue={row?.session_type ?? ""}
                  >
                    <option value="">未登録</option>
                    {PERFORMANCE_SESSION_TYPES.map(
                      (session) => (
                        <option key={session} value={session}>
                          {session}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="performance-field">
                  <span className="field-label">劇場名</span>
                  <input
                    className="bulk-input"
                    name={`venue_name__${date}`}
                    defaultValue={row?.venue_name ?? ""}
                    placeholder="共通劇場なら空欄可"
                  />
                </div>

                <div className="performance-field">
                  <span className="field-label">
                    イベント・ゲスト・不在
                  </span>
                  <input
                    className="bulk-input"
                    name={`event_name__${date}`}
                    defaultValue={row?.event_name ?? ""}
                  />
                </div>

                <div className="performance-field">
                  <span className="field-label">芝居</span>
                  <input
                    className="bulk-input"
                    name={`play_title__${date}`}
                    defaultValue={row?.play_title ?? ""}
                  />
                </div>

                <div className="performance-field">
                  <span className="field-label">
                    ラストショー
                  </span>
                  <input
                    className="bulk-input"
                    name={`last_show_title__${date}`}
                    defaultValue={row?.last_show_title ?? ""}
                  />
                </div>

                <div className="performance-field">
                  <span className="field-label">夜の部</span>
                  <input
                    className="bulk-input"
                    name={`night_show_title__${date}`}
                    defaultValue={row?.night_show_title ?? ""}
                  />
                </div>

                <div className="performance-field bulk-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name={`has_first_part__${date}`}
                      defaultChecked={Boolean(
                        row?.has_first_part,
                      )}
                    />
                    <span className="field-label">1部あり</span>
                  </label>
                </div>

                <div className="performance-field bulk-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name={`is_public__${date}`}
                      defaultChecked={
                        row
                          ? row.is_public !== false
                          : true
                      }
                    />
                    <span className="field-label">公開する</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
