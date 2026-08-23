"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("確認中...");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(
        "ログインできませんでした。メールアドレスとパスワードを確認してください。"
      );
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function resetPassword() {
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const email = emailInput?.value?.trim();

    if (!email) {
      setMessage("先にメールアドレスを入力してください。");
      return;
    }

    setResetLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://gekidan-hanafubuki-homepage.vercel.app/auth/update-password",
    });

    setResetLoading(false);

    if (error) {
      setMessage(`送信エラー: ${error.message}`);
      return;
    }

    setMessage(
      "パスワード再設定メールを送りました。メールを確認してください。"
    );
  }

  return (
    <main>
      <form className="form" onSubmit={login}>
        <p className="eyebrow">ADMIN LOGIN</p>
        <h1>管理画面ログイン</h1>

        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">パスワード</label>
        <input id="password" name="password" type="password" required />

        <button type="submit">ログイン</button>

        <button
          type="button"
          onClick={resetPassword}
          disabled={resetLoading}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "12px",
            background: "transparent",
            color: "#d8b45a",
            border: "1px solid #d8b45a",
            cursor: "pointer",
          }}
        >
          {resetLoading ? "送信中..." : "パスワードを忘れた方"}
        </button>

        <p>{message}</p>
      </form>
    </main>
  );
}
