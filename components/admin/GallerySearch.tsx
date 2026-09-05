"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialQuery: string;
  initialStatus: string;
};

export function GallerySearch({ initialQuery, initialStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function move(params: URLSearchParams) {
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    move(params);
  }

  function handleStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    move(params);
  }

  const buttons = [
    { label: "全部", value: "" },
    { label: "公開", value: "published" },
    { label: "非公開", value: "hidden" },
    { label: "保留", value: "pending" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 700 }}>
        写真を検索
        <input
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="写真タイトルで検索"
          autoComplete="off"
          onChange={(event) => handleSearch(event.target.value)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginTop: 8,
            padding: "12px 14px",
            background: "#080706",
            border: "1px solid #3a342c",
            color: "#eee7dc",
            fontSize: 16,
          }}
        />
      </label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14,
        }}
      >
        {buttons.map((button) => {
          const active = initialStatus === button.value;

          return (
            <button
              key={button.label}
              type="button"
              onClick={() => handleStatus(button.value)}
              style={{
                padding: "10px 16px",
                border: "1px solid #d4a83d",
                background: active ? "#d4a83d" : "#080706",
                color: active ? "#080706" : "#d4a83d",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {button.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
