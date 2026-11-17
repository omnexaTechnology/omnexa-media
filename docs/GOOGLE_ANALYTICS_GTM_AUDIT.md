# Google Analytics & Google Tag Manager Audit: media.omnexa.sa

Date: 2026-11-17 · Branch: `analytics/gtm-audit` · Auditor access: GTM account `Omnexa Media` (6405216646) and GA4 account `Omnexa Media` (416362336) as Administrator; no access to Vercel or to the account that owns `GTM-KSHRL7JL`.

## A. Executive Summary

| Question | Answer |
|---|---|
| Is GTM correctly installed? | **PARTIAL**. The code (PR #12) is correct, but the live build never received a container ID, so production loads **no** GTM. Fixed in this branch; not yet deployed. |
| Is GA4 correctly configured? | **YES**. Property `564394064`, web stream `G-W3XN5NQR7S` for `https://media.omnexa.sa`. Both containers (`GTM-KSHRL7JL` and `GTM-KQLT29JX`) contain a Google tag for `G-W3XN5NQR7S` that fires on page load. |
| Is production tracking working? | **NO** (today). Verified on the live site: no `gtm.js`, no `dataLayer`, no GA4 requests. |
| Is page_view tracking working? | **VERIFIED BY INJECTION ONLY**. Loading the container by hand on the live page sent `page_view` to `G-W3XN5NQR7S` for the first load and for each client-side route change, with no duplicates, and GA4 Realtime showed the visit. This proves the chain works but not the deployment. |
| Is the original issue resolved? | **PARTIAL**. The cause is found and fixed in code. It is resolved once this branch is merged and deployed. |

**Root cause in one line:** `NEXT_PUBLIC_GTM_ID` is read at build time, and the Vercel production build ran without it. The shipped bundle contains the unresolved `e.default.env.NEXT_PUBLIC_GTM_ID`, so the loader bails out and nothing is sent.

## B. Technical Findings

### 1. Container ID missing from the production build (critical)
- **Description:** The live site loads no Google script at all.
- **Root cause:** `src/components/layout/Analytics.tsx:10` (master, before this branch) read `process.env.NEXT_PUBLIC_GTM_ID`, and `:35` returned early when it was empty. The variable was never added to Vercel's Production environment. The deployed chunk `_next/static/immutable/chunks/2yh21szeenzmn.js` contains `o=e.default.env.NEXT_PUBLIC_GTM_ID` instead of an inlined ID.
- **Impact:** Zero GA4 data since PR #12 replaced the direct GA4 tag. It is also why GTM says *"Your Google tag wasn't detected on media.omnexa.sa"*.
- **Fix (this branch):** `src/lib/gtm.ts:4` defaults to `GTM-KSHRL7JL` when the env var is not set. A container ID is public, not a secret, and the env var can still override it.

### 2. Two containers point at the same GA4 property (configuration risk)
- **Description:**
  - `GTM-KSHRL7JL` is named in the task. It is version 1 and is not visible from the auditor's account.
  - `GTM-KQLT29JX` is in account 6405216646. It is version 3, published 2026-11-17 by alawi.basher@gmail.com.
  - Both contain a Google tag for `G-W3XN5NQR7S` (confirmed from the public `gtm.js` of each).
- **Impact:** Only one may be installed; installing both would double every `page_view`. The two containers are **not equivalent**:

  | | `GTM-KSHRL7JL` | `GTM-KQLT29JX` (v3) |
  |---|---|---|
  | Google tag → `G-W3XN5NQR7S` | Yes | Yes |
  | GA4 event tag for `booking_submit`, `whatsapp_click`, `phone_click`, `email_click`, `service_cta_click` | **No** | Yes |
  | Auditor can edit | No | Yes |

- **Decision taken:** The code uses `GTM-KSHRL7JL` because the task names it as the site's container. Until a GA4 event tag is added to it (see E.1), the conversion events are pushed to `dataLayer` but **do not reach GA4**.
- **Alternative:** Use `GTM-KQLT29JX` (set `NEXT_PUBLIC_GTM_ID=GTM-KQLT29JX` on Vercel, or change the default in `src/lib/gtm.ts:4`). It already sends the events.

### 3. No `<noscript>` fallback (minor)
- **Description / root cause:** GTM's recommended `<noscript><iframe …ns.html>` was missing from `src/app/[locale]/layout.tsx`.
- **Impact:** Negligible. Neither container has noscript-capable tags, and GA4 needs JavaScript. It was added for completeness.
- **Fix:** `src/app/[locale]/layout.tsx:51-53`. Next.js renders its own `<div hidden>` first, so the iframe is the first *content* element inside `<body>` rather than the literal first tag.

### 4. Snippet in the request is not GTM's snippet (informational)
The snippet quoted in the task loads `gtm.js` and then defines a `gtag()` that only pushes `js`. That is a mix of the GTM and gtag.js snippets. The site uses GTM's own bootstrap instead:
- `dataLayer = [{ "gtm.start", event: "gtm.js" }]` (`Analytics.tsx:36`)
- an async `gtm.js?id=…` script (`:37-40`)

A `gtag()` function is not needed: the Google tag inside the container handles GA4 configuration.

### 5. Initialization, routing and duplicates (no issue found)
- **Rendering:** `Analytics` is rendered once in the locale root layout (`layout.tsx:63`) and wraps every route. All pages live under `src/app/[locale]/`.
- **Load guard:** The loader runs once per page load, guarded by `window.dataLayer` (`Analytics.tsx:35`), and only on the production hostname. Local, test and preview builds send nothing; the smoke test asserts this.
- **SPA navigation:** The Google tag's enhanced measurement ("page changes based on browser history events") sends one `page_view` per `history.pushState`. App Router navigation uses `pushState`, so no manual route-change `page_view` is pushed, which avoids duplicates. Back and forward navigation (`popstate`) are covered by the same setting.
- **Query strings:** Query strings are kept in `dl` (page location). This is the GA4 default.

### 6. Consent & privacy (informational)
- **Consent:** The site has no cookie banner and no Consent Mode. Nothing blocks analytics, and nothing accidentally prevents tracking.
- **Event payload:** Conversion events carry only the event name, the path and a service id. There is no personal data.
- **GTM v3 setting to review:** Version 3 of `GTM-KQLT29JX` turned on *"Allow user-provided data capabilities"* (hashed email/phone collection). The site sends no such data, but if that container is chosen, the owner should confirm this setting is intended.

### 7. No CSP or caching blockers
- **Headers:** `next.config.ts` sets no Content-Security-Policy, and no `_headers` or `vercel.json` adds one.
- **Caching:** `gtm.js` is served by Google with HTTP 200 for both containers.

### 8. Stale variable
`NEXT_PUBLIC_GA_ID` is no longer read anywhere since PR #12. If it still exists on Vercel, delete it.

## C. Changes Implemented

| File | Change |
|---|---|
| `src/lib/gtm.ts` (new) | Single source for the container ID: `NEXT_PUBLIC_GTM_ID`, falling back to `GTM-KSHRL7JL`. |
| `src/components/layout/Analytics.tsx` | Imports `GTM_ID`. Drops the empty-ID early return because the ID is always set. Comment updated. Hostname gate and single-load guard unchanged. |
| `src/app/[locale]/layout.tsx` | Adds GTM's `<noscript>` iframe at the top of `<body>`. |
| `.env.example` | Documents `GTM-KSHRL7JL` and the fallback. |
| `tests/smoke.spec.ts` | New test: the built HTML contains the GTM noscript fallback with a container ID. This guards against shipping a build with no ID again. |
| `docs/gtm-conversion-events-import.json` (new) | GTM import file (tag, trigger and 2 variables) that adds the GA4 conversion-events tag to any container. |
| `docs/GOOGLE_ANALYTICS_GTM_AUDIT.md` (new) | This report. |

## D. Testing Evidence

**Live site before the fix** (`https://media.omnexa.sa/ar`, 2026-11-17):
- `window.dataLayer` was `undefined`.
- There was no `googletagmanager` script.
- No resource matched `google|collect`.
- Deployed chunk: `...o=e.default.env.NEXT_PUBLIC_GTM_ID` (not inlined).

**Container to GA4 chain.** The container was injected by hand on the live page with the same bootstrap the code uses:
- `GTM-KSHRL7JL`:
  - `gtm.js` returned 200.
  - `dataLayer` showed `gtm.js`, `gtm.dom` and `gtm.load`.
  - `google-analytics.com/g/collect?…tid=G-W3XN5NQR7S…en=page_view` was sent for `/ar`.
- `GTM-KQLT29JX`:
  - `page_view` was sent for `/en`.
  - After `history.pushState('/en/work')`, a second `page_view` with `dl=https://media.omnexa.sa/en/work` was sent about 10 s later (GA4 batching).
  - Exactly one hit per URL, so no duplicates.
- GA4 → Realtime (property 564394064): 1 active user (Cairo) and page views recorded from these test loads.
- Network capture tooling did not list injected requests. Evidence comes from `performance.getEntriesByType('resource')`.

**Console:** No errors from GTM or GA4 during the injected loads.

**Build and tests on this branch** (env: `NEXT_PUBLIC_SITE_URL=https://media.omnexa.sa`, **no** `NEXT_PUBLIC_GTM_ID`, same as Vercel today):
- `npx tsc --noEmit`: exit 0
- `npx eslint src tests`: exit 0
- `npm run build`: exit 0, 103 static pages. `GTM-KSHRL7JL` is present in the client bundle.
- `npx playwright test --project=chromium`: 36 passed, 6 skipped, plus the new GTM test passing, run after the regex fix below.
- The new test initially failed because Next.js renders `<div hidden>` before the `<noscript>`. The regex now allows that element.

**Not verified:** Production after deploy. That needs this branch merged and deployed (see E).

## E. Remaining Manual Actions

1. **Google Tag Manager, `GTM-KSHRL7JL`** (owner of that container): Admin → Import Container → `docs/gtm-conversion-events-import.json` → Merge → Publish. Without this, conversion events do not reach GA4. *Or* use `GTM-KQLT29JX`, which already has the event tag.
2. **Vercel, Production env:**
   - Optionally set `NEXT_PUBLIC_GTM_ID=GTM-KSHRL7JL` (or `GTM-KQLT29JX`) to make the choice explicit.
   - Delete the unused `NEXT_PUBLIC_GA_ID`.
   - Redeploy after merging, because the value is inlined at build time.
3. **After deploy:** Open `https://media.omnexa.sa`, then check GTM → *Test your website* / Tag Assistant and GA4 → Realtime for organic (non-test) visits.
4. **GA4:** Mark `booking_submit` and `whatsapp_click` as key events once they appear (Admin → Events).
5. **GTM `GTM-KQLT29JX`:** If it is not the chosen container, leave it unpublished-to-site (it is harmless) or pause its tags, so nobody installs both.

## F. Final Status

**PARTIALLY COMPLETED.** The root cause is found and fixed in code, and the GTM → GA4 chain is proven on the live page by injection, with GA4 Realtime receiving the hits. Production tracking will be confirmed after this branch is deployed. Conversion events need the GA4 event tag in `GTM-KSHRL7JL` (or the switch to `GTM-KQLT29JX`).
