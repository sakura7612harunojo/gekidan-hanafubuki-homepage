import { createClient } from "@/lib/supabase/server";
import { PERFORMANCE_VENUES } from "@/lib/performance-venues";
import type { SupabaseClient } from "@supabase/supabase-js";

type VenueRow = {
  performance_month: string;
  venue_name: string;
  address: string | null;
  phone: string | null;
  reservation_phone: string | null;
  reservation_note: string | null;
  access: string | null;
  day_start_time: string | null;
  night_start_time: string | null;
  website_url: string | null;
  map_url: string | null;
};

export type PublicPerformanceVenue = {
  month: string;
  name: string;
  address: string;
  tel: string;
  reservationTel?: string;
  access: string;
  schedule: string[];
  websiteUrl: string;
  mapUrl: string;

  // トップページの既存汎用表示との互換用。
  venueName?: string;
  phone?: string;
  reservationPhone?: string;
  hours?: string;
  time?: string;
  dayStartTime?: string;
  nightStartTime?: string;
  website?: string;
  mapLink?: string;
};

function monthDate(month: string) {
  return `${month}-01`;
}

function displayMonth(month: string) {
  const [year, monthNumber] = month.split("-");
  return `${year}年${Number(monthNumber)}月`;
}

function emptyVenue(month: string): PublicPerformanceVenue {
  return {
    month: displayMonth(month),
    name: "",
    address: "",
    tel: "",
    reservationTel: "",
    access: "",
    schedule: [],
    websiteUrl: "",
    mapUrl: "",
  };
}

function publicVenueFromRow(
  row: VenueRow,
  month: string,
): PublicPerformanceVenue {
  const dayLine = row.day_start_time
    ? `昼の部 ${row.day_start_time}開演`
    : "";
  const nightLine = row.night_start_time
    ? `夜の部 ${row.night_start_time}開演`
    : "";
  const schedule = [dayLine, nightLine].filter((line): line is string => Boolean(line));

  const reservationTel = [row.reservation_phone, row.reservation_note]
    .filter((value): value is string => Boolean(value?.trim()))
    .join("\n");

  return {
    month: displayMonth(month),
    name: row.venue_name,
    venueName: row.venue_name,
    address: row.address ?? "",
    tel: row.phone ?? "",
    phone: row.phone ?? "",
    reservationTel,
    reservationPhone: row.reservation_phone ?? "",
    access: row.access ?? "",
    schedule,
    hours: schedule.join("\n"),
    time: schedule.join("\n"),
    dayStartTime: row.day_start_time ?? "",
    nightStartTime: row.night_start_time ?? "",
    websiteUrl: row.website_url ?? "",
    website: row.website_url ?? "",
    mapUrl: row.map_url ?? "",
    mapLink: row.map_url ?? "",
  };
}

async function getCmsVenueMap(supabaseClient?: SupabaseClient): Promise<
  Record<string, PublicPerformanceVenue>
> {
  const supabase = supabaseClient ?? await createClient();
  const { data, error } = await supabase
    .from("performance_venues")
    .select(
      "performance_month,venue_name,address,phone,reservation_phone,reservation_note,access,day_start_time,night_start_time,website_url,map_url",
    )
    .eq("is_public", true)
    .order("performance_month", { ascending: true });

  if (error || !data) {
    return {};
  }

  return Object.fromEntries(
    (data as VenueRow[]).map((row) => {
      const month = row.performance_month.slice(0, 7);
      return [month, publicVenueFromRow(row, month)];
    }),
  );
}

export async function getPerformanceVenueMap(): Promise<
  Record<string, PublicPerformanceVenue>
>;
export async function getPerformanceVenueMap(
  supabaseClient: SupabaseClient,
): Promise<Record<string, PublicPerformanceVenue>>;
export async function getPerformanceVenueMap(
  supabaseClient?: SupabaseClient,
): Promise<Record<string, PublicPerformanceVenue>> {
  const cms = await getCmsVenueMap(supabaseClient);

  const fallback =
    PERFORMANCE_VENUES as unknown as Record<string, PublicPerformanceVenue>;

  return {
    ...fallback,
    ...cms,
  };
}

export async function getPerformanceVenueForMonth(
  month: string,
  supabaseClient?: SupabaseClient,
): Promise<PublicPerformanceVenue> {
  const map = supabaseClient
    ? await getPerformanceVenueMap(supabaseClient)
    : await getPerformanceVenueMap();
  return map[month] ?? emptyVenue(month);
}

export async function getPerformanceVenueRowForMonth(month: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("performance_venues")
    .select("*")
    .eq("performance_month", monthDate(month))
    .eq("is_public", true)
    .maybeSingle();

  return data;
}
