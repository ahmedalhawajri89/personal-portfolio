// Static export gives /ar/ and /en/. The site root serves the default
// language, so that language's tree is copied up to the root. Asset URLs are
// absolute, so a copy is all it takes. Change ROOT_LANG and the canonical,
// the hreflang x-default and the sitemap all follow -- each page keeps
// pointing at its own /<lang>/ URL, and the root is the duplicate.
const ROOT_LANG = 'en';
import { cpSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/site.mjs';
const out = 'out';
if (!existsSync(join(out, ROOT_LANG))) { console.error(`no out/${ROOT_LANG} — did next build run?`); process.exit(1); }
for (const e of readdirSync(join(out, ROOT_LANG))) {
  cpSync(join(out, ROOT_LANG, e), join(out, e), { recursive: true });
}
const urls = ['/', ...['ar', 'en'].filter((l) => l !== ROOT_LANG).map((l) => `/${l}/`)];
for (const l of ['ar', 'en']) for (const d of readdirSync(join(out, l, 'work'))) urls.push(`/${l}/work/${d}/`);
writeFileSync(join(out, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`postbuild: root = ${ROOT_LANG}, sitemap urls =`, urls.length);
