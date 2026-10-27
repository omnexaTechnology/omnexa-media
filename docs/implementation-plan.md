# Implementation plan — omnexa-media-web

## Current state → target
- **Current**: `../omnexa-final-run` — static AR/EN site (index.html + 4.9k-line `styles.css` + 13 JS files, GSAP/ScrollTrigger/Matter vendored). Hash routes, client-side i18n, client-side metadata. Kept untouched as the reference.
- **Target**: this folder — Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + next-intl, statically generated `/ar/*` and `/en/*`, same visuals and motion.

## Keep / reuse / adapt / replace
| Item | Decision | Why |
|---|---|---|
| `ds/tokens/*.css` (Figma tokens) | **Keep verbatim** → `src/styles/tokens/` | Single source of truth already; exported from the DS |
| `css/styles.css` | **Keep, mechanically adapted** → `src/styles/site.css` (asset URLs → `/assets/...`, font literals → next/font variables) | Layered v5–v55 overrides; re-expressing 4.9k lines as utilities would lose fidelity. New code uses tokens/Tailwind. |
| `js/data.js`, `extra.js`, `works.js`, `wmedia.js` | **Convert by script** → `src/content/data.ts` (evaluated in Node `vm`, serialised) | Byte-faithful content, typed |
| `js/i18n.js` | **Convert by script** → `src/messages/{ar,en}.json` (nested) | next-intl format, typed keys |
| `js/app.js` renderers | **Rewrite as React components** with the same DOM/class names | CSS keeps matching |
| `js/motion.js` | **Port** to `useGSAP` in one client `MotionLayer` | same timings/eases |
| `dots.js`, `squares.js`, `particles.js` | **Port** to client canvas components with cleanup | |
| `pills.js` + Matter.js | **Port**, Matter loaded via dynamic `import()` | |
| Material Symbols (Google Fonts) | **Keep** `<link>` | icons are ligatures in markup; swapping is a separate task |
| Dead code (see design-system-audit §7) | **Drop** | unreachable |
| Hash routes `#/project/<id>`, `#/service/<id>` | **Replace** with `/[locale]/work/[id]`, `/[locale]/services/[id]` | real, static, shareable URLs |

## Architecture
```
src/app/layout.tsx                       pass-through (children)
src/app/[locale]/layout.tsx              <html lang dir data-theme>, fonts, metadata, providers, Header/Footer/Fab
src/app/[locale]/page.tsx                home sections
src/app/[locale]/work/[id]/page.tsx      project page (WORK_SVC ids → redirect)
src/app/[locale]/services/[id]/page.tsx  service pages (ads | report | social)
src/app/[locale]/not-found.tsx
src/proxy.ts                             next-intl locale redirect (Next 16 "proxy" = former middleware)
src/i18n/{routing,request,navigation}.ts
src/messages/{ar,en}.json
src/content/data.ts (generated) + src/content/helpers.ts
src/components/{layout,ui,sections,motion}/…
src/styles/tokens/*.css, src/styles/site.css, src/app/globals.css (Tailwind + token bridge)
public/assets/** (copied), src/fonts/*.ttf (copied)
```
Server Components by default; client components only for: header (scroll state, drawer, theme), language switch, work explorer, testimonials, FAQ, booking, FAB, lightbox, canvases, motion layer.

## Ordered tasks
- [x] 1. Scaffold (create-next-app), add next-intl, gsap, @gsap/react, matter-js; lint/type/build baseline
- [x] 2. Copy assets/fonts; port tokens + stylesheet; globals with Tailwind token bridge
- [x] 3. Generate messages + content data from the reference JS; typed next-intl config
- [x] 4. Locale routing (proxy, `[locale]` layout, `lang`/`dir`, static params, metadata + hreflang), language switcher preserving path
- [x] 5. Shell: header (nav scroll-spy, theme, language, drawer), footer, FAB, skip link
- [x] 6. Home sections: hero, platforms, services, about, work explorer, process, clients, testimonials, FAQ, contact/booking
- [x] 7. Motion: MotionLayer (G1–G16), DotGrid, Squares, Particles, ProcessPills
- [x] 8. Project pages `/work/[id]` + service pages `/services/[id]`
- [x] 9. Validation: lint, tsc, build; browser pass AR/EN × light/dark × desktop/mobile; reduced motion; keyboard
- [x] 10. Final report

Acceptance per task: renders without console errors, matches reference screenshot of the same section, works in both directions.

## Risks / unknowns
- 68 MB of portfolio media in `public/` (unchanged from reference). Optimisation (poster sizes, AVIF, CDN) is a follow-up.
- Arabic bold 800 is synthesised (Plex ships ≤700) — same as reference.
- Matter.js pile is non-deterministic by nature; reduced-motion output is pre-simulated.
- `cacheComponents` (scaffold default in Next 16.4) conflicts with next-intl's request-locale lookup → disabled (see log).

## Decision log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-27 | Brand spelled **Omnexa Media** | Confirmed by user; matches all logos/copy |
| 2026-10-27 | New sibling app `omnexa-media-web`; reference untouched | Confirmed by user |
| 2026-10-27 | npm (Node 24.18 / npm 11); no pnpm installed | toolchain present |
| 2026-10-27 | Deps: `next-intl` (routing/messages), `gsap` + `@gsap/react` (source motion lib + safe cleanup), `matter-js` (+types) (source physics) | each required by source behaviour |
| 2026-10-27 | No React Bits / Framer Motion | source only *ports* React Bits ideas in vanilla code; nothing to install |
| 2026-10-27 | Disable `cacheComponents` / `partialPrefetching` from the scaffold | next-intl reads request locale via `headers()`; site is fully static via `generateStaticParams` + `setRequestLocale` |
| 2026-10-27 | Keep stylesheet instead of rewriting into utilities | fidelity; layered overrides |
| 2026-10-27 | `next/font/local` for Cairo + IBM Plex Sans Arabic, CSS literals replaced by font variables, `preload: false` | self-hosted with metric fallbacks; each locale renders only one family, so preloading both (~1.4 MB TTF) would waste bandwidth |
| 2026-10-27 | `localeDetection: false` | the reference always opened in Arabic; `/` → `/ar`. The URL is the source of truth; the switcher links to the same page in the other locale and restores the reading position |
| 2026-10-27 | Pre-paint script adds `gsap-on` + `motion-pending` | reveal blocks are visible without JS; only the load-timeline elements are hidden until GSAP sets their start state (3 s safety net) — no flash, no invisible content |
| 2026-10-27 | Play-once ScrollTriggers use `toggleActions: "play none none none"`, not `once: true` | `once` triggers that fire while the page loads already scrolled kill themselves inside the next trigger's refresh and crash ScrollTrigger 3.15 (reproduced on `/ar#faq` and after a language switch) |
| 2026-10-27 | Home = React components; project pages = JSX for the 9 reachable showcase layouts + one client controller; service pages = generated server-side string builder (`scripts/gen-svc-pages.js`) + `SvcEffects` | fidelity within scope; service pages are ~190 lines of bespoke mock UI (dashboards, report, IG profiles) — componentising them is a follow-up |
| 2026-10-27 | Booking month buttons use `bk.prevM/nextM` labels | the reference reused the generic prev/next labels; the specific keys already existed |

## Phase 1 status (2026-10-27)
All tasks done. Implemented routes (static, 99 pages): `/ar`, `/en`, `/{locale}/work/{44 ids}` (3 redirect to service pages), `/{locale}/services/{ads,report,social}`; `/` redirects to `/ar`.

### Verification actually run
| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npx eslint src` | pass (0 warnings) |
| `npm run build` | pass — 99 static pages |
| Browser (Chrome, dev server) `/ar` all sections @1440 vs reference screenshots | match (hero, platforms, services, about, work, process physics, clients, stories, FAQ, booking, footer) |
| `/en` @1440 | LTR, Cairo font, English copy |
| Project pages: tiles (`og-posts`), flow (`eco-web`), phone (`autobus-app`), video phone (`og-edit`) | render + interact; video autoplays muted when sound is blocked |
| Service pages ads / report / social | render; counters + reveals run |
| Dark theme toggle | applies, persists (`om-theme`), `aria-pressed` updates |
| Language switch on `/ar/work/bling-logo` and `/ar#faq` | same page in the other locale, `lang`/`dir` correct, localized `<title>`, reading position kept |
| Mobile 390 px | no horizontal overflow; drawer opens, Escape closes, `aria-expanded` resets |
| Booking | validation message, service preselected from a "request" button, WhatsApp message composed correctly (`window.open` stubbed — nothing sent) |
| Keyboard: work tabs in RTL | ArrowLeft → next, End → last |
| Console | no errors / hydration warnings after the fixes above |

### Not verified (manual steps)
- **Reduced motion**: not emulated in the browser tool. Code paths: GSAP builds nothing, canvases draw a still frame, intervals/autoplay are skipped. Check in DevTools → Rendering → "prefers-reduced-motion: reduce".
- Tablet (768) and wide (1920+) widths, Safari/Firefox, real touch devices.
- Production server (`npm start`) smoke test — only the build was run.
- Screen-reader pass.

## Phase 2 — production hardening (2026-10-27)

### What changed
| Area | Change | Files |
|---|---|---|
| Images | All raster images go through `next/image` (AVIF → WebP fallback, width-matched `srcset` via per-layout `sizes`, lazy by default, intrinsic width/height from `src/content/media-dims.json` so no layout shift). The two images swapped by script (phone screen, cover-flow backdrop) use optimised URLs too. Originals stay in `public/assets` as the optimiser's source. | `next.config.ts` (`images`), `components/ui/Img.tsx`, `lib/imageUrl.ts`, `project/{Showcase,VideoStage,ProjectControls,EndCta}.tsx`, `sections/{SxCard,Clients}.tsx`, `ui/ClientLogo.tsx`, `scripts/gen-media-dims.js` |
| Video | Not re-encoded (already 540×960 at 0.4–1.1 Mbit/s; the only local encoder, `avconvert`, has no codec all browsers play better than the current H.264). Delivery fixed: card/hero clips render without `src`, get it and play only near the viewport, pause when they leave; the project phone player is `preload="none"` and starts only when 25 % visible (resumes after scrolling back unless the visitor paused it). Reduced motion → posters only. | `ui/AutoVideo.tsx`, `project/VideoStage.tsx`, `project/ProjectControls.tsx` |
| Service pages | The generated string builder (`src/legacy/svc-page-html.js` + `scripts/gen-svc-pages.js`) is replaced by 11 React section components + 6 shared blocks; the page composes them per id. Output verified identical to the legacy HTML for all 6 pages (see Verification). Dead code in the source builder (`BA`, `STEP_IC`, `REP_IC`, `posts()`, the unused "after" profile branch) not ported. | `components/services/{shared,Ads,Report,Social}.tsx`, `app/[locale]/services/[id]/page.tsx`, `scripts/svc-snapshot.js`, `tests/fixtures/svc-*.html` |
| Icons | Material Symbols no longer loaded from Google Fonts: an 87-icon subset (Google's `icon_names` parameter) is self-hosted through `next/font/local` and preloaded — **14.4 KB instead of the 662 KB full font**, no third-party request. A test fails if a page renders an icon missing from the subset. | `scripts/gen-icons.js`, `src/fonts/material-symbols-*`, `lib/fonts.ts`, `site.css` (`.ms` font family), `[locale]/layout.tsx` |
| SEO | `sitemap.xml` (90 URLs = 45 pages × 2 locales, each with its hreflang twin; the 3 works that redirect to service pages are excluded) and `robots.txt`; one origin for metadata/sitemap/robots via `NEXT_PUBLIC_SITE_URL` (`.env.example`). Each page has one `h1`, `lang`/`dir`, hreflang alternates (tested). | `app/sitemap.ts`, `app/robots.ts`, `lib/siteUrl.ts`, `.env.example` |
| Bugs fixed | (1) Opening a page with `#section` (e.g. nav links from a project page, `/ar#faq`) stayed at the top in production — the reference scrolled to the target in JS; ported (`scrollToHashTarget`). (2) Lightbox focus trap leaked in Safari (its default Tab skips buttons) → focus is now cycled explicitly. (3) Closing the lightbox in Safari returned focus to `<body>` → focus returns to the tile that opened it. | `layout/{Header,localeSwitch}.ts(x)`, `project/ProjectControls.tsx` |
| Contact data | WhatsApp number left as reference data, annotated as **unverified** at its single use (`waHref` in `content/site.ts`). | — |
| Tooling | `@playwright/test` (devDependency) + its Chromium/WebKit/Firefox builds; `playwright.config.ts` runs against `next start` on :3200. | `tests/smoke.spec.ts`, `tests/perf.spec.ts` |

### Transfer size (measured)
Method: `tests/perf.spec.ts`, Playwright **WebKit** (Playwright's Chromium cannot decode H.264, so it never fetches the mp4s), production server on localhost, cold cache. *First view* = everything loaded 5 s after `load`; *full scroll* = after wheel-scrolling to the bottom. Bytes = response bodies + headers, in MB. Raw data: `docs/perf-baseline.json`, `docs/perf-final.json`.

| Page @ viewport width | First view | After full scroll | Fonts | Images (full) | Video (full) |
|---|---|---|---|---|---|
| `/ar@390` | 6.28 → **2.82** (-55%) | 6.72 → **2.98** (-56%) | 1.04 → 0.4 | 1.44 → 0.43 | 3.86 → 1.75 |
| `/ar@1440` | 6.28 → **4.93** (-21%) | 6.91 → **5.25** (-24%) | 1.04 → 0.4 | 1.64 → 0.59 | 3.86 → 3.86 |
| `/ar/work/nabaa-photo@390` | 3.19 → **1.08** (-66%) | 3.78 → **1.21** (-68%) | 1.04 → 0.4 | 2.42 → 0.47 | 0 → 0 |
| `/ar/work/nabaa-photo@1440` | 3.19 → **1.49** (-53%) | 3.92 → **1.85** (-53%) | 1.04 → 0.4 | 2.56 → 1.11 | 0 → 0 |
| `/ar/work/og-edit@390` | 10.27 → **1.01** (-90%) | 11.31 → **8.14** (-28%) | 1.04 → 0.4 | 0.57 → 0.3 | 9.38 → 7.1 |
| `/ar/work/og-edit@1440` | 10.27 → **1.01** (-90%) | 11.31 → **9.38** (-17%) | 1.04 → 0.4 | 0.57 → 0.3 | 9.38 → 8.35 |

Remaining weight is video that is actually on screen: on desktop the four hero reels (≈3.9 MB) are visible at load; on video project pages the clips play when scrolled to. Largest files: `w2/qudrat-motion/v02.mp4` 4.0 MB, `w2/bestwash-edit/v00.mp4` 3.4 MB, `w2/qudrat-motion/v01.mp4` 3.0 MB (full list: `docs/media-inventory.md`). The remaining 0.4 MB of fonts is the Arabic/English text fonts (TTF). `public/assets` is still 76 MB on disk: originals are kept as the optimiser's source; 56 files (7.39 MB, listed in `docs/media-inventory.md`) are never requested by any page.

### Verification (Phase 2, actually run)
| Check | Result |
|---|---|
| `npx tsc --noEmit` / `npx eslint src` | pass / pass |
| `npm run build` | pass — 101 routes = 99 pages + `sitemap.xml` + `robots.txt` |
| Service-page refactor diff (`scripts/svc-snapshot.js`, normalised HTML between hero and end CTA, 3 pages × 2 locales) | identical except the closing tag of the removed legacy wrapper `div` |
| `npx playwright test tests/smoke.spec.ts` — **Chromium 156** | 26/26 pass |
| same — **WebKit 27.2 (Safari engine)** | 26/26 pass |
| same — **Firefox 157** | **not run**: Playwright's Firefox build exits with "Could not find profile folder" on this Mac (macOS 27.0.1), also when launched directly with an existing profile and outside the command sandbox. Firefox is untested. |
| Routes covered | `/ar`, `/en`, 6 project layouts (tiles, flow, phone, video, a4, side), 3 service pages, `/` → `/ar`, work→service redirect, 2 × 404 — status 200, `lang`/`dir`, one `h1`, title, hreflang, no console errors, no HTTP ≥ 400, all icons in subset |
| Widths 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920 × ar/en × home, `/work/eco-web`, `/services/ads` | no horizontal panning in either engine. One clipped (non-pannable) 5 px overflow: dashboard panels on `/ar/services/ads` @360 — identical in the reference |
| Visual comparison with the reference (served read-only) | 768 ar hero/work, 360 ar services, 1920 en hero: match (hero cards differ only by entrance-animation timing; settled state verified) |
| Interactions | theme persists; language switch keeps path + reading position; `/ar#faq` lands on FAQ; drawer + Escape; work tabs ArrowLeft/End (RTL) and ArrowRight (LTR); search empty state + reset; lightbox open/arrows/focus trap/Escape/focus return; booking validation, preselected service, composed WhatsApp URL — `window.open` stubbed, **nothing sent** |
| Reduced motion (Playwright `reducedMotion: "reduce"`, both engines) | `html.reduce-motion`, hero title opacity 1 / no transform, headings fully visible, hero clips have no `src` (poster only), work strip does not auto-rotate |
| Accessibility spot checks | skip link first in tab order (Option+Tab in Safari), visible focus ring, every input/select/textarea labelled, contrast ≥ 4.5:1 for body text, section lead, card text, primary button, footer, booking text in light and dark (lowest 9.57:1) |

### Still not verified
- Firefox (see above) and real iOS/Android devices.
- Screen-reader pass (VoiceOver/NVDA) — only automated a11y spot checks ran.
- Lighthouse / Core Web Vitals in the field (only transfer size was measured).
- The production host itself (Vercel/Node) — the optimiser was exercised by `next start` locally.

## Outstanding items
1. **WhatsApp number `966550483401` is unverified** as the Media line (flagged in the reference's `js/data.js`). It is the only number used (`SITE.contact.whatsapp` → `waHref`), so a correction is one change in the source data + `node scripts/gen-content.js`.
2. Set `NEXT_PUBLIC_SITE_URL` in production — canonical/hreflang/OG/sitemap URLs default to `http://localhost:3000`.
3. Hero reels on desktop (≈3.9 MB, all visible at load): shorter loops or a lower bitrate would cut this further, but changes the content — needs a decision; trimming is possible locally with `avconvert --start/--duration`.
4. `next/image` cache can't be invalidated: give a replaced image a new file name (`minimumCacheTTL` 31 days).
5. Firefox + screen-reader testing on a machine where they are available.
