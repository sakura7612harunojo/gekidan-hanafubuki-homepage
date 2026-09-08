"use client";

import { useEffect } from "react";

export default function SmoothHashLinks() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!link) return;

      const url = new URL(link.href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }

      const element = document.getElementById(
        decodeURIComponent(url.hash.slice(1))
      );

      if (!element) return;

      event.preventDefault();

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      history.pushState(null, "", url.hash);
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
