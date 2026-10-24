'use client';

import { useEffect, useRef, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

/* The case study's four answers (for whom, what was wrong, what it does,
   what was handed over), told one at a time like a set of stories rather
   than laid out as four boxes.

   On one side the questions, each with a thin bar; on the other the answer
   to the open one, set large. While the brief is on screen it plays: the
   open question's bar fills for as long as its answer takes to read, then
   the next one opens. Pointing at it or focusing inside it holds the bar
   where it is; choosing a question stops the playing for good, and the
   reader goes at their own pace. On a phone the questions become four bars
   in a row above the answer, the way stories are shown.

   It is a proper tablist, arrow keys included. All four answers sit in the
   same grid cell, so the box is as tall as the longest and the page below
   never jumps. Without script every answer is shown in turn; for reduced
   motion nothing plays and the bar of the open question is simply full. */
export default function Brief({ items, label, rtl }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);   // playing is allowed: motion is fine and no question was chosen
  const [live, setLive] = useState(false);   // the brief is on screen
  const [hold, setHold] = useState(false);   // pointed at or focused inside
  const root = useRef(null);
  const tabs = useRef([]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAuto(true);
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.45 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const pick = (n) => { setAuto(false); setI(n); };
  const key = (e) => {
    const step = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const n = (i + step + items.length) % items.length;
    pick(n); tabs.current[n]?.focus();
  };
  // As long as the answer takes to read, within reason.
  const time = (a) => {
    const chars = (Array.isArray(a) ? a.join(' ') : a).length;
    return `${Math.min(14, Math.max(6, chars / 22)).toFixed(1)}s`;
  };

  const playing = auto && live && !hold;
  return (
    <div ref={root} className={`bf${auto ? ' is-auto' : ''}${playing ? ' is-playing' : ''}`}
         onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
         onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="bf-qs" role="tablist" aria-label={label} onKeyDown={key}>
        {items.map((x, n) => (
          <button key={x.q} ref={(el) => (tabs.current[n] = el)} type="button" role="tab"
                  id={`bf-tab-${n}`} aria-controls={`bf-panel-${n}`} aria-selected={n === i} tabIndex={n === i ? 0 : -1}
                  className={`bf-q${n === i ? ' is-on' : ''}${n < i ? ' is-past' : ''}`} onClick={() => pick(n)}>
            <span className="bf-n lat">{pad(n + 1)}</span>
            <span className="bf-t">{x.q}</span>
            <span className="bf-bar" aria-hidden="true">
              <i style={{ '--dur': time(x.a) }}
                 onAnimationEnd={n === i ? () => setI((k) => (k + 1) % items.length) : undefined} />
            </span>
          </button>
        ))}
      </div>

      <div className="bf-panels">
        {items.map((x, n) => (
          <div key={x.q} role="tabpanel" id={`bf-panel-${n}`} aria-labelledby={`bf-tab-${n}`} aria-hidden={n !== i}
               className={`bf-a${n === i ? ' is-on' : ''}${Array.isArray(x.a) ? ' is-list' : ''}`}>
            <p className="bf-aq"><span className="lat">{pad(n + 1)}</span>{x.q}</p>
            {Array.isArray(x.a)
              ? <ul>{x.a.map((y, k) => <li key={y} style={{ '--k': k + 1 }}>{y}</li>)}</ul>
              : <p className="bf-say">{x.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
