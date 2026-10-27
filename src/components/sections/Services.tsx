import { useLocale, useTranslations } from "next-intl";
import { SVCS, type Locale } from "@/content/data";
import SectionHead from "@/components/ui/SectionHead";
import BtnInner from "@/components/ui/BtnInner";
import ScrollPager from "@/components/ui/ScrollPager";
import Ms from "@/components/ui/Ms";

/* v49 services: one pastel card per service group (app.js renderServices) */
const PAL = ["s-cream", "s-lilac", "s-sun", "s-lav", "s-peri", "s-apri", "s-pink"];
/* sub-services that have their own page */
const SVC_PAGE: Record<string, string[]> = { mkt: ["ads", "report"], social: ["social"] };

export default function Services() {
  const t = useTranslations("svc");
  const l = useLocale() as Locale;
  return (
    <section className="section services" id="services" aria-labelledby="svcTitle">
      <div className="container">
        <SectionHead k="svc" icon="deployed_code" />
        <svg className="ill ill-plane" viewBox="0 0 220 170" aria-hidden="true">
          <path className="ill-f" style={{ "--f": "var(--ill-lilac)" } as React.CSSProperties} d="M150 18c30-6 58 14 58 42s-30 44-58 38-44-20-40-44 14-32 40-36Z" />
          <path className="ill-d" d="M120 74C88 96 46 84 52 56 58 30 96 38 86 70 78 96 40 118 10 150" />
          <path d="M122 66 204 26 168 116 150 86Z" />
          <path d="M150 86 204 26M150 86l-6 28 22-20" />
          <path className="ill-s" d="M196 104l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
        </svg>
        <div className="svc-stage" id="svcStage" data-reveal="">
          <div className="sv7">
            {SVCS.map((s, i) => {
              const c = s[l];
              return (
                <article key={s.id} className={`sv7-c ${PAL[i % PAL.length]}`} data-sid={s.id}>
                  <span className="sv7-ic" aria-hidden="true"><span className="ms">{s.icon}</span></span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                  <ul className="svc5-list">
                    {c.f.map((f, k) => {
                      const pg = SVC_PAGE[s.id]?.[k];
                      return (
                        <li key={k}>
                          {pg ? (
                            <a className="svc-link" href={`/${l}/services/${pg}`}>
                              <Ms name="check_circle" />{f}<Ms name="arrow_outward" className="flip svc-go" />
                            </a>
                          ) : (
                            <><Ms name="check_circle" />{f}</>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <a className="btn btn-primary btn-sm sv7-go" href="#contact" data-service={s.id}>
                    <BtnInner label={t("req")} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
        <div className="svc-acc" id="svcAcc" />
        <ScrollPager id="svc" row="#svcStage .sv7" item=".sv7-c" n={SVCS.length} />
      </div>
    </section>
  );
}
