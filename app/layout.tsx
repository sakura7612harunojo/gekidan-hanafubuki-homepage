import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gekidan-hanafubuki-homepage.vercel.app"),

  title: {
    default: "劇団花吹雪｜公式ホームページ",
    template: "%s｜劇団花吹雪",
  },

  description:
    "劇団花吹雪の公式ホームページ。公演情報、演目、劇団員紹介、舞台写真、お知らせをご案内します。",

  applicationName: "劇団花吹雪",

  keywords: [
    "劇団花吹雪",
    "大衆演劇",
    "桜春之丞",
    "公演情報",
    "演目",
    "舞台",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "劇団花吹雪",
    title: "劇団花吹雪｜公式ホームページ",
    description:
      "劇団花吹雪の公演情報、演目、劇団員紹介、舞台写真、お知らせをご案内します。",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
