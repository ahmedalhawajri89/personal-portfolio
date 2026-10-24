'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';

const pad = (n) => String(n).padStart(2, '0');

/* What ties the sections into one film rather than a row of rooms: in the
   corner, the chapter the reader is in -- its number and its name, which
   roll over when it changes, in the chapter's colour -- and a line for how
   far through the whole page they are. It is hidden over the opening, where
   the page has not started its chapters yet, and over the footer, where
   they have ended.

   There used to be a coloured light behind the page that followed the
   chapters too. It was dropped: a soft glow drifting behind everything is
   the most common background on the web, and the colour already lives
   where it means something -- the labels, the covers, the dots. The page
   behind is now flat ink with a grain (globals.css, body::after).

   It is decoration over a page that reads without it: the marker repeats
   the headings, and for reduced motion it is not shown. */
export default function Scenes({ chapters }) {
  const [now, setNow] = useState(-1);
  const [done, setDone] = useState(false);
  const bar = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
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
        return () => { marks.forEach((s) => s.kill()); end?.kill(); prog.kill(); setNow(-1); setDone(false); };
      });
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [chapters]);

  const c = chapters[now];
  return (
    <>
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
