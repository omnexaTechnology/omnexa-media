// Builds the default social share image public/assets/covers/og.jpg (1200x630, JPEG for broad platform support)
// from the brand logo on the brand purple. Run: node scripts/gen-og.mjs
import sharp from "sharp";

const W = 1200, H = 630, BG = "#5700AE";
const logo = await sharp("public/assets/brand/logo-en.png").resize({ height: 400 }).toBuffer();
const { width } = await sharp(logo).metadata();

await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
  .composite([{ input: logo, left: Math.round((W - width) / 2), top: Math.round((H - 400) / 2) }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/assets/covers/og.jpg");
console.log("public/assets/covers/og.jpg");
