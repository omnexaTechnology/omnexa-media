/* Self-hosted Material Symbols subset.
   1. Collects every icon name: text of class="ms…" elements on all built pages (crawled from a running server,
      URLs from the sitemap) + icons that only appear after interaction or filtering (listed below / from data).
   2. Asks Google Fonts for exactly those glyphs (official `icon_names` parameter, names sorted) and saves the
      woff2 to src/fonts/material-symbols-subset.woff2 + the list to src/fonts/material-symbols-icons.json.
   Usage: node scripts/gen-icons.js http://localhost:3200      (Material Symbols: Apache License 2.0) */
const fs = require("fs"), path = require("path");
const base = process.argv[2] || "http://localhost:3200";
const root = path.join(__dirname, "..");
// shown only after a click / state change, so absent from the server HTML
const RUNTIME = ["pause", "play_arrow", "volume_off", "volume_up", "add", "remove", "close", "menu"];

(async () => {
  const sm = await (await fetch(`${base}/sitemap.xml`)).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (urls.length < 50) throw Error("sitemap too small: " + urls.length);
  const names = new Set(RUNTIME);
  for (const u of urls) {
    const html = await (await fetch(base + u)).text();
    for (const m of html.matchAll(/class="ms(?: [^"]*)?"[^>]*>([a-z0-9_]+)</g)) names.add(m[1]);
  }
  // any category / sector icon can appear in the work strip after filtering
  const src = fs.readFileSync(path.join(root, "src/content/data.ts"), "utf8").replace(/export const /g, "exports.").replace(/export type[^\n]*\n/g, "");
  const D = {};
  new Function("exports", src)(D);
  D.SVCS.forEach((s) => names.add(s.icon));
  Object.values(D.SECTORS).forEach((s) => names.add(s.icon));
  const list = [...names].sort();

  const cssUrl = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0&display=block&icon_names=" + list.join(",");
  // Google picks the format by User-Agent: a Chrome UA gets WOFF2 (a Safari UA gets the larger WOFF)
  const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": ua } })).text();
  const fontUrl = (css.match(/url\((https:[^)]+)\)/) || [])[1];
  if (!fontUrl) throw Error("no font URL in response:\n" + css.slice(0, 400));
  const buf = Buffer.from(await (await fetch(fontUrl, { headers: { "User-Agent": ua } })).arrayBuffer());
  if (buf.subarray(0, 4).toString() !== "wOF2") throw Error("not a woff2 file (the response depends on the User-Agent)");
  fs.writeFileSync(path.join(root, "src/fonts/material-symbols-subset.woff2"), buf);
  fs.writeFileSync(path.join(root, "src/fonts/material-symbols-icons.json"), JSON.stringify(list) + "\n");
  console.log(`${list.length} icons from ${urls.length} pages → ${(buf.length / 1024).toFixed(1)} KB woff2`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
