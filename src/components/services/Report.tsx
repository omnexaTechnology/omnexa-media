/* eslint-disable @next/next/no-img-element -- 12 KB brand mark inside the illustration */
import { Chips, Line, Num, SAMPLE, SvcHead, css, type SvcProps } from "./shared";

/* Analytics & reporting service page sections (svcpages.js, id "report"), in page order. */

/* poster drawn in code: three lines of copy, two papers with a network graph, a lens */
const POSTER = { ar: ["نحلل أرقامك", "نفهم جمهورك", "ونبني لك قرارات أوضح"], en: ["We analyse your numbers", "understand your audience", "and build clearer decisions"] };
const NODES = [[30, 30], [70, 18], [120, 34], [168, 22], [44, 80], [96, 70], [150, 84], [70, 118], [130, 120]];
export function ReportPoster({ l }: SvcProps) {
  const pt = POSTER[l];
  return (
    <section className="sp8-show">
      <div className="container">
        <div className="sp8-stage" data-reveal="">
          <Chips icons={["query_stats", "donut_large", "tips_and_updates"]} />
          <div className="pz-bare" role="img" aria-label={pt.join(" ")}>
            <p className="pz-st">{pt.map((x, k) => <span key={k} className={`l${k}`}>{x}</span>)}</p>
            <div className="pz-art pz-rep" aria-hidden="true">
              <span className="pz-paper p2" />
              <span className="pz-paper p1">
                <svg viewBox="0 0 200 140">
                  {NODES.map((n, k, a) => { const to = a[(k * 3 + 2) % a.length]; return <line key={`l${k}`} x1={n[0]} y1={n[1]} x2={to[0]} y2={to[1]} />; })}
                  {NODES.map((n, k) => <circle key={`c${k}`} cx={n[0]} cy={n[1]} r="7" />)}
                </svg>
              </span>
              <span className="pz-lens">
                <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" className="t0" /><circle cx="20" cy="20" r="10" className="t1" /><circle cx="20" cy="20" r="5" className="t0" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* a SAMPLE monthly report; the four features are pinned to its parts (hovering a feature lights its pin) */
const DOC = {
  ar: { k: "شكل التقرير", kpi: ["الوصول", "التفاعل", "النقرات", "التحويلات"], title: "تقرير الأداء الشهري", reach: "الوصول خلال الشهر", share: "التوزيع حسب المنصة", camp: "مقارنة الحملات", recsT: "التوصيات", recs: ["ركّز على الفيديو القصير", "انشر أكثر في نهاية الأسبوع", "اختبر رسالتين إعلانيتين"], take: "الخلاصة", goal: "من هدف الشهر (مثال)" },
  en: { k: "The report", kpi: ["Reach", "Engagement", "Clicks", "Conversions"], title: "Monthly performance report", reach: "Reach this month", share: "Share by platform", camp: "Campaign comparison", recsT: "Recommendations", recs: ["Focus on short video", "Post more at weekends", "Test two ad messages"], take: "Takeaway", goal: "of the monthly goal (example)" },
};
const Pin = ({ n }: { n: number }) => <span className="rp-pin" data-pin={n}>{n + 1}</span>;
export function ReportDoc({ l, c }: SvcProps) {
  const d = DOC[l], S = SAMPLE[l];
  const kp: [string, number, string, string][] = [[d.kpi[0], 248, "K", "+12%"], [d.kpi[1], 6.8, "%", "+0.9"], [d.kpi[2], 9.4, "K", "+8%"], [d.kpi[3], 612, "", "+5%"]];
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={d.k} t={c.featT} p={c.dashP} />
        <div className="rpw">
          <ol className="rp-feats rp-pills" data-reveal="">
            {c.feats.map((f, k) => (
              <li key={k} style={css({ "--k": k })} data-feat={k}>
                <span className="rp-n">{k + 1}</span>
                <div><h3>{f[1]}</h3><p>{f[2]}</p></div>
              </li>
            ))}
          </ol>
          <div className="rp-doc" data-reveal="" aria-hidden="true">
            <div className="rp-dh">
              <span className="rp-logo"><img src="/assets/brand/mark.png" alt="" /></span>
              <div><b>{d.title}</b><small>Omnexa Media · {S}</small></div>
              <span className="sp-sample">{S}</span>
              <Pin n={2} />
            </div>
            <div className="rp-kpis">
              {kp.map((x) => <div key={x[0]}><small>{x[0]}</small><Num v={x[1]} suf={x[2]} /><em>{x[3]}</em></div>)}
              <Pin n={1} />
            </div>
            <div className="rp-row">
              <div className="rp-box rp-chart">
                <small>{d.reach}</small>
                <div className="rp-lines">
                  <Line pts={[22, 30, 27, 41, 38, 52, 57, 54, 66, 71, 69, 82]} />
                  <Line pts={[10, 12, 15, 14, 19, 21, 20, 26, 28, 27, 33, 36]} cls="b" />
                </div>
                <Pin n={0} />
              </div>
              <div className="rp-box rp-donut">
                <small>{d.share}</small>
                <svg viewBox="0 0 42 42">{[0, 1, 2, 3].map((k) => <circle key={k} className={`d${k}`} cx="21" cy="21" r="15.9" />)}</svg>
                <ul>{["Instagram", "TikTok", "Snapchat", "X"].map((x, k) => <li key={x}><i className={`k${k + 1}`} />{x}</li>)}</ul>
              </div>
            </div>
            <div className="rp-row">
              <div className="rp-box rp-bars">
                <small>{d.camp}</small>
                <div className="bd-bars">{([["A", 82], ["B", 64], ["C", 48], ["D", 71]] as const).map((b) => <span key={b[0]} style={css({ "--v": `${b[1]}%` })}><i /><em>{b[0]}</em></span>)}</div>
              </div>
              <div className="rp-box rp-recs">
                <small>{d.recsT}</small>
                <ul>{d.recs.map((x, k) => <li key={x} style={css({ "--d": `${k * 0.25 + 0.6}s` })}><span className="ms">check_circle</span>{x}</li>)}</ul>
                <Pin n={3} />
              </div>
            </div>
            <div className="rp-float">
              <b>{d.take}</b>
              <span className="sp-sample">{S}</span>
              <div className="rp-gauge"><svg viewBox="0 0 42 42"><circle className="g0" cx="21" cy="21" r="15.9" /><circle className="g1" cx="21" cy="21" r="15.9" /></svg><Num v={74} suf="%" /></div>
              <small>{d.goal}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* four-step flow, each step said by a small figure */
export function ReportSteps({ l, c }: SvcProps) {
  return (
    <section className="sp7-sec">
      <div className="container">
        <SvcHead k={l === "ar" ? "طريقة العمل" : "How it works"} t={c.procT} />
        <div className="pp" data-reveal="">
          <ol className="pp-row">
            {c.steps.map((s, k) => (
              <li key={k} className={`pp${k}`} style={css({ "--d": `${k * 0.25}s` })}>
                <div className="pp-say"><small dir="ltr">0{k + 1}</small><b>{s[0]}</b><span>{s[1]}</span></div>
                <svg className="pp-man" viewBox="0 0 120 150" aria-hidden="true">
                  <circle className="hd" cx="60" cy="38" r="24" />
                  <path className="sh" d="M8 150 C10 96 30 78 60 78 C90 78 110 96 112 150 Z" />
                  <path className="cl" d="M48 79 L60 104 L72 79 Z" />
                  <path className="tie" d="M57 86 L63 86 L65 118 L60 126 L55 118 Z" />
                </svg>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
