import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = resolve(projectDirectory, "node_modules/next/dist/bin/next");

function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (port === null) reject(new Error("検査用ポートを取得できません"));
        else resolvePort(port);
      });
    });
  });
}

async function pageHtml(url, child, logs) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`公演案内ページを起動できませんでした\n${logs.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return await response.text();
    } catch {
      // 起動完了まで待ちます。
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`公演案内ページの起動が時間内に完了しませんでした\n${logs.join("")}`);
}

test("公演案内ページの題名は劇団花吹雪から始まり公演案内と続く", { timeout: 70_000 }, async (t) => {
  const port = await availablePort();
  const logs = [];
  const child = spawn(process.execPath, [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: projectDirectory,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString()));
  t.after(() => {
    if (child.exitCode === null) child.kill("SIGTERM");
  });

  const html = await pageHtml(`http://127.0.0.1:${port}/performances`, child, logs);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  assert.equal(title, "劇団花吹雪 | 公演案内");
});
