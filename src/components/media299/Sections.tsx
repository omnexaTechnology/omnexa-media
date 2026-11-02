import type { Locale } from "@/content/data";
import { COPY, MAIN_SITE, START_PRICE, clientLogos, extras, faq, included, packages, platforms, reasons, showcase, steps } from "@/content/media299";
import { SITE } from "@/content/data";
import { WA_PATH, waHref } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import Img from "@/components/ui/Img";
import Ms from "@/components/ui/Ms";
import BtnInner from "@/components/ui/BtnInner";
import { OrderForm } from "./Package";
import Faq from "./Faq";

/* /ads sections after the hero, in page order. Shared pieces are only the site's tokens, buttons, icons and images;
   layouts and styles are this page's own (media299.css, everything under .m299). */

type P = { l: Locale };
const two = (n: number) => String(n).padStart(2, "0");

function Head({ k, t, p, id, center = true }: { k: string; t: string; p?: string; id: string; center?: boolean }) {
  return (
    <div className={`m-head${center ? " c" : ""}`} data-m-reveal="">
      <span className="m-k">{k}</span>
      <h2 id={id}>{t}</h2>
      {p && <p>{p}</p>}
    </div>
  );
}

/* the starting price ("packages start from 423 SAR only"); the amount reads number-then-currency in Arabic,
   currency-then-number in English */
export function PriceTag({ l, p, className }: P & { p: { from: string; cur: string; only: string }; className?: string }) {
  const amt = <b dir="ltr">{START_PRICE}</b>, cur = <small>{p.cur}</small>;
  return (
    <p className={`m-price${className ? " " + className : ""}`}>
      <span className="m-price-l">{p.from}</span>
      <span className="m-price-v">{l === "ar" ? <>{amt}{cur}</> : <>{cur}{amt}</>}</span>
      <span className="m-price-o">{p.only}</span>
    </p>
  );
}

/* our work at a glance: intro + link to the main site + three real works + platforms */
export function Overview({ l }: P) {
  const c = COPY[l].overview;
  return (
    <section className="m-sec m-over" id="overview" aria-labelledby="mOverT">
      <div className="container">
        <div className="m-over-grid">
          <div className="m-over-side">
            <Head k={c.k} t={c.t} p={c.p} id="mOverT" center={false} />
            <a className="btn btn-primary m-over-cta" href={MAIN_SITE} data-m-reveal=""><BtnInner label={c.cta} /></a>
          </div>
          <ul className="m-pillars m-works">
            {showcase(l).map((w, k) => (
              <li key={w.id} data-m-reveal="" style={{ "--d": `${k * 0.08}s` } as React.CSSProperties}>
                <span className="m-work-img"><Img src={w.cover} sizes="96px" /></span>
                <div><small>{w.cat}</small><h3>{w.n}</h3></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="m-platrow" data-m-reveal="">
          <span>{c.platT}</span>
          <ul>
            {platforms().map((p) => (
              <li key={p.id}><i style={{ background: p.bg, color: p.fg }} aria-hidden="true"><Svg d={p.d} /></i>{p[l]}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* what's included: the six parts of the managed service */
export function Included({ l }: P) {
  const c = COPY[l].inc;
  return (
    <section className="m-sec m-inc" id="included" aria-labelledby="mIncT">
      <div className="container">
        <Head k={c.k} t={c.t} p={c.p} id="mIncT" />
        <ol className="m-inc-grid">
          {included(l).map(([ic, t, p], k) => (
            <li key={t} className={k === 0 ? "hl" : undefined} data-m-reveal="" style={{ "--d": `${(k % 3) * 0.08}s` } as React.CSSProperties}>
              <span className="m-inc-top"><span className="m-inc-ic"><Ms name={ic} /></span><small dir="ltr">{two(k + 1)}</small></span>
              <h3>{t}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
        <p className="m-inc-note" data-m-reveal=""><Ms name="info" />{c.note}</p>
      </div>
    </section>
  );
}

/* media packages: the starting price, the seven service categories (the first — social media — is the core package
   detailed in the next section) and the site's other services; every request opens WhatsApp with that service */
export function Addons({ l }: P) {
  const c = COPY[l].add;
  const wa = (t: string) => waHref(`${COPY[l].waText} ${c.waWith} ${t}`);
  return (
    <section className="m-sec m-addons" id="addons" aria-labelledby="mAddT">
      <div className="container">
        <Head k={c.k} t={c.t} p={c.p} id="mAddT" />
        <div className="m-pricebar" data-m-reveal="">
          <PriceTag l={l} p={c.price} />
          <p className="m-pricenote"><Ms name="info" />{c.priceNote}</p>
        </div>
        <ol className="m-add-grid">
          {packages(l).map((a, k) => (
            <li key={a.id} className={k === 0 ? "hl" : undefined} data-m-reveal="" style={{ "--d": `${(k % 4) * 0.06}s` } as React.CSSProperties}>
              <span className="m-inc-top"><span className="m-add-ic"><Ms name={a.icon} /></span><small dir="ltr">{two(k + 1)}</small></span>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
              {a.f.length > 0 && <ul className="m-deliv">{a.f.map((x) => <li key={x}><Ms name="check_circle" />{x}</li>)}</ul>}
              <a className="m-go" href={wa(a.t)} target="_blank" rel="noopener" data-service={a.id} aria-label={`${c.cta}: ${a.t}`}>
                {c.cta}<Ms name="arrow_forward" className="flip m-go-ar" />
              </a>
            </li>
          ))}
        </ol>
        <div className="m-extras" data-m-reveal="">
          <span>{c.extraT}</span>
          <ul>
            {extras(l).map((x) => (
              <li key={x.id}>
                <a href={wa(x.t)} target="_blank" rel="noopener" data-service={x.id}><Ms name={x.icon} />{x.t}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* why Omnexa Media: profile figures, four reasons, client logos */
export function Why({ l }: P) {
  const c = COPY[l].why;
  const logos = clientLogos(l);
  return (
    <section className="m-sec m-why" aria-labelledby="mWhyT">
      <div className="container">
        <div className="m-why-grid">
          <div className="m-why-side">
            <Head k={c.k} t={c.t} p={c.p} id="mWhyT" center={false} />
            <div className="m-stats" data-m-reveal="">
              {c.stats.map(([n, t]) => <div key={t}><b dir="ltr">{n}</b><span>{t}</span></div>)}
            </div>
          </div>
          <ul className="m-reasons">
            {reasons(l).map(([ic, t, p], k) => (
              <li key={t} data-m-reveal="" style={{ "--d": `${k * 0.08}s` } as React.CSSProperties}>
                <span className="m-rs-ic"><Ms name={ic} /></span>
                <h3>{t}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="m-logos" data-m-reveal="">
        <p className="container">{c.clients}</p>
        <div className="m-marq">
          {/* the list twice; the copy is hidden from assistive tech so the loop is seamless */}
          <div className="m-marq-in">
            {[0, 1].map((dup) => (
              <ul key={dup} aria-hidden={dup ? "true" : undefined}>
                {logos.map((g) => (
                  <li key={g.slug}>
                    <Img className="lc" src={`${g.logo}.png`} alt={dup ? "" : g.name} sizes="160px" />
                    <Img className="lw" src={`${g.logo}-w.png`} alt="" aria-hidden="true" sizes="160px" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* how it works: four steps on a track */
export function How({ l }: P) {
  const c = COPY[l].how;
  return (
    <section className="m-sec m-how" id="how" aria-labelledby="mHowT">
      <div className="container">
        <Head k={c.k} t={c.t} p={c.p} id="mHowT" />
        <ol className="m-steps" data-m-reveal="">
          {steps(l).map(([t, p], k) => (
            <li key={t} style={{ "--d": `${k * 0.15}s` } as React.CSSProperties}>
              <span className="m-step-n" dir="ltr">{two(k + 1)}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FaqSection({ l }: P) {
  const c = COPY[l].faq;
  return (
    <section className="m-sec m-faqs" id="faq" aria-labelledby="mFaqT">
      <div className="container m-faq-grid">
        <Head k={c.k} t={c.t} p={c.p} id="mFaqT" center={false} />
        <div data-m-reveal=""><Faq items={faq(l)} /></div>
      </div>
    </section>
  );
}

/* closing CTA with the request form */
export function End({ l }: P) {
  const c = COPY[l].end;
  const tel = SITE.contact.phone.replace(/\s/g, "");
  return (
    <section className="m-sec m-end" id="order" aria-labelledby="mEndT">
      <div className="container">
        <div className="m-end-panel" data-m-reveal="">
          <span className="m-end-glow" aria-hidden="true" />
          <div className="m-end-copy">
            <span className="m-k">{c.k}</span>
            <h2 id="mEndT">{c.t}</h2>
            <p>{c.p}</p>
            <div className="m-end-acts">
              <a className="m-wa" href={waHref(COPY[l].waText)} target="_blank" rel="noopener" data-service="media299"><Svg d={WA_PATH} />{c.wa}</a>
              <a className="m-call" href={`tel:${tel}`}><Ms name="call" /><bdi dir="ltr">{SITE.contact.phone}</bdi></a>
            </div>
          </div>
          <OrderForm />
        </div>
      </div>
    </section>
  );
}
