"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialQuery: string;
  initialType: string;
};

export function WorksSearch({ initialQuery, initialType }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function move(params: URLSearchParams) {
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    move(params);
  }

  function handleTypeChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }

    move(params);
  }

  const buttons = [
    { label: "全部", value: "" },
    { label: "芝居", value: "芝居" },
    { label: "舞踊", value: "舞踊" },
    { label: "両方", value: "両方" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 700 }}>
        演目名で検索
        <input
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="例：仲乗り新三"
          autoComplete="off"
          onChange={(event) => handleChange(event.target.value)}
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
          const active = initialType === button.value;

          return (
            <button
              key={button.label}
              type="button"
              onClick={() => handleTypeChange(button.value)}
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
