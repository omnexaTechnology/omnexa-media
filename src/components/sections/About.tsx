import { useTranslations } from "next-intl";
import SectionHead from "@/components/ui/SectionHead";
import BtnInner from "@/components/ui/BtnInner";
import PlatIcon from "@/components/ui/PlatIcon";

/* app.js renderAbout — [value, suffix, label key, icon, background, tilt] */
const RES = [
  ["50", "+", "res.r1", "rocket_launch", "var(--brand-orange)", -3],
  ["50", "+", "res.r2", "handshake", "var(--primitives-color-base-white)", 2.5],
  ["3", "+", "res.r3", "workspace_premium", "var(--brand-purple-muted)", -1.5],
  ["90", "%", "res.r4", "sentiment_very_satisfied", "var(--brand-orange-muted)", 3],
] as const;
const ICONS = ["instagram", "tiktok", "snapchat", "linkedin", "whatsapp"];

/* the megaphone illustration (index.html, v33): social icons are emitted from its mouth by the motion layer */
function Mic() {
  return (
    <svg className="ab-mic ab-mega" viewBox="0 0 340 260" aria-hidden="true">
      <g className="mg-orb">
        <ellipse cx="170" cy="138" rx="150" ry="40" transform="rotate(-14 170 138)" />
        <ellipse cx="170" cy="138" rx="126" ry="29" transform="rotate(-20 170 138)" />
        <ellipse cx="176" cy="142" rx="160" ry="54" transform="rotate(-8 176 142)" />
      </g>
      <g className="mg-body" transform="rotate(-32 160 130)">
        <rect className="mg-cap" x="92" y="112" width="22" height="38" rx="8" />
        <path className="mg-cone" d="M112 114 196 84v94l-84-30Z" />
        <path className="mg-band" d="M174 92l10-3.6v85.2l-10-3.6Z" />
        <path className="mg-hand" d="M128 148l18 6-6 42c-1 6-5 8-10 6l-8-3c-5-2-6-6-4-11Z" />
        <path className="mg-trig" d="M146 162l11 4" />
        <ellipse className="mg-bell" cx="198" cy="131" rx="16" ry="50" />
        <ellipse className="mg-in" cx="201" cy="131" rx="8" ry="37" />
        <path className="mg-grill" d="M98 124h10M98 131h10M98 138h10" />
        <g className="mg-waves">
          <path d="M220 110a26 26 0 0 1 0 42" />
          <path d="M232 98a42 42 0 0 1 0 66" />
          <path d="M244 86a58 58 0 0 1 0 90" />
        </g>
      </g>
      <circle className="mg-dk" cx="228" cy="34" r="15" />
      <path className="mg-wh" d="M228 42.5l-7.2-7a4.3 4.3 0 0 1 7.2-4.9 4.3 4.3 0 0 1 7.2 4.9Z" />
      <circle className="mg-gd" cx="270" cy="60" r="13" />
      <path className="mg-ln" d="M265 60l9-5.5M265 60l9 5.5" />
      <circle className="mg-dk sm" cx="265" cy="60" r="2.6" />
      <circle className="mg-dk sm" cx="274" cy="54.5" r="2.6" />
      <circle className="mg-dk sm" cx="274" cy="65.5" r="2.6" />
      <circle className="mg-dk" cx="264" cy="106" r="14" />
      <path className="mg-wh" d="M259.5 99l11 7-11 7Z" />
      <path className="mg-gd" d="M240 178c-8-10-12-16-12-22a12 12 0 0 1 24 0c0 6-4 12-12 22Z" />
      <circle className="mg-dk sm" cx="240" cy="156" r="4.2" />
      <path className="mg-dk" d="M60 128c2 16 6 20 22 22-16 2-20 6-22 22-2-16-6-20-22-22 16-2 20-6 22-22Z" />
      <path className="mg-dk" d="M208 204c1 7 3 9 10 10-7 1-9 3-10 10-1-7-3-9-10-10 7-1 9-3 10-10Z" />
      <path className="mg-ol" d="M36 56c1 5 2 6 7 7-5 1-6 2-7 7-1-5-2-6-7-7 5-1 6-2 7-7Z" />
      <circle className="mg-gd" cx="214" cy="76" r="4.5" />
      <circle className="mg-gd" cx="176" cy="226" r="3.5" />
      <circle className="mg-gd" cx="304" cy="132" r="3" />
    </svg>
  );
}

export default function About() {
  const t = useTranslations();
  return (
    <section className="section about" id="about" aria-labelledby="aboutTitle">
      <div className="container ab-grid" id="abGrid">
        <div className="ab-art" aria-hidden="true"><Mic /></div>
        <div className="ab-main">
          <SectionHead k="about" icon="groups" center />
          <div className="about-cta" data-reveal="">
            <a className="btn btn-primary" href="#contact"><BtnInner label={t("about.btn")} /></a>
          </div>
          <div className="res-grid" id="resGrid">
            <div className="rp-stack">
              {RES.map(([v, suf, key, icon, bg, r], i) => (
                <div key={key} className="rp" style={{ "--bg": bg, "--r": `${r}deg`, "--k": i } as React.CSSProperties}>
                  <i><span className="ms" aria-hidden="true">{icon}</span></i>
                  <b>
                    <bdi dir="ltr">
                      {suf === "%" ? <><span className="rp-n" data-to={v}>{v}</span>%</> : <>+<span className="rp-n" data-to={v}>{v}</span></>}
                    </bdi>
                  </b>
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ab-icons" id="abIcons" aria-hidden="true">
          {ICONS.map((id, k) => <PlatIcon key={id} id={id} className={`abi abi${k}`} />)}
        </div>
      </div>
    </section>
  );
}
