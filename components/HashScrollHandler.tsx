"use client";

import { useEffect } from "react";

export function HashScrollHandler() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
