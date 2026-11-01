/* eslint-disable @next/next/no-img-element -- the same small logo files the site footer uses */
import { useTranslations } from "next-intl";
import type { Locale } from "@/content/data";
import { COPY } from "@/content/media299";
import SocialRow from "@/components/layout/SocialRow";

/* /ads' own footer (the site footer is hidden on this page by media299.css). Same design as the site footer —
   it reuses its classes (.footer.f2: purple background, orbs, social icons, wordmark) — but links only to
   sections of this page, and shows the brand clearly: "Omnexa Media" in the copyright, the localized heading as the wordmark. */
export default function LandingFooter({ l }: { l: Locale }) {
  const t = useTranslations("foot");
  const c = COPY[l].nav;
  return (
    <footer className="footer f2 m-foot" role="contentinfo">
      <div className="f2-bg" aria-hidden="true">
        <i className="o1" /><i className="o2" /><i className="o3" />
        <span className="s1" /><span className="s2" /><span className="s3" /><span className="s4" />
      </div>
      <div className="container">
        <a className="f2-logo" href="#top" aria-label="Omnexa Media">
          <img className="brand-ar" src="/assets/brand/logo-ar.svg" alt="أومنيكسا ميديا" width={120} height={91} />
          <img className="brand-en" src="/assets/brand/logo-en.png" alt="Omnexa Media" width={150} height={60} />
        </a>
        <nav className="f2-nav" aria-label={c.menu}>
          {c.links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="f2-bottom">
          <span className="f2-gap" aria-hidden="true" />
          <div className="f2-mid">
            <p className="copy">
              <bdi dir="ltr">© {new Date().getFullYear()} <b>Omnexa Media</b></bdi> — <span>{t("rights")}</span>
            </p>
          </div>
          <SocialRow className="f2-pills f2-social" />
        </div>
      </div>
      {/* the localized brand heading, large and in full contrast ("خدمات أومنيكسا ميديا" / "Omnexa Media Services") */}
      <div className="wordmark f2-wm m-foot-wm" aria-hidden="true">
        <div className="wm-static wm-one"><span>{COPY[l].foot.word}</span></div>
      </div>
    </footer>
  );
}
