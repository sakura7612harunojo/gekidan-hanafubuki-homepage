export type PerformanceVenueInfo = {
  month: string;
  name: string;
  address: string;
  tel?: string;
  reservationTel?: string;
  access?: string;
  schedule?: string[];
  specialDates?: string[];
  websiteUrl?: string;
  mapUrl?: string;
};

export const PERFORMANCE_VENUES:
  Record<string, PerformanceVenueInfo> = {
  "2026-09": {
    month: "2026-09",
    name: "天然温泉 おふろcafé 湯守座",
    address: "三重県四日市市生桑町311番地",
    tel: "059-332-2611",
    reservationTel: "059-332-0489",
    access:
      "近鉄四日市駅からアクセス。観劇予約は公演日の10日前から受付。",
    schedule: [
      "昼の部 12:30〜15:00",
      "夜の部 19:00〜20:00",
    ],
    specialDates: [
      "9月1日（火） 初日",
      "9月16日（水） 休演",
      "9月27日（日） 千穐楽（第三部）",
    ],
    websiteUrl:
      "https://ofurocafe-yumoriza.com/",
    mapUrl:
      "https://share.google/yYstmq75530m9PssN",
  },

  "2026-10": {
    month: "2026-10",
    name: "羅い舞座 京橋劇場",
    address:
      "大阪府大阪市都島区東野田町1-6-22 KiKi京橋5F",
    tel: "06-6355-0481",
    access:
      "京阪京橋駅片町口・Osaka Metro京橋駅1号出口から徒歩約1分。JR京橋駅北口から徒歩約5分。",
    schedule: [
      "通常 昼の部 12:00〜",
      "通常 夜の部 17:00〜",
    ],
    specialDates: [
      "10月1日（木） 初日",
      "10月19日（月） 昼一回",
      "10月20日（火） 休演",
      "10月29日（木） 昼一回",
      "10月30日（金） 千穐楽・昼一回",
    ],
    mapUrl:
      "https://share.google/DzvRiyh0YUyeZu90o",
  },

  "2026-11": {
    month: "2026-11",
    name: "後楽座",
    address:
      "岡山県岡山市北区田町2-2-1",
    tel: "086-237-1481",
    access:
      "岡山電気軌道「田町駅」から徒歩約1分。JR岡山駅から徒歩約12分。",
    schedule: [
      "通常 昼の部 12:30〜",
      "通常 夜の部 17:30〜",
    ],
    mapUrl:
      "https://share.google/7SsS0p0GhH7YylkhC",
  },

  "2026-12": {
    month: "2026-12",
    name: "しおはまの湯 四国健康村",
    address:
      "香川県綾歌郡宇多津町浜一番丁6番地10",
    tel: "0877-49-2600",
    schedule: [
      "昼：芝居 13:30〜14:30",
      "昼：歌謡舞踊ショー 14:40〜15:40",
      "夜：曜日により開演時間が異なります",
    ],
    websiteUrl:
      "https://shikoku-kenkomura.com/",
  },
};
