import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gekidan-hanafubuki.com"),
  title: { default: "劇団花吹雪｜大衆演劇 公式サイト", template: "%s｜劇団花吹雪" },
  description: "劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。",
  keywords: ["劇団花吹雪","大衆演劇","桜春之丞","櫻京之介","公演予定","芝居","舞踊ショー"],
  openGraph: { type:"website", locale:"ja_JP", url:"https://www.gekidan-hanafubuki.com", siteName:"劇団花吹雪", title:"劇団花吹雪｜大衆演劇 公式サイト", description:"劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。", images:[{url:"/opengraph-image",width:1200,height:630,alt:"劇団花吹雪 公式サイト"}] },
  twitter: { card:"summary_large_image", title:"劇団花吹雪｜大衆演劇 公式サイト", description:"劇団花吹雪の公式サイト。大衆演劇の公演予定、本日の演目、劇団員、芝居・舞踊演目、お知らせを掲載しています。座長 桜春之丞・櫻京之介。", images:["/opengraph-image"] },
  robots: { index:true, follow:true, googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1} },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-642C3PSFKH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-642C3PSFKH');
          `}
        </Script>
{children}</body>
    </html>
  );
}
