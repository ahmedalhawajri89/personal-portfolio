import { PROJECTS, PROFILE } from '../content/projects';
import { T } from './i18n';
import { HUE } from './hues';
import { shotsOf } from './shots';

const pad = (n) => String(n).padStart(2, '0');

/* What the page curtain says about each page it can open
   (components/Curtain.jsx), keyed by path: a small line above, the name set
   large, what it is, and the colour the curtain takes. The home page is the
   person in the signal orange; each case study is its project in its own
   hue, numbered as on the home page. */
export function curtainRoutes(lang) {
  const t = T[lang];
  const live = PROJECTS.filter((p) => shotsOf(p.shots).shots.length > 0);
  const map = {
    [`/${lang}/`]: { k: t.nav.home, name: PROFILE.name[lang], kind: t.hero.roleLine, hue: 'var(--accent)' },
  };
  live.forEach((p, i) => {
    map[`/${lang}/work/${p.slug}/`] = {
      n: `${pad(i + 1)} / ${pad(live.length)}`, k: t.detail.story.eyebrow, name: p[lang].name, kind: p[lang].kind, hue: HUE[p.slug],
    };
  });
  return map;
}
