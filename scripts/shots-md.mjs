// Medium copies of the screenshots the case-study tour shows (components/
// Journey.jsx). The tour frame is 527–830 CSS px wide, while a capture is
// 1600 px wide, so a 960 px copy serves a normal-density screen and the
// browser still picks the original on a high-density one (srcset + sizes in
// app/[lang]/work/[slug]/page.jsx). The originals are never touched; copies
// sit beside them as <name>-md.webp and are made only when missing.
//
//   node scripts/shots-md.mjs
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { PROJECTS } from '../content/projects.js';
import { BRIEFS } from '../content/briefs.js';

// The same choice as lib/shots.js shotOf(): reader's language, desktop first.
// (lib/shots.js imports the JSON in a way plain Node does not accept.)
const SHOTS = JSON.parse(readFileSync('content/shots.json', 'utf8'));
const shotOf = (folder, key, lang) => {
  const all = (SHOTS[folder]?.shots || []).filter((s) => s.key === key);
  return all.find((s) => s.device === 'desktop' && s.locale === lang)
      || all.find((s) => s.device === 'desktop')
      || all.find((s) => s.locale === lang)
      || all[0];
};

export const MD_WIDTH = 960;
const made = [], kept = [];
for (const p of PROJECTS) {
  const keys = new Set((BRIEFS[p.slug]?.journey || []).map((st) => st.shot));
  for (const key of keys) {
    for (const lang of ['ar', 'en']) {
      const sh = shotOf(p.shots, key, lang);
      if (!sh || sh.device !== 'desktop' || sh.w <= MD_WIDTH) continue;
      const from = join('public', 'shots', p.shots, sh.file);
      const to = from.replace(/\.webp$/, '-md.webp');
      if (existsSync(to)) { kept.push(to); continue; }
      const info = await sharp(from).resize({ width: MD_WIDTH }).webp({ quality: 82, effort: 6 }).toFile(to);
      made.push(`${to} ${Math.round(info.size / 1024)}KB`);
    }
  }
}
console.log(`shots-md: ${made.length} made, ${kept.length} already there`);
made.forEach((m) => console.log('  ' + m));
