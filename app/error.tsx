"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          ERROR
        </p>

        <h1 style={{
          fontSize: "clamp(32px, 7vw, 60px)",
          margin: "12px 0 20px"
        }}>
          ページを表示できませんでした
        </h1>

        <p style={{
          lineHeight: 1.9,
          opacity: 0.75,
          marginBottom: 30
        }}>
          一時的な通信エラーの可能性があります。
        </p>

        <button
          onClick={() => reset()}
          style={{
            border: 0,
            padding: "14px 26px",
            background: "#d1ad59",
            color: "#090807",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
