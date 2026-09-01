import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="brand-with-mark">
        <Link className="brand" href="/">劇団花吹雪</Link>
        <img
          className="header-brand-mark"
          src="/images/hanabuki-haru-mark.png"
          alt="春"
          width="34"
          height="34"
        />
      </div>
      <nav className="nav" aria-label="メインメニュー">
        <Link href="/#today">本日の公演</Link>
        <Link href="/performances">公演予定</Link>
        <a href="/#cast">劇団員</a>
<Link href="/news">お知らせ</Link>
</nav>
    </header>
  );
}
