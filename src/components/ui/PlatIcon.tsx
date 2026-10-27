import { PLAT_BG, platInk, platPath } from "@/content/site";

export function Svg({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* round brand chip with the platform logo (hero title, about icons) */
export default function PlatIcon({ id, className }: { id: string; className?: string }) {
  return (
    <i className={className} style={{ background: PLAT_BG[id], color: platInk(id) }}>
      <Svg d={platPath(id)} />
    </i>
  );
}
