# i18n / RTL audit — Omnexa Media reference

## Current mechanism (O)
- Strings: `js/i18n.js` → `window.I18N = { ar: {...}, en: {...} }`, **flat dotted keys** (`nav.home`, `hero.c1`). **297 keys in each locale, 0 missing on either side**, no ICU-special characters (`{ } #`), no apostrophes, no key that is also a prefix of another (so they nest cleanly). Two keys contain HTML (`about.c1`, `about.c3`) and are unused.
- Content data carries both languages inline: `{ ar: {...}, en: {...} }` objects in `data.js`, `extra.js`, `works.js`, `svcpages.js` (services, works, clients, sectors, FAQ, process, platforms…). Some long copy is hard-coded with `S.lang === 'ar' ? … : …` inside renderers (`vidCopy`, `kopy` pills, `renderWhy`, service pages).
- Binding: `data-i18n`, `data-i18n-attr="aria-label:key;placeholder:key"`, `data-btn`, `data-head` attributes, re-rendered by `applyStatic()`/`renderAll()`.
- Locale selection: inline pre-paint script reads `localStorage['om-lang']`; **default Arabic (rtl)**. Toggle button `#langBtn` flips language **in place** (same URL), stores choice, re-renders and keeps the scroll anchor. No locale in the URL, no `Accept-Language` detection, no `hreflang`.
- Metadata: `setMeta()` updates `document.title`, description and OG tags client-side; `og:locale` switches `ar_SA` / `en_US`. Initial HTML metadata is Arabic only.
- Dates: booking uses `toLocaleDateString('ar-SA-u-ca-gregory-nu-latn' | 'en-GB')` → Gregorian calendar, Latin digits in both languages; times in `<bdi dir=ltr>`; time zone label "Asia/Riyadh". Weekday headers from `bk.days`.
- Fonts per locale: AR → IBM Plex Sans Arabic, EN → Cairo (CSS `html[lang]` selectors).
- Logos per locale: `.brand-ar` / `.brand-en` toggled by `:root[lang=en]`.

## Direction handling (O)
- Logical properties dominate: 146 `inset-inline*`, 62 `margin-inline*`, 45 `padding-inline*`, 23 `text-align: start/end`, 10 `border-inline*`.
- Physical leftovers: ~88 `left:` / 26 `right:` (mostly centring `left:50%` + translate, decorative absolute art, and canvas/marquee internals), 9 `margin-left`, 4 `border-left/right`, 2 `text-align:left/right`. **62 `[dir="rtl"]` override rules** compensate where needed.
- Icons: `.flip` class mirrors directional Material icons in RTL (`[dir=rtl] .flip { transform: scaleX(-1) }`); button arrows `.ms.arr` mirrored with hover nudge; logos and illustrations are not mirrored (correct).
- Marquees: `mqR` keyframe for RTL so tracks move in reading direction.
- JS direction awareness: `rtl()` checks for work card slide sign, testimonial slide sign, mic emission point, drawer link offset, cover-flow/phone stage offsets, arrow-key tab navigation (ArrowRight = previous in RTL), lightbox arrows.
- Mixed text: Latin handles/numbers/emails wrapped in `<bdi dir="ltr">`; phone/email inputs `dir="ltr"`; lightbox counter `dir=ltr`.

## Gaps to close in the Next.js app
1. **Locale-aware routes** `/ar/...` and `/en/...` (Arabic default) so each language is indexable and shareable; the switcher navigates to the same path in the other locale instead of re-rendering in place.
2. `<html lang dir>` must be **server-rendered** per locale (the reference relied on a client script, so first paint/SEO was always Arabic).
3. Localised metadata at build time per route (title, description, OG locale, `alternates.languages` hreflang).
4. Move UI strings to `messages/{ar,en}.json` (nested, typed via next-intl `AppConfig`); keep bilingual **content data** as typed TS objects (`{ar,en}`) — it is content, not UI copy.
5. Inline `lang === 'ar' ? …` copy in renderers (`vidCopy`, profile tab names, service pages) → keep as typed bilingual constants next to the component that uses them (single source, no duplication).
6. Remaining physical CSS is kept where it is direction-neutral (centring) and verified visually in both directions; no blanket rewrite (risk of regressions in 4.9k lines).
7. Persisted preference: the reference remembered `om-lang`; with URL locales the URL is the source of truth. next-intl's locale cookie + proxy redirect of `/` cover the "remember my language" behaviour.
8. Theme preference stays client-side (`om-theme`, pre-paint script) — not part of i18n.
