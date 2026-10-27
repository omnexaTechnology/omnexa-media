import { useLocale, useTranslations } from "next-intl";
import SocialRow from "./SocialRow";

const LINKS = ["services", "about", "work", "process", "faq"] as const;

export default function Footer() {
  const t = useTranslations();
  const home = `/${useLocale()}`;
  return (
    <footer className="footer f2">
      <div className="f2-bg" aria-hidden="true">
        <i className="o1" /><i className="o2" /><i className="o3" />
        <span className="s1" /><span className="s2" /><span className="s3" /><span className="s4" />
      </div>
      <div className="container">
        <a className="f2-logo" href={`${home}#top`} aria-label="Omnexa Media">
          {/* eslint-disable @next/next/no-img-element */}
          <img className="brand-ar" src="/assets/brand/logo-ar.svg" alt="أومنيكسا ميديا" width={120} height={91} />
          <img className="brand-en" src="/assets/brand/logo-en.png" alt="Omnexa Media" width={150} height={60} />
          {/* eslint-enable @next/next/no-img-element */}
        </a>
        <nav className="f2-nav" aria-label="footer">
          {LINKS.map((k) => (
            <a key={k} href={`${home}#${k}`}>{t(`nav.${k}`)}</a>
          ))}
        </nav>
        <div className="f2-bottom">
          <span className="f2-gap" aria-hidden="true" />
          <div className="f2-mid">
            <p className="copy">
              <bdi dir="ltr">© {new Date().getFullYear()} <b>Omnexa Media</b></bdi> — <span>{t("foot.rights")}</span>
            </p>
          </div>
          <SocialRow className="f2-pills f2-social" id="f2Social" />
        </div>
      </div>
      <div className="wordmark f2-wm" id="wordmark" aria-hidden="true">
        <div className="wm-static wm-one"><span>{t("foot.word")}</span></div>
      </div>
    </footer>
  );
}
