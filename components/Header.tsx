import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <Link className="brand" href="/">劇団花吹雪</Link>
      <nav className="nav" aria-label="メインメニュー">
        <Link href="/#today">本日の公演</Link>
        <Link href="/performances">公演予定</Link>
        <a href="/#cast">劇団員</a>
        <a href="/#repertoire">演目</a>
        <Link href="/news">お知らせ</Link>
</nav>
    </header>
  );
}
