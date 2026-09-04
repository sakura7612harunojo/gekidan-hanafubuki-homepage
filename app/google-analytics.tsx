"use client";

import Script from "next/script";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MEASUREMENT_ID = "G-642C3PSFKH";
const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const mounted = useRef(false);
  const admin = isAdminPath(pathname);

  useLayoutEffect(() => {
    const gaWindow = window as typeof window & Record<string, unknown>;
    gaWindow[DISABLE_KEY] = admin;
  }, [admin]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (admin) return;

    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, admin]);

  if (admin) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window['${DISABLE_KEY}'] = false;
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', {
            send_page_view: false
          });

          gtag('event', 'page_view', {
            page_path: window.location.pathname,
            page_location: window.location.href,
            page_title: document.title
          });
        `}
      </Script>
    </>
  );
}
