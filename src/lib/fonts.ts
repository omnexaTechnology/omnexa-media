import localFont from "next/font/local";

/* Effective reference typography: Arabic UI = IBM Plex Sans Arabic, English UI = Cairo.
   Only the weights that exist on disk (fonts.css also declared missing ones).
   preload:false — each locale only renders one family, so preloading both would waste ~1.4 MB. */
export const plex = localFont({
  variable: "--font-plex",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/IBMPlexSansArabic-Regular.ttf", weight: "400" },
    { path: "../fonts/IBMPlexSansArabic-Medium.ttf", weight: "500" },
    { path: "../fonts/IBMPlexSansArabic-SemiBold.ttf", weight: "600" },
    { path: "../fonts/IBMPlexSansArabic-Bold.ttf", weight: "700" },
  ],
});

export const cairo = localFont({
  variable: "--font-cairo",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/Cairo-Regular.ttf", weight: "400" },
    { path: "../fonts/Cairo-Medium.ttf", weight: "500" },
    { path: "../fonts/Cairo-SemiBold.ttf", weight: "600" },
    { path: "../fonts/Cairo-Bold.ttf", weight: "700" },
    { path: "../fonts/Cairo-ExtraBold.ttf", weight: "800" },
  ],
});

/* Material Symbols Rounded, subset to the 87 icons the site renders (scripts/gen-icons.js): 14 KB instead of the
   ~660 KB Google Fonts file, self-hosted, preloaded. block: hide ligature words until the glyphs are ready. */
export const icons = localFont({
  variable: "--font-icons",
  display: "block",
  preload: true,
  adjustFontFallback: false,
  src: [{ path: "../fonts/material-symbols-subset.woff2", weight: "500" }],
});
