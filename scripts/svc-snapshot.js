/* Captures the body of each service page (between the hero and the end CTA) from a running server,
   normalised, so the React refactor can be diffed against the legacy string builder output.
   Usage: node scripts/svc-snapshot.js <baseURL> <outDir> */
const fs = require("fs"), path = require("path");
const [base = "http://localhost:3200", out = "tests/fixtures"] = process.argv.slice(2);
const unImage = (h) => h.replace(/<img [^>]*>/g, (tag) => {
  // next/image → the original file, so only real markup changes show up in the diff
  const src = (tag.match(/ src="([^"]*)"/) || [])[1] || "", alt = (tag.match(/ alt="([^"]*)"/) || [])[1] || "";
  const m = src.match(/_next\/image\?url=([^&]+)/), cls = tag.match(/ class="([^"]*)"/), aria = / aria-hidden="true"/.test(tag);
  return `<img alt="${alt}"${aria ? ' aria-hidden="true"' : ""}${cls ? ` class="${cls[1]}"` : ""} src="${m ? decodeURIComponent(m[1]) : src}">`;
});
const norm = (h) =>
  unImage(h).replace(/<(path|circle|line|rect|ellipse|polyline)([^>]*?)\s*\/>/g, "<$1$2></$1>").replace(/=""/g, "").replace(/&#x27;|&#39;/g, "'").replace(/<!--.*?-->/gs, "")                       // React text separators
   .replace(/<div style="display:contents">/, "")       // legacy wrapper
   .replace(/\s+/g, " ").replace(/> </g, "><").trim()
   .replace(/<([a-z0-9]+)((?: [^\s=>]+(?:="[^"]*")?)+)(\s?\/?)>/gi, (_, tag, attrs, end) =>
     `<${tag} ${attrs.trim().match(/[^\s=]+(?:="[^"]*")?/g).sort().join(" ")}${end}>`); // attribute order
(async () => {
  fs.mkdirSync(out, { recursive: true });
  for (const l of ["ar", "en"]) for (const id of ["ads", "report", "social"]) {
    const html = await (await fetch(`${base}/${l}/services/${id}`)).text();
    const a = html.indexOf("</section>", html.indexOf('class="p7-hero')) + "</section>".length;
    const b = html.indexOf('<section class="p6-end"');
    if (a < 20 || b < 0) throw Error("markers not found " + l + id);
    fs.writeFileSync(path.join(out, `svc-${l}-${id}.html`), norm(html.slice(a, b)).replace(/></g, ">\n<") + "\n");
  }
  console.log("ok");
})();
