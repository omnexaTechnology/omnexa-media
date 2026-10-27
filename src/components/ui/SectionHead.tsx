import { useTranslations } from "next-intl";
import Ms from "./Ms";

/* the shared section head (app.js applyStatic, [data-head]) */
const IDS = { svc: "svcTitle", clients: "clientsTitle", about: "aboutTitle", work: "workTitle", testi: "testiTitle", process: "processTitle", faq: "faqTitle", contact: "contactTitle" } as const;
const IC2: Record<keyof typeof IDS, string> = { svc: "brush", clients: "favorite", about: "edit", work: "play_arrow", testi: "chat", process: "flag", faq: "help", contact: "call" };
export type HeadKey = keyof typeof IDS;

export default function SectionHead({ k, icon, center }: { k: HeadKey; icon: string; center?: boolean }) {
  const t = useTranslations(k);
  return (
    <div className={`shead ad-head${center ? " center" : ""}`} data-reveal="">
      <span className="ab-tag">{t("tag")}</span>
      <h2 className="s-title ab-title" id={IDS[k]}>
        <span className="l1">
          <span className="t1">{t("t1")}</span>
          <span className="ab-sel" aria-hidden="true">
            <i><Ms name={IC2[k]} /></i>
            <i className="on"><Ms name={icon} /></i>
          </span>
        </span>
        <span className="l2">
          <span className="ab-tile" aria-hidden="true"><Ms name="auto_fix_high" /></span>
          <span className="t2">{t("t2")}</span>
        </span>
      </h2>
      <p className="s-sub ab-sub">{t("sub")}</p>
    </div>
  );
}
