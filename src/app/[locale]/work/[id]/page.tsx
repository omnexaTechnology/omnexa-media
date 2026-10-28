import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WORKS, SOCIAL, type Locale } from "@/content/data";
import { client, sec, sector, svcPageOf, wCat, wClient, wName, wSec, wSub, work, workMedia } from "@/content/site";
import { routing } from "@/i18n/routing";
import { pageMetadata, SITE_NAME } from "@/lib/seo";
import DetailHero from "@/components/project/DetailHero";
import Showcase, { shapeOf } from "@/components/project/Showcase";
import VideoStage from "@/components/project/VideoStage";
import ProjectControls, { type Post } from "@/components/project/ProjectControls";
import RelatedRow from "@/components/project/RelatedRow";
import EndCta from "@/components/project/EndCta";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => WORKS.map((w) => ({ locale, id: w.id })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const w = work(id), l = locale as Locale;
  if (!w) return {};
  const m = workMedia(w);
  return pageMetadata({
    locale: l, path: `/work/${id}`, title: `${wName(w, l)} | ${SITE_NAME[l]}`, description: w[l].d || sec(w.cat)[l].d,
    image: m.cover ?? undefined, imageAlt: wName(w, l),
  });
}

/* title + text of the video section, per type of video (app.js vidCopy) */
function vidCopy(sub: string, c: string, l: Locale, fallback: { t: string; d: string }) {
  const A = l === "ar";
  const T: Record<string, [string, string]> = {
    motion: A ? [`موشن جرافيك لـ ${c}`, `صممنا وحرّكنا موشن جرافيك لـ ${c} يشرح الفكرة بأسلوب بصري واضح وممتع، ومجهّز للنشر على منصات السوشيال ميديا.`] : [`Motion graphics for ${c}`, `Motion graphics we designed and animated for ${c} to explain the idea in a clear, enjoyable way, ready for social media.`],
    edit: A ? [`تصوير ومونتاج لـ ${c}`, "صوّرنا لقطات حقيقية من الموقع وركّبناها بإيقاع سريع يناسب الريلز ومنصات السوشيال ميديا."] : [`Filming & editing for ${c}`, "Real on-site footage, cut at a fast pace that suits reels and social platforms."],
    ai: A ? [`فيديو بالذكاء الاصطناعي لـ ${c}`, "أنتجنا مشاهد إبداعية بأدوات الذكاء الاصطناعي توصل رسالة العلامة بشكل غير تقليدي ويلفت الانتباه."] : [`AI video for ${c}`, "Creative scenes produced with AI tools that carry the brand’s message in an unconventional, eye-catching way."],
  };
  return T[sub] ? { t: T[sub][0], d: T[sub][1] } : fallback;
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[id]">) {
  const { locale, id } = await params;
  const l = locale as Locale;
  setRequestLocale(l);
  const w = work(id);
  if (!w) notFound();
  if (svcPageOf(w.id)) redirect(`/${l}/services/${svcPageOf(w.id)}`);
  const t = await getTranslations();

  const g = sec(w.cat), m = workMedia(w), desc = w[l].d;
  const posts: Post[] = [...m.imgs.map((src) => ({ t: "img" as const, src })), ...m.vids.map((v) => ({ t: "vid" as const, src: v.src, poster: v.poster }))];
  let related = WORKS.filter((x) => x.sub === w.sub && x.id !== w.id);
  if (related.length < 3) related = related.concat(WORKS.filter((x) => x.cat === w.cat && x.id !== w.id && !related.includes(x)));
  const textOnly = w.cat === "video"; // video works: description + videos, no image collage
  const imgs = posts.slice(0, 12).filter((p) => p.t === "img").map((p) => p.src);
  const slug = client(w).slug;
  const ig = slug ? (SOCIAL as Record<string, { t: string; h: string }[]>)[slug]?.find((y) => y.t === "instagram")?.h : undefined;
  const handle = ig ?? "@" + wClient(w, l).replace(/\s+/g, "").toLowerCase();
  const vc = vidCopy(w.sub, wClient(w, l), l, { t: t("pd.videos"), d: g[l].d });

  return (
    <div id="project">
      {/* solid header before hydration (reference: body.on-project) */}
      <script dangerouslySetInnerHTML={{ __html: "document.body.classList.add('on-project')" }} />
      <DetailHero id="pdTitle" title={wName(w, l)} floats={[g.icon, sector(w.sec).icon, "auto_awesome", "favorite", "bolt", "star"]}>
        {desc && <p className="p7-desc">{desc}</p>}
        <a className="btn btn-primary" href="#contact"><BtnInner label={t("pd.ctaB")} /></a>
      </DetailHero>

      <section className="p7-sum" aria-labelledby="sumT">
        <div className="container">
          <h2 id="sumT">{t("pd.sumT")}</h2>
          <p>{t("pd.sumP")}</p>
          <div className="p7-sumg">
            <article className="p7-sc s1"><b>{wClient(w, l)}</b><small>{t("pd.client")}</small></article>
            <article className="p7-sc s2"><b>{wSub(w, l)}</b><small>{t("pd.workType")}</small></article>
            <article className="p7-sc s3">
              <span className="p7-items">
                <span><i><Ms name={g.icon} /></i>{wCat(w, l)}</span>
                <span><i><Ms name={sector(w.sec).icon} /></i>{wSec(w, l)}</span>
              </span>
              <small>{t("pd.areaSec")}</small>
            </article>
          </div>
        </div>
      </section>

      {!textOnly && (
        <section className="p7-ov" aria-labelledby="ovT">
          <div className="container p7-ov-in full">
            <h2 className="sr" id="ovT">{wSub(w, l)}</h2>
            {imgs.length ? (
              <Showcase shape={shapeOf(w)} imgs={imgs} />
            ) : (
              <div className="p7-empty"><Ms name={g.icon} /><b>{wClient(w, l)}</b><span>{t("pd.soon")}</span></div>
            )}
          </div>
        </section>
      )}

      {m.vids.length > 0 && (
        <section className="rk" aria-labelledby="rkT">
          <div className="container rk-head" data-reveal="">
            <h2 id="rkT">{vc.t}</h2>
            <p>{vc.d}</p>
            <a className="btn btn-primary" href="#contact"><BtnInner label={t("pd.ctaB")} /></a>
          </div>
          <VideoStage vids={m.vids} handle={handle} chips={{ sub: wSub(w, l), cat: wCat(w, l), client: wClient(w, l), sec: wSec(w, l) }} />
        </section>
      )}

      {related.length > 0 && (
        <section className="p7-rel2" aria-labelledby="relT">
          <div className="container">
            <h2 className="pd-h" id="relT">{t("pd.related")}</h2>
            <RelatedRow ids={related.slice(0, 4).map((x) => x.id)} />
          </div>
        </section>
      )}

      <EndCta />
      <ProjectControls posts={posts} />
    </div>
  );
}
