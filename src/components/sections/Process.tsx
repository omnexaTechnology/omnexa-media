import { useLocale, useTranslations } from "next-intl";
import { PROCESS, type Locale } from "@/content/data";
import SectionHead from "@/components/ui/SectionHead";
import Squares from "@/components/motion/Squares";
import ProcessPills from "@/components/motion/ProcessPills";

/* app.js renderProcess: six numbered steps + twelve tags; colours are primary/secondary shades only */
const TAGS = ["proc.goal", "proc.plan", "proc.scope", "proc.path", "proc.design", "proc.shoot", "proc.motion", "proc.copy", "process.t_schedule", "process.t_publish", "proc.r2", "proc.r3"] as const;
const PF_C = [["#FFFFFF", "#33006A"], ["#FBB040", "#1A0B2E"], ["#5700AE", "#FFFFFF"], ["#CDB4FF", "#33006A"], ["#FFD597", "#3A2400"], ["#33006A", "#FFFFFF"], ["#EEE4FF", "#5700AE"], ["#E39A24", "#1A0B2E"]];
const col = (k: number) => ({ "--c": PF_C[k % PF_C.length][0], "--t": PF_C[k % PF_C.length][1] }) as React.CSSProperties;

export default function Process() {
  const t = useTranslations();
  const l = useLocale() as Locale;
  return (
    <section className="section process" id="process" aria-labelledby="processTitle">
      <Squares dir="up" />
      <div className="container">
        <div className="pf-head">
          <SectionHead k="process" icon="route" />
          <svg className="ill ill-bulb" viewBox="0 0 180 190" aria-hidden="true">
            <path className="ill-f" style={{ "--f": "var(--ill-orange)" } as React.CSSProperties} d="M40 70c4-34 44-52 74-36s34 58 8 80-86 0-82-44Z" />
            <path d="M90 40c-26 0-44 20-44 42 0 16 10 26 18 34 6 6 8 12 8 20h36c0-8 2-14 8-20 8-8 18-18 18-34 0-22-18-42-44-42Z" />
            <path d="M74 146h32M78 160h24M84 172h12M90 136v-34l-10-12M90 102l10-12" />
            <path d="M90 8v14M40 26l10 10M140 26l-10 10M18 80h14M148 80h14" />
            <circle className="ill-o" cx="160" cy="150" r="5" />
          </svg>
        </div>
        <ProcessPills>
          <ol className="pf-list" id="pfList">
            {PROCESS.map((s, k) => (
              <li key={k} className="pf-pill pf-step" style={col(k)} title={s[l][1]}>
                <i>0{k + 1}</i>
                <span>{s[l][0]}</span>
              </li>
            ))}
            {TAGS.map((key, k) => (
              <li key={key} className={`pf-pill pf-tag${k > 5 ? " pf-x" : ""}`} style={col(k + 3)} aria-hidden="true">
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
        </ProcessPills>
      </div>
    </section>
  );
}
