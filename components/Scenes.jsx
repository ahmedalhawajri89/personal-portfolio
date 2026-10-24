'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';

const pad = (n) => String(n).padStart(2, '0');

/* What turns the sections into one film rather than a row of rooms.

   The light. A soft light sits behind the whole page, and every scene sets
   its colour and where it falls (data-light, data-lx, data-ly on the
   element): orange over the opening, each project's own colour as its row
   comes up, violet for how he works, lime for the tests, and so on. Moving
   from one scene to the next is a change of lighting, eased over a second,
   never a cut.

   The chapter. In the corner, the chapter the reader is in -- its number
   and its name, which roll over when it changes -- and a line for how far
   through the whole page they are. It is hidden over the opening, where
   the page has not started its chapters yet, and over the footer, where
   they have ended.

   Both are decoration over a page that reads without them: the light is
   aria-hidden, the chapter marker repeats the headings, and for reduced
   motion the light does not move and the marker is not shown. */
export default function Scenes({ chapters }) {
  const [now, setNow] = useState(-1);
  const [done, setDone] = useState(false);
  const light = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !light.current) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = light.current;
        const go = (src) => gsap.to(el, {
          '--lc': src.dataset.light, '--lx': src.dataset.lx || '70vw', '--ly': src.dataset.ly || '30vh',
          duration: 1.4, ease: 'power2.inOut', overwrite: 'auto',
        });
        const lit = Array.from(document.querySelectorAll('[data-light]')).map((src) => ScrollTrigger.create({
          trigger: src, start: 'top 55%', end: 'bottom 55%',
          onToggle: (self) => { if (self.isActive) go(src); },
        }));
        const marks = chapters.map((c, k) => {
          const sec = document.getElementById(c.id);
          return sec && ScrollTrigger.create({
            trigger: sec, start: 'top 50%', end: 'bottom 50%',
            onToggle: (self) => { if (self.isActive) setNow(k); else setNow((n) => (n === k && self.direction < 0 && k === 0 ? -1 : n)); },
          });
        }).filter(Boolean);
        // The film is over when the footer comes up: the marker steps aside
        // rather than sit on the footer's own last line.
        const foot = document.querySelector('.foot');
        const end = foot && ScrollTrigger.create({
          trigger: foot, start: 'top 85%',
          onEnter: () => setDone(true), onLeaveBack: () => setDone(false),
        });
        const prog = ScrollTrigger.create({
          start: 0, end: 'max',
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`; },
        });
        return () => { lit.forEach((s) => s.kill()); marks.forEach((s) => s.kill()); end?.kill(); prog.kill(); setNow(-1); setDone(false); };
      });
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [chapters]);

  const c = chapters[now];
  return (
    <>
      <div className="stage" ref={light} aria-hidden="true"><i /></div>
      <div className={`chap${c && !done ? ' is-on' : ''}`} aria-hidden="true" style={c ? { '--c': c.hue } : undefined}>
        <span className="chap-n lat">{c ? pad(now + 1) : '00'}<small>/{pad(chapters.length)}</small></span>
        <span className="chap-name">
          {chapters.map((x, k) => <span key={x.id} className={`chap-w${k === now ? ' is-on' : k < now ? ' is-past' : ''}`}>{x.name}</span>)}
        </span>
        <span className="chap-bar"><i ref={bar} /></span>
      </div>
    </>
  );
}
