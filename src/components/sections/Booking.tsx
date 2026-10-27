"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SVCS, type Locale } from "@/content/data";
import { waHref } from "@/content/site";
import BtnInner from "@/components/ui/BtnInner";
import Ms from "@/components/ui/Ms";

/* app.js renderBook/bkSend: month calendar (past days + Fridays off) → 12 slots → details → opens WhatsApp
   with the composed request. No backend: the reference never posted anywhere either. */
const TIMES = ["10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "15:00", "16:00", "16:30", "17:00"];
const FULL: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };

export default function Booking() {
  const t = useTranslations();
  const l = useLocale() as Locale;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(l === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", o);
  // "today" only exists in the browser — render the calendar after mount to avoid a hydration mismatch
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step2, setStep2] = useState(false);
  const [service, setService] = useState("");
  const [err, setErr] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only date, set once after hydration
    setToday(now);
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  // any "request service" button on the page preselects the service here (app.js [data-service])
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-service]");
      if (el) setService(el.dataset.service!);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const pickTime = (x: string) => {
    setTime(x);
    setStep2(true);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (panel.current && panel.current.getBoundingClientRect().top < 0) panel.current.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 300);
  };

  const send = (form: HTMLFormElement) => {
    const v = (k: string) => (form.elements.namedItem(k) as HTMLInputElement).value.trim();
    const nm = v("name"), ph = v("phone"), em = v("email"), nt = v("notes");
    if (!nm || ph.replace(/\D/g, "").length < 7) return setErr(t("bk.need"));
    setErr("");
    const svc = SVCS.find((s) => s.id === service);
    const msg = [
      t("bk.msg"), "",
      `${t("f.name")}: ${nm}`, `${t("f.phone")}: ${ph}`,
      ...(em ? [`${t("f.email")}: ${em}`] : []),
      ...(svc ? [`${t("f.service")}: ${svc[l].t}`] : []),
      ...(nt ? [nt] : []),
      `${fmt(day!, FULL)} — ${time} (Asia/Riyadh)`,
    ].join("\n");
    window.open(waHref(msg), "_blank", "noopener");
  };

  const two = step2 && !!day && !!time;
  const y = month?.getFullYear() ?? 0, mo = month?.getMonth() ?? 0;
  const first = month ? new Date(y, mo, 1).getDay() : 0, days = month ? new Date(y, mo + 1, 0).getDate() : 0;
  const canPrev = !!month && !!today && new Date(y, mo, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className={`ct-panel book${two ? " s2" : ""}`} id="ctCall" data-reveal="" ref={panel}>
      <div className="bk-info">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="bk-logo"><img src="/assets/brand/mark.png" alt="" /></span>
        <small>Omnexa Media</small>
        <h3>{t("bk.title")}</h3>
        <p>{t("bk.desc")}</p>
        <ul>
          <li><Ms name="schedule" /><span>{t("bk.len")}</span></li>
          <li><Ms name="videocam" /><span>{t("bk.via")}</span></li>
          <li><Ms name="public" /><span>Asia/Riyadh</span></li>
        </ul>
      </div>
      <div className="bk-cal">
        <div className="bk-mhead">
          <b id="bkMonth">{month ? fmt(month, { month: "long", year: "numeric" }) : ""}</b>
          <span>
            <button type="button" className="bk-nav" aria-label={t("bk.prevM")} disabled={!canPrev} onClick={() => setMonth(new Date(y, mo - 1, 1))}>
              <Ms name="chevron_left" className="flip" />
            </button>
            <button type="button" className="bk-nav" aria-label={t("bk.nextM")} disabled={!month} onClick={() => setMonth(new Date(y, mo + 1, 1))}>
              <Ms name="chevron_right" className="flip" />
            </button>
          </span>
        </div>
        <div className="bk-grid" id="bkGrid">
          {t("bk.days").split(",").map((d) => <span key={d} className="dn">{d}</span>)}
          {Array.from({ length: first }, (_, k) => <span key={`e${k}`} />)}
          {Array.from({ length: days }, (_, k) => {
            const dt = new Date(y, mo, k + 1);
            const off = !today || dt < today || dt.getDay() === 5; // past days and Fridays
            const sel = day?.getTime() === dt.getTime();
            return (
              <button key={k} type="button" disabled={off} aria-pressed={sel || undefined} className={today && dt.getTime() === today.getTime() ? "today" : undefined}
                onClick={() => { setDay(dt); setTime(null); setStep2(false); }}>
                {k + 1}
              </button>
            );
          })}
        </div>
      </div>
      <div className="bk-times">
        <p className="bk-day" id="bkDay">{day ? fmt(day, { weekday: "long", day: "numeric", month: "long" }) : t("bk.pick")}</p>
        <div className="bk-slots" id="bkSlots">
          {day && TIMES.map((x) => (
            <button key={x} type="button" aria-pressed={time === x || undefined} onClick={() => pickTime(x)}><bdi dir="ltr">{x}</bdi></button>
          ))}
        </div>
      </div>
      <form className="bk-step2" id="bkStep2" hidden={!two} noValidate onSubmit={(e) => { e.preventDefault(); send(e.currentTarget); }}>
        <button type="button" className="bk-back" onClick={() => setStep2(false)}>
          <Ms name="arrow_back" className="flip" /><span>{t("bk.back")}</span>
        </button>
        <p className="bk-when" id="bkWhen">
          {two && <><Ms name="event" />{fmt(day!, FULL)} — <bdi dir="ltr">{time}</bdi></>}
        </p>
        <div className="bk-fields">
          <label><span>{t("f.name")}</span><input ref={nameRef} name="name" autoComplete="name" placeholder={t("bk.phName")} required /></label>
          <label><span>{t("f.phone")}</span><input name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder={t("bk.phPhone")} required /></label>
          <label><span>{t("f.email")}</span><input name="email" type="email" dir="ltr" autoComplete="email" placeholder={t("bk.phEmail")} /></label>
          <label className="wide">
            <span>{t("f.service")}</span>
            <select id="bkService" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">{t("f.choose")}</option>
              {SVCS.map((s) => <option key={s.id} value={s.id}>{s[l].t}</option>)}
            </select>
          </label>
          <label className="wide"><span>{t("bk.notes")}</span><textarea name="notes" rows={3} placeholder={t("bk.phNotes")} /></label>
        </div>
        <button className="btn btn-primary" type="submit" id="bkSend"><BtnInner label={t("bk.confirm")} /></button>
        <p className="bk-err" id="bkErr" role="alert">{err}</p>
      </form>
    </div>
  );
}
