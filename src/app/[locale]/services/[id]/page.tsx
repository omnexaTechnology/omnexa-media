import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SVCPAGES, type Locale } from "@/content/data";
import { routing } from "@/i18n/routing";
import DetailHero from "@/components/project/DetailHero";
import EndCta from "@/components/project/EndCta";
import SvcEffects from "@/components/project/SvcEffects";
import BtnInner from "@/components/ui/BtnInner";
import type { SvcCopy } from "@/components/services/shared";
import { AdsDashboard, AdsPoster, PlatformPills, StepCards, WhyFan } from "@/components/services/Ads";
import { ReportDoc, ReportPoster, ReportSteps } from "@/components/services/Report";
import { BeforeAfter, SocialBento, SocialPlatforms } from "@/components/services/Social";

type SvcPage = { svc: string; icon: string; plats: string[] | null; ar: SvcCopy; en: SvcCopy };
const PAGES = SVCPAGES as unknown as Record<string, SvcPage>;

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => Object.keys(PAGES).map((id) => ({ locale, id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const P = PAGES[id], l = locale as Locale;
  if (!P) return {};
  return {
    title: `${P[l].h1} | ${l === "ar" ? "أومنيكسا ميديا" : "Omnexa Media"}`,
    description: P[l].lead,
    alternates: { canonical: `/${l}/services/${id}`, languages: { ar: `/ar/services/${id}`, en: `/en/services/${id}` } },
  };
}

/* the sections of each service page, in order (svcpages.js renderer v44) */
function Sections({ id, l, c, plats }: { id: string; l: Locale; c: SvcCopy; plats: string[] }) {
  const p = { l, c };
  switch (id) {
    case "ads":
      return <><AdsPoster {...p} /><WhyFan {...p} /><PlatformPills {...p} plats={plats} /><StepCards {...p} /><AdsDashboard {...p} /></>;
    case "report":
      return <><ReportPoster {...p} /><ReportDoc {...p} /><ReportSteps {...p} /></>;
    default:
      return <><SocialPlatforms {...p} plats={plats} /><SocialBento {...p} /><BeforeAfter {...p} /></>;
  }
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[id]">) {
  const { locale, id } = await params;
  const l = locale as Locale;
  setRequestLocale(l);
  const P = PAGES[id];
  if (!P) notFound();
  const t = await getTranslations();
  const c = P[l];

  return (
    <div id="project">
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('on-project')" }} />
      <DetailHero id="spT" className="sp7-hero" title={c.h1} floats={[P.icon, "auto_awesome", "favorite", "bolt", "star", "trending_up"]}
        tag={<span className="p7-tag"><i />{c.tag}</span>}>
        <p className="sp7-lead">{c.lead}</p>
        <p className="p7-desc">{c.desc}</p>
        <div className="sp-btns">
          <a className="btn btn-primary" href="#contact" data-service={P.svc}><BtnInner label={t("nav.contact")} /></a>
          <a className="btn btn-secondary" href={`/${l}#work`}><BtnInner label={t("hero.cta1")} icon="arrow_downward" /></a>
        </div>
      </DetailHero>
      <Sections id={id} l={l} c={c} plats={P.plats ?? []} />
      <EndCta />
      <SvcEffects />
    </div>
  );
}
