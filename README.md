# Omnexa Media — website

Next.js 16 (App Router) + TypeScript + Tailwind v4 + next-intl port of the static reference site in `../omnexa-final-run` (kept untouched).
Arabic (`/ar`, RTL, default) and English (`/en`, LTR); every page is statically generated.

```bash
npm install
npm run dev      # http://localhost:3000 → /ar
npm run build && npm start
npm run lint
```

- **Docs**: `docs/` — asset manifest, design-system audit, animation inventory, i18n audit, implementation plan (status, decisions, verification).
- **Content** comes from the reference's JS data. After changing it there, regenerate:
  `node scripts/gen-content.js ../omnexa-final-run .` (messages + `src/content/data.ts`).
- **Media**: originals live in `public/assets`; images are served via `next/image` (`src/components/ui/Img.tsx`).
  After adding/replacing images run `node scripts/gen-media-dims.js` (intrinsic sizes); give a replaced image a new file name (optimiser cache).
  Inventory of what is used where: `node scripts/media-inventory.js` → `docs/media-inventory.md`.
- **Icons**: Material Symbols subset, self-hosted. After using a new icon name, start the production server and run
  `node scripts/gen-icons.js http://localhost:3200` (the test suite fails if a page shows an icon missing from the subset).
- **Styles**: design tokens `src/styles/tokens/*` (Figma export) + reference stylesheet `src/styles/site.css`; Tailwind utilities map to the same tokens (`bg-primary`, `text-ink`, …) in `src/app/globals.css`.
- **Motion**: `src/components/motion/` — GSAP/ScrollTrigger layer, dot grid, squares, particles, Matter.js process pills. All respect `prefers-reduced-motion`.
- **Env**: set `NEXT_PUBLIC_SITE_URL` in production (canonical/hreflang/Open Graph/sitemap/robots URLs; defaults to localhost). See `.env.example`.
- **Tests** (Playwright, against the production server on :3200 — run `npm run build` first):
  `npx playwright install chromium webkit firefox` once, then `npx playwright test tests/smoke.spec.ts`;
  transfer sizes: `PERF_LABEL=run npx playwright test tests/perf.spec.ts --project=webkit` → `docs/perf-run.json`;
  service-page markup regression: `node scripts/svc-snapshot.js http://localhost:3200 <dir>` and diff against `tests/fixtures/`.
