export const PERFORMANCE_SESSION_TYPES = [
  "昼・夜",
  "昼一回",
  "休演",
] as const;

export type PerformanceSessionType =
  (typeof PERFORMANCE_SESSION_TYPES)[number];

export type BulkPerformanceRow = {
  performance_date: string;
  venue_name: string;
  session_type: PerformanceSessionType;
  event_name: string | null;
  play_title: string | null;
  last_show_title: string | null;
  night_show_title: string | null;
  has_first_part: boolean;
  is_public: boolean;
};

type BulkPerformanceInput = {
  performance_date: string;
  venue_name: string;
  default_venue: string;
  session_type: string;
  event_name: string;
  play_title: string;
  last_show_title: string;
  night_show_title: string;
  has_first_part: boolean;
  is_public: boolean;
};

function nullableText(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function formText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

export function currentJapanMonth() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 7);
}

export function safeMonth(value: string | undefined) {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return currentJapanMonth();
  }

  return value;
}

export function monthDates(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const days = new Date(year, monthNumber, 0).getDate();

  return Array.from({ length: days }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${month}-${day}`;
  });
}

export function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(
    Date.UTC(year, monthNumber - 1 + delta, 1),
  );

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export function normalizeBulkPerformance(
  input: BulkPerformanceInput,
): BulkPerformanceRow | null {
  const date = input.performance_date.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("日付の形式が正しくありません。");
  }

  const session = input.session_type.trim();

  // 未登録は削除ではなく「保存対象外」。
  if (session === "") return null;

  if (
    !PERFORMANCE_SESSION_TYPES.includes(
      session as PerformanceSessionType,
    )
  ) {
    throw new Error(`${date}: 公演区分が正しくありません。`);
  }

  const venue =
    input.venue_name.trim() || input.default_venue.trim();

  if (!venue) {
    throw new Error(`${date}: 劇場名を入力してください。`);
  }

  const isRest = session === "休演";

  return {
    performance_date: date,
    venue_name: venue,
    session_type: session as PerformanceSessionType,
    event_name: nullableText(input.event_name),

    // 休演日は演目を自動消去。
    play_title: isRest ? null : nullableText(input.play_title),
    last_show_title: isRest
      ? null
      : nullableText(input.last_show_title),
    night_show_title: isRest
      ? null
      : nullableText(input.night_show_title),

    has_first_part: isRest ? false : input.has_first_part,
    is_public: input.is_public,
  };
}

export function rowsFromBulkFormData(
  formData: FormData,
): BulkPerformanceRow[] {
  const defaultVenue = formText(formData, "default_venue");

  const dates = Array.from(formData.keys())
    .filter((key) => key.startsWith("session_type__"))
    .map((key) => key.replace("session_type__", ""));

  return Array.from(new Set(dates))
    .sort()
    .map((date) =>
      normalizeBulkPerformance({
        performance_date: date,
        default_venue: defaultVenue,
        venue_name: formText(formData, `venue_name__${date}`),
        session_type: formText(
          formData,
          `session_type__${date}`,
        ),
        event_name: formText(formData, `event_name__${date}`),
        play_title: formText(formData, `play_title__${date}`),
        last_show_title: formText(
          formData,
          `last_show_title__${date}`,
        ),
        night_show_title: formText(
          formData,
          `night_show_title__${date}`,
        ),
        has_first_part:
          formData.get(`has_first_part__${date}`) === "on",
        is_public:
          formData.get(`is_public__${date}`) === "on",
      }),
    )
    .filter(
      (row): row is BulkPerformanceRow => row !== null,
    );
}

export function copyRowsToMonth(
  rows: BulkPerformanceRow[],
  targetMonth: string,
  venueName: string,
) {
  const validDates = new Set(monthDates(targetMonth));
  const venue = venueName.trim();

  if (!venue) {
    throw new Error("コピー先の劇場名を入力してください。");
  }

  return rows
    .map((row) => {
      const day = row.performance_date.slice(-2);
      const targetDate = `${targetMonth}-${day}`;

      // 例：31日→30日までしかない月の場合は無視。
      if (!validDates.has(targetDate)) return null;

      return {
        ...row,
        performance_date: targetDate,
        venue_name: venue,
      };
    })
    .filter(
      (row): row is BulkPerformanceRow => row !== null,
    );
}
