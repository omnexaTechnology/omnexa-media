import { useTranslations } from "next-intl";
import Img from "@/components/ui/Img";
import BtnInner from "@/components/ui/BtnInner";
import { Chips, Line, Num, PNAME, SAMPLE, SpIcon, SvcHead, css, type SvcProps } from "./shared";

/* Paid ads service page sections (svcpages.js, id "ads"), in page order. */

export function AdsPoster({ c }: SvcProps) {
  return (
    <section className="sp8-show">
      <div className="container">
        <div className="sp8-stage" data-reveal="">
          <Chips icons={["campaign", "ads_click", "trending_up"]} />
          <div className="sp8-cut"><Img src="/assets/w2/svc-ads/p.webp" alt={c.h1} sizes="(max-width: 767px) 90vw, 720px" /></div>
        </div>
      </div>
    </section>
  );
}

/* "why are competitors ahead of you?" — four answer cards in a fan; SvcEffects rotates the front card */
const WHY = {
  ar: { k: "ليش؟", t: "ليش المنافسين سابقينك؟", p: "غالبًا لأن إعلاناتهم توصل للجمهور الصح، بالرسالة الصح، في الوقت الصح. وهذا بالضبط اللي نشتغل عليه معك:", tabs: ["الهدف", "الميزانية", "المنصات"], ad: "إعلان" },
  en: { k: "Why?", t: "Why are competitors ahead of you?", p: "Usually because their ads reach the right audience, with the right message, at the right time. That is exactly what we work on with you:", tabs: ["Goal", "Budget", "Platforms"], ad: "Ad" },
};
export function WhyFan({ l, c }: SvcProps) {
  const q = WHY[l];
  const mini = [
    <span key="av" className="fn-av">{["18–24", "25–34", "35–44"].map((x, k) => <i key={x} style={css({ "--k": k })}>{x}</i>)}</span>,
    <span key="tabs" className="fn-tabs">{q.tabs.map((x, k) => <i key={x} className={k ? undefined : "on"}>{x}</i>)}</span>,
    <span key="ad" className="fn-ad"><i /><b /><b className="s" /><em>{q.ad}</em></span>,
    <Line key="line" pts={[18, 26, 22, 34, 30, 44, 52, 48, 60]} cls="fn-line" />,
  ];
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={q.k} t={q.t} p={q.p} />
        <div className="fn fn4" data-reveal="">
          {c.feats.map((f, k) => (
            <article key={k} className="fn-c" style={css({ "--i": k })} data-pos={k}>
              <span className="fn-h"><span className="ms" aria-hidden="true">{f[0]}</span><small dir="ltr">0{k + 1}</small></span>
              <h3>{f[1]}</h3>
              <p>{f[2]}</p>
              <div className="fn-vis" aria-hidden="true">{mini[k]}</div>
            </article>
          ))}
        </div>
        <div className="fn-dots" aria-hidden="true">{c.feats.map((_, k) => <i key={k} className={k ? undefined : "on"} />)}</div>
      </div>
    </section>
  );
}

/* ad platforms as floating pills around the copy */
const POS = [[16, 12, -7], [38, 5, 4], [62, 5, -4], [84, 12, 7], [30, 92, 4], [70, 92, -4]];
export function PlatformPills({ c, plats }: SvcProps & { plats: string[] }) {
  return (
    <section className="sp7-sec sp7-plats">
      <div className="container">
        <div className="pf-stage">
          {plats.map((k, n) => {
            const p = POS[n % POS.length];
            return (
              <span key={k} className="pf-pill2" style={css({ "--x": `${p[0]}%`, "--y": `${p[1]}%`, "--r": `${p[2]}deg`, "--d": `${n * 0.12}s` })}>
                <SpIcon k={k} cls="sp-pi sm2" />
                <b dir="ltr">{PNAME[k] + (k !== "meta" && k !== "google" ? " Ads" : "")}</b>
              </span>
            );
          })}
          <div className="pf-mid" data-reveal=""><h2>{c.platT}</h2><p>{c.platP}</p></div>
        </div>
      </div>
    </section>
  );
}

/* each step its own colour card with a small moving visual */
export function StepCards({ l, c }: SvcProps) {
  const vis = [
    <span key="t" className="uc-target"><i /><i /><i /></span>,
    <span key="p" className="uc-pills">
      {["meta", "google", "tiktok"].map((k) => <span key={k}><SpIcon k={k} cls="sp-pi sm" /><b dir="ltr">{PNAME[k].replace(" Ads", "")}</b></span>)}
    </span>,
    <span key="r" className="uc-rocket"><span className="ms">rocket_launch</span></span>,
    <svg key="s" className="uc-spark" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 44 L22 38 L40 46 L62 30 L84 34 L104 18 L126 26 L150 12 L172 20 L200 6" /><circle cx="200" cy="6" r="5" /></svg>,
  ];
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={l === "ar" ? "طريقة العمل" : "How it works"} t={c.procT} />
        <ol className="uc" data-reveal="">
          {c.steps.map((s, k) => (
            <li key={k} className={`uc${k}`} style={css({ "--d": `${k * 0.12}s` })}>
              <span className="uc-no" dir="ltr">0{k + 1}</span>
              <h3>{s[0]}</h3>
              <p>{s[1]}</p>
              <div className="uc-vis" aria-hidden="true">{vis[k]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* SAMPLE campaign dashboard: spend bars + budget split donut (figures are examples, labelled as such) */
const DASH = {
  ar: { t: "تابع حملتك بوضوح", spend: "إنفاق الحملة", unit: "ر.س هذا الشهر — مثال", ch: ["متابعة الإنفاق يوميًا", "النقرات والتحويلات", "تكلفة كل نتيجة", "مقارنة المنصات"], splitT: "توزيع الميزانية على المنصات", splitP: "نوزّع الميزانية حسب أداء كل منصة ونعدّلها مع تقدّم الحملة — الأرقام هنا مثال توضيحي." },
  en: { t: "Follow your campaign clearly", spend: "Campaign spend", unit: "SAR this month — example", ch: ["Daily spend tracking", "Clicks & conversions", "Cost per result", "Platform comparison"], splitT: "Budget split across platforms", splitP: "We split the budget by how each platform performs and adjust it as the campaign runs — figures here are an example." },
};
const SPLIT: [string, number, string][] = [["Meta", 40, "#5700AE"], ["Google", 25, "#FBB040"], ["TikTok", 20, "#A97BF0"], ["Snapchat", 15, "#33006A"]];
// where each slice of the donut starts (running total of the previous shares)
const OFFSET = SPLIT.map((_, i) => SPLIT.slice(0, i).reduce((a, s) => a + s[1], 0));
export function AdsDashboard({ l, c }: SvcProps) {
  const t = useTranslations();
  const d = DASH[l];
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={SAMPLE[l]} t={d.t} />
        <div className="em" data-reveal="">
          <article className="em-p">
            <div className="em-vis">
              <div className="em-bars">{[48, 62, 38, 92, 70, 56, 80].map((v, k) => <i key={k} style={css({ "--v": `${v}%` })} className={k === 3 ? "hi" : undefined} />)}</div>
              <div className="em-card o">
                <small>{d.spend}</small>
                <Num v={18450} />
                <em>{d.unit}</em>
                <span className="em-acts">{["add", "pause", "tune"].map((x) => <i key={x}><span className="ms">{x}</span></i>)}</span>
              </div>
            </div>
            <div className="em-t">
              <h3>{c.dashT}</h3>
              <p>{c.dashP}</p>
              <ul>{d.ch.map((x) => <li key={x}><span className="ms">check_circle</span>{x}</li>)}</ul>
            </div>
          </article>
          <article className="em-p r">
            <div className="em-t">
              <h3>{d.splitT}</h3>
              <p>{d.splitP}</p>
              <a className="btn btn-primary" href="#contact"><BtnInner label={t("nav.contact")} /></a>
            </div>
            <div className="em-vis">
              <div className="em-card p"><SpIcon k="meta" cls="sp-pi sm2" /><b>Meta Ads</b><strong dir="ltr">40%</strong><span className="em-tg"><i /></span></div>
              <div className="em-pie">
                <div className="em-leg">{SPLIT.map((s) => <span key={s[0]}><i style={{ background: s[2] }} />{s[0]}<em dir="ltr">{s[1]}%</em></span>)}</div>
                <svg viewBox="0 0 42 42">
                  {SPLIT.map((s, i) => <circle key={s[0]} cx="21" cy="21" r="15.9" style={css({ stroke: s[2], "--a": s[1], "--o": -OFFSET[i] })} />)}
                </svg>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
