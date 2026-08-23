import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 70% 30%, #3a2208 0%, #0b0907 45%, #050505 100%)",
        }}
      >
        <div
          style={{
            width: 146,
            height: 146,
            border: "4px solid #d4a83d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5efe4",
            boxShadow: "0 0 18px rgba(212,168,61,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              fontWeight: 700,
            }}
          >
            花
          </div>
        </div>
      </div>
    ),
    size
  );
}
