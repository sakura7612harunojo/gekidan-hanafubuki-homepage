import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#090807",
      color: "#f3eee5",
      display: "grid",
      placeItems: "center",
      padding: "32px"
    }}>
      <div style={{ maxWidth: 620, textAlign: "center" }}>
        <p style={{
          color: "#d1ad59",
          letterSpacing: "0.2em",
          fontSize: 13
        }}>
          404 NOT FOUND
        </p>

        <h1 style={{
          fontSize: "clamp(36px, 8vw, 72px)",
          margin: "12px 0 20px"
        }}>
          ページが見つかりません
        </h1>

        <p style={{
          lineHeight: 1.9,
          opacity: 0.75,
          marginBottom: 30
        }}>
          お探しのページは移動または削除された可能性があります。
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 26px",
            background: "#d1ad59",
            color: "#090807",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          ホームへ戻る
        </Link>
      </div>
    </main>
  );
}
