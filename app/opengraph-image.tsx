import { ImageResponse } from "next/og";

export const alt = "劇団花吹雪 公式ホームページ";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background:
            "linear-gradient(135deg, #070605 0%, #171008 55%, #050505 100%)",
          color: "#f5efe4",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.35em",
            color: "#d4a83d",
            marginBottom: 30,
          }}
        >
          GEKIDAN HANAFUBUKI
        </div>

        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          劇団花吹雪
        </div>

        <div
          style={{
            width: 120,
            height: 4,
            background: "#d4a83d",
            marginTop: 38,
            marginBottom: 38,
          }}
        />

        <div
          style={{
            fontSize: 30,
            color: "#d8d0c4",
          }}
        >
          公式ホームページ
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            bottom: 55,
            fontSize: 20,
            color: "#9f8956",
          }}
        >
          公演情報・演目・劇団員・舞台写真
        </div>
      </div>
    ),
    size
  );
}
