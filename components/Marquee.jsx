import { LOGOS } from './TechLogos';
import Icon from './Icons';

// Which logo a skill name maps to; anything unmatched gets a generic glyph.
const MATCH = [
  [/laravel/i, 'laravel'], [/^php/i, 'php'], [/mysql/i, 'mysql'], [/vue/i, 'vue'], [/pinia/i, 'pinia'],
  [/vite/i, 'vite'], [/tailwind/i, 'tailwind'], [/pest/i, 'pest'], [/playwright/i, 'playwright'],
  [/next/i, 'next'], [/^git$/i, 'git'],
];
// Pinia, Pest and Playwright have no simple-icons glyph; they take a fitting generic one.
const GENERIC = [[/api/i, 'code'], [/rtl|i18n/i, 'languages'], [/blade/i, 'layout'], [/datatables/i, 'database'], [/sanctum|pest|playwright/i, 'shield'], [/pinia/i, 'layers']];

// The brand colour lives on the chip, so hover can tint its border as well as the glyph.
const logoFor = (name) => { const k = MATCH.find(([re]) => re.test(name))?.[1]; return (k && LOGOS[k]) || null; };

function Logo({ name, logo }) {
  if (logo) {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" className="logo">
        <path d={logo.d} fill="currentColor" />
      </svg>
    );
  }
  const g = GENERIC.find(([re]) => re.test(name))?.[1] || 'sparkles';
  return <Icon name={g} size={14} className="logo" />;
}

// Infinite skill strip. Pure CSS: the list is rendered twice and the track
// slides by exactly half its width, so the loop is seamless. Logos are
// monochrome in the strip and take their brand colour on hover.
export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="marquee py-1" aria-label={items.join(', ')}>
      <div className="marquee-track">
        {row.map((x, i) => {
          const logo = logoFor(x);
          return (
            <span key={i} className="chip tech lat whitespace-nowrap px-4 py-2 text-[13px]" aria-hidden={i >= items.length}
                  style={logo ? { '--brand': logo.hex } : undefined}>
              <Logo name={x} logo={logo} />
              {x}
            </span>
          );
        })}
      </div>
    </div>
  );
}
