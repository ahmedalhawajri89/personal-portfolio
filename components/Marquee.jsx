import { LOGOS } from './TechLogos';
import Icon from './Icons';

// Which logo a tool maps to; anything unmatched gets a generic glyph.
const MATCH = [
  [/laravel/i, 'laravel'], [/^php/i, 'php'], [/mysql/i, 'mysql'], [/vue/i, 'vue'],
  [/tailwind/i, 'tailwind'], [/next/i, 'next'],
];
const GENERIC = [[/api/i, 'code'], [/pest|playwright/i, 'shield']];

function Mark({ name }) {
  const k = MATCH.find(([re]) => re.test(name))?.[1];
  if (k && LOGOS[k]) {
    return <svg viewBox="0 0 24 24" className="tk-logo" aria-hidden="true"><path d={LOGOS[k].d} fill="currentColor" /></svg>;
  }
  return <Icon name={GENERIC.find(([re]) => re.test(name))?.[1] || 'code'} size={24} className="tk-logo" />;
}

// The stack as a ticker, set like a headline rather than a row of badges:
// each tool at display size with the job it does in the work beside it, the
// logo's dot between them. Full bleed, between two hairlines. The moving copy
// is decoration (aria-hidden); a plain list carries the same words for a
// screen reader. It pauses under the pointer and off screen, and stands
// still for reduced motion.
export default function Marquee({ items, roles, label }) {
  const one = (k) => items.map((x) => (
    <span key={`${k}-${x}`} className="tk-item">
      <Mark name={x} />
      <b className="lat">{x}</b>
      {roles?.[x] && <small>{roles[x]}</small>}
      <i className="tk-dot" />
    </span>
  ));
  return (
    <section className="tk" aria-label={label}>
      <ul className="sr-only">{items.map((x) => <li key={x}>{roles?.[x] ? `${x} — ${roles[x]}` : x}</li>)}</ul>
      <div className="tk-band" aria-hidden="true">
        <div className="tk-track">{one('a')}{one('b')}</div>
      </div>
    </section>
  );
}
