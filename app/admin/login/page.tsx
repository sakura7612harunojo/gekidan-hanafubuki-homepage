"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("確認中…");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("ログインできませんでした。メールアドレスとパスワードを確認してください。");
      return;
    }

    router.push("/admin");
    router.refresh();
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
        <p>{message}</p>
      </form>
    </main>
  );
}
