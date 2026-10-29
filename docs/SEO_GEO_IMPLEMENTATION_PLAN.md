# Omnexa Media — SEO + GEO Implementation Plan

Based on `docs/SEO_GEO_AUDIT.md` (2026-10-28). Finding numbers (#) refer to that audit.
Order = dependency order. Nothing later in this plan pays off until Phase 1 is live.

---

## Phase 1 — P0: Stop shipping localhost (day 1)

**1.1 Set the env var in the hosting platform (owner/devops; no code needed)**
- Set `NEXT_PUBLIC_SITE_URL=https://media.omnexa.sa` for the **Production** environment of the host that builds media.omnexa.sa.
- Trigger a **fresh build**. A restart is not enough, because the value is inlined at build time.
- Fixes #1–#5 on its own. I verified this locally: 0 localhost references after the build.

**1.2 Make it impossible to regress (code)**
- `src/lib/siteUrl.ts`: in a production build, throw if `NEXT_PUBLIC_SITE_URL` is missing or is not `https://`. Keep the localhost fallback for `next dev` only.
- Update `.env.example` to `https://media.omnexa.sa`.

**1.3 Complete per-page metadata (code)**
- Add a small helper (e.g. `src/lib/seo.ts`) that builds `alternates` (canonical, `ar`, `en`, `x-default: /ar/...`) and `openGraph` (title, description, url, type, locale, alternateLocale, image) for a path, so the layout, service and work pages share one source.
- Service pages: page-specific `og:title`/`og:description` (#7), `x-default` (#9), `og:url` (#8).
- Work pages: keep the cover image but stop dropping `og:locale`/`type` (#10).
- OG image: add a **1200×630 JPG** (`/assets/covers/og.jpg`) with `width`/`height`/`alt`, made from the existing `og.webp` (#11).

**1.4 Tests**
- Extend `tests/smoke.spec.ts` with a metadata matrix: `/ar`, `/en`, `/ar/services/ads`, `/en/services/social`, one `/work/*`.
- Assert: absolute `https://media.omnexa.sa` canonical equal to the page's own URL; reciprocal `ar`/`en` plus `x-default`; OG image returns 200; no `localhost` in `/robots.txt` or `/sitemap.xml`.

**Acceptance:** after deploy, `curl` on production shows zero `localhost` in HTML, robots and sitemap. Every sampled canonical equals its own HTTPS URL.

---

## Phase 2 — P0/P1: Search Console (immediately after Phase 1 is live)

Read-only first. Change nothing until access is confirmed on the **existing** `https://media.omnexa.sa/` property (or the `omnexa.sa` Domain property). Do not create a duplicate.

1. **Baseline export** (before resubmitting): Performance (3 months + 28 days: queries, pages, countries, devices, split by `/ar` and `/en`); Pages/Indexing reasons; Sitemaps status; Core Web Vitals; HTTPS. Note whether a generative-AI report exists in the UI.
2. **URL Inspection** on `/ar`, `/en`, `/ar/services/ads`, `/en/services/ads`, `/ar/services/social`. Record the user-declared and Google-selected canonical and the last crawl. Expect "user-declared = localhost" in data from before the fix.
3. **Sitemaps:** submit `https://media.omnexa.sa/sitemap.xml`. Remove any submitted localhost or broken sitemap entry.
4. **Request indexing** only for the 5 URLs above plus the remaining service pages. Don't bulk-submit.
5. Re-check in 7–14 days. Google decides timing, and there is no promise of indexing.

**Exports needed if browser access isn't available:** Performance CSV (Queries, Pages, Countries, Devices); Pages report with each "why not indexed" reason and examples; Sitemaps screenshot; URL Inspection screenshots for the 5 URLs.

---

## Phase 3 — P1: Crawl, redirect and link hygiene

- **Work → service redirects** (#13): use `permanentRedirect()` (308) in `work/[id]/page.tsx:51`. Check whether the SSG output honours it in production.
- **Orphan check** (#16): crawl the built site and confirm every sitemap `/work/*` URL is reachable through an `<a href>` (not only via a JS-driven explorer). If not, add crawlable links (e.g. "all projects" lists per category) or drop thin work pages from the sitemap.
- **Thin work pages:** pages with no images, no videos and no description (`pd.soon` placeholder). Either `noindex` and remove them from the sitemap, or fill them with content.
- **Sitemap:** add `lastModified` only if a real date source exists (no fake dates).
- Unique title/description check across all 101 routes (script in tests).

---

## Phase 4 — P1: Entity and structured data (GEO foundation)

Requires owner confirmation (see Owner inputs). Add one JSON-LD graph per page from a single source file. Don't duplicate blocks.

| Page | Schema | Content basis |
|---|---|---|
| All (layout) | `Organization` (+ `WebSite`) with stable `@id` `https://media.omnexa.sa/#org`: name (ar/en), logo, url, email, telephone, `sameAs` (confirmed socials), `parentOrganization` → omnexa.sa if true, `areaServed` = confirmed cities | Footer/contact facts |
| Service pages | `Service` (`provider` → `#org`, `serviceType`, `areaServed`) + `BreadcrumbList` (Home → Services → page) | Visible H1/lead |
| Work pages | `CreativeWork` (`creator` → `#org`, client name only if permitted) + `BreadcrumbList` | Visible case content |
| Homepage | `FAQPage` mirroring the visible FAQ exactly | `FAQ` in `data.ts` |

`LocalBusiness` only if there is a real Dammam office that customers visit and it matches the Google Business Profile. Validate with Rich Results Test and validator.schema.org. A pass shows eligibility, not a rich result.

Also:
- Make contact details, city and "serving the Kingdom of Saudi Arabia / Eastern Province" (only what's true) visible in the footer or contact section, in both languages.
- Social links: descriptive `aria-label` ("Omnexa Media on Instagram"), `rel="noopener noreferrer"`, and the canonical TikTok profile URL (#20, #21).
- Privacy policy page `/[locale]/privacy` with owner/legal-approved text, linked from the footer and the booking form (#22).

---

## Phase 5 — P1/P2: Content and landing pages (biggest long-term lever)

Today only **ads, report, social** have pages. The homepage lists 7 services. Build one strong page per **real** service, in priority order. Validate the order with Search Console query data from Phase 2.

| Priority | Page (ar / en) | Primary intent (Saudi market) |
|---|---|---|
| 1 | `/services/branding` — تصميم الهوية البصرية / Brand identity design | "تصميم هوية بصرية", "تصميم شعار" |
| 2 | `/services/video` — إنتاج فيديو وموشن جرافيك / Video & motion production | "شركة موشن جرافيك", "تصوير ريلز" |
| 3 | `/services/photography` — التصوير الإعلاني / Advertising photography | "تصوير منتجات", "تصوير إعلاني الدمام" (only if true) |
| 4 | `/services/uiux` — تصميم واجهات وتجربة المستخدم | "تصميم UI UX" |
| 5 | `/services/print` — المطبوعات والتغليف | "تصميم تغليف" |

Each page needs:
- One H1 for the intent and a 40–60 word direct answer under it ("what this is, for whom, what you get").
- Deliverables, process (reuse `PROCESS`), real related work items linked from `WORKS`, a visible FAQ of 3–5 real questions, and a CTA to booking/WhatsApp.
- Arabic written for Saudi search terms, not translated literally.
- Links from the homepage service cards, the footer, related work pages, and between services.

No city doorway pages. Mention Dammam, Khobar, Riyadh, etc. only where the business really serves them, in one line of true copy.

**Case studies (upgrade 3–5 best work pages):** challenge → approach → deliverables → result. Use dated, measurable results only with client permission.

**Insights (after the service pages):** 1–2 practical Arabic-first guides per month, each tied to a service and reviewed by a named team member, e.g. "كم تكلفة تصميم هوية بصرية في السعودية؟ (العوامل)" or "Snapchat vs TikTok ads for Saudi businesses". A brief template is in the source plan §5.

---

## Phase 6 — GEO / AI-search readiness

GEO here means making accurate Omnexa facts easy for search and answer engines to find, understand and cite. It is not a trick.

- Phases 1–5 already do most of the work: crawlable SSR text, clear entity (`Organization` + `sameAs`), one page per service with direct answers, real FAQs and case studies with dates and numbers.
- Keep facts identical everywhere: the same name (أومنيكسا ميديا / Omnexa Media), phone, city and services on the site, Google Business Profile, LinkedIn, Instagram bio and omnexa.sa. AI systems reconcile entities across sources.
- Earn real third-party mentions: client-approved case studies on clients' sites, Saudi agency directories, LinkedIn posts about launches. No fake reviews or bought mentions.
- AI crawler policy (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) is an **owner decision**. The current robots.txt allows all. Don't add `llms.txt` as a ranking tactic.
- **Manual citation log** (monthly): 10 fixed buyer questions in Arabic and English (e.g. "أفضل وكالة تسويق في الدمام", "شركة إدارة سوشيال ميديا في الشرقية", "branding agency Saudi Arabia"). Ask Google AI Mode/Overviews, ChatGPT, Perplexity, Gemini and Copilot. Record date, system, whether Omnexa was mentioned or cited, and which URL. This is a directional signal only.

---

## Phase 7 — Analytics (GA4 `p546423044`)

- The GA4 property exists, but **no Google tag is in the code**. First check whether it's injected another way (host integration, GTM). Open DevTools on production and look for `collect?v=2`.
- If it's absent: add the Google tag once through `@next/third-parties/google` (`GoogleAnalytics gaId="G-…"`). The owner supplies the Measurement ID (`G-XXXX`, not the property number).
- Conversion events (no PII): `booking_submit` (WhatsApp opened from the booking form), `whatsapp_click`, `phone_click`, `email_click`, `service_cta_click` with `service` param.
- Consent: add a consent banner or Consent Mode defaults if the privacy review requires it.
- AI referral segment: session source matching `chatgpt.com|perplexity.ai|gemini.google.com|copilot.microsoft.com|claude.ai`.

---

## Phase 8 — KPIs and cadence

| KPI | Source | Baseline | Target signal |
|---|---|---|---|
| Valid canonical / sitemap URLs | curl tests + GSC Sitemaps | 0 % (localhost) | 100 % |
| Indexed priority URLs (home + services ×2 locales) | GSC URL Inspection | TBD (Phase 2) | All indexed |
| Impressions / clicks by `/ar` vs `/en` | GSC Performance | TBD | Upward trend over 3 months |
| Non-brand queries with impressions | GSC | TBD | Grows as service pages launch |
| Qualified leads (booking + WhatsApp clicks) | GA4 events | none tracked | Measured, then grow |
| AI referrals | GA4 segment | TBD | Tracked |
| AI citations (10-question log) | Manual monthly | TBD | Directional only |
| CWV (LCP/INP/CLS) | GSC CWV + PSI | TBD | "Good" |

Review weekly for the first month after Phase 1, then monthly. Note each deploy and content launch in GA4/GSC notes.

---

## Status check — 2026-10-28 (read-only; nothing was changed in Google)

| Item | Finding |
|---|---|
| Phase 1 code | Merged to `master` (PR #1, `1919b7b`). **Live site still serves localhost URLs**, so the new build is not deployed yet. |
| Analytics on live site | **None.** No `gtag`, GTM, `dataLayer` or Google requests on `https://media.omnexa.sa/ar`. |
| GA4 property `a401818072p546423044` | One web stream: `www.omnexa.sa`, Measurement ID `G-HCVNPRQZJC`. Shows "Data collection isn't active"; no data in 48 h. No stream for `media.omnexa.sa`. |
| Search Console (account `mohamed1.shamseldeen@gmail.com`) | Only property: `https://omnexa.sa/` (URL-prefix; user, **not a verified owner**; added 27 Oct 2026). It does **not** cover `media.omnexa.sa`. `https://media.omnexa.sa/` → "no access". `sc-domain:omnexa.sa` → "no access" (either it doesn't exist or this account isn't on it). The generative-AI performance report is available in the UI for `omnexa.sa`. |
| Orphan pages (#16) | **Not reproduced.** Every sitemap URL is linked by `<a href>` from at least one other built page. |
| Thin work pages | None found by heuristic (empty placeholder, or no description + <2 images + no video). |
| Duplicate titles | 3 pairs, all `/ar/work/omnexa-{ads,social,report}` vs. their service page. These are redirect stubs; a 308 removes them. |
| Duplicate descriptions | 2 pairs (ar + en): two print/packaging work pages fall back to the same category description. |

### Phase 3, split by dependency

| Sub-phase | Work | Depends on | Who |
|---|---|---|---|
| **3A — Search Console access** ★ | Find out whether `sc-domain:omnexa.sa` exists under another account. If yes → add `mohamed1.shamseldeen@gmail.com` as Owner/Full user. If no → create a Domain property `omnexa.sa` (DNS TXT at the registrar; best) **or** a URL-prefix property `https://media.omnexa.sa/` verified with a meta tag that we ship in code. | Owner / DNS admin decision | Owner (+ me for the meta-tag path) |
| **3B — Small code fixes** | 308 permanent redirects for `omnexa-*` work stubs; unique fallback descriptions for the 2 print pages (append client name); optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` support. | Nothing | Me |
| **3C — GA4 install** | Add the Google tag once (`@next/third-parties/google`) from `NEXT_PUBLIC_GA_ID`; decide `G-HCVNPRQZJC` (shared stream, filter by hostname) vs. a dedicated `media.omnexa.sa` stream/property; conversion events (`booking_submit`, `whatsapp_click`, `phone_click`, `email_click`) without PII. | Owner choice of stream + privacy/consent decision | Me (code) + owner |
| **3D — After deploy** | Re-check live site for localhost; GSC baseline export; submit sitemap; URL Inspection + request indexing for home + 3 service pages ×2 locales; verify GA4 Realtime. | Deploy + 3A | Me (with access) |

## Status update — 2026-10-29

| Item | Status |
|---|---|
| Live site | Canonicals, hreflang, sitemap (90 URLs) and robots all use `https://media.omnexa.sa`; `omnexa-*` work stubs return 308. |
| GA4 | `G-HCVNPRQZJC` collecting on `media.omnexa.sa` (Realtime confirmed). Key events not marked yet. |
| Search Console | URL-prefix property `https://media.omnexa.sa/` created and **verified (HTML file `public/google22884ed680ea321c.html` — keep it)**. The GA method failed because the tag is injected after hydration. `sitemap.xml` submitted: success, 90 pages discovered. Performance/Indexing reports still processing → baseline export pending. |
| Structured data (owner-independent slice) | `WebSite` on `/ar` and `/en`; `BreadcrumbList` (Home → page) on service and work pages. `Organization`/`Service`/`FAQPage` still wait for owner facts. |
| Social links | `aria-label` names the platform ("Omnexa Media on Instagram"), `rel="noopener noreferrer"`. Canonical TikTok URL still to confirm. |

## Owner inputs (blocking items marked ★)

1. ★ Access to the hosting dashboard (or someone to set `NEXT_PUBLIC_SITE_URL` and redeploy).
2. ★ Search Console access in a signed-in browser, or the exports listed in Phase 2.
3. ★ GA4 Measurement ID (`G-…`), and whether GTM is used.
4. Legal name (ar/en), confirmed phone/WhatsApp/email, office address or "service-area only", cities served.
5. Official social URLs (canonical TikTok profile) and whether a Google Business Profile exists.
6. Privacy policy text approved by the owner and a legal reviewer (PDPL).
7. Which services are real and priority for 2026 (confirms the Phase 5 order).
8. Client permission plus real results for 3–5 case studies.
9. AI-crawler policy decision.

## Next 5 actions (ranked)

1. Set `NEXT_PUBLIC_SITE_URL` in production and rebuild (fixes the P0s; ~10 min).
2. Code PR: build guard, shared metadata helper, JPG OG image, x-default, metadata tests (Phase 1.2–1.4).
3. Search Console: baseline export → submit sitemap → inspect and request indexing for priority URLs.
4. Organization/Service/Breadcrumb/FAQ JSON-LD and footer contact facts, after owner confirmation.
5. Ship the branding and video service pages, then measure in GSC.
