/* Lookups shared by sections and pages — ports of the helpers at the top of ../omnexa-final-run/js/app.js. */
import { CLIENTS, PLATFORMS, PROJECTS, SECTORS, SITE, SOCIAL, SVCS, WMEDIA, WORKS, WORK_SVC, XPATH } from "./data";
import type { Locale, Project, Work } from "./data";

type Bi<T> = { ar: T; en: T };
export const L = <T,>(o: Bi<T>, l: Locale): T => o[l];

/* assets live under public/, the reference used relative "assets/..." paths */
export const asset = (p: string) => (p.startsWith("/") ? p : "/" + p);

export const proj = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const platform = (id: string) => PLATFORMS.find((p) => p.id === id);
export const platPath = (id: string) => (id === "x" ? XPATH : platform(id)?.d ?? "");
export const WA_PATH = platPath("whatsapp");
// Number = SITE.contact.whatsapp, copied from the reference data. NOT yet confirmed as the Media line
// (flagged in the reference's js/data.js) — see docs/implementation-plan.md before launch.
export const waHref = (text?: string) =>
  "https://wa.me/" + SITE.contact.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");

/* brand chip backgrounds used by hero/about/footer icons (app.js BG / AB) */
export const PLAT_BG: Record<string, string> = {
  instagram: "linear-gradient(45deg,#F58529,#DD2A7B 50%,#8134AF)",
  tiktok: "#111",
  snapchat: "#FFFC00",
  linkedin: "#0A66C2",
  x: "#111",
  whatsapp: "#25D366",
  youtube: "#FF0000",
};
export const platInk = (id: string) => (id === "snapchat" ? "#000" : "#fff");

export const igHandle = (slug: string, l: Locale) => {
  const x = (SOCIAL as Record<string, { t: string; h: string }[]>)[slug]?.find((y) => y.t === "instagram");
  return x ? x.h : (proj(slug) ? L(proj(slug)!, l).client : slug);
};
export const hasInstagram = (p: Project) =>
  ((SOCIAL as Record<string, { t: string }[]>)[p.slug] ?? []).some((y) => y.t === "instagram");

/* ---- portfolio (works.js) ---- */
export const sec = (id: string) => SVCS.find((s) => s.id === id)!;
export const work = (id: string) => WORKS.find((w) => w.id === id);
export const sector = (k: string) => (SECTORS as Record<string, { icon: string; ar: string; en: string }>)[k];
export const client = (w: Work) => (CLIENTS as Record<string, { slug?: string; ar: string; en: string }>)[w.c];
export const wName = (w: Work, l: Locale) => w[l].n;
export const wCat = (w: Work, l: Locale) => sec(w.cat)[l].t;
export const wSub = (w: Work, l: Locale) => {
  const x = (sec(w.cat).subs as string[][]).find((s) => s[0] === w.sub);
  return x ? x[l === "ar" ? 1 : 2] : "";
};
export const wSec = (w: Work, l: Locale) => sector(w.sec)[l];
export const wClient = (w: Work, l: Locale) => client(w)[l];
export const svcPageOf = (id: string) => (WORK_SVC as Record<string, string>)[id];
/* where a work card links to: three works are presented as service pages */
export const workHref = (w: Work) => (svcPageOf(w.id) ? `/services/${svcPageOf(w.id)}` : `/work/${w.id}`);

export type Vid = { src: string; poster: string };
type Media = { c?: string; g?: string[]; v?: Vid[] };
/* app.js workMedia(): every work has a WMEDIA entry, so the legacy folder fallbacks are not needed */
export function workMedia(w: Work) {
  const e = (WMEDIA as Record<string, Media>)[w.id] ?? {};
  const slug = client(w).slug;
  const imgs = (e.g ?? []).map(asset);
  const vids = (e.v ?? []).map((v) => ({ src: asset(v.src), poster: asset(v.poster) }));
  let cover = e.c ? asset(e.c) : null;
  if (!cover && (w.m === "proj" || w.cat === "video") && slug && proj(slug)) cover = `/assets/covers/${slug}.webp`;
  cover ??= (vids[0] && w.cat === "video" ? vids[0].poster : null) ?? imgs[0] ?? null;
  return { imgs, vids, cover };
}

/* Arabic-aware search normalisation (app.js norm) */
export const norm = (s: string) =>
  String(s).toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");

/* footer + drawer social row (app.js SOC) — facebook path is not in PLATFORMS */
const FB =
  "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z";
export const SOCIAL_LINKS: { id: string; href: string; d: string | null }[] = [
  { id: "instagram", href: "https://www.instagram.com/omnexa_tech", d: platPath("instagram") },
  { id: "tiktok", href: "https://www.tiktok.com/@0mnexa", d: platPath("tiktok") },
  { id: "snapchat", href: "https://www.snapchat.com/add/omnexa", d: platPath("snapchat") },
  { id: "linkedin", href: "https://www.linkedin.com/company/omnexa-technology", d: platPath("linkedin") || FB },
  { id: "facebook", href: "https://www.facebook.com/profile.php?id=61580077742055", d: FB },
  { id: "email", href: "mailto:" + SITE.contact.email, d: null },
  { id: "whatsapp", href: waHref(), d: WA_PATH },
];
