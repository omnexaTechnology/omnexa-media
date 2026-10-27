import { useLocale, useTranslations } from "next-intl";
import { PLATFORMS, type Locale } from "@/content/data";
import { Svg } from "@/components/ui/PlatIcon";

export default function Platforms() {
  const t = useTranslations("platforms");
  const l = useLocale() as Locale;
  const pills = (copy: number) =>
    PLATFORMS.map((p) => (
      <span key={`${copy}-${p.id}`} className="plat">
        <i style={{ "--b": p.bg, "--f": p.fg } as React.CSSProperties}><Svg d={p.d} /></i>
        {p[l]}
      </span>
    ));
  return (
    <section className="platforms" aria-labelledby="platTitle">
      <div className="container">
        <p className="plat-title" id="platTitle">{t("title")}</p>
        <div className="plat-frame" id="platFrame">
          <div className="plat-track">
            {pills(0)}
            <div style={{ display: "contents" }} aria-hidden="true">{pills(1)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
