export default function Loading() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#090807",
      color: "#f3eee5",
      display: "grid",
      placeItems: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{
          color: "#d1ad59",
          letterSpacing: "0.22em",
          fontSize: 13
        }}>
          GEKIDAN HANAFUBUKI
        </p>
        <p style={{ marginTop: 14, opacity: 0.7 }}>
          読み込み中…
        </p>
      </div>
    </main>
  );
}
