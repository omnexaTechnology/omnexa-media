/* eslint-disable @next/next/no-img-element -- two script-swapped <img>s (phone screen, flow background) stay raw but point at optimised URLs */
import { useTranslations } from "next-intl";
import type { Work } from "@/content/data";
import Img from "@/components/ui/Img";
import { optimized } from "@/lib/imageUrl";

/* rendered widths per layout, so next/image picks a matching srcset entry */
const SZ = {
  grid: "(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 620px",
  full: "(max-width: 1280px) 100vw, 1240px",
  flow: "(max-width: 767px) 90vw, 760px",
  card: "240px",
};

/* Media layout of a project page, chosen by the work's sub-type (app.js renderProject → showcase()).
   Only the shapes the reference can actually reach are ported. Every tile opens the lightbox via data-gal. */
export type Shape = "posts" | "tiles" | "two" | "side" | "jg" | "a4" | "full" | "phone" | "flow";

export function shapeOf(w: Work): Shape {
  if (w.sub === "profile") return "a4";
  const map: Record<string, Shape> = {
    rebrand: "full", logo: w.id === "altior-logo" ? "side" : "jg", app: "phone", web: "flow", dash: "flow",
    posts: "tiles", menu: "tiles", pack: w.id === "og-pack" ? "two" : "jg", photo: "tiles",
  };
  return map[w.sub] ?? "posts";
}

export default function Showcase({ shape, imgs }: { shape: Shape; imgs: string[] }) {
  const t = useTranslations();
  const lbl = (k: number) => `${t("pd.open")} ${k + 1}`;
  const css = (o: Record<string, string | number>) => o as React.CSSProperties;
  const img = (src: string, sizes = SZ.grid) => <Img src={src} sizes={sizes} decoding="async" />;

  switch (shape) {
    case "two":
    case "tiles":
      return (
        <div className="p9-tiles" style={css({ "--cols": shape === "two" ? 2 : Math.min(3, imgs.length) })}>
          {imgs.map((s, k) => <button key={k} type="button" className="p9-tile" style={css({ "--k": k })} data-gal={k} aria-label={lbl(k)}>{img(s)}</button>)}
        </div>
      );
    case "side":
      return (
        <div className="p9-side">
          {imgs.map((s, k) => <button key={k} type="button" className={`p9-sd${k ? "" : " main"}`} data-gal={k} aria-label={lbl(k)}>{img(s)}</button>)}
        </div>
      );
    case "jg":
      return (
        <div className="jg">
          {imgs.map((s, k) => <button key={k} type="button" className="jg-i" style={css({ "--k": k })} data-gal={k} aria-label={lbl(k)}>{img(s)}</button>)}
          <i className="jg-end" aria-hidden="true" />
        </div>
      );
    case "a4":
      return (
        <div className="a4">
          {imgs.map((s, k) => (
            <button key={k} type="button" className="a4-p" style={css({ "--k": k })} data-gal={k} aria-label={lbl(k)}>
              {img(s)}<small dir="ltr">{String(k + 1).padStart(2, "0")}</small>
            </button>
          ))}
        </div>
      );
    case "full":
      return (
        <div className="p9-full">
          {imgs.map((s, k) => <button key={k} type="button" className="p9-fi" data-gal={k} aria-label={lbl(k)}>{img(s, SZ.full)}</button>)}
        </div>
      );
    case "flow":
      return (
        <div className="p9-flow" id="flow">
          <img className="p9-fl-bg" id="flowBg" src={optimized(imgs[0], 640)} alt="" aria-hidden="true" />
          <div className="p9-fl-stage" id="flowStage">
            {imgs.map((s, k) => <button key={k} type="button" className="p9-fc" data-fc={k} aria-label={lbl(k)}>{img(s, SZ.flow)}</button>)}
          </div>
          {imgs.length > 1 && (
            <div className="p9-fl-nav">
              <button type="button" className="hd-ic" data-fl="-1" aria-label={t("lb.prev")}><span className="ms flip" aria-hidden="true">chevron_left</span></button>
              <span className="p9-fl-dots">
                {imgs.map((_, k) => <button key={k} type="button" data-fc={k} aria-label={String(k + 1)} />)}
              </span>
              <button type="button" className="hd-ic" data-fl="1" aria-label={t("lb.next")}><span className="ms flip" aria-hidden="true">chevron_right</span></button>
            </div>
          )}
        </div>
      );
    case "phone": {
      // the card row scrolls behind the phone (CSS marquee); the phone shows whichever card passes behind it
      let row = imgs.map((s, k) => ({ s, k }));
      while (row.length < 6) row = row.concat(imgs.map((s, k) => ({ s, k })));
      const cards = (dup: boolean) =>
        row.map(({ s, k }, i) => (
          <button key={`${dup}${i}`} type="button" className="rk-card" data-shot={k} aria-label={lbl(k)} tabIndex={dup ? -1 : undefined} aria-hidden={dup || undefined}>
            <Img src={s} sizes={SZ.card} />
          </button>
        ));
      return (
        <div className="rk-stage p9-app">
          <div className="rk-row"><div className="rk-track">{cards(false)}{cards(true)}</div></div>
          <div className="rk-phone"><i className="rk-island" aria-hidden="true" /><img className="p9-screen" id="shotImg" src={optimized(imgs[0], 828)} alt="" /></div>
        </div>
      );
    }
    default: {
      // posts: a column count that divides the number of posts, so the last row is never half empty
      const pc = [5, 4, 3, 2].find((q) => imgs.length % q === 0) ?? 3;
      return (
        <div className="p9-posts g" style={css({ "--cols": imgs.length === 1 ? 1 : pc })}>
          {imgs.map((s, k) => <button key={k} type="button" className="p9-post" data-gal={k} aria-label={lbl(k)}>{img(s)}</button>)}
        </div>
      );
    }
  }
}
