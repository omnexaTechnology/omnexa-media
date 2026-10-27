import { SITE } from "@/content/data";
import { SOCIAL_LINKS } from "@/content/site";
import { Svg } from "@/components/ui/PlatIcon";
import Ms from "@/components/ui/Ms";

export default function SocialRow({ className, id }: { className: string; id?: string }) {
  return (
    <div className={className} id={id}>
      {SOCIAL_LINKS.map((s) =>
        s.d ? (
          <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.id}>
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
