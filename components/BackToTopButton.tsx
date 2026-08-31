"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function BackToTopButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname.startsWith("/admin") || !visible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="ページ上部へ戻る"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        right: "18px",
        bottom: "calc(22px + env(safe-area-inset-bottom))",
        width: "48px",
        height: "48px",
        borderRadius: "9999px",
        border: "1px solid #d9ad3f",
        background: "rgba(5, 5, 5, 0.94)",
        color: "#f2c94c",
        fontSize: "24px",
        lineHeight: 1,
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 4px 18px rgba(0,0,0,.35)",
      }}
    >
      ↑
    </button>
  );
}
