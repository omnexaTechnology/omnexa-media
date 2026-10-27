/* Language switch = full navigation (each locale has its own root layout). The reference kept the reader's
   place when switching (app.js setLang); we remember the first visible section and restore it after load.
   Sections are matched by position: both locales render the same structure. */
const KEY = "om-anchor";
const sections = () => [...document.querySelectorAll<HTMLElement>("main section, footer")];

export const switchLocaleHref = (pathname: string, locale: string) =>
  `/${locale}${pathname === "/" ? "" : pathname}`;

export function rememberScrollAnchor() {
  const list = sections();
  const i = list.findIndex((s) => s.getBoundingClientRect().bottom > 80);
  if (i < 0) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ i, top: list[i].getBoundingClientRect().top }));
  } catch {}
}

/** Restores the position saved by a language switch. Returns true when it did. */
export function restoreScrollAnchor(): boolean {
  let saved: { i: number; top: number } | null = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    sessionStorage.removeItem(KEY);
  } catch {}
  const el = saved && sections()[saved.i];
  if (!el || !saved) return false;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - saved.top, behavior: "instant" });
  return true;
}

/* A page opened with #section lands on it (app.js route(true)): the browser's own jump does not happen reliably
   here, so scroll once now, again after late layout (fonts, media) and on load — like the reference. */
export function scrollToHashTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return () => {};
  const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  const raf = requestAnimationFrame(go), t = setTimeout(go, 450);
  window.addEventListener("load", go, { once: true });
  return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener("load", go); };
}
