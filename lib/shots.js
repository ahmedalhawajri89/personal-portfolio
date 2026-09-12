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
