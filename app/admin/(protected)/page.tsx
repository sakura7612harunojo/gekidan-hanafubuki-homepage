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
          <Link
            href="/admin/performances"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <small>公演管理</small>
            <h3>公演予定を管理</h3>
            <p>日付、会場、昼夜、芝居、ラスト、イベント、公開状態を登録・編集します。</p>
          </Link>

          <Link
            href="/admin/news"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <small>お知らせ管理</small>
            <h3>お知らせを管理</h3>
            <p>お知らせの新規登録、編集、公開、削除を行います。</p>
          </Link>

          <Link
            href="/admin/members"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <small>劇団員管理</small>
            <h3>劇団員プロフィールを管理</h3>
            <p>芸名、役職、プロフィール、表示順、公開状態を管理します。</p>
          </Link>

          <Link
            href="/admin/works"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <small>演目管理</small>
            <h3>芝居・舞踊を管理</h3>
            <p>演目名、種類、作品紹介、公開状態を登録・編集します。</p>
          </Link>

          <Link
            href="/admin/gallery"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <small>写真管理</small>
            <h3>ギャラリーを管理</h3>
            <p>写真のアップロード、公開・非公開の切替、削除を行います。</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
