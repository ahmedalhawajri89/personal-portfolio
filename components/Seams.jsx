'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadMotion, MOTION_OK, motionWanted } from '../lib/motion';
import { Body } from './Mini';

/* The handoff between sections. In the open space above each section's
   label, the character whose part of the work the section shows rides a
   wire in from the far side of the page as the reader scrolls, hopping
   along it, and lands on the label with a ring. The wire stays behind as
   a faint thread into the section; scrolling back sends the character back
   up it. The page reads as one system, each part handing over to the next.

   It lives only in the gap above a label, never over text, and only where
   there is motion: on a phone or for reduced motion nothing is drawn. */

const HUE = { db: 'var(--h-db)', api: 'var(--h-api)', ui: 'var(--h-ui)', test: 'var(--h-test)', sec: 'var(--h-sec)' };
const CUES = [
  ['work', 'ui'], ['services', 'api'], ['problems', 'sec'], ['proof', 'test'],
  ['rules', 'db'], ['skills', 'db'], ['process', 'test'],
];

export default function Seams({ rtl }) {
  const [spots, setSpots] = useState([]);
  const refs = useRef({});

  // Where each wire runs: from the far top corner of the section down to
  // just above the start of its label. Measured again when the window
  // changes size.
  useEffect(() => {
    if (!motionWanted()) return;
    let t;
    const measure = () => setSpots(CUES.map(([id, k]) => {
      const el = document.getElementById(id);
      const label = el?.querySelector('.sec-label');
      if (!el || !label) return null;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      const r = el.getBoundingClientRect();
      const l = label.getBoundingClientRect();
      const h = Math.round(l.bottom - r.top - 2);
      if (h < 90) return null;
      const w = Math.round(r.width);
      // Beside the label, in the margin before it, standing on its baseline.
      const ex = Math.round(rtl ? l.right - r.left + 22 : l.left - r.left - 22);
      const sx = rtl ? 30 : w - 30;
      return { id, k, el, label, w, h, sx, ex };
    }).filter(Boolean));
    measure();
    const onResize = () => { clearTimeout(t); t = setTimeout(measure, 200); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [rtl]);

  useEffect(() => {
    if (!spots.length) return;
    let gone = false, mm;
    (async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        spots.forEach((s) => {
          const svg = refs.current[s.id];
          if (!svg) return;
          const wire = svg.querySelector('.sm-wire');
          const who = svg.querySelector('.sm-who');
          const body = svg.querySelector('.sm-body');
          const ring = svg.querySelector('.sm-ring');
          const len = wire.getTotalLength();
          gsap.set(body, { transformOrigin: '50% 100%' });
          gsap.set(ring, { transformOrigin: '50% 50%', scale: 0, opacity: 0 });
          let landed = false;
          const o = { p: 0 };
          const draw = () => {
            const p = o.p;
            wire.style.strokeDashoffset = String(1 - p);
            const pt = wire.getPointAtLength(p * len);
            // Hops that grow smaller as it nears the label.
            const hop = Math.abs(Math.sin(p * Math.PI * 5)) * 12 * (1 - p);
            gsap.set(who, { x: pt.x, y: pt.y - hop, opacity: p > 0.015 ? 1 : 0 });
            if (p > 0.985 && !landed) {
              landed = true;
              s.label.classList.add('is-landed');
              gsap.timeline()
                .to(body, { scaleY: 0.78, scaleX: 1.14, duration: 0.12, ease: 'power1.in' })
                .to(body, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1,0.35)' });
              gsap.fromTo(ring, { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.8, ease: 'power2.out' });
            } else if (p < 0.9 && landed) {
              landed = false;
              s.label.classList.remove('is-landed');
            }
          };
          draw();
          gsap.to(o, {
            p: 1, ease: 'none', onUpdate: draw,
            scrollTrigger: { trigger: s.el, start: 'top 95%', end: () => `top+=${s.h} 62%`, scrub: 0.7 },
          });
        });
        ScrollTrigger.refresh();
      });
    })();
    return () => { gone = true; mm?.revert(); spots.forEach((s) => s.label.classList.remove('is-landed')); };
  }, [spots]);

  return spots.map((s) => {
    const dx = s.sx - s.ex;
    const d = `M${s.sx} 6 C${s.sx - dx * 0.15} ${s.h * 0.95}, ${s.ex + dx * 0.45} ${-s.h * 0.15}, ${s.ex} ${s.h}`;
    return createPortal(
      <svg
        key={s.id}
        ref={(n) => { refs.current[s.id] = n; }}
        className="sm"
        width={s.w}
        height={s.h}
        viewBox={`0 0 ${s.w} ${s.h}`}
        style={{ '--c': HUE[s.k] }}
        aria-hidden="true"
        focusable="false"
      >
        <path className="sm-wire" d={d} pathLength="1" />
        <circle className="sm-ring" cx={s.ex} cy={s.h - 4} r="14" />
        <g className="sm-who" style={{ opacity: 0 }}>
          <g className="sm-body">
            <path className="cw-limb" d="M-6 -15v15M6 -15v15" />
            <Body k={s.k} />
          </g>
        </g>
      </svg>,
      s.el,
    );
  });
}
