// Content checks, run before every build (npm runs it from `prebuild`) and on
// their own with `npm run check`. The site is one portfolio in two languages:
// the Arabic and English text live side by side in content/ and lib/i18n.js,
// and this fails the build when one language has a key, a list item or a
// project field the other lacks, when shared project data is missing, or when
// a fixed UTC offset creeps back in (Gaza changes offset with daylight saving).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { T } from '../lib/i18n.js';
import { PROJECTS, PROFILE } from '../content/projects.js';
import { BRIEFS } from '../content/briefs.js';
import { STORIES } from '../content/stories.js';
import { SERVICES, HERO_TESTS, PROCESS } from '../content/site.js';

const problems = [];
const fail = (msg) => problems.push(msg);

// Every path to a leaf, with list lengths, so a missing item shows up too.
const shape = (o, p = '') => {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((x, i) => shape(x, `${p}[${i}]`))];
  if (o && typeof o === 'object') return Object.keys(o).flatMap((k) => shape(o[k], p ? `${p}.${k}` : k));
  return [p];
};
const same = (ar, en, where) => {
  const A = new Set(shape(ar)), E = new Set(shape(en));
  const onlyAr = [...A].filter((x) => !E.has(x));
  const onlyEn = [...E].filter((x) => !A.has(x));
  if (onlyAr.length) fail(`${where}: only in Arabic: ${onlyAr.slice(0, 6).join(', ')}`);
  if (onlyEn.length) fail(`${where}: only in English: ${onlyEn.slice(0, 6).join(', ')}`);
};
const filled = (v, where) => { if (typeof v !== 'string' || !v.trim()) fail(`${where}: empty`); };

same(T.ar, T.en, 'lib/i18n.js');

const STATUSES = Object.keys(T.en.work.status);
if (PROJECTS.length !== 5) fail(`content/projects.js: expected the five projects, found ${PROJECTS.length}`);
const slugs = new Set();
for (const p of PROJECTS) {
  const w = `project ${p.slug}`;
  if (slugs.has(p.slug)) fail(`${w}: duplicate slug`);
  slugs.add(p.slug);
  if (!STATUSES.includes(p.status)) fail(`${w}: status "${p.status}" has no label (work.status)`);
  if (!/^https:\/\/github\.com\//.test(p.repo || '')) fail(`${w}: repo is not a GitHub link`);
  if (p.demo && !/^https:\/\//.test(p.demo)) fail(`${w}: demo is not an https link`);
  if (!p.stack?.length) fail(`${w}: empty stack`);
  same(p.ar, p.en, w);
  for (const k of ['name', 'kind', 'tagline', 'summary']) { filled(p.ar?.[k], `${w}.ar.${k}`); filled(p.en?.[k], `${w}.en.${k}`); }
  if (!BRIEFS[p.slug]) fail(`${w}: no brief in content/briefs.js`);
  else same(BRIEFS[p.slug].ar, BRIEFS[p.slug].en, `brief ${p.slug}`);
  if (STORIES[p.slug]) same(STORIES[p.slug].ar, STORIES[p.slug].en, `story ${p.slug}`);
}
for (const k of Object.keys(BRIEFS)) if (!slugs.has(k)) fail(`content/briefs.js: "${k}" is not a project`);

for (const sv of SERVICES) {
  same(sv.ar, sv.en, `service ${sv.en.h}`);
  if (sv.proof && !slugs.has(sv.proof)) fail(`service ${sv.en.h}: proof "${sv.proof}" is not a project`);
  if (sv.tier === 'core') for (const k of ['for', 'get']) { filled(sv[k]?.ar, `service ${sv.en.h}.${k}.ar`); filled(sv[k]?.en, `service ${sv.en.h}.${k}.en`); }
}
for (const x of HERO_TESTS) {
  if (!slugs.has(x.project)) fail(`test ${x.file}: project "${x.project}" is not a project`);
  for (const k of ['ar', 'en', 'probAr', 'probEn', 'decAr', 'decEn']) filled(x[k], `test ${x.file}.${k}`);
}
same(PROCESS.ar, PROCESS.en, 'content/site.js PROCESS');
for (const k of ['name', 'role', 'location', 'lede']) { filled(PROFILE[k]?.ar, `profile.${k}.ar`); filled(PROFILE[k]?.en, `profile.${k}.en`); }

// No written UTC offset anywhere in the source: the footer reads the time
// zone (Asia/Hebron) in the browser instead.
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : /\.(m?jsx?)$/.test(f) ? [p] : [];
});
for (const file of ['app', 'components', 'content', 'lib'].flatMap(walk)) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/(GMT|UTC)\s*[+−-]\s*\d/);
  if (m) fail(`${file}: fixed offset "${m[0]}"; use the Asia/Hebron time zone`);
}

// Every section the header, footer and dock link to exists on the home page.
const home = readFileSync('app/[lang]/page.jsx', 'utf8');
const ids = new Set([...home.matchAll(/<section id="([a-z]+)"/g)].map((m) => m[1]));
const chrome = readFileSync('components/Chrome.jsx', 'utf8');
const linked = new Set([...chrome.matchAll(/\['([a-z]+)', t\.nav\./g)].map((m) => m[1]));
for (const id of linked) if (!ids.has(id)) fail(`components/Chrome.jsx links to #${id}, which the home page does not have`);

if (problems.length) {
  console.error(`check-content: ${problems.length} problem(s)\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check-content: ok — ${PROJECTS.length} projects, both languages match, ${linked.size} linked sections exist`);
