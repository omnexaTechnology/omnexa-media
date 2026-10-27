import { useTranslations } from "next-intl";
import { PROJECTS } from "@/content/data";
import { WA_PATH, waHref } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import Img from "@/components/ui/Img";
import Ms from "@/components/ui/Ms";

/* booking CTA before the footer on project and service pages (app.js endCta) */
export default function EndCta() {
  const t = useTranslations();
  return (
    <section className="p6-end">
      <div className="container">
        <div className="p6-ctab">
          <div className="p6-ct1">
            <h2>
              {t("pd.endT1")}{" "}
              <span className="p6-apps" aria-hidden="true">
                {PROJECTS.filter((q) => q.logo).slice(0, 4).map((q, k) => (
                  <i key={q.slug} className={`a${k}`}><Img src={`/${q.logo}.png`} sizes="96px" /></i>
                ))}
              </span>
            </h2>
          </div>
          <div className="p6-ct2">
            <p>{t("pd.endP")}</p>
            <div className="p6-ctb">
              <a className="p6-book" href="#contact"><Ms name="videocam" />{t("nav.contact")}</a>
              <a className="p6-ib p6-wa" href={waHref()} target="_blank" rel="noopener" aria-label={t("foot.wa")}><Svg d={WA_PATH} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
