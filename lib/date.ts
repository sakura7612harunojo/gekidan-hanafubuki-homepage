const JST_TIME_ZONE = "Asia/Tokyo";

export function getJapanDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    iso: `${values.year}-${values.month}-${values.day}`,
  };
}

export function formatPerformanceDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "UTC",
    weekday: "short",
  }).format(date);

  return {
    compact: `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`,
    display: `${month}月${day}日（${weekday}）`,
  };
}
