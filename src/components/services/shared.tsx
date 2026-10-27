import { PLATFORMS, XPATH, type Locale } from "@/content/data";

/* Building blocks shared by the three service pages (ported from svcpages.js helpers icon/line/num/head). */
export type SvcCopy = {
  tag: string; h1: string; lead: string; desc: string; featT: string; featP: string; feats: [string, string, string][];
  platT?: string; platP?: string; procT: string; steps: [string, string][]; dashT: string; dashP: string;
};
export type SvcProps = { l: Locale; c: SvcCopy };
export const css = (o: Record<string, string | number>) => o as React.CSSProperties;
export const SAMPLE = { ar: "بيانات توضيحية", en: "SAMPLE" };

const pl = (id: string) => PLATFORMS.find((x) => x.id === id)?.d ?? "";
const GOOGLE = "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z";
const YOUTUBE = "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";
const FACEBOOK = "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z";
const IG_BG = "linear-gradient(45deg,#FEDA75,#FA7E1E 30%,#D62976 60%,#962FBF 85%,#4F5BD5)";
/* [background, path, ink] per platform (meta uses the Facebook mark) */
const ICON: Record<string, [string, string, string?]> = {
  meta: ["#1877F2", FACEBOOK], google: ["#fff", GOOGLE, "#4285F4"], tiktok: ["#000", pl("tiktok")], snapchat: ["#FFFC00", pl("snapchat"), "#000"],
  instagram: [IG_BG, pl("instagram")], facebook: ["#1877F2", FACEBOOK], youtube: ["#FF0000", YOUTUBE], x: ["#000", XPATH], linkedin: ["#0A66C2", pl("linkedin")],
};
export const PNAME: Record<string, string> = { meta: "Meta Ads", google: "Google Ads", tiktok: "TikTok", snapchat: "Snapchat", instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", x: "X", linkedin: "LinkedIn" };

export function SpIcon({ k, cls = "sp-pi" }: { k: string; cls?: string }) {
  const x = ICON[k];
  if (!x) return null;
  return (
    <i className={cls} style={{ background: x[0], color: x[2] || "#fff" }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={x[1]} /></svg>
    </i>
  );
}

/* small area + line chart (SAMPLE data) */
export function Line({ pts, cls = "" }: { pts: number[]; cls?: string }) {
  const w = 300, h = 100, max = Math.max(...pts), st = w / (pts.length - 1);
  const d = pts.map((v, k) => (k ? "L" : "M") + (k * st).toFixed(1) + " " + (h - (v / max) * (h - 12) - 4).toFixed(1)).join(" ");
  return (
    <svg className={`sp-line ${cls}`} viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="ar" d={`${d} L300 100 L0 100 Z`} />
      <path className="ln" d={d} />
    </svg>
  );
}

/* number that SvcEffects counts up from 0 when it scrolls into view */
export const Num = ({ v, suf = "" }: { v: number; suf?: string }) => (
  <b className="sp-num" data-to={v} data-suf={suf} dir="ltr">0{suf}</b>
);

export function SvcHead({ k, t, p }: { k?: string; t: string; p?: string }) {
  return (
    <div className="sp7-head" data-reveal="">
      {k && <span className="sp7-k">{k}</span>}
      <h2>{t}</h2>
      {p && <p>{p}</p>}
    </div>
  );
}

/* the three floating icon chips around a poster */
export const Chips = ({ icons }: { icons: string[] }) => (
  <>
    {icons.map((k, n) => (
      <span key={k} className={`sp8-chip c${n}`} aria-hidden="true"><span className="ms">{k}</span></span>
    ))}
  </>
);
