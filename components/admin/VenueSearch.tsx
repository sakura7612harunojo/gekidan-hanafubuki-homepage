"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initialQuery: string;
  initialMonth: string;
};

export function VenueSearch({ initialQuery, initialMonth }: Props) {
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

  function handleMonth(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("month", value);
    } else {
      params.delete("month");
    }

    move(params);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
        marginBottom: 18,
      }}
    >
      <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
        公演先を検索
        <input
          name="q"
          type="search"
          defaultValue={initialQuery}
          placeholder="例：湯守座"
          autoComplete="off"
          onChange={(event) => handleSearch(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #d9c9c9",
            background: "#fff",
            color: "#3f292e",
            borderRadius: 6,
            fontSize: 15,
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
        対象月で絞り込み
        <input
          name="month"
          type="month"
          defaultValue={initialMonth}
          onChange={(event) => handleMonth(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #d9c9c9",
            background: "#fff",
            color: "#3f292e",
            borderRadius: 6,
            fontSize: 15,
          }}
        />
      </label>
    </div>
  );
}
