"use client";

import Link from "next/link";

export default function AdminErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090807",
        color: "#f3eee5",
        display: "grid",
        placeItems: "center",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 620, textAlign: "center" }}>
        <p style={{ color: "#d1ad59", letterSpacing: "0.2em", fontSize: 13 }}>
          ADMIN ERROR
        </p>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 52px)", margin: "12px 0 20px" }}>
          保存・登録処理に失敗しました
        </h1>
        <p style={{ lineHeight: 1.9, opacity: 0.78, marginBottom: 26 }}>
          入力内容の重複、通信状態、ログイン状態を確認して、もう一度お試しください。
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              border: 0,
              padding: "13px 22px",
              background: "#d1ad59",
              color: "#090807",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            もう一度試す
          </button>
          <Link
            href="/admin"
            style={{
              padding: "12px 22px",
              border: "1px solid #6f6659",
              color: "#f3eee5",
            }}
          >
            管理画面に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
