import { useLocale, useTranslations } from "next-intl";
import Squares from "@/components/motion/Squares";
import Ms from "@/components/ui/Ms";

/* shared hero of project and service pages (.p7-hero): squares background, floating icon bubbles,
   breadcrumb, title whose last word gets the hand-drawn underline */
export default function DetailHero({ id, title, floats, className = "", tag, children }: { id: string; title: string; floats: string[]; className?: string; tag?: React.ReactNode; children: React.ReactNode }) {
  const t = useTranslations();
  const l = useLocale();
  const words = title.split(" "), last = words.pop();
  return (
    <section className={`p7-hero ${className}`.trim()} aria-labelledby={id}>
      <Squares dir="diagonal" />
      {floats.map((f, k) => (
        <span key={k} className={`p7-fl f${k + 1}`} aria-hidden="true"><span className="ms">{f}</span></span>
      ))}
      <div className="container p7-in">
        <nav className="crumbs" aria-label="breadcrumb">
          <a href={`/${l}#work`}><Ms name="arrow_back" className="flip" />{t("pd.back")}</a>
        </nav>
        {tag}
        <h1 id={id}>
          {words.join(" ")}{" "}
          <span className="p7-ul">
            {last}
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14C40 4 80 5 118 9S172 15 197 6" /></svg>
          </span>
        </h1>
        {children}
      </div>
    </section>
  );
}
