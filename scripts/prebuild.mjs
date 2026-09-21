// robots.txt and sitemap.xml, written into public/ *before* next build.
//
// They used to be written into out/ by postbuild, which works for `npm start`
// but never reached production: Vercel's Next builder collects its own output
// and ignores files added to out/ afterwards, so both URLs returned 404 on the
// live site while /favicon.svg and /og.png -- which live in public/ -- were
// served fine. Anything that has to survive a deploy goes in public/.
//
// npm runs this automatically before `build`, so the sitemap cannot drift from
// the project list: it is derived from content/projects.js, not hand-kept.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/site.mjs';
import { PROJECTS } from '../content/projects.js';

const LANGS = ['ar', 'en'];
const ROOT_LANG = 'en'; // must match scripts/postbuild.mjs

const urls = [
  '/',
  ...LANGS.filter((l) => l !== ROOT_LANG).map((l) => `/${l}/`),
  ...LANGS.flatMap((l) => PROJECTS.map((p) => `/${l}/work/${p.slug}/`)),
];

writeFileSync(
  join('public', 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n'
);

writeFileSync(join('public', 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log('prebuild: public/robots.txt + public/sitemap.xml,', urls.length, 'urls');
