/* The shape family: one material -- glossy orange and cream with a soft
   shadow -- and a meaning for each piece, so a shape on the page always says
   something about the work:

     tube    the data moving through a system, and what joins its parts
     key     the code itself
     sel     the interface: a cursor in a selection
     ast     the idea, the start
     ok      testing: checked before you see it
     layers  database, server, interface: the whole system
     bag, cal, chart, msg, doc   things the services and stages make

   <ShapeDefs /> is rendered once per page and holds every drawing as a
   symbol; <Shape name="ok" /> places one. They are decoration: hidden from
   assistive technology. Their motion lives in components/ShapeMotion.jsx. */

export function ShapeDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sx-o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFB27A" /><stop offset=".5" stopColor="#FF5A14" /><stop offset="1" stopColor="#B83300" /></linearGradient>
        <linearGradient id="sx-oT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFC59A" /><stop offset="1" stopColor="#FF7A33" /></linearGradient>
        <linearGradient id="sx-oS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E5500F" /><stop offset="1" stopColor="#A52E00" /></linearGradient>
        <linearGradient id="sx-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFDF8" /><stop offset="1" stopColor="#E4DCCB" /></linearGradient>
        <linearGradient id="sx-cS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D8CFBD" /><stop offset="1" stopColor="#B9AE98" /></linearGradient>
        <linearGradient id="sx-tube" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB27A" /><stop offset=".45" stopColor="#FF6A1F" /><stop offset="1" stopColor="#C23A06" /></linearGradient>
        <filter id="sx-sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity=".42" /></filter>

        <symbol id="sx-tube" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <path d="M16 118 C 40 140, 62 100, 80 80 S 120 30, 146 52" fill="none" stroke="url(#sx-tube)" strokeWidth="20" strokeLinecap="round" />
            <path d="M16 114 C 40 136, 62 96, 80 76 S 120 26, 146 48" fill="none" stroke="rgba(255,230,205,.55)" strokeWidth="4" strokeLinecap="round" />
            <g transform="translate(74 86) rotate(-50)"><rect x="-8" y="-15" width="16" height="30" rx="6" fill="#F4F0E8" /><rect x="-8" y="-15" width="5" height="30" rx="2.5" fill="#D9D1C2" /></g>
          </g>
        </symbol>
        <symbol id="sx-key" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)" transform="rotate(-10 80 80)">
            <rect x="26" y="38" width="108" height="94" rx="22" fill="url(#sx-cS)" />
            <rect x="28" y="30" width="104" height="88" rx="20" fill="url(#sx-c)" />
            <path d="M62 62 L48 74 L62 86 M98 62 L112 74 L98 86 M86 58 L74 90" fill="none" stroke="#2A2620" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </symbol>
        <symbol id="sx-sel" viewBox="0 0 160 160">
          <rect x="22" y="28" width="116" height="100" fill="none" stroke="#FF6A1F" strokeWidth="2.5" />
          <g fill="#FF6A1F"><rect x="16" y="22" width="12" height="12" /><rect x="132" y="22" width="12" height="12" /><rect x="16" y="122" width="12" height="12" /><rect x="132" y="122" width="12" height="12" /></g>
          <g filter="url(#sx-sh)"><path d="M58 50 L118 84 L90 90 L78 118 Z" fill="url(#sx-o)" stroke="#FFD2B0" strokeWidth="2" strokeLinejoin="round" /></g>
        </symbol>
        <symbol id="sx-ast" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)" transform="translate(80 80)">
            <rect x="-15" y="-56" width="30" height="112" rx="15" fill="url(#sx-o)" />
            <rect x="-15" y="-56" width="30" height="112" rx="15" fill="url(#sx-o)" transform="rotate(60)" />
            <rect x="-15" y="-56" width="30" height="112" rx="15" fill="url(#sx-o)" transform="rotate(-60)" />
            <circle r="14" fill="#FF8A45" />
          </g>
        </symbol>
        <symbol id="sx-ok" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <circle cx="80" cy="86" r="54" fill="url(#sx-oS)" />
            <circle cx="80" cy="78" r="54" fill="url(#sx-o)" />
            <circle cx="80" cy="78" r="40" fill="none" stroke="rgba(255,225,200,.45)" strokeWidth="2" />
            <path d="M58 79 L74 95 L104 62" fill="none" stroke="#FFFDF8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </symbol>
        <symbol id="sx-layers" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <g transform="translate(0 30)"><path d="M80 70 L136 98 L80 126 L24 98 Z" fill="url(#sx-oS)" /><path d="M24 98 L80 126 L80 136 L24 108 Z" fill="#8F2800" /><path d="M136 98 L80 126 L80 136 L136 108 Z" fill="#A83200" /><path d="M80 70 L136 98 L80 126 L24 98 Z" fill="url(#sx-oT)" opacity=".55" /></g>
            <g><path d="M24 98 L80 126 L80 136 L24 108 Z" fill="#A99D86" /><path d="M136 98 L80 126 L80 136 L136 108 Z" fill="#BFB39C" /><path d="M80 70 L136 98 L80 126 L24 98 Z" fill="url(#sx-c)" /></g>
            <g transform="translate(0 -30)"><path d="M24 98 L80 126 L80 136 L24 108 Z" fill="#9C2C00" /><path d="M136 98 L80 126 L80 136 L136 108 Z" fill="#B53500" /><path d="M80 70 L136 98 L80 126 L24 98 Z" fill="url(#sx-oT)" /></g>
          </g>
        </symbol>
        <symbol id="sx-bag" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <path d="M58 58 v-10 a22 22 0 0 1 44 0 v10" fill="none" stroke="#E4DCCB" strokeWidth="9" strokeLinecap="round" />
            <path d="M36 62 h88 l8 74 a8 8 0 0 1 -8 9 h-88 a8 8 0 0 1 -8 -9 z" fill="url(#sx-oS)" />
            <path d="M36 56 h88 l7 70 a8 8 0 0 1 -8 9 h-86 a8 8 0 0 1 -8 -9 z" fill="url(#sx-o)" />
            <circle cx="62" cy="74" r="5" fill="#8F2800" /><circle cx="98" cy="74" r="5" fill="#8F2800" />
          </g>
        </symbol>
        <symbol id="sx-cal" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <rect x="26" y="40" width="108" height="100" rx="18" fill="url(#sx-cS)" />
            <rect x="26" y="34" width="108" height="98" rx="18" fill="url(#sx-c)" />
            <path d="M26 52 a18 18 0 0 1 18 -18 h72 a18 18 0 0 1 18 18 v12 h-108z" fill="url(#sx-o)" />
            <rect x="50" y="22" width="9" height="24" rx="4.5" fill="#8F2800" /><rect x="101" y="22" width="9" height="24" rx="4.5" fill="#8F2800" />
            <g fill="#D8CFBD"><rect x="42" y="78" width="16" height="14" rx="4" /><rect x="72" y="78" width="16" height="14" rx="4" /><rect x="42" y="102" width="16" height="14" rx="4" /><rect x="102" y="102" width="16" height="14" rx="4" /></g>
            <rect x="102" y="78" width="16" height="14" rx="4" fill="#FF5A14" /><rect x="72" y="102" width="16" height="14" rx="4" fill="#FF5A14" />
          </g>
        </symbol>
        <symbol id="sx-chart" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <rect x="24" y="36" width="112" height="104" rx="18" fill="url(#sx-cS)" />
            <rect x="24" y="30" width="112" height="104" rx="18" fill="url(#sx-c)" />
            <rect x="42" y="88" width="16" height="30" rx="5" fill="#E8C9A8" /><rect x="66" y="72" width="16" height="46" rx="5" fill="#FFB27A" /><rect x="90" y="80" width="16" height="38" rx="5" fill="#FF8A45" /><rect x="114" y="56" width="12" height="62" rx="5" fill="url(#sx-o)" />
            <path d="M44 74 L72 58 L96 66 L122 42" fill="none" stroke="#FF5A14" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </symbol>
        <symbol id="sx-msg" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)">
            <path d="M30 40 h100 a16 16 0 0 1 16 16 v46 a16 16 0 0 1 -16 16 h-58 l-24 20 v-20 h-18 a16 16 0 0 1 -16 -16 v-46 a16 16 0 0 1 16 -16z" fill="url(#sx-o)" />
            <circle cx="56" cy="79" r="7" fill="#FFFDF8" /><circle cx="80" cy="79" r="7" fill="#FFFDF8" /><circle cx="104" cy="79" r="7" fill="#FFFDF8" />
          </g>
        </symbol>
        <symbol id="sx-doc" viewBox="0 0 160 160">
          <g filter="url(#sx-sh)" transform="rotate(6 80 80)">
            <path d="M42 26 h56 l26 26 v84 a10 10 0 0 1 -10 10 h-72 a10 10 0 0 1 -10 -10 v-100 a10 10 0 0 1 10 -10z" fill="url(#sx-c)" />
            <path d="M98 26 v20 a6 6 0 0 0 6 6 h20z" fill="#D8CFBD" />
            <g fill="#D8CFBD"><rect x="48" y="62" width="60" height="7" rx="3.5" /><rect x="48" y="78" width="48" height="7" rx="3.5" /><rect x="48" y="94" width="56" height="7" rx="3.5" /></g>
            <rect x="48" y="114" width="40" height="16" rx="8" fill="url(#sx-o)" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

export function Shape({ name, className = '', spin = false }) {
  return (
    <span className={`sx${spin ? ' sx-spin' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 160 160" focusable="false"><use href={`#sx-${name}`} /></svg>
    </span>
  );
}

/* The opening of the work: the word set huge, with the family around it.
   One tube, drawn as one path, wraps the word: it rises behind the first
   letters, arcs over the top and comes down in front of the rest. The same
   path is drawn twice -- once behind the word, once in front of it with
   only its right part showing -- so it reads as a single piece passing
   round. Around it: the idea, the cursor in its selection, the key of code,
   sparks. Every piece sits in a placing group with a moving group inside,
   so motion never moves a piece off its place. */
const TUBE = 'M60 470 C 180 500, 260 380, 340 330 C 430 270, 450 150, 560 130 C 680 110, 730 220, 705 300 C 680 380, 760 470, 860 460 C 960 450, 1010 405, 1050 380';

function Tube() {
  return (
    <>
      <path className="wm-t" d={TUBE} fill="none" stroke="url(#sx-tube)" strokeWidth="30" strokeLinecap="round" pathLength="1" />
      <path className="wm-t" d={TUBE} transform="translate(0 -6)" fill="none" stroke="rgba(255,230,205,.5)" strokeWidth="6" strokeLinecap="round" pathLength="1" />
    </>
  );
}

export function WorkMark({ word }) {
  const spark = 'M0-22 C3-6 6-3 22 0 C6 3 3 6 0 22 C-3 6 -6 3 -22 0 C-6-3 -3-6 0-22Z';
  const at = (x, y, cls, children) => <g transform={`translate(${x} ${y})`}><g className={`wm-p ${cls}`}>{children}</g></g>;
  return (
    <div className="wm" aria-hidden="true">
      <svg className="wm-back" viewBox="0 0 1240 520" focusable="false">
        <g filter="url(#sx-sh)"><Tube /></g>
      </svg>
      <p className="wm-word"><span>{word}</span></p>
      <svg className="wm-front" viewBox="0 0 1240 520" focusable="false">
        <defs><clipPath id="wm-front"><rect x="610" y="0" width="630" height="520" /></clipPath></defs>
        <g filter="url(#sx-sh)">
          <g clipPath="url(#wm-front)"><Tube /></g>
          {/* This ring sits where the tube passes from behind the word to in
              front of it, so the join is never seen. */}
          {at(610, 129, 'wm-ring', <g transform="rotate(9)"><rect x="-13" y="-23" width="26" height="46" rx="8" fill="#F4F0E8" /><rect x="-13" y="-23" width="8" height="46" rx="4" fill="#D9D1C2" /></g>)}
          {at(862, 460, 'wm-ring', <><rect x="-13" y="-22" width="26" height="44" rx="8" fill="#F4F0E8" /><rect x="-13" y="-22" width="8" height="44" rx="4" fill="#D9D1C2" /></>)}
        </g>
        {at(820, 80, 'wm-ast', <use href="#sx-ast" x="-60" y="-60" width="120" height="120" />)}
        {at(1110, 120, 'wm-sel', <use href="#sx-sel" x="-75" y="-75" width="150" height="150" />)}
        {at(1000, 450, 'wm-key', <use href="#sx-key" x="-70" y="-70" width="140" height="140" />)}
        <g fill="#FF6A1F">
          {at(140, 110, 'wm-spk', <path d={spark} />)}
          {at(1190, 320, 'wm-spk', <path d={spark} transform="scale(.8)" />)}
          {at(620, 490, 'wm-spk', <path d={spark} transform="scale(.6)" />)}
          {at(420, 50, 'wm-spk', <path d={spark} transform="scale(.55)" />)}
        </g>
      </svg>
    </div>
  );
}
