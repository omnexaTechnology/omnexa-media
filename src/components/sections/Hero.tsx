import { useLocale, useTranslations } from "next-intl";
import { PROJECTS, WMEDIA, type Locale } from "@/content/data";
import { L, asset, hasInstagram, igHandle, wName, work, workHref } from "@/content/site";
import PlatIcon from "@/components/ui/PlatIcon";
import AutoVideo from "@/components/ui/AutoVideo";
import ScrollPager from "@/components/ui/ScrollPager";
import ClientLogo from "@/components/ui/ClientLogo";
import DotGrid from "@/components/motion/DotGrid";

const SPARK = "M12 1C13 8.5 15.5 11 23 12C15.5 13 13 15.5 12 23C11 15.5 8.5 13 1 12C8.5 11 11 8.5 12 1Z";

/* app.js renderHeroCards: four tilted reel cards + the purple stat card with auto-scrolling client handles */
function Reel({ id, r, l, fallback }: { id: string; r: number; l: Locale; fallback: string }) {
  const own = id === "hero-reel" || id === "hero-svc";
  const v = own
    ? { src: `/assets/w2/${id}/v00.mp4`, poster: `/assets/w2/${id}/v00.jpg` }
    : (WMEDIA as Record<string, { v?: { src: string; poster: string }[] }>)[id]?.v?.[0];
  if (!v) return null;
  const w = work(id);
  return (
    <div className="hcd" style={{ "--r": `${r}deg` } as React.CSSProperties}>
      <a className="hcd-in hcd-photo" href={w ? `/${l}${workHref(w)}` : `/${l}#work`} aria-label={w ? wName(w, l) : fallback}>
        <AutoVideo src={asset(v.src)} poster={asset(v.poster)} />
      </a>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations();
  const l = useLocale() as Locale;
  const half = Math.ceil(PROJECTS.length / 2);
  const rows = [PROJECTS.slice(0, half), PROJECTS.slice(half)];

  return (
    <section className="hero hc" id="top" aria-labelledby="heroTitle">
      <DotGrid />
      <div className="container hc-top">
        <div className="hc-tw">
          <h1 className="hc-title" id="heroTitle">
            <span className="hc-l">
              <span>{t("hero.c1")}</span> <em className="hc-box">{t("hero.c1e")}</em>
            </span>
            <span className="hc-l">
              <em>{t("hero.c2e")}</em>{" "}
              <span className="hc-ic" id="heroIc" aria-hidden="true">
                {["instagram", "tiktok", "snapchat"].map((id) => <PlatIcon key={id} id={id} />)}
              </span>{" "}
              <span>{t("hero.c2")}</span>
            </span>
          </h1>
          {["hcd-sp1", "hcd-sp2", "hcd-sp3"].map((c) => (
            <svg key={c} className={`hcd-o ${c}`} viewBox="0 0 24 24" aria-hidden="true"><path d={SPARK} /></svg>
          ))}
          <svg className="hcd-o hcd-dot" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" /></svg>
          <svg className="hcd-o hcd-burst" viewBox="0 0 60 60" aria-hidden="true"><path d="M8 10L26 22M4 30H24M10 50L27 38" /></svg>
        </div>
        <p className="hc-sub">{t("hero.sub")}</p>
        <a className="hc-btn" href="#work">{t("hero.cta1")}</a>
      </div>

      <div className="hc-cards" id="heroCards">
        <Reel id="hero-svc" r={-5} l={l} fallback={t("nav.work")} />
        <Reel id="hero-reel" r={4} l={l} fallback={t("nav.work")} />
        <div className="hcd hcd-wide" style={{ "--r": "-7deg" } as React.CSSProperties}>
          <div className="hcd-in hcd-stat">
            <span className="hcd-avs">
              {PROJECTS.filter(hasInstagram).slice(0, 4).map((p) => (
                <span key={p.slug}><ClientLogo p={p} alt={L(p, l).client} /></span>
              ))}
            </span>
            <small>{t("hero.cardT")}</small>
            <b><bdi dir="ltr">+<span className="hcd-num" data-to="50">50</span></bdi></b>
            <span className="hcd-marq">
              {rows.map((list, k) => (
                <span key={k} className={`hcd-mrow${k ? " rev" : ""}`}>
                  <span className="hcd-mtrack">
                    {/* four copies so the CSS marquee loops without a gap */}
                    {[0, 1, 2, 3].flatMap((c) =>
                      list.map((p) => (
                        <span key={`${c}-${p.slug}`} className="hcd-pill" aria-hidden={c > 0 || undefined}>
                          <span className="hcd-pav"><ClientLogo p={p} alt={L(p, l).client} /></span>
                          <bdi dir="ltr">{igHandle(p.slug, l)}</bdi>
                        </span>
                      )),
                    )}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
        <Reel id="qudrat-motion" r={5} l={l} fallback={t("nav.work")} />
        <Reel id="bestwash-ai" r={-4} l={l} fallback={t("nav.work")} />
      </div>
      <div className="container">
        <ScrollPager id="hero" row="#heroCards" item=".hcd" n={5} small />
      </div>
    </section>
  );
}
