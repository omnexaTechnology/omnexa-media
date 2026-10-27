# Design-system audit — Omnexa Media reference

Reference: `../omnexa-final-run` (static HTML/CSS/JS, styles "v25.2 … v55"). Evidence comes from the source files and from screenshots of the running reference (served read-only on `127.0.0.1:4100`, AR + light theme, 1440×900).
Legend: **O** = observed in source · **V** = verified in the rendered page · **I** = inferred · **?** = unknown.

## 1. Brand and visual direction
- **Name**: "Omnexa Media" / "أومنيكسا ميديا" (logos, `<title>`, i18n `meta.*`, footer wordmark). **O**
- **Logo**: gold infinity mark + wordmark; white (`logo-ar.svg`, `logo-en.png`) or #33006A (`*-light`). In the header the light-theme logo sits in a purple pill (`.brand { background: var(--primary); border-radius:14px }`); in dark theme there is no pill. Locale swaps AR/EN logos via `:root[lang=en] .brand-ar {display:none}`. **O/V**
- **Direction**: clean white canvas with a faint dot grid; heavy black display type with **purple accent lines** (`.t2`); playful "UI-editor" decorations (selection frame around icon chips `.ab-sel`, a gold "magic wand" tile `.ab-tile`, sparkle SVGs, a tilted gold "box" word in the hero); tilted media cards; pastel service cards; pill tags. Full-bleed purple footer with a giant wordmark. **V**
- **Image treatment**: real client work (webp), rounded cards (`--r-lg`), autoplay muted video loops for reels, client logos in colour (light) / white (dark). **V**

## 2. Colour tokens
Source chain: `ds/tokens/fig-tokens.css` (Figma variables, light `:root` + dark `:root[data-theme=dark]`) → `ds/tokens/semantic.css` (brand aliases) → `css/styles.css :root` (site aliases). All **O**.

| Role | Site alias | DS token | Light | Dark |
|---|---|---|---|---|
| Brand primary | `--primary`, `--p1` | `--brand-purple` | #5700AE | same |
| Primary dark / deep / muted | `--primary-600/700/200` | `--brand-purple-dark/deep/muted` | #46008B / #340068 / #DDCCEF | same |
| Brand secondary (gold) | `--gold`, `--g1` | `--brand-orange` | #FBB040 | same |
| Gold dark / deep / muted | `--gold-600`, `--g0`, `--gold-100` | `--brand-orange-dark/deep/muted` | #C98D33 / #976A26 / #FEEFD9 | same |
| Canvas | `--bg` | `--color-bg-canvas` | #FFFFFF | #000000 |
| Alt band | `--bg-alt` | `--color-bg-muted` (dark: neutral-850) | #DDDCDF | #0D0C0E |
| Surface / subtle / raised | `--surface/-2/-3` | `--color-bg-surface/subtle/surface-raised` | #FFF / #DDDCDF / #DDDCDF | #463E4D / #463E4D / #342F3A |
| Text | `--ink` | `--color-text-primary` | #000 | #FFF |
| Text secondary | `--ink-2` | `--color-text-secondary` (dark override: neutral-muted) | #463E4D | #DDDCDF |
| Muted | `--muted` | neutral-light (dark: neutral-muted) | #574E60 | #DDDCDF |
| Border | `--line` | `--color-border-default` | #DDDCDF | #463E4D |
| Link | `--link` | `--color-text-link` (dark override: purple-muted) | #340068 | #DDCCEF |
| Error | `--error` | `--color-text-error` | #8F2929 | #EF4444 |
| Focus ring | `--focus` | — | `0 0 0 3px #DDCCEF` | same |
| Wordmark ink (logo) | — | — | #33006A | — |

Hard-coded colours outside the token system (O): platform brand colours (Instagram gradient `#F58529→#DD2A7B→#8134AF`, TikTok #111, Snapchat #FFFC00, LinkedIn #0A66C2, WhatsApp #25D366), service column gradients (`#6A1BC4`, `#A8329E/#8E24AA`, `#F5A62C/#D9851A`), process pill palette `PF_C` (8 purple/gold pairs), per-project `tint/ink/deep`. These are kept as data, not promoted to tokens.
Status/info/success/warning scales exist in the DS (`--primitives-color-status-*`) but the UI only uses error. **O**

## 3. Typography
- **Families actually rendered** (v31 block, `styles.css:2056-2059`, forced with `!important` on every element except `.ms`/SVG): **Arabic → IBM Plex Sans Arabic**, **English → Cairo**. **O/V**
- Earlier token names (Almarai, Devlin, IBM Plex Sans/Mono, Georgia) are never loaded → treated as dead. **O**
- Weights shipped: Cairo 400–800, IBM Plex Sans Arabic 400–700. Headings use 800 (`.s-title`); because Plex has no 800, the browser synthesises bold from 700 in Arabic. **O/I**
- Icons: **Material Symbols Rounded** (ligatures; `FILL 1, wght 500, opsz 24`), class `.ms`. **O**

Type scale (px, from `responsive.css` device modes — mobile → ≥768 → ≥1200). **O**

| Token | Mobile | Tablet | Desktop | Used for |
|---|---|---|---|---|
| `--fs-h1` (`--fs-hero`) | 39 | 49 | 61 | hero title |
| `--fs-h2` (`--fs-section`) | 31 | 39 | 49 | section titles `.s-title` |
| `--fs-h4` (`--fs-card`) | 20 | 25 | 31 | card titles |
| `--fs-body-l` (`--fs-lead`) | 16→20 | 20 | 20 | lead `.s-sub` |
| `--fs-text` | max(15, body) | 16 | 16 | body |
| `--fs-sm` / `--fs-xs` | max(13,…) / max(12,…) | | | meta |
Body line-height 1.75; titles 1.15 (AR) / 1.02 (EN, weight 400). EN titles and buttons switch to weight 400 + letter-spacing (`:root[lang=en] .s-title/.btn`). **O**

## 4. Spacing, geometry, elevation (O)
- Spacing primitives: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192 (`--space-*`).
- Container `--container: 1240px`, gutter `max(--grid-margin, 16px)`; section padding `--section` 96px (64px ≤767).
- Header height `--header-h` 80px (72px ≤1060).
- Radii primitives 2/4/8/12/16/24/999. `--r-card` 8 → `--r-container` 16 (≥768) / 24 (≥1200). Pills use `--r-pill` (999).
- Shadows: DS `--shadow-low/high/card` + many local soft shadows; dark mode uses "glow" shadow colour.
- Grids: 4 / 8 / 12 columns (mobile/tablet/desktop) — defined but layout mainly uses flex/grid per component.
- **Breakpoints in use** (~25 distinct). Dominant: `max-width` 767 (34×), 1023 (28×), 900, 760, 860, 640, 1060, 560; `min-width` 1024 (GSAP desktop), 1200 (DS). Token breakpoints are 768 / 1200.
- z-index: header 50, skip link 100, ghost cards 5, overlays (qv/lightbox) above header. **O**

## 5. Components and states
| Component | Source (class / renderer) | States & behaviour |
|---|---|---|
| Header | `.site-header`, `.header-row` | transparent → `.scrolled` (94% canvas + border) after 20px; active nav link pill (`.active`, gold dot ::before); scroll-spy (`onScroll`) |
| Theme / language buttons | `.hd-ic`, `#themeBtn`, `#langBtn` | round 44px, hover purple; `aria-pressed` on theme; lang button shows the *other* language |
| Mobile drawer | `#drawer`, `#menuBtn` | ≤1060px; `aria-expanded`, Escape closes, links cascade in (GSAP) |
| Buttons | `.btn .btn-primary/.btn-secondary/.btn-sm` | pill 50/44px; **rolling label** (`.bt` two spans, translateY(-100%) on hover); arrow icon nudges, mirrored in RTL; `[disabled]` 55% |
| Section head | `.shead` (`applyStatic` → `.ab-tag`, `h2.s-title` with `.t1` + `.ab-sel` icon chips, `.ab-tile` wand + `.t2` purple line, `p.s-sub`) | word-by-word blur reveal |
| Hero | `.hero.hc`: dot-grid canvas, 2-line title with `.hc-box` (tilted gold word) + platform icon chips `.hc-ic`, sparkles `.hcd-o`, CTA, tilted cards row `#heroCards` (4 video cards + purple stat card with auto-scrolling client handles), pager | cards straighten on hover |
| Platforms strip | `.plat-track` marquee | pauses on hover; RTL reverses |
| Services | `.sv7` 7 pastel cards (`s-cream…s-pink`), icon, title, desc, check list (3 link to service pages), "request" button | ≤767 horizontal scroll + auto-advance (`omRows`) + pager |
| About | mic SVG (`.ab-mega`), centered head + CTA, 4 tilted stat pills `.rp` (count-up), 5 social icons `.abi` | icons fly out of the mic |
| Work | search (`#workSearch`, Arabic-normalised), sector `<select>`, category tabs `.dept-tab` (counts), sub-tabs `.wk-sub`, card strip `.sx` (4 per page; open card wide, others vertical labels), pager, empty state | roving tabs with arrow keys (RTL aware), auto-advance 3.6 s paused on hover/focus |
| Process | `.pf-frame` purple panel; Matter.js pills (6 numbered steps + 12 tags) | drag on fine pointer; static fallback |
| Clients | 2 logo marquee rows `.lr-track` (2nd reversed) | pause on hover; colour/white logo per theme |
| Testimonials | `.ts-slide`: framed logo + quote + client name + arrows; particles canvas | auto-advance 3 s when visible; WAAPI slide/blur + logo rotateY |
| FAQ | `.faq-item` accordion (single open, first open by default) | `aria-expanded/controls`, +/− icon |
| Contact / booking | `.ct-panel.book`: info column, month calendar (past days + Fridays disabled), 12 time slots, step 2 form | validation: name + ≥7 phone digits → opens `wa.me` with composed message |
| Footer | `.f2`: decorative orbs/sparkles, logo, nav, copyright, social pills, giant wordmark `.f2-wm` | wordmark scrub (desktop) |
| FAB | `.fab`: WhatsApp + scroll-progress ring `#fabTop` (shows %, "down" mode under 300px) | |
| Lightbox | `#lightbox` images/videos | focus trap, Esc, arrows (RTL aware) |
| Project page | `#project` (`renderProject`) | always light/dark per theme; see section map |
| Quick-view `#qv` | dead (`openQV` returns immediately) | not ported |

## 6. Page and section map
**Home (`/`)** in display order: Header → Hero (`#top`) → Platforms strip → Services (`#services`) → About (`#about`) → Work (`#work`) → Process (`#process`) → Clients (`#partners`) → Testimonials (`#stories`) → FAQ (`#faq`) → Contact/booking (`#contact`) → Footer → FAB.
**Project page** (`#/project/<work-id>`, 44 works, 3 redirect to service pages via `WORK_SVC`): `.p7-hero` (squares canvas, floating icon bubbles, breadcrumb, title with hand-drawn underline on last word, desc, CTA) → `.p7-sum` (client / work type / area+sector cards) → `.p7-ov` media showcase (shape chosen by sub-type: `tiles`, `posts`, `jg` justified, `full`, `a4`, `side`, `two`, `phone`, `flow` cover-flow) — skipped for video works → `.rk` videos in phone mock (`ruHTML`) → related works strip → end CTA (`.p6-end`).
**Service pages** (`#/service/{ads|report|social}`, `js/svcpages.js`): custom long pages + end CTA.
Contact section stays visible on project/service pages (outside `#home`).

## 7. Dead / superseded code (not ported)
`renderWhy` (#bento), `renderBenefits` (#hub), `silk`, `stars`, `openQV` & quick-view, slat gallery, reels fan (`#rlStage`), arc (`#arc`), pinterest stack (`relScroll`), `mcScroll`, `pzShow`, `switchService` (old svc stage), `illustrations.js`, `SVC5`, the `extra.js` copies of `SVCS/SECTORS`. Their CSS remains in `styles.css` and is harmless.
