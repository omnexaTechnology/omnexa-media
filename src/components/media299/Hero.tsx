import type { Locale } from "@/content/data";
import { SITE } from "@/content/data";
import { waHref } from "@/content/site";
import { COPY, FEED } from "@/content/media299";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";
import Img from "@/components/ui/Img";
import { PriceTag } from "./Sections";

/* /ads hero — one focused composition: two-line headline (gold second line), one descriptive line (the seven service
   categories and the brand line), the starting price, the main CTA (opens a WhatsApp chat on the site's configured number) with a compact
   "Contact us" tel: link under it, and a fan of five
   real client posts rising out of a soft light. Background: slow aurora light, a faint grid fading out, and a thin
   light arc. Motion is transform/opacity only, paused off-screen (Effects), off under prefers-reduced-motion. */

const FAN = [3, 1, 0, 2, 4]; // FEED order → fan position (centre card = strongest post)

export default function Hero({ l }: { l: Locale }) {
  const c = COPY[l].hero;
  const tel = SITE.contact.phone.replace(/\s/g, "");
  return (
    <section className="m-hero" id="top" aria-labelledby="mHeroT">
      <div className="m-bg" aria-hidden="true">
        <span className="m-aur a1" /><span className="m-aur a2" />
        <span className="m-grid" />
        <span className="m-beam" />
      </div>

      <div className="container m-hero-in">
        <h1 id="mHeroT">
          <span className="m-h1a">{c.h1a}</span>
          <span className="m-h1b">{c.h1b}</span>
        </h1>
        <p className="m-sub">{c.sub}</p>
        <PriceTag l={l} p={c.price} className="m-price-hero" />
        <a className="btn btn-primary m-cta" href={waHref(COPY[l].waText)} target="_blank" rel="noopener" data-service="media299">
          <BtnInner label={c.cta} icon="chat" />
        </a>
        <a className="m-hero-call" href={`tel:${tel}`} data-service="media299">
          <span className="m-hero-call-ic" aria-hidden="true"><Ms name="call" /></span>{c.contact}
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
