import { useTranslations } from "next-intl";
import type { Vid } from "@/content/site";
import Img from "@/components/ui/Img";

/* app.js ruHTML: a row of video cards slides behind a phone that plays the current one (driven by ProjectControls) */
export default function VideoStage({ vids, handle, chips }: { vids: Vid[]; handle: string; chips: { sub: string; cat: string; client: string; sec: string } }) {
  const t = useTranslations();
  const many = vids.length > 1;
  return (
    <div className="ru ru-video" id="ru">
      {many && (
        <div className="ru-row">
          {vids.map((v, k) => (
            <button key={k} type="button" className="ru-c" data-ru={k} aria-label={`${t("pd.play")} ${k + 1}`}>
              <Img src={v.poster} sizes="200px" />
            </button>
          ))}
        </div>
      )}
      <div className="ru-phone">
        <i className="ru-isl" aria-hidden="true" />
        <div className="ru-scr">
          {/* preload none: nothing is fetched until ProjectControls starts it in view */}
          <video id="rkVid" playsInline preload="none" loop={!many} poster={vids[0].poster} data-k="0">
            <source src={vids[0].src} type="video/mp4" />
          </video>
          <span className="ru-ui" aria-hidden="true">
            <span className="ru-side">
              <span className="ms">favorite</span><span className="ms">chat_bubble</span><span className="ms">reply</span>
              {/* eslint-disable-next-line @next/next/no-img-element -- 12 KB brand mark */}
              <i className="ru-disc"><img src="/assets/brand/mark.png" alt="" /></i>
            </span>
            <span className="ru-cap"><b dir="ltr">{handle}</b><small>{chips.sub}</small></span>
            <span className="ru-nav"><span className="ms">home</span><span className="ms">search</span><b>+</b><span className="ms">inbox</span><span className="ms">person</span></span>
          </span>
          <button type="button" className="ru-ctl p" id="rkPlay" aria-label={t("pd.pause")}><span className="ms" aria-hidden="true">pause</span></button>
          <button type="button" className="ru-ctl s" id="rkSnd" aria-label={t("pd.sound")} aria-pressed="false"><span className="ms" aria-hidden="true">volume_off</span></button>
        </div>
      </div>
      <span className="ru-chip c1" aria-hidden="true"><b>{chips.sub}</b><small>{chips.cat}</small></span>
      <span className="ru-chip c2" aria-hidden="true"><b>{chips.client}</b><small>{chips.sec}</small></span>
    </div>
  );
}
