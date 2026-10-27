"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CLIENTS, SECTORS, SVCS, WORKS, type Locale, type Work } from "@/content/data";
import { norm, sec } from "@/content/site";
import Ms from "@/components/ui/Ms";
import SxCard from "./SxCard";

/* app.js buildSlider / sxPage / sxRun: filters (tab, sub-tab, sector, search) → four cards per page, open card rotates */
const PER = 4;
type Filters = { dept: string; sub: string; cat: string; q: string };

function matches(w: Work, f: Filters, skip: { cat?: boolean; sub?: boolean } = {}) {
  if (!skip.cat && f.dept !== "all" && w.cat !== f.dept) return false;
  if (!skip.sub && f.sub !== "all" && `${w.cat}.${w.sub}` !== f.sub) return false;
  if (f.cat !== "all" && w.sec !== f.cat) return false;
  const q = norm(f.q.trim());
  if (!q) return true;
  const g = sec(w.cat), sb = (g.subs as string[][]).find((s) => s[0] === w.sub) ?? [];
  const sc = (SECTORS as Record<string, { ar: string; en: string }>)[w.sec], cl = (CLIENTS as Record<string, { ar: string; en: string }>)[w.c];
  const hay = norm([w.ar.n, w.en.n, g.ar.t, g.en.t, sb[1], sb[2], sc.ar, sc.en, cl.ar, cl.en].join(" | "));
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export default function WorkExplorer() {
  const t = useTranslations();
  const l = useLocale() as Locale;
  const [f, setF] = useState<Filters>({ dept: "all", sub: "all", cat: "all", q: "" });
  const [input, setInput] = useState("");
  const [page, setPage] = useState(0);
  const hold = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  // counts reflect search + sector filters, like the reference
  const pool = useMemo(() => WORKS.filter((w) => matches(w, f, { cat: true, sub: true })), [f]);
  const tabs = [{ id: "all", label: t("work.all"), count: pool.length }, ...SVCS.map((g) => ({ id: g.id, label: g[l].t, count: pool.filter((w) => w.cat === g.id).length }))];
  const inG = pool.filter((w) => f.dept === "all" || w.cat === f.dept);
  const subs = [{ id: "all", label: t("wk.subAll"), count: inG.length }];
  for (const g of f.dept === "all" ? SVCS : [sec(f.dept)])
    for (const s of g.subs as string[][]) {
      const n = inG.filter((w) => w.cat === g.id && w.sub === s[0]).length;
      if (n || f.dept !== "all") subs.push({ id: `${g.id}.${s[0]}`, label: s[l === "ar" ? 1 : 2], count: n });
    }
  const sub = subs.some((d) => d.id === f.sub) ? f.sub : "all";
  const list = WORKS.filter((w) => matches(w, { ...f, sub }));
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const pg = page < pages ? page : 0;
  const part = list.slice(pg * PER, pg * PER + PER);
  const rowKey = `${f.dept}|${sub}|${f.cat}|${f.q}|${pg}`;
  // the open card resets to the first one whenever the set of cards changes
  const [openState, setOpenState] = useState({ key: rowKey, i: 0 });
  const open = openState.key === rowKey ? openState.i : 0;
  const setOpen = (u: number | ((i: number) => number)) =>
    setOpenState((s) => { const cur = s.key === rowKey ? s.i : 0; return { key: rowKey, i: typeof u === "function" ? u(cur) : u }; });

  // debounce search typing (160ms) as in the reference
  useEffect(() => {
    const id = setTimeout(() => { setF((o) => ({ ...o, q: input })); setPage(0); }, 160);
    return () => clearTimeout(id);
  }, [input]);

  // new set of cards: the motion layer replays the entrance (om:work)
  useEffect(() => {
    document.dispatchEvent(new CustomEvent("om:work"));
  }, [rowKey]);

  // the open card moves along every 3.6 s; hover/focus/hidden tab pauses it
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || part.length < 2) return;
    const id = setInterval(() => { if (!hold.current && !document.hidden) setOpenState((s) => ({ key: rowKey, i: ((s.key === rowKey ? s.i : 0) + 1) % part.length })); }, 3600);
    return () => clearInterval(id);
  }, [rowKey, part.length]);

  const showWork = () => {
    const el = tabsRef.current;
    if (!el) return;
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - hh - 12, behavior: smooth ? "smooth" : "auto" });
  };
  const update = (patch: Partial<Filters>) => { setF((o) => ({ ...o, ...patch })); setPage(0); };

  // roving tabs: arrows follow reading direction, Home/End jump
  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl = document.documentElement.dir === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (step === undefined && e.key !== "Home" && e.key !== "End") return;
    const tabsEls = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=tab]")];
    const i = tabsEls.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === "Home" ? tabsEls[0] : e.key === "End" ? tabsEls.at(-1)! : tabsEls[(i + step! + tabsEls.length) % tabsEls.length];
    next.click();
    next.focus();
  };

  const reset = () => { setInput(""); setF({ dept: "all", sub: "all", cat: "all", q: "" }); setPage(0); };

  return (
    <>
      <div className="wk-bar2" data-reveal="">
        <div className="wk-tools2">
          <label className="wk-search">
            <Ms name="search" />
            <input
              id="workSearch"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder={t("work.search")}
              aria-label={t("work.search")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape" && input) { e.stopPropagation(); setInput(""); } }}
            />
            <button type="button" className="wk-clear" id="wkClear" hidden={!input} aria-label={t("wk.clear")} onClick={() => setInput("")}>
              <Ms name="close" />
            </button>
          </label>
          <label className="wk-ind">
            <span className="sr">{t("wk.ind")}</span>
            <select id="wkCat" value={f.cat} onChange={(e) => update({ cat: e.target.value })}>
              <option value="all">{t("wk.indAll")}</option>
              {Object.entries(SECTORS).map(([k, s]) => <option key={k} value={k}>{s[l]}</option>)}
            </select>
            <span className="wk-ind-arr" aria-hidden="true"><span className="ms">keyboard_arrow_down</span></span>
          </label>
        </div>
        <div className="dept-tabs wk-tabs1" role="tablist" id="workTabs" aria-label={t("work.tag")} ref={tabsRef} onKeyDown={onTabKey}>
          {tabs.map((d) => (
            <button key={d.id} className="dept-tab" role="tab" type="button" data-group="work" data-id={d.id} aria-selected={d.id === f.dept} tabIndex={d.id === f.dept ? 0 : -1}
              onClick={() => { update({ dept: d.id, sub: "all" }); showWork(); }}>
              <span>{d.label}</span><span className="cnt">{d.count}</span>
            </button>
          ))}
        </div>
        <div className="wk-tabs2" role="tablist" id="workSubs" aria-label={f.dept === "all" ? t("work.all") : sec(f.dept)[l].t} onKeyDown={onTabKey}>
          {subs.map((d) => (
            <button key={d.id} className="wk-sub" role="tab" type="button" data-wk-sub={d.id} aria-selected={d.id === sub} tabIndex={d.id === sub ? 0 : -1}
              onClick={() => { update({ sub: d.id }); setTimeout(showWork, 0); }}>
              <span>{d.label}</span><span className="cnt">{d.count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`wk-scroll${list.length ? "" : " empty"}`} id="gfold">
        <div
          key={rowKey}
          className="sx in"
          id="wkRow"
          onMouseEnter={() => (hold.current = true)}
          onMouseLeave={() => (hold.current = false)}
          onFocus={() => (hold.current = true)}
          onBlur={() => (hold.current = false)}
          onMouseOver={(e) => {
            const c = (e.target as HTMLElement).closest<HTMLElement>(".sx-c:not(.on)");
            if (c && matchMedia("(hover: hover)").matches) setOpen(+c.dataset.sx!);
          }}
        >
          {part.map((w, n) => <SxCard key={w.id} w={w} n={n} on={n === open} l={l} onOpen={setOpen} />)}
        </div>
        <div className="ring-empty" id="ringEmpty" hidden={list.length > 0}>
          <svg className="nf-ill" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="nf-bg" cx="60" cy="60" r="50" />
            <g className="nf-lens"><circle cx="54" cy="52" r="22" /><path d="M70 68l18 18" /><path className="nf-q" d="M48 46a6 6 0 1 1 9 5c-2 1-3 2-3 4M54 60v.5" /></g>
            <circle className="nf-d d1" cx="24" cy="30" r="3" /><circle className="nf-d d2" cx="98" cy="36" r="2.5" /><circle className="nf-d d3" cx="92" cy="96" r="3" />
          </svg>
          <b>{t("work.empty")}</b>
          <span>{t("wk.emptyP")}</span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={reset}>{t("wk.reset")}</button>
        </div>
      </div>
      <div className="pgr" data-pager="work" hidden={pages < 2}>
        <button className="pg-btn pg-prev" type="button" aria-label={t("lb.prev")} onClick={() => setPage((pg - 1 + pages) % pages)}>
          <Ms name="chevron_left" className="flip" />
        </button>
        <span className="pg-dots">
          {Array.from({ length: pages }, (_, k) => (
            <button key={k} type="button" className={k === pg ? "on" : undefined} aria-current={k === pg} aria-label={`${k + 1} / ${pages}`} onClick={() => setPage(k)} />
          ))}
        </span>
        <button className="pg-btn pg-next" type="button" aria-label={t("lb.next")} onClick={() => setPage((pg + 1) % pages)}>
          <Ms name="chevron_right" className="flip" />
        </button>
      </div>
    </>
  );
}
