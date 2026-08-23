import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            "radial-gradient(circle at 70% 30%, #3a2208 0%, #0b0907 50%, #050505 100%)",
        }}
      >
        <div
          style={{
            width: 420,
            height: 420,
            border: "12px solid #d4a83d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5efe4",
          }}
        >
          <div
            style={{
              fontSize: 270,
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
