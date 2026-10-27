/* Intrinsic pixel sizes of every raster image in public/assets → src/content/media-dims.json
   (used by components/ui/Img so next/image reserves the right box: no layout shift). Reads only; uses macOS `sips`. */
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const pub = path.join(__dirname, "../public"), out = {};
(function walk(d) {
  for (const f of fs.readdirSync(d).sort()) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(webp|png|jpe?g)$/i.test(f)) continue;
    const o = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", p]).toString();
    out["/" + path.relative(pub, p)] = [+o.match(/pixelWidth: (\d+)/)[1], +o.match(/pixelHeight: (\d+)/)[1]];
  }
})(path.join(pub, "assets"));
fs.writeFileSync(path.join(__dirname, "../src/content/media-dims.json"), JSON.stringify(out) + "\n");
console.log(Object.keys(out).length, "images");
