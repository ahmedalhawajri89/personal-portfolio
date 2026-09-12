// Static export gives /ar/ and /en/. The site root should serve Arabic,
// so /ar/* is copied up to the root. Asset URLs are absolute, so a copy
// is all it takes.
import { cpSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/site.mjs';
const out = 'out';
if (!existsSync(join(out, 'ar'))) { console.error('no out/ar — did next build run?'); process.exit(1); }
for (const e of readdirSync(join(out, 'ar'))) {
  cpSync(join(out, 'ar', e), join(out, e), { recursive: true });
}
const urls = ['/', '/en/'];
for (const l of ['ar', 'en']) for (const d of readdirSync(join(out, l, 'work'))) urls.push(`/${l}/work/${d}/`);
writeFileSync(join(out, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('postbuild: root = Arabic, sitemap urls =', urls.length);
