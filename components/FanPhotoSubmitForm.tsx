"use client";

import { FormEvent, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function FanPhotoSubmitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const nickname = String(formData.get("nickname") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setErrorMessage("投稿する写真を選んでください。");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrorMessage("JPEG・PNG・WebPの画像を選択してください。");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("画像は10MB以下にしてください。");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "jpg";

    const storagePath = `fan-${Date.now()}-${crypto.randomUUID()}.${extension}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("gallery-private")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertError } = await supabase.from("gallery").insert({
        title: title || null,
        submitted_by: nickname || null,
        storage_path: storagePath,
        status: "pending",
        is_public: false,
      });

      if (insertError) {
        await supabase.storage
          .from("gallery-private")
          .remove([storagePath]);

        throw insertError;
      }

      formRef.current?.reset();
      setMessage(
        "投稿ありがとうございます。確認後、掲載させていただきます。"
      );
    } catch (error) {
      console.error("Fan gallery submit error:", error);
      setErrorMessage(
        "投稿できませんでした。時間をおいてもう一度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="card"
      style={{
        maxWidth: 720,
        margin: "0 auto 48px",
        padding: 24,
      }}
    >
      <p className="eyebrow">FAN PHOTO</p>
      <h2 style={{ marginTop: 0 }}>ファン写真投稿</h2>

      <p style={{ lineHeight: 1.8 }}>
        劇団花吹雪の写真をお送りいただけます。
        投稿された写真は確認後、掲載させていただきます。
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 18 }}
      >
        <label>
          ニックネーム（任意）
          <input
            type="text"
            name="nickname"
            maxLength={50}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: 8,
              padding: "12px 14px",
            }}
          />
        </label>

        <label>
          タイトル（任意）
          <input
            type="text"
            name="title"
            maxLength={100}
            placeholder="例：舞踊ショーの写真"
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: 8,
              padding: "12px 14px",
            }}
          />
        </label>

        <label>
          写真
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            required
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: 8,
              padding: 12,
            }}
          />
        </label>

        <small>
          JPEG・PNG・WebP／10MB以下
        </small>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button"
          style={{
            padding: "14px 18px",
            cursor: isSubmitting ? "wait" : "pointer",
          }}
        >
          {isSubmitting ? "投稿中…" : "写真を投稿する"}
        </button>

        {message ? (
          <p
            role="status"
            style={{
              margin: 0,
              fontWeight: 700,
            }}
          >
            {message}
          </p>
        ) : null}

        {errorMessage ? (
          <p
            role="alert"
            style={{
              margin: 0,
              color: "#b00020",
              fontWeight: 700,
            }}
          >
            {errorMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}
