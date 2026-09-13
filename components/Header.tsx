"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <Link className="brand" href="/" onClick={closeMenu}>
        劇団花吹雪
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰ メニュー
      </button>

      <nav
        id="mobile-navigation"
        className={`nav ${menuOpen ? "mobile-menu-open" : ""}`}
        aria-label="メインメニュー"
      >
        <Link href="/#today" onClick={closeMenu}>本日の公演</Link>
        <Link href="/performances" onClick={closeMenu}>公演予定</Link>
        <Link href="/cast" onClick={closeMenu}>劇団員</Link>
        <Link href="/gallery" onClick={closeMenu}>写真</Link>
        <Link href="/recruit" onClick={closeMenu}>座員募集</Link>
        <Link href="/news" onClick={closeMenu}>お知らせ</Link>
      </nav>
    </header>
  );
}
