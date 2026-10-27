# Animation inventory — Omnexa Media reference

Libraries actually present (verified by `<script>` tags and vendored files): **GSAP 3.12.5 + ScrollTrigger** (`js/vendor`), **Matter.js** (process pills), **Web Animations API** (`el.animate`, testimonials), **CSS keyframes/transitions** (89 `@keyframes`), **Canvas 2D** (4 custom effects). No Motion/Framer, Lenis, Three.js, OGL or Lottie. "React Bits" appears only as inspiration: `js/dots.js` is a vanilla rewrite of React Bits *Dot Grid*, and the squares background cites React Bits *Squares* — no React Bits package is used.

Global rules (O): GSAP runs inside `gsap.matchMedia` with `desktop = (min-width:1024px) and (prefers-reduced-motion:no-preference)` and `mobile = (max-width:1023px) and (no-preference)`. Desktop adds `blur(10px)` and 60px rise; mobile uses no blur and 40px rise. **Reduced motion → no GSAP animation at all**, plus `.reduce-motion` class. Default ease `power3.out` ≈ DS `--ease-out cubic-bezier(.2,.7,.2,1)`. Status: **V** = seen playing in the reference, **O** = read in source, not visually timed.

## GSAP (`js/motion.js`)
| # | Element | Trigger | Properties | Timing | Notes | Status |
|---|---|---|---|---|---|---|
| G1 | Header row children | load (hero timeline) | y −16→0, opacity | .5s, stagger .06 | | V |
| G2 | Hero title words (`splitWords`, word spans `.mw`, never letters → Arabic-safe) | load, after G1 (−.25) | opacity, y 26, blur 10px | .7s, stagger .05 | | V |
| G3 | Hero platform chips `.hc-ic i` | load (−.45) | scale 0, rotation −40 | .5s stagger .1, `back.out(2.2)` | | V |
| G4 | Hero gold box word `.hc-box` | load (−.4) | rotation −16, scale .6 | .6s `back.out(2.4)` | | V |
| G5 | Sparkles `.hcd-o` | load (−.3) | opacity | .5s stagger .07 | | V |
| G6 | `.hc-sub`, `.hc-btn` | load | opacity, y 20/16, scale .96 | .6s / .5s | | V |
| G7 | Hero cards `.hcd` | load (−.4) | y 120, opacity | .9s stagger .09 | | V |
| G8 | Hero stat number `.hcd-num` | load (−.5) | count 0→50 | 1.2s `power2.out` | | O |
| G9 | Section heads `.shead` | ScrollTrigger `top 82%`, once | tag y14 → words (blur) → icon chips scale .6 → sub y16 | .45/.6/.45/.5s | words split on every locale render | V |
| G10 | Generic `[data-reveal]` (not heads/FAQ) | `ScrollTrigger.batch` `top 88%` | opacity, y 60/40 | .8s stagger .08 | `fresh()` guard avoids replay | V |
| G11 | Card groups (`.svc-stage > *` .1, `.faq-item` .06, footer links .03) | batch `top 90%` | opacity, y 36/24 | .7s | | O |
| G12 | About stat pills `.rp` | `#resGrid top 80%`, once | y −320→0, rotation ±14, opacity, `bounce.out`; then count-up | 1.1s (desk) / .9s, offset i×.16; count 1.1s | | V |
| G13 | About social icons `.abi` | `#abGrid top 70%`, once | fly from mic mouth (x,y computed from mic rect; mouth at 43% / 57% depending on `dir`) scale .2 rot −40 → 0 | 1.2s delay .2+i×.16 | **direction-aware** | V |
| G14 | Work cards `.wkc` | batch `top 92%` | x ±60 (from inline-end, sign flips with `dir`) | .7s stagger .08 | `.wkc` no longer rendered (cards are `.sx-c`) → effectively dead | O |
| G15 | Work stage `#gfold` | `top 85%`, once | opacity, y, scale .97 | .9s | | V |
| G16 | Footer wordmark `.f2-wm` | desktop only, scrub .8 `top 90% → bottom bottom` | yPercent 40, opacity .2 | scrub | | V |
| G17 | Work row after filter change (`om:work` event) | tab/search change | `.sx-c` opacity, y 24 | .5s stagger .06 | skipped in reduced motion | O |
| G18 | Project/service page enter (hashchange) | route | page opacity/y 24; head words blur 8px; cards batch y30 | .5s / .55s / .6s | kills old triggers then `ScrollTrigger.refresh()` | O |
| G19 | Drawer links | menu open | x ±24 (dir-aware), opacity | .35s stagger .04 | | O |
| G20 | Refresh | language switch, window load | `ScrollTrigger.refresh()` | | | O |

## Web Animations API / JS-driven
| # | Element | Trigger | What | Timing | Reduced motion | Status |
|---|---|---|---|---|---|---|
| W1 | Testimonial slide | auto every 3s while visible & not hovered/focused; arrows | out: x ∓36, blur 2px; in: x ±36 → 0 (dir-aware); logo rotateY 70°→0 | 260 / 420 / 760ms `cubic-bezier(.45,0,.2,1)` | instant swap, no autoplay | V |
| W2 | Work strip `.sx` | auto every 3.6s (paused on hover/focus/hidden); hover opens card | `.on` card widens (CSS transitions) | 3.6s interval | no autoplay | V |
| W3 | Mobile rows (`omRows`, ≤767) | every 3.2s when on screen; holds 7s after touch/wheel | eased `scrollLeft` glide 650ms | | disabled | O |
| W4 | Booking / FAQ / tabs | click | CSS transitions only | .25–.45s | | V |
| W5 | Count-up `[data-count]` | IntersectionObserver .5 | 1.6s ease-out cubic | | final value | O |
| W6 | Project page media (`flowGo` cover-flow 2.6s, `shotGo` 3.2s, `ruGo` phone stage 3.2s/ended) | auto + click/swipe | transforms on cards | | no autoplay | O |

## Canvas / physics
| # | File | Element | Behaviour | Key params | Reduced motion | Cleanup |
|---|---|---|---|---|---|---|
| C1 | `dots.js` (React Bits *Dot Grid* port) | `#heroDots` | pointer-reactive dot grid; dots pushed by fast pointer (>90px/s) and click shockwave; spring back | gap 34, r 2.1, proximity 150, shock r 240, spring .06, damping .86, purple per theme | static grid, hover colour only | none (lives with hero) — React port must clean up |
| C2 | `pills.js` (Matter.js) | `#pfFrame` | 6 step pills + 12 tag pills fall and pile up when 30% visible; one drop / 150ms; gravity 1.15; drag (fine pointer); scroll/mouse nudges pile | | pre-simulates 900 steps → still image | rebuild on `om:process`; fallback `.pf-flow` row without Matter |
| C3 | `squares.js` (React Bits *Squares* idea) | `canvas[data-squares]` (process bg, project hero) | drifting grid, hovered cell filled, radial fade | cell 46, speed .22, direction up/diagonal | still grid | **leaks** listeners per project render — fix in port |
| C4 | `particles.js` | `#ptBg` (testimonials) | ≤160 drifting particles in 4 brand colours, pointer parallax, pauses off-screen | | one still frame | IO pause |

## CSS keyframes in live use (selection)
`mq/mqR` (marquees; platforms 18s, logos 50s/58s reversed, RTL variant), `hcdM` (hero card client-handle marquee), `pageDrop` (project page drop .7s), `sxIn/sxRise` (work strip), `waPulse` (FAB WhatsApp), `twinkle`, `illFloat` (decorative SVGs), `wmSweep` (footer wordmark shine), `mgOrb/mgShout/mgWave` (about mic), `pfFloat`, `ruIn/ruSpin`, `p7Draw` (title underline), `p7Float` (project hero bubbles), `rkMove/rkMoveR`, `flipIn`, `fadeUp`, `cardBob/tileBob/abFloat`. Full list: 89 keyframes, only `beam` unused. 28 `prefers-reduced-motion` blocks neutralise them.

## Porting decisions
- Keep **GSAP + ScrollTrigger** (same lib, same timings) via `@gsap/react` `useGSAP` scoped to a root ref → automatic revert on unmount/locale change. One `MotionLayer` client component reproduces G1–G16 against the same class names.
- Keep **Matter.js** for C2 (lazy `import()` so it only loads when the process section is near).
- Port C1/C3/C4 as client canvas components with `useEffect` cleanup (observers, rAF, listeners) — fixes C3 leak.
- Testimonials/work/booking interactions become React state; WAAPI kept for W1.
- CSS keyframes stay in the ported stylesheet unchanged.
- No React Bits / Framer Motion install: nothing in the source requires them.

## Phase 2 changes to playback (no visual change)
| Element | Before | Now |
|---|---|---|
| Hero reels, work-strip video cards (`AutoVideo`) | `preload="metadata"`, autoplay on mount, kept playing off-screen | no `src` until within 200 px of the viewport; plays in view, pauses out of view; reduced motion → poster only (no download) |
| Project phone player (`#rkVid`) | started (and downloaded) on page load | `preload="none"`; starts when 25 % visible, pauses when scrolled away, resumes on return unless the visitor paused it |
| ScrollTrigger play-once reveals | `once: true` | `toggleActions: "play none none none"` (same visual result; avoids a ScrollTrigger crash when a page loads already scrolled) |
