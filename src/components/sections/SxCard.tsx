import type { Locale, Work } from "@/content/data";
import { sec, sector, wCat, wClient, wName, wSec, wSub, workHref, workMedia } from "@/content/site";
import AutoVideo from "@/components/ui/AutoVideo";
import Img from "@/components/ui/Img";
import Ms from "@/components/ui/Ms";

/* one strip of the portfolio row (app.js sxCard): the open card is wide, the others show the client vertically */
export default function SxCard({ w, n, on, l, onOpen }: { w: Work; n: number; on: boolean; l: Locale; onOpen?: (n: number) => void }) {
  const m = workMedia(w);
  const vid = w.cat === "video" ? m.vids[0] : null;
  return (
    <article className={`sx-c${on ? " on" : ""}`} data-sx={n} style={{ "--k": n } as React.CSSProperties}>
      {vid ? (
        <AutoVideo className="sx-bg" src={vid.src} poster={vid.poster} />
      ) : m.cover ? (
        <Img className="sx-bg" src={m.cover} fill sizes="(max-width: 767px) 85vw, 640px" />
      ) : (
        <span className="sx-bg w-ph" aria-hidden="true"><span className="ms">{sec(w.cat).icon}</span><b>{wClient(w, l)}</b></span>
      )}
      <span className="sx-shade" aria-hidden="true" />
      <button className="sx-tab" type="button" data-sx-go={n} aria-expanded={on} aria-label={wName(w, l)} onClick={() => onOpen?.(n)}>
        <span className="sx-v">{wClient(w, l)}</span>
        <Ms name={sec(w.cat).icon} className="sx-ic" />
      </button>
      <a className="sx-txt" href={`/${l}${workHref(w)}`} tabIndex={on ? 0 : -1}>
        <b>{wName(w, l)}</b>
        <span className="sx-chips">
          <span className="sx-cat">{wCat(w, l)}</span>
          <span className="sx-sub">{wSub(w, l)}</span>
          <span className="sx-sec"><Ms name={sector(w.sec).icon} />{wSec(w, l)}</span>
        </span>
        <span className="sx-go" aria-hidden="true"><span className="ms flip">arrow_outward</span></span>
      </a>
    </article>
  );
}
