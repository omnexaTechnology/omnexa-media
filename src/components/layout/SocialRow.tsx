import { useLocale } from "next-intl";
import { PLATFORMS, SITE, type Locale } from "@/content/data";
import { SOCIAL_LINKS } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import Ms from "@/components/ui/Ms";

/* "Omnexa Media on Instagram" / "أومنيكسا ميديا على إنستغرام" */
function label(id: string, l: Locale) {
  const p = PLATFORMS.find((x) => x.id === id);
  return p ? (l === "ar" ? `أومنيكسا ميديا على ${p.ar}` : `Omnexa Media on ${p.en}`) : id;
}

export default function SocialRow({ className, id }: { className: string; id?: string }) {
  const l = useLocale() as Locale;
  return (
    <div className={className} id={id}>
      {SOCIAL_LINKS.map((s) =>
        s.d ? (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={label(s.id, l)}>
            <Svg d={s.d} />
          </a>
        ) : (
          <a key={s.id} href={s.href} aria-label={SITE.contact.email}>
            <Ms name="mail" />
          </a>
        ),
      )}
    </div>
  );
}
