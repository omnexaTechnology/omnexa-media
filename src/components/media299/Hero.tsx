import type { Locale } from "@/content/data";
import { COPY, FEED } from "@/content/media299";
import { waHref } from "@/content/site";
import BtnInner from "@/components/ui/BtnInner";
import Img from "@/components/ui/Img";

/* /ads hero — one focused composition: kicker, two-line headline (gold second line), one short line, one CTA,
   and a fan of five real client posts rising out of a soft light. Background: slow aurora light, a faint grid
   fading out, and a thin light arc. Motion is transform/opacity only, paused off-screen (Effects), off under
   prefers-reduced-motion. */

const FAN = [3, 1, 0, 2, 4]; // FEED order → fan position (centre card = strongest post)

export default function Hero({ l }: { l: Locale }) {
  const c = COPY[l].hero;
  return (
    <section className="m-hero" id="top" aria-labelledby="mHeroT">
      <div className="m-bg" aria-hidden="true">
        <span className="m-aur a1" /><span className="m-aur a2" />
        <span className="m-grid" />
        <span className="m-beam" />
      </div>

      <div className="container m-hero-in">
        <span className="m-kick"><i />{c.kicker}</span>
        <h1 id="mHeroT">
          <span className="m-h1a">{c.h1a}</span>
          <span className="m-h1b">{c.h1b}</span>
        </h1>
        <p className="m-sub">{c.sub}</p>
        <a className="btn btn-primary m-cta" href={waHref(COPY[l].waText)} target="_blank" rel="noopener" data-service="media299">
          <BtnInner label={c.cta} />
        </a>
      </div>

      <div className="m-fan" role="img" aria-label={c.visualAlt}>
        <span className="m-halo" aria-hidden="true" />
        {FAN.map((i, k) => (
          <span key={FEED[i]} className={`m-fc k${k}`} aria-hidden="true">
            <Img src={FEED[i]} sizes="(max-width: 767px) 40vw, 260px" priority={k === 2} />
          </span>
        ))}
      </div>
    </section>
  );
}
