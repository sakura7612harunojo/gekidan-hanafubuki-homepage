import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <Link className="brand" href="/">劇団花吹雪</Link>
      <nav className="nav" aria-label="メインメニュー">
        <Link href="/#today">本日の公演</Link>
        <Link href="/performances">公演予定</Link>
        <Link href="/cast">劇団員</Link>
        <Link href="/gallery">写真</Link>
        <Link href="/recruit">座員募集</Link>
        <Link href="/news">お知らせ</Link>
</nav>
    </header>
  );
}
