import { WMEDIA } from "@/content/data";
import Img from "@/components/ui/Img";
import { PNAME, SpIcon, SvcHead, css, type SvcProps } from "./shared";

/* Social media management service page sections (svcpages.js, id "social"), in page order. */

/* "we work across all major platforms": icons scattered around the copy (SvcEffects spreads them on scroll) */
const WA = [[50, 4, -6], [14, 24, 9], [86, 22, -9], [20, 82, -11], [80, 84, 10], [50, 100, 4]];
export function SocialPlatforms({ l, c, plats }: SvcProps & { plats: string[] }) {
  return (
    <section className="sp7-sec wa">
      <div className="container">
        <div className="wa-stage">
          {plats.map((k, n) => {
            const p = WA[n % WA.length];
            return (
              <span key={k} className="wa-ic" style={css({ "--x": `${p[0]}%`, "--y": `${p[1]}%`, "--r": `${p[2]}deg`, "--d": `${n * -0.9}s` })} title={PNAME[k]}>
                <SpIcon k={k} cls="wa-tile" />
              </span>
            );
          })}
          <div className="wa-mid" data-reveal="">
            <h2>{l === "ar" ? <>نشتغل على كل منصات التواصل <em>الرئيسية</em>.</> : <>We work across all <em>major</em> social platforms.</>}</h2>
            <p>{c.platP}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* one coloured card per managed service + a card of tumbling content pills */
const KC = ["k-cream", "k-violet", "k-peach", "k-mint", "k-sun", "k-lilac"];
const PILLS = { ar: ["ريلز", "ستوري", "بوستات", "موشن", "تقارير", "تفاعل", "هوية", "تصوير"], en: ["Reels", "Stories", "Posts", "Motion", "Reports", "Engagement", "Identity", "Photography"] };
export function SocialBento({ l, c }: SvcProps) {
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={l === "ar" ? "خدماتنا في الإدارة" : "What we manage"} t={c.featT} p={c.featP} />
        <div className="kb">
          {c.feats.map((f, k) => (
            <article key={k} className={`kb-c ${KC[k]}`} data-reveal="" style={css({ "--d": `${k * 0.07}s` })}>
              <span className="kb-k"><span className="ms" aria-hidden="true">{f[0]}</span><span dir="ltr">0{k + 1}</span></span>
              <h3>{f[1]}</h3>
              <p>{f[2]}</p>
              <span className="kb-deco" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 0 L61 34 L97 31 L68 53 L80 88 L50 66 L20 88 L32 53 L3 31 L39 34 Z" /></svg></span>
            </article>
          ))}
          <article className="kb-c kb-pills" aria-hidden="true">
            {PILLS[l].map((x, k) => <span key={x} style={css({ "--k": k })}>{x}</span>)}
          </article>
        </div>
      </div>
    </section>
  );
}

/* before / after: an illustrated unmanaged profile vs Al Qudrat Institute's real account with our designs */
const BA = {
  ar: { t: "قبل / بعد", s: "إدارة السوشيال ميديا", b: "قبل", a: "بعد", name: "معهد القدرات", kind: "معهد تدريب", posts: "منشورات", follow: "متابعة", msg: "رسالة", hl: "جديد", shot: "حساب معهد القدرات على إنستغرام", note: "«قبل» مثال توضيحي، و«بعد» هو حساب معهد القدرات الفعلي مع تصاميم من أعمالنا لهم." },
  en: { t: "Before / After", s: "Social Media", b: "Before", a: "After", name: "Al Qudrat Institute", kind: "Training institute", posts: "posts", follow: "Follow", msg: "Message", hl: "New", shot: "Al Qudrat Institute on Instagram", note: "“Before” is an illustration; “After” is Al Qudrat Institute’s real account with designs from our work for them." },
};
export function BeforeAfter({ l }: SvcProps) {
  const d = BA[l];
  const qp = ((WMEDIA as Record<string, { g?: string[] }>)["qudrat-posts"]?.g ?? []).slice(0, 9);
  return (
    <section className="sp7-sec ba3-sec">
      <div className="container">
        <div className="ba3" data-reveal="">
          <h2 className="ba3-t"><span>{d.t}</span>{d.s}</h2>
          <div className="ba3-stage">
            <div className="ba3-b">
              <span className="ba3-tag">{d.b}</span>
              <div className="igp">
                <div className="igp-top"><b dir="ltr">hma_institute_</b><span className="ms">menu</span></div>
                <div className="igp-head">
                  <span className="igp-av"><Img src="/assets/logos/qudrat.png" sizes="64px" /></span>
                  <div className="igp-st"><span><b dir="ltr">3</b>{d.posts}</span></div>
                </div>
                <div className="igp-bio"><b>{d.name}</b><span>{d.kind}</span></div>
                <div className="igp-btns"><span className="">{d.follow}</span><span>{d.msg}</span></div>
                <div className="igp-hl"><span><i><span className="ms">add</span></i>{d.hl}</span></div>
                <div className="igp-grid">
                  {[0, 1, 2, 3, 4, 5].map((k) => <i key={k} className={`ph${k > 2 ? " no" : ""}`}><span className="ms">{k > 2 ? "" : "image"}</span></i>)}
                </div>
              </div>
            </div>
            <svg className="ba3-arr" viewBox="0 0 120 70" aria-hidden="true"><path d="M8 62 C30 10 80 6 108 22" /><path className="h" d="M92 10 L110 22 L92 34" /></svg>
            <div className="ba3-a">
              <span className="ba3-tag a">{d.a}</span>
              <div className="igp after real">
                <Img className="igp-shot" src="/assets/w2/svc-social/qudrat-ig.webp" alt={d.shot} sizes="(max-width: 767px) 90vw, 420px" />
                <div className="igp-grid">{qp.map((s) => <i key={s}><Img src={"/" + s} sizes="140px" /></i>)}</div>
              </div>
            </div>
          </div>
          <p className="ba3-note">{d.note}</p>
        </div>
      </div>
    </section>
  );
}
