# Omnexa Media — SEO + GEO Audit (baseline)

**Date:** 2026-10-28 · **Repo:** `master` @ `c49ec81` (only `package-lock.json` modified, pre-existing) · **Site:** https://media.omnexa.sa
**Stack (verified):** Next.js 16.4.3 (App Router, Turbopack), React 19.3, next-intl 4 (`localePrefix: "always"`, `defaultLocale: "ar"`, no locale detection), all pages SSG (101 static routes).
**Mode:** read-only. No source files were changed.

Labels: **CODE** = confirmed in code · **PROD** = confirmed in production · **NR** = not reproduced · **NYV** = not yet verifiable.

---

## 1. Root cause of the P0 bugs

[src/lib/siteUrl.ts:2](../src/lib/siteUrl.ts) falls back to `http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is missing. `NEXT_PUBLIC_*` values are inlined **at build time**, so production was built without the variable.

Evidence:
- Production `/ar`, `/en/services/ads`: canonical, hreflang, `og:image` and `twitter:image` are all `http://localhost:3000/...` (PROD, fetched with curl on 2026-10-28).
- Production `robots.txt`: `Sitemap: http://localhost:3000/sitemap.xml` (PROD).
- Production `sitemap.xml`: all 90 `<loc>` and `xhtml:link` entries use `http://localhost:3000` (PROD).
- A local `NEXT_PUBLIC_SITE_URL=https://media.omnexa.sa next build` produced **0** files containing `localhost`, with a correct canonical, robots and OG image (verified locally).

**Impact:** Google is told that the canonical of every page is a localhost URL and gets a sitemap it cannot crawl. This is the most likely reason for weak indexing and it overrides every other SEO effort.

---

## 2. Evidence table

| # | Issue | Label | Proof | Impact | Priority |
|---|---|---|---|---|---|
| 1 | Canonical = `http://localhost:3000/...` on all pages | PROD + CODE | `curl /ar` → `<link rel="canonical" href="http://localhost:3000/ar">`; `siteUrl.ts:2` | Wrong canonical on every URL | **P0** |
| 2 | hreflang alternates use localhost | PROD + CODE | Same pages: `hrefLang="ar/en/x-default" href="http://localhost:3000/..."` | Language pairing broken | **P0** |
| 3 | `og:image` / `twitter:image` use localhost | PROD + CODE | `og:image content="http://localhost:3000/assets/covers/og.webp"` | Broken social previews | **P0** |
| 4 | robots.txt points to a localhost sitemap | PROD + CODE | `/robots.txt` body; `src/app/robots.ts:5` | Google cannot find the sitemap | **P0** |
| 5 | sitemap.xml lists only localhost URLs | PROD + CODE | `/sitemap.xml` (90 URLs); `src/app/sitemap.ts:14` | Sitemap is unusable | **P0** |
| 6 | No guard: a build without the env var silently ships localhost | CODE | `siteUrl.ts:2` silent fallback | The bug can come back | **P0** |
| 7 | Service pages reuse the **homepage** OG/Twitter title and description | PROD + CODE | `/en/services/ads`: `<title>` = "Paid Advertising…" but `og:title` = "Omnexa Media \| Content that stops the scroll"; `services/[id]/page.tsx:27-31` sets no `openGraph` | Weak, duplicate social/AI snippets | P1 |
| 8 | No `og:url` on any page | CODE | No `openGraph.url` in layout or pages | Minor; weaker share consolidation | P1 |
| 9 | Inner pages have no `x-default` alternate; homepage does | PROD + CODE | `services/[id]/page.tsx:30`, `work/[id]/page.tsx:29` | Incomplete hreflang set | P1 |
| 10 | Work pages replace `openGraph` with `{ images }` only, so they lose `og:type`, `og:locale` and `og:locale:alternate` | CODE (build output) | `work/[id]/page.tsx:30`; built `en/work/adkhil-posts.html` has no `og:locale` | Minor | P2 |
| 11 | OG image is WebP only (`og.webp`); size not declared | PROD | `/assets/covers/og.webp` → 200 `image/webp` | Some platforms (e.g. WhatsApp, LinkedIn) may not show it | P1 |
| 12 | No JSON-LD at all (no Organization / Service / Breadcrumb) | PROD + CODE | `grep ld+json` = 0 in HTML and `src/` | No explicit entity data for Google or AI systems | P1 |
| 13 | Work → service redirects are **307 (temporary)** | PROD | `/ar/work/omnexa-ads` → 307 → `/ar/services/ads`; `work/[id]/page.tsx:51` uses `redirect()` | Weak signal consolidation; should be 308 | P2 |
| 14 | `/` → `/ar` is a 307 (next-intl default) | PROD | `curl /` | Acceptable; `x-default` = `/ar` matches this | Info |
| 15 | Only 3 of 7 listed services have a landing page (ads, report, social) | CODE | `SVCPAGES` vs `SVCS` (brand, uiux, video, photo, print, mkt have none) | Missing pages for core search intents | P1 (content) |
| 16 | Only 13 of ~85 `/ar/work/*` sitemap URLs are linked in the homepage HTML | PROD (build HTML) | `grep href="/ar/work/` in `ar.html` | Possible orphan/thin pages; check WorkExplorer links | P1 (verify) |
| 17 | `srcset` entries up to `w=3840` for 180 px client logos | PROD | 290 `w=3840` occurrences in `/ar` HTML (e.g. `logos/altior.png&w=3840`) | Mostly harmless (with `sizes="180px"` the browser picks a small width). Real downloads **NYV**; needs a network trace | P2 |
| 18 | Logo ticker: 4 copies (Hero), clones marked `aria-hidden` | CODE | `Hero.tsx:79-81`, `Platforms.tsx:22`, `Clients.tsx:30` | Already handled for screen readers; the PDF finding is **NR** as an a11y bug | Info |
| 19 | Material icon ligature text (`dark_mode`, etc.) | CODE | Subset font with `display: "block"`, preloaded (`fonts.ts:33-39`); `Ms` is `aria-hidden` | Mitigated in code. Visible text when the font fails is **NYV** | P2 |
| 20 | Social links named only by id (`aria-label="instagram"`); email link label is the address | CODE | `SocialRow.tsx:11,15` | Low a11y quality | P2 |
| 21 | TikTok uses a short link `vm.tiktok.com/...` | CODE | `site.ts:79` | Weak `sameAs` value; needs the canonical profile URL from the owner | P2 (owner) |
| 22 | No privacy policy or terms; the booking form collects name, phone and email (sent through WhatsApp) | CODE | No privacy strings in `messages/*.json`; `Booking.tsx:136-138` | Trust and E-E-A-T; possible PDPL obligations | P1 (owner/legal) |
| 23 | `<html lang/dir>` | PROD | `/ar` → `lang="ar" dir="rtl"`, `/en` → `lang="en" dir="ltr"` | Correct (**NR**) | — |
| 24 | One `<h1>` per page | PROD | `/ar` and `/en/services/ads` have 1 each | Correct (**NR**) | — |
| 25 | Text fonts are TTF, not WOFF2 | CODE | `fonts.ts` (Plex/Cairo `.ttf`) | Larger font payload; LCP/CLS impact **NYV** | P2 |
| 26 | Visible FAQ section exists on the homepage | CODE | `page.tsx:28-33`, `FAQ` in `data.ts` | Ready for `FAQPage` markup that matches what users see | Info |
| 27 | Analytics (GA4/GTM) tag in the code | CODE | No `gtag`/`googletagmanager` in `src/` | GA4 property exists (per owner) but is **not installed on this site in code**; see §4 | P1 |

---

## 3. Baseline checks (before any change)

| Check | Result |
|---|---|
| `eslint` | **Fails (pre-existing):** 13 errors, 1 warning, all `no-require-imports` in `scripts/*.js` (Node CommonJS helpers). `src/` is clean. |
| `tsc --noEmit` (before build) | Fails only because `PageProps`/`LayoutProps` are generated by `next build`; passes after a build. |
| `next build` (with `NEXT_PUBLIC_SITE_URL=https://media.omnexa.sa`) | ✅ Success, 101 static pages, 0 localhost references. |
| Production status codes | `/ar` 200, `/en` 200, `/ar/services/ads` 200, `/en/services/social` 200, `/robots.txt` 200 text/plain, `/sitemap.xml` 200 application/xml, `/assets/covers/og.webp` 200. |
| Playwright tests | Exist (`tests/smoke.spec.ts`, `tests/perf.spec.ts`); not run in this audit. |
| Lighthouse / CrUX | Not run (**NYV**). `docs/perf-baseline.json` / `perf-final.json` exist from earlier work. |

---

## 4. Google access status (2026-10-28)

| Service | Status |
|---|---|
| Search Console | **Not accessed.** The built-in browser has no Google session and redirected to the public "about" page. I did not sign in (I don't enter passwords). |
| GA4 (`a401818072p546423044`) | **Not accessed**, for the same reason. |
| Sitemap submission / URL Inspection / Request indexing | **Not done.** They are also pointless until finding #1–#5 is deployed, because Google would read the localhost canonical again. |

To unblock: use your signed-in Chrome (Claude in Chrome), or export the reports listed in `SEO_GEO_IMPLEMENTATION_PLAN.md` §Phase 2.

Nothing here claims a Search Console or GA4 value.

---

## 5. Business facts found in the code (owner must confirm before use in schema)

From `src/content/data.ts` `SITE.contact`: phone/WhatsApp `+966 55 048 3401`, email `info@omnexa.sa`, parent website `https://omnexa.sa`, city "Dammam — Saudi Arabia". Social links: Instagram `omnexa_tech`, LinkedIn `omnexa-technology`, Snapchat `omnexa`, TikTok short link.
These are shown on the site today, but I have **not** verified them. I won't put them into JSON-LD until the owner confirms them, along with the legal name and the cities served.
