import SHOTS from '../content/shots.json';

/** { groups, shots } for a project folder, or an empty set. */
export const shotsOf = (folder) => SHOTS[folder] || { groups: {}, shots: [] };

/** The desktop shot used as the project's cover, preferring the page language. */
export function coverOf(p, lang = 'ar') {
  const { shots } = shotsOf(p.shots);
  const desk = shots.filter((s) => s.device === 'desktop');
  return (
    desk.find((s) => s.key === p.cover && s.locale === lang) ||
    desk.find((s) => s.key === p.cover) ||
    desk.find((s) => s.locale === lang) ||
    desk[0]
  );
}

/** Distinct pages (one key counts once whatever its language or device). */
export const pagesOf = (folder) => new Set(shotsOf(folder).shots.map((s) => s.key)).size;

export const src = (folder, file) => `/shots/${folder}/${file}`;

/**
 * The short tour: up to `max` screens that walk the whole product once.
 *
 * The pick is derived, not editorial. A group is a part of the product — the
 * shop, the customer's account, the admin panel — and inside a group the
 * capture config already lists screens in the order somebody would meet them.
 * So the tour takes the opening screens of every group, in group order, with
 * each group's share of the slots proportional to how much of the product it
 * is. Every part gets at least one screen, nothing is invented, and it stays
 * right when screens are added or removed.
 */
export function tourOf(project, lang = 'ar', max = 8) {
  const folder = typeof project === 'string' ? project : project.shots;
  const { groups, shots } = shotsOf(folder);
  const ids = Object.keys(groups).filter((g) => shots.some((s) => s.group === g));
  if (!ids.length) return [];

  // One shot per page key, preferring the reader's language and the desktop
  // capture, because a tour of a web product is a tour of its wide layout.
  const pick = (key) => {
    const all = shots.filter((s) => s.key === key);
    return all.find((s) => s.device === 'desktop' && s.locale === lang)
        || all.find((s) => s.device === 'desktop')
        || all.find((s) => s.locale === lang)
        || all[0];
  };
  const keysIn = (g) => [...new Set(shots.filter((s) => s.group === g).map((s) => s.key))];

  // A project may name its own tour. Derivation covers a part of the product
  // evenly, which is the right default, but it cannot know that a furniture
  // shop's room screen carries the whole idea while its category listing does
  // not. Any key that no longer has a capture simply drops out.
  if (Array.isArray(project?.tour) && project.tour.length) {
    const named = project.tour.map(pick).filter(Boolean);
    if (named.length) return named.slice(0, max);
  }

  const buckets = ids.map((g) => ({ g, keys: keysIn(g) }));
  const total = buckets.reduce((n, b) => n + b.keys.length, 0);
  let quota = buckets.map((b) => Math.max(1, Math.round((max * b.keys.length) / total)));

  // Rounding up per group can overshoot; give the slots back to the biggest
  // groups first, never taking a group below its one guaranteed screen.
  let over = quota.reduce((a, b) => a + b, 0) - max;
  while (over > 0) {
    let i = quota.indexOf(Math.max(...quota));
    if (quota[i] <= 1) break;
    quota[i] -= 1; over -= 1;
  }
  return buckets.flatMap((b, i) => b.keys.slice(0, Math.min(quota[i], b.keys.length)).map(pick)).filter(Boolean);
}
