import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "劇団花吹雪｜公式ホームページ",
  description: "劇団花吹雪の公演情報、劇団員、演目、舞台写真をご案内します。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
