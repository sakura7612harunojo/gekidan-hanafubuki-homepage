import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <h2>劇団花吹雪 CMS</h2>
        <Link href="/admin">ダッシュボード</Link>
        <Link href="/admin/performances">公演管理</Link>
        <Link href="/admin/news">お知らせ</Link>
        <Link href="/admin/members">劇団員</Link>
        <Link href="/admin/works">演目</Link>
        <Link href="/admin/gallery">写真</Link>
        <Link href="/">公開サイト</Link>
      </aside>
      <section className="content">
        <p className="eyebrow">ADMIN DASHBOARD</p>
        <h1>管理ダッシュボード</h1>
        <div className="grid">
          <article className="card"><small>公演管理</small><h3>公演予定を更新</h3><p>日付、劇場、芝居、ラスト、イベントを管理します。</p></article>
          <article className="card"><small>コンテンツ</small><h3>劇団員・演目</h3><p>公開プロフィールと作品紹介を管理します。</p></article>
          <article className="card"><small>メディア</small><h3>写真管理</h3><p>Supabase Storageへ写真を登録する予定です。</p></article>
        </div>
      </section>
    </main>
  );
}
