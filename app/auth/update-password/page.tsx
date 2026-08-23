"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("パスワードは8文字以上で入力してください。");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("確認用パスワードが一致していません。");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("パスワードを変更できませんでした。もう一度再設定メールから開いてください。");
      return;
    }

    setMessage("パスワードを変更しました。管理画面からログインできます。");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#f4efe6",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid #3a342c",
          background: "#12100d",
          padding: 28,
        }}
      >
        <p style={{ color: "#d4af37", letterSpacing: 4, fontSize: 12 }}>
          PASSWORD RESET
        </p>

        <h1 style={{ fontSize: 30, marginBottom: 28 }}>
          新しいパスワード設定
        </h1>

        <form onSubmit={handleSubmit}>
          <label>新しいパスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              margin: "8px 0 18px",
              background: "#050505",
              color: "#fff",
              border: "1px solid #4a4338",
            }}
          />

          <label>新しいパスワード（確認）</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              margin: "8px 0 22px",
              background: "#050505",
              color: "#fff",
              border: "1px solid #4a4338",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 15,
              background: "#d8b45a",
              border: 0,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "変更中..." : "パスワードを変更"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20, lineHeight: 1.6 }}>{message}</p>
        )}
      </div>
    </main>
  );
}
