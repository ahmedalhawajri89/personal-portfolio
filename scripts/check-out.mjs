// Checks on the built pages in out/, run after every build (from postbuild)
// and on their own with `npm run check:out`. Reads the HTML a visitor gets:
// both home pages list the same five projects in the same order, every case
// study exists in both languages with a working way back, every in-page link
// lands on a section, and the contact links are present.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS, PROFILE } from '../content/projects.js';

const LANGS = ['ar', 'en'];
const problems = [];
const fail = (m) => problems.push(m);
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : (fail(`missing ${p}`), ''));

const order = {};
for (const lang of LANGS) {
  const html = read(join('out', lang, 'index.html'));
  if (!html) continue;
  if (!html.includes(`lang="${lang}"`)) fail(`/${lang}/: html lang is not ${lang}`);
  if (!html.includes(`dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`)) fail(`/${lang}/: wrong text direction`);

  // The five projects, in the order the cards show them.
  const seen = [...html.matchAll(new RegExp(`href="/${lang}/work/([a-z]+)/"`, 'g'))].map((m) => m[1]);
  order[lang] = [...new Set(seen)];
  for (const p of PROJECTS) {
    if (!seen.includes(p.slug)) fail(`/${lang}/: no link to ${p.slug}`);
    if (!html.includes(p[lang].name)) fail(`/${lang}/: ${p.slug} is not named "${p[lang].name}"`);
    if (p.demo && !html.includes(`href="${p.demo}"`)) fail(`/${lang}/: no live demo link for ${p.slug}`);
  }

  // Every #anchor on the page has a section to land on.
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, id] of html.matchAll(/href="#([a-z][\w-]*)"/g)) if (!ids.has(id)) fail(`/${lang}/: #${id} has no target`);

  // The ways to get in touch.
  if (!html.includes(`mailto:${PROFILE.links.email}`)) fail(`/${lang}/: no mailto link`);
  if (!html.includes(PROFILE.links.whatsapp)) fail(`/${lang}/: no WhatsApp link`);
  if (!html.includes('id="f-email"') || !html.includes('id="f-msg"')) fail(`/${lang}/: contact form fields missing`);
  if (/(GMT|UTC)\s*[+-]\s*\d/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(`/${lang}/: a fixed UTC offset is in the page`);

  for (const p of PROJECTS) {
    const cs = read(join('out', lang, 'work', p.slug, 'index.html'));
    if (cs && !cs.includes(`href="/${lang}/"`) && !cs.includes(`href="/${lang}/#`)) fail(`/${lang}/work/${p.slug}/: no way back home`);
  }
}
if (order.ar && order.en && order.ar.join() !== order.en.join()) fail(`project order differs: ar ${order.ar} / en ${order.en}`);

if (problems.length) {
  console.error(`check-out: ${problems.length} problem(s)\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check-out: ok — ${LANGS.length} languages, ${PROJECTS.length} projects in the same order: ${order.en.join(', ')}`);
