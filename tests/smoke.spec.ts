import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import ICONS from "../src/fonts/material-symbols-icons.json";

/* Production smoke + regression suite (runs against `next start`, see playwright.config.ts).
   Nothing is ever sent: window.open is stubbed before the booking flow is exercised. */

const ROUTES = [
  "/ar", "/en",
  "/ar/work/og-posts", "/en/work/eco-web", "/ar/work/autobus-app", "/en/work/og-edit", "/ar/work/albadr-profile", "/en/work/altior-logo",
  "/ar/services/ads", "/en/services/report", "/ar/services/social",
];
const WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920];
const iconSet = new Set<string>(ICONS);

/* collect console errors, page errors and failed requests for one page */
function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") problems.push(`console: ${m.text().slice(0, 200)}`); });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => { if (r.status() >= 400) problems.push(`HTTP ${r.status()} ${r.url()}`); });
  return problems;
}
// media requests are cancelled on purpose when a clip leaves the viewport or the page changes
const real = (p: string[]) => p.filter((x) => !/net::ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i.test(x));

const scrollThrough = async (page: Page) => {
  for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(60); }
  await page.waitForTimeout(300);
};

test.describe("routes", () => {
  for (const route of ROUTES) {
    test(`renders ${route}`, async ({ page }) => {
      const problems = watch(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      const l = route.slice(1, 3);
      await expect(page.locator("html")).toHaveAttribute("lang", l);
      await expect(page.locator("html")).toHaveAttribute("dir", l === "ar" ? "rtl" : "ltr");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Omnexa Media|أومنيكسا ميديا/);
      expect(await page.locator('link[rel="alternate"][hreflang="ar"]').count()).toBe(1);
      await scrollThrough(page);
      // every icon ligature on the page exists in the self-hosted subset font
      const used = await page.$$eval(".ms", (els) => els.map((e) => e.textContent!.trim()).filter(Boolean));
      expect(used.filter((x) => !iconSet.has(x)), "icons missing from the subset").toEqual([]);
      expect(real(problems)).toEqual([]);
    });
  }

  test("redirects and 404s", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
    await page.goto("/ar/work/omnexa-ads");
    await expect(page).toHaveURL(/\/ar\/services\/ads$/);
    // work entries shown as service pages move permanently (308), so search engines consolidate on the service URL
    for (const [w, s] of [["omnexa-ads", "ads"], ["omnexa-social", "social"], ["omnexa-report", "report"]]) {
      const r = await page.request.get(`/en/work/${w}`, { maxRedirects: 0 });
      expect(r.status()).toBe(308);
      expect(r.headers()["location"]).toMatch(new RegExp(`/en/services/${s}$`));
    }
    expect((await page.goto("/ar/work/does-not-exist"))?.status()).toBe(404);
    expect((await page.goto("/en/services/nope"))?.status()).toBe(404);
  });
});

/* SEO metadata: the build under test must use NEXT_PUBLIC_SITE_URL=https://media.omnexa.sa (the production origin) */
const ORIGIN = "https://media.omnexa.sa";
const SEO_ROUTES = ["/ar", "/en", "/ar/services/ads", "/en/services/social", "/en/work/eco-web"];

test.describe("seo metadata", () => {
  for (const route of SEO_ROUTES) {
    test(`metadata ${route}`, async ({ page }) => {
      await page.goto(route);
      const html = await page.content();
      expect(html).not.toContain("localhost");
      const attr = (sel: string, a = "content") => page.locator(sel).first().getAttribute(a);
      const l = route.slice(1, 3), path = route.slice(3);
      const canonical = await attr('link[rel="canonical"]', "href");
      expect(canonical).toBe(`${ORIGIN}${route}`);
      // reciprocal alternates: each language points at its own twin of this path, x-default at Arabic
      expect(await attr('link[rel="alternate"][hreflang="ar"]', "href")).toBe(`${ORIGIN}/ar${path}`);
      expect(await attr('link[rel="alternate"][hreflang="en"]', "href")).toBe(`${ORIGIN}/en${path}`);
      expect(await attr('link[rel="alternate"][hreflang="x-default"]', "href")).toBe(`${ORIGIN}/ar${path}`);
      expect(await attr('meta[property="og:url"]')).toBe(canonical);
      expect(await attr('meta[property="og:locale"]')).toBe(l === "ar" ? "ar_SA" : "en_US");
      expect(await attr('meta[property="og:type"]')).toBe("website");
      // social title/description are this page's own, not the homepage's
      const title = await page.title();
      expect(await attr('meta[property="og:title"]')).toBe(title);
      expect(await attr('meta[name="twitter:title"]')).toBe(title);
      const desc = await attr('meta[name="description"]');
      expect(desc).toBeTruthy();
      expect(await attr('meta[property="og:description"]')).toBe(desc);
      expect(await attr('meta[name="twitter:description"]')).toBe(desc);
      const img = await attr('meta[property="og:image"]');
      expect(img?.startsWith(`${ORIGIN}/`)).toBe(true);
      expect(await attr('meta[name="twitter:image"]')).toBe(img);
      expect((await page.request.get(new URL(img!).pathname)).status()).toBe(200);
    });
  }

  test("default share image is a 1200x630 JPEG", async ({ page, request }) => {
    await page.goto("/en/services/social");
    expect(await page.locator('meta[property="og:image"]').getAttribute("content")).toBe(`${ORIGIN}/assets/covers/og.jpg`);
    expect(await page.locator('meta[property="og:image:width"]').getAttribute("content")).toBe("1200");
    expect(await page.locator('meta[property="og:image:height"]').getAttribute("content")).toBe("630");
    const res = await request.get("/assets/covers/og.jpg");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/jpeg");
    // JPEG SOF0/SOF2 frame header holds height then width
    const b = await res.body();
    let i = 2;
    while (i < b.length && !(b[i] === 0xff && (b[i + 1] === 0xc0 || b[i + 1] === 0xc2))) i += 2 + b.readUInt16BE(i + 2);
    expect([b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]).toEqual([1200, 630]);
  });

  test("no Google tag off the production host", async ({ page }) => {
    const hits: string[] = [];
    page.on("request", (r) => { if (/googletagmanager|google-analytics/.test(r.url())) hits.push(r.url()); });
    await page.goto("/ar");
    await page.waitForTimeout(1500);
    expect(hits).toEqual([]);
    expect(await page.evaluate(() => typeof (window as { gtag?: unknown }).gtag)).toBe("undefined");
  });

  test("robots.txt and sitemap.xml use the production origin", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).not.toContain("localhost");
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("localhost");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    expect(locs.filter((u) => !u.startsWith(`${ORIGIN}/`))).toEqual([]);
  });
});

test.describe("responsive", () => {
  for (const l of ["ar", "en"]) {
    test(`no horizontal scroll — ${l}`, async ({ page, browserName }) => {
      test.slow();
      const report: string[] = [];
      for (const path of ["", "/work/eco-web", "/services/ads"]) {
        for (const w of WIDTHS) {
          await page.setViewportSize({ width: w, height: w < 800 ? 800 : 900 });
          await page.goto(`/${l}${path}`);
          await scrollThrough(page);
          // what a visitor experiences: can the page be panned sideways?
          const panX = await page.evaluate(() => { window.scrollTo(99999, window.scrollY); const x = Math.abs(window.scrollX); window.scrollTo(0, window.scrollY); return x; });
          const bodyW = await page.evaluate(() => document.body.scrollWidth);
          if (panX > 1) report.push(`${l}${path || "/"} @${w}: page pans ${panX}px`);
          if (bodyW > w + 1) test.info().annotations.push({ type: "clipped-overflow", description: `${l}${path || "/"} @${w}: body.scrollWidth ${bodyW} (clipped by overflow-x:hidden, not pannable)` });
          if (browserName === "chromium" && path === "") {
            fs.mkdirSync("test-results/screens", { recursive: true });
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(400);
            await page.screenshot({ path: `test-results/screens/${l}-home-${w}.png`, fullPage: true });
          }
        }
      }
      expect(report).toEqual([]);
    });
  }
});

test.describe("interactions", () => {
  test("theme toggle persists", async ({ page }) => {
    await page.goto("/ar");
    await page.locator("#themeBtn").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("#themeBtn")).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("language switch keeps page and reading position", async ({ page }) => {
    await page.goto("/ar#faq");
    await page.waitForTimeout(800);
    const before = await page.locator("#faq").evaluate((e) => e.getBoundingClientRect().top);
    expect(Math.abs(before)).toBeLessThan(150);
    await page.locator("#langBtn").click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await page.waitForTimeout(800);
    const after = await page.locator("#faq").evaluate((e) => e.getBoundingClientRect().top);
    expect(Math.abs(after - before)).toBeLessThan(60);
    await page.goto("/en/work/bling-logo");
    await page.locator("#langBtn").click();
    await expect(page).toHaveURL(/\/ar\/work\/bling-logo$/);
  });

  test("mobile drawer: open, Escape closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/ar");
    await page.locator("#menuBtn").click();
    await expect(page.locator("#drawer")).toBeVisible();
    await expect(page.locator("#menuBtn")).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("#drawer")).toBeHidden();
    await expect(page.locator("#menuBtn")).toHaveAttribute("aria-expanded", "false");
  });

  for (const [l, next] of [["ar", "ArrowLeft"], ["en", "ArrowRight"]] as const) {
    test(`work tabs keyboard — ${l}`, async ({ page }) => {
      await page.goto(`/${l}`);
      await page.locator('#workTabs [aria-selected="true"]').focus();
      await page.keyboard.press(next);
      await expect(page.locator('#workTabs [aria-selected="true"]')).toHaveAttribute("data-id", "brand");
      await expect(page.locator("#workTabs [data-id=brand]")).toBeFocused();
      await page.keyboard.press("End");
      await expect(page.locator('#workTabs [aria-selected="true"]')).toHaveAttribute("data-id", "print");
      expect(await page.locator("#wkRow .sx-c").count()).toBeGreaterThan(0);
    });
  }

  test("work search filters and empties", async ({ page }) => {
    await page.goto("/ar");
    await page.locator("#workSearch").fill("zzzz-no-match");
    await expect(page.locator("#ringEmpty")).toBeVisible();
    await page.locator("#ringEmpty button").click();
    await expect(page.locator("#ringEmpty")).toBeHidden();
  });

  test("lightbox: open, arrows, focus trap, Escape returns focus", async ({ page }) => {
    await page.goto("/en/work/og-posts");
    const tile = page.locator("[data-gal]").first();
    await tile.scrollIntoViewIfNeeded();
    await tile.click();
    const lb = page.locator("#lightbox");
    await expect(lb).toBeVisible();
    await expect(lb.locator(".lb-close")).toBeFocused();
    await expect(lb.locator(".lb-count")).toHaveText(/^1 \/ \d+$/);
    await page.keyboard.press("ArrowRight");
    await expect(lb.locator(".lb-count")).toHaveText(/^2 \/ \d+$/);
    for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#lightbox"))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(lb).toBeHidden();
    await expect(tile).toBeFocused();
  });

  test("booking: validation, preselected service, WhatsApp message (stubbed)", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __opened: string[] }).__opened = [];
      window.open = ((u: string) => { (window as unknown as { __opened: string[] }).__opened.push(u); return null; }) as typeof window.open;
    });
    await page.goto("/en");
    await page.locator('.sv7-go[data-service="social"]').click();
    await expect(page.locator("#bkService")).toHaveValue("social");
    await page.locator("#bkGrid button:not([disabled])").nth(1).click();
    await page.locator("#bkSlots button").first().click();
    await page.locator("#bkSend").click();
    await expect(page.locator("#bkErr")).toHaveText(/name and phone/i);
    await page.locator('#bkStep2 input[name="name"]').fill("Test User");
    await page.locator('#bkStep2 input[name="phone"]').fill("0550000000");
    await page.locator("#bkSend").click();
    const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
    expect(opened).toHaveLength(1);
    const msg = decodeURIComponent(opened[0]);
    expect(msg).toContain("https://wa.me/966550483401?text=");
    expect(msg).toContain("Test User");
    expect(msg).toContain("Social Media");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("content is static and fully visible", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveClass(/reduce-motion/);
    // hero title and section heads are visible immediately, not mid-animation
    const hero = await page.locator(".hc-title").evaluate((e) => ({ o: getComputedStyle(e).opacity, t: getComputedStyle(e).transform }));
    expect(hero.o).toBe("1");
    expect(hero.t === "none" || hero.t === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    await page.locator("#faq").scrollIntoViewIfNeeded();
    expect(await page.locator("#faqTitle").evaluate((e) => getComputedStyle(e.closest(".shead")!).opacity)).toBe("1");
    // hero clips never get a source: posters only
    expect(await page.$$eval("#heroCards video", (vs) => vs.filter((v) => v.getAttribute("src")).length)).toBe(0);
    // the work strip does not rotate on its own
    const open = () => page.locator("#wkRow .sx-c.on").getAttribute("data-sx");
    await page.locator("#wkRow").scrollIntoViewIfNeeded();
    const first = await open();
    await page.waitForTimeout(4500);
    expect(await open()).toBe(first);
  });
});

test.describe("accessibility spot checks", () => {
  test("skip link, visible focus, labelled fields", async ({ page, browserName }) => {
    // Safari only moves Tab focus to links and buttons with Option+Tab (unless the user changed the preference)
    const tab = browserName === "webkit" ? "Alt+Tab" : "Tab";
    await page.goto("/en");
    await page.keyboard.press(tab);
    await expect(page.locator(".skip")).toBeFocused();
    await page.keyboard.press(tab);
    await page.keyboard.press(tab);
    const ring = await page.evaluate(() => { const s = getComputedStyle(document.activeElement!); return s.boxShadow !== "none" || s.outlineStyle !== "none"; });
    expect(ring, "focused element shows a focus indicator").toBe(true);
    const unlabelled = await page.$$eval("input, select, textarea", (els) =>
      els.filter((e) => !(e.closest("label") || e.getAttribute("aria-label") || (e.id && document.querySelector(`label[for="${e.id}"]`)))).map((e) => e.outerHTML.slice(0, 80)),
    );
    expect(unlabelled).toEqual([]);
  });

  for (const theme of ["light", "dark"]) {
    test(`text contrast (WCAG AA) — ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("om-theme", t), theme);
      await page.goto("/en");
      await scrollThrough(page);
      const results = await page.evaluate(() => {
        const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
        const lum = ([r, g, b]: number[]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
        const bg = (el: Element | null): number[] => {
          for (; el; el = el.parentElement) { const c = rgb(getComputedStyle(el).backgroundColor); if (c.length && (c[3] ?? 1) > 0.9) return c; }
          return [255, 255, 255];
        };
        const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
        const SEL = { "body text (FAQ answer)": ".faq-a p", "section lead": "#services .s-sub", "service card text": ".sv7-c p", "primary button": ".btn-primary .bt span", "footer copyright": ".f2 .copy", "booking text": ".bk-info p" };
        return Object.entries(SEL).map(([name, sel]) => {
          const el = document.querySelector(sel);
          if (!el) return { name, ratio: 0, missing: true };
          return { name, ratio: +ratio(rgb(getComputedStyle(el).color), bg(el)).toFixed(2), missing: false };
        });
      });
      for (const r of results) test.info().annotations.push({ type: "contrast", description: `${r.name}: ${r.ratio}:1` });
      const failing = results.filter((r) => !r.missing && r.ratio < 4.5);
      expect(failing, "text below 4.5:1").toEqual([]);
    });
  }
});
