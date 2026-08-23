import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <Link className="brand" href="/">劇団花吹雪</Link>
      <nav className="nav" aria-label="メインメニュー">
        <Link href="/#today">本日の公演</Link>
        <Link href="/performances">公演予定</Link>
        <Link href="/#cast">劇団員</Link>
        <Link href="/#repertoire">演目</Link>
        <Link href="/news">お知らせ</Link>
        <Link href="/admin">管理画面</Link>
      </nav>
    </header>
  );
}
