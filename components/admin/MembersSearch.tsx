"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MembersSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontWeight: 700 }}>
        劇団員を検索
        <input
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="例：明菜・座長・サポート"
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
    </div>
  );
}
