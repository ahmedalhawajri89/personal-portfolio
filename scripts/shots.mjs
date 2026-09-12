// Photographs every page listed in shots.config.mjs and writes
//   public/shots/<project>/<key>-<locale>[-m].webp      full-size capture
//   public/shots/<project>/<key>-<locale>[-m]-t.webp    grid thumbnail
//   content/shots.json                                  the manifest the site reads
//
// Desktop is 1440×900 at 2× (crisp on retina), phone is 390×844 at 2×.
// Full-page captures are capped at 4000 CSS px so a long page stays a
// sensible image. Playwright comes from the booking project's node_modules,
// so nothing has to be installed here.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS } from './shots.config.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('D:/Works Exhibition/01-fullstack/booking/node_modules/playwright');

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public', 'shots');
const MANIFEST = join(ROOT, 'content', 'shots.json');

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const MAX_FULL = 4000;            // CSS px
const FULL_W = { desktop: 1600, mobile: 780 };
const THUMB_W = { desktop: 960, mobile: 480 };
const THUMB_H = { desktop: 600, mobile: 1040 };

// `node scripts/shots.mjs kafala --only=adm-login,portal` re-captures just
// those page keys and merges them into the project's existing manifest.
const args = process.argv.slice(2);
const onlyKeys = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const only = args.filter((a) => !a.startsWith('--'));
const names = only.length ? only : Object.keys(PROJECTS);

// Scrollbars off, caret off, and every animation jumped to its final frame.
const CALM_CSS = `
  ::-webkit-scrollbar{display:none!important} html{scrollbar-width:none!important}
  *,*::before,*::after{caret-color:transparent!important}
  nextjs-portal,#__next-build-watcher,[data-nextjs-toast]{display:none!important}
`;

// Each project writes its own manifest so several projects can be captured in
// parallel; content/shots.json is re-merged from those files at the end.
const PARTS = join(ROOT, 'content', 'shots');
mkdirSync(PARTS, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const name of names) {
  const P = PROJECTS[name];
  if (!P) { console.error(`unknown project ${name}`); continue; }
  const dir = join(OUT, name);
  const partFile = join(PARTS, `${name}.json`);
  if (!onlyKeys.length) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  // With --only, start from the previous manifest minus the keys being redone.
  const previous = onlyKeys.length && existsSync(partFile) ? JSON.parse(readFileSync(partFile, 'utf8')).shots : [];
  const entries = previous.filter((e) => !onlyKeys.includes(e.key));
  console.log(`\n=== ${name} ===`);

  for (const locale of P.locales) {
    for (const device of ['desktop', 'mobile']) {
      const pages = P.pages.filter((pg) => (device === 'desktop' || pg.mobile) && (!onlyKeys.length || onlyKeys.includes(pg.key)));
      if (!pages.length) continue;

      // One context per role so sessions never bleed into each other.
      const roles = [...new Set(pages.map((pg) => pg.as || ''))];
      for (const role of roles) {
        const ctx = await browser.newContext({
          viewport: device === 'desktop' ? DESKTOP : MOBILE,
          deviceScaleFactor: 2,
          isMobile: device === 'mobile',
          hasTouch: device === 'mobile',
          locale: locale === 'ar' ? 'ar' : 'en-US',
          colorScheme: 'light',
          reducedMotion: 'no-preference',
        });
        await ctx.addInitScript(() => {
          // Hide the mouse-driven cursor effects some sites draw.
          Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });
        const page = await ctx.newPage();
        page.setDefaultTimeout(45000);
        page.setDefaultNavigationTimeout(90000);
        page.on('pageerror', (e) => problems.push(`${name} ${locale} ${device} PAGEERROR ${e.message.slice(0, 120)}`));

        try {
          if (P.setLocale) await P.setLocale(page, P.base, locale);
          if (role) await login(page, P, role);
        } catch (e) {
          problems.push(`${name} ${locale} ${device} ${role}: setup failed — ${e.message.slice(0, 160)}`);
          await ctx.close();
          continue;
        }

        for (const pg of pages.filter((x) => (x.as || '') === role)) {
          const suffix = device === 'mobile' ? '-m' : '';
          const stem = `${pg.key}-${locale}${suffix}`;
          const url = pg.url || P.base + pg.path;
          try {
            await page.goto(url, { waitUntil: 'networkidle' });
            if (pg.prep) await pg.prep(page);
            await settle(page, !!pg.full);
            const full = !!pg.full;
            const png = await page.screenshot({ fullPage: full, type: 'png', animations: 'disabled' });
            const meta = await writeImages(png, join(dir, stem), device);
            entries.push({
              key: pg.key, locale, device, group: pg.group,
              file: `${stem}.webp`, thumb: `${stem}-t.webp`,
              labelAr: pg.ar, labelEn: pg.en,
              path: pg.url ? new URL(pg.url).pathname : pg.path.replace(/\?.*$/, ''),
              w: meta.w, h: meta.h, tw: meta.tw, th: meta.th, full,
            });
            console.log(`  ✓ ${stem}  ${meta.w}×${meta.h}`);
          } catch (e) {
            problems.push(`${name} ${stem}: ${e.message.split('\n')[0].slice(0, 160)}`);
            console.log(`  ✗ ${stem}: ${e.message.split('\n')[0].slice(0, 100)}`);
          }
        }
        await ctx.close();
      }
    }
  }

  if (onlyKeys.length) entries.sort((a, b) => P.pages.findIndex((x) => x.key === a.key) - P.pages.findIndex((x) => x.key === b.key) || a.locale.localeCompare(b.locale) || a.device.localeCompare(b.device));
  writeFileSync(partFile, JSON.stringify({ groups: P.groups, shots: entries }, null, 1));
  console.log(`  ${entries.length} shots`);
}

await browser.close();
const merged = {};
for (const k of Object.keys(PROJECTS)) {
  const f = join(PARTS, `${k}.json`);
  if (existsSync(f)) merged[k] = JSON.parse(readFileSync(f, 'utf8'));
}
writeFileSync(MANIFEST, JSON.stringify(merged, null, 1));
console.log(problems.length ? `\nproblems:\n${problems.join('\n')}` : '\nclean');

/* ---------------------------------------------------------------- helpers */

async function login(page, P, role) {
  const r = P.roles[role];
  await page.goto(P.base + r.path, { waitUntil: 'networkidle' });
  await page.fill(r.email, r.user);
  await page.fill(r.password, r.pass);
  // The submit button of the form that holds the password field — pages
  // often carry another form (language toggle, newsletter) before it.
  const submit = page.locator(`form:has(${r.password}) button[type=submit]`).first();
  await Promise.all([
    r.waitFor ? page.waitForURL(r.waitFor, { timeout: 60000 }) : page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }).catch(() => {}),
    submit.click(),
  ]);
  await page.waitForLoadState('networkidle').catch(() => {});
  // Still on the login page means the credentials were refused.
  if (page.url().includes(r.path) && !r.waitFor) throw new Error(`login as ${role} did not leave ${r.path}`);
}

// Fonts, images and reveal-on-scroll all need a moment; a full-page shot also
// needs the page scrolled once so IntersectionObserver-gated sections appear.
async function settle(page, full) {
  await page.addStyleTag({ content: CALM_CSS }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  if (full) {
    await page.evaluate(async () => {
      const step = Math.max(300, window.innerHeight * 0.7);
      for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 4600); y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
  }
  // Force every lazy image, then wait for them.
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
    await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
  }).catch(() => {});
  await page.waitForTimeout(900);
}

async function writeImages(png, stemPath, device) {
  const cap = MAX_FULL * 2;
  let img = sharp(png);
  const m = await img.metadata();
  if (m.height > cap) img = img.extract({ left: 0, top: 0, width: m.width, height: cap });
  const fullBuf = await img.resize({ width: FULL_W[device] }).webp({ quality: 80, effort: 5 }).toBuffer();
  const fm = await sharp(fullBuf).metadata();
  writeFileSync(`${stemPath}.webp`, fullBuf);

  const tw = THUMB_W[device], th = THUMB_H[device];
  const thumb = await sharp(png)
    .resize({ width: tw })
    .extract({ left: 0, top: 0, width: tw, height: Math.min(th, Math.round(m.height * tw / m.width)) })
    .webp({ quality: 78, effort: 5 })
    .toBuffer();
  const tm = await sharp(thumb).metadata();
  writeFileSync(`${stemPath}-t.webp`, thumb);
  return { w: fm.width, h: fm.height, tw: tm.width, th: tm.height };
}
