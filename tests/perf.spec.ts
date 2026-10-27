import { test } from "@playwright/test";
import fs from "node:fs";

/* Bytes actually transferred for the home page: first view, then after scrolling to the bottom.
   WebKit only. Writes docs/perf-<label>.json; label via PERF_LABEL. */
// WebKit: Playwright's bundled Chromium has no H.264 decoder, so it never downloads the mp4s; WebKit uses the macOS decoders
test.skip(({ browserName }) => browserName !== "webkit");

const kind = (url: string, type: string) =>
  /\.(mp4)(\?|$)/.test(url) || type.startsWith("video") ? "video"
  : type.startsWith("image") || /_next\/image|\.(webp|png|jpe?g|svg|avif)(\?|$)/.test(url) ? "image"
  : /font|\.woff2?/.test(url + type) ? "font"
  : /javascript/.test(type) ? "js" : /css/.test(type) ? "css" : "other";

const ROUTES = ["/ar", "/ar/work/nabaa-photo", "/ar/work/og-edit"];
for (const route of ROUTES) for (const width of [390, 1440]) {
  test(`transfer ${route} @${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 900 });
    const totals = { first: {} as Record<string, number>, full: {} as Record<string, number> };
    let phase: "first" | "full" = "first";
    const pending: Promise<void>[] = [];
    page.on("requestfinished", (req) => {
      const p = phase;
      pending.push(req.sizes().then(async (s) => {
        const res = await req.response();
        const k = kind(req.url(), res?.headers()["content-type"] ?? "");
        const b = s.responseBodySize + s.responseHeadersSize;
        totals[p][k] = (totals[p][k] ?? 0) + b;
        totals.full[k] = p === "first" ? (totals.full[k] ?? 0) + b : totals.full[k];
      }).catch(() => {}));
    });
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(5000);
    phase = "full";
    for (let y = 0; y < 40; y++) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(4000);
    await Promise.all(pending);
    const mb = (o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, +(v / 1048576).toFixed(2)]).concat([["total", +(Object.values(o).reduce((a, b) => a + b, 0) / 1048576).toFixed(2)]]));
    const out = `docs/perf-${process.env.PERF_LABEL ?? "run"}.json`;
    const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
    prev[`${route}@${width}`] = { firstViewMB: mb(totals.first), afterFullScrollMB: mb(totals.full), measured: new Date().toISOString() };
    fs.writeFileSync(out, JSON.stringify(prev, null, 2) + "\n");
  });
}
