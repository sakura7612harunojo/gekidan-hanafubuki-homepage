export async function GET() {
  return Response.json({
    ok: true,
    service: "gekidan-hanafubuki-os",
    timestamp: new Date().toISOString(),
  });
}
