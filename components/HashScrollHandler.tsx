"use client";

import { useEffect } from "react";

export function HashScrollHandler() {
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      target.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const adjustScroll = () => {
      scrollToHash();

      for (const delay of [100, 300, 700, 1200]) {
        timers.push(setTimeout(scrollToHash, delay));
      }
    };

    adjustScroll();

    window.addEventListener("load", adjustScroll);
    window.addEventListener("hashchange", adjustScroll);

    return () => {
      window.removeEventListener("load", adjustScroll);
      window.removeEventListener("hashchange", adjustScroll);

      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  return null;
}
