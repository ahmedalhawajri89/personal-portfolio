// Static export gives /ar/ and /en/. The site root serves the default
// language, so that language's tree is copied up to the root. Asset URLs are
// absolute, so a copy is all it takes. Change ROOT_LANG and the canonical,
// the hreflang x-default and the sitemap all follow -- each page keeps
// pointing at its own /<lang>/ URL, and the root is the duplicate.
const ROOT_LANG = 'en';
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const out = 'out';
if (!existsSync(join(out, ROOT_LANG))) { console.error(`no out/${ROOT_LANG} — did next build run?`); process.exit(1); }
for (const e of readdirSync(join(out, ROOT_LANG))) {
  cpSync(join(out, ROOT_LANG, e), join(out, e), { recursive: true });
}
// robots.txt and sitemap.xml are written by scripts/prebuild.mjs into
// public/, because files added to out/ after next build never reach Vercel.
console.log(`postbuild: root = ${ROOT_LANG}`);
