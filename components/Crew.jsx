'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK, motionWanted } from '../lib/motion';

/* The crew from the hero, walking the page with the reader.

   Once the hero is left behind, the five characters drop into a strip at
   the foot of the screen and walk it from one end to the other as the page
   is read: where they stand is how far down the page the reader is. Their
   legs move with the scroll -- they stop when it stops, and turn round
   when the reader goes back up. Entering a section, the character whose
   part of the work it shows jumps and says so in a bubble; at the footer
   the whole crew arrives and cheers.

   Decoration only: hidden from assistive technology, never in the way of a
   pointer, and not drawn at all on a phone or for reduced motion. */

const CAST = [
  { k: 'db', c: 'var(--h-db)' },
  { k: 'api', c: 'var(--h-api)' },
  { k: 'ui', c: 'var(--h-ui)' },
  { k: 'test', c: 'var(--h-test)' },
  { k: 'sec', c: 'var(--h-sec)' },
];
// Which character speaks for which section; -1 is the whole crew.
const CUES = [
  ['work', 2], ['services', 1], ['problems', 4], ['proof', 3], ['rules', 0],
  ['skills', 0], ['process', 3], ['about', -1], ['contact', -1],
];
const GAP = 54;

function Eyes({ y }) {
  return (
    <g className="cw-eyes">
      {[-5, 5].map((dx) => (
        <g key={dx}>
          <ellipse className="hs-eye" cx={dx} cy={y} rx="3.3" ry="3.8" />
          <circle className="hs-pupil cw-pupil" cx={dx + 0.8} cy={y + 0.6} r="1.7" />
        </g>
      ))}
      <path className="cw-mouth" d={`M-3 ${y + 6} q3 3 6 0`} />
    </g>
  );
}

function Body({ k }) {
  switch (k) {
    case 'db': return (<>
      <path className="hs-f" d="M-16 -40v25a16 5 0 0 0 32 0v-25z" />
      <path className="cw-band" d="M-16 -22a16 5 0 0 0 32 0" />
      <ellipse className="hs-l" cx="0" cy="-40" rx="16" ry="5" />
      <Eyes y={-31} />
    </>);
    case 'api': return (<>
      <path className="cw-thin" d="M0 -44v-8" />
      <circle className="hs-l" cx="0" cy="-54" r="3" />
      <rect className="hs-f" x="-15" y="-45" width="30" height="31" rx="8" />
      <Eyes y={-31} />
    </>);
    case 'ui': return (<>
      <circle className="hs-f" cx="0" cy="-29" r="16" />
      <path className="hs-l" d="M-13 -37a16 16 0 0 1 26 0q-13 -6 -26 0z" />
      <Eyes y={-30} />
    </>);
    case 'test': return (<>
      <ellipse className="hs-f" cx="0" cy="-29" rx="14" ry="16" />
      <rect className="cw-board" x="10" y="-30" width="10" height="13" rx="2" />
      <Eyes y={-32} />
    </>);
    default: return (<>
      <rect className="hs-f" x="-15" y="-45" width="30" height="31" rx="11" />
      <path className="cw-shield" d="M-17 -30l7 2.5v6.5c0 5-3.5 8-7 10c-3.5-2-7-5-7-10v-6.5z" />
      <Eyes y={-33} />
    </>);
  }
}

function Say({ k }) {
  const icon = {
    db: <path className="cw-ico" d="M-6 -4h12M-6 0h12M-6 4h8" />,
    api: <text className="cw-ico-t" x="0" y="3.5" textAnchor="middle">200</text>,
    ui: <path className="cw-ico" d="M-6 -5h12v10h-12zM-6 -1.5h12" />,
    test: <path className="cw-ico" d="M-5 0l3.4 3.4l6.6 -7" />,
    sec: <path className="cw-ico" d="M-4 -1v-2.5a4 4 0 0 1 8 0v2.5M-6 -1h12v7h-12z" />,
  }[k];
  return (
    <g className="cw-say" transform="translate(0 -72)">
      <path className="cw-bub" d="M-15 -11h30a5 5 0 0 1 5 5v12a5 5 0 0 1 -5 5h-11l-4 5l-4 -5h-11a5 5 0 0 1 -5 -5v-12a5 5 0 0 1 5 -5z" />
      {icon}
    </g>
  );
}

export default function Crew({ rtl }) {
  const root = useRef(null);

  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    (async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !root.current) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current;
        const q = gsap.utils.selector(el);
        const line = q('.cw-line')[0];
        const mates = q('.cw-m');
        const flips = q('.cw-flip');
        const legs = mates.map((m) => [...m.querySelectorAll('.cw-leg')]);
        const bodies = q('.cw-body');
        const says = q('.cw-say');
        const hero = document.getElementById('home');

        gsap.set(says, { scale: 0, transformOrigin: '50% 100%' });
        gsap.set(bodies, { transformOrigin: '50% 100%' });
        flips.forEach((f) => {
          const bb = f.getBBox();
          gsap.set(f, { transformOrigin: `${-bb.x}px ${-bb.y}px` });
        });
        legs.flat().forEach((l) => gsap.set(l, { transformOrigin: '50% 0%' }));
        gsap.set(mates, { y: 90 });

        // Where the line of five can stand: the width of the screen less
        // its own width and a margin each side (the back-to-top button sits
        // at the far corner).
        const room = () => Math.max(0, window.innerWidth - (CAST.length - 1) * GAP - 220);
        const toX = gsap.quickTo(line, 'x', { duration: 0.6, ease: 'power3' });

        // In and out with the hero: they come when it has gone.
        let shown = false, sunk = false, ducking;
        const show = (on) => {
          if (on === shown) return;
          shown = on;
          sunk = false;
          gsap.to(mates, on
            ? { y: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: { each: 0.07, from: rtl ? 'end' : 'start' }, overwrite: 'auto' }
            : { y: 90, duration: 0.4, ease: 'power2.in', stagger: 0.04, overwrite: 'auto' });
        };

        // Walking: the step follows the distance scrolled, so the legs stop
        // with the page and keep pace with a fast flick.
        let phase = 0, lastY = window.scrollY, facing = 1;
        const step = (dir) => {
          const y = window.scrollY;
          const d = y - lastY;
          lastY = y;
          phase += d / 26;
          legs.forEach(([a, b], i) => {
            const s = Math.sin(phase + i * 0.9) * 28;
            gsap.set(a, { rotation: s });
            gsap.set(b, { rotation: -s });
            gsap.set(bodies[i], { y: -Math.abs(Math.sin(phase + i * 0.9)) * 3 });
          });
          // Facing the way they walk: down the page is forward.
          const want = (dir >= 0 ? 1 : -1) * (rtl ? -1 : 1);
          if (want !== facing && Math.abs(d) > 2) {
            facing = want;
            gsap.to(flips, { scaleX: want, duration: 0.25, ease: 'power2.out', stagger: 0.03 });
          }
        };
        const rise = () => {
          ducking?.kill();
          if (!sunk || !shown) return;
          sunk = false;
          gsap.to(mates, { y: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.04, overwrite: 'auto' });
        };
        const rest = () => {
          ducking?.kill();
          ducking = gsap.delayedCall(1.3, () => {
            if (!shown) return;
            sunk = true;
            gsap.to(mates, { y: 40, duration: 0.6, ease: 'power3.inOut', stagger: 0.05, overwrite: 'auto' });
          });
          gsap.to(legs.flat(), { rotation: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(bodies, { y: 0, duration: 0.3, ease: 'power2.out' });
        };

        const st = ScrollTrigger.create({
          start: 0, end: 'max',
          onUpdate: (s) => {
            rise();
            const r = room();
            toX(rtl ? -s.progress * r : s.progress * r);
            show(window.scrollY > (hero ? hero.offsetHeight * 0.7 : 600));
            step(s.direction);
          },
        });
        ScrollTrigger.addEventListener('scrollEnd', rest);

        // A cue: the character jumps and its bubble pops, then folds away.
        const cheer = (i) => {
          if (!shown) return;
          rise();
          const who = i < 0 ? mates.map((_, k) => k) : [i];
          who.forEach((k, n) => {
            gsap.timeline({ delay: n * 0.08 })
              .to(bodies[k], { y: -26, scaleY: 1.08, scaleX: 0.92, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
              .to(bodies[k], { y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'bounce.out' })
              .fromTo(says[k], { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, 0.1)
              .to(says[k], { scale: 0, duration: 0.3, ease: 'power2.in' }, 1.9);
          });
        };
        const cues = CUES.map(([id, i]) => {
          const sec = document.getElementById(id);
          return sec && ScrollTrigger.create({
            trigger: sec, start: 'top 55%',
            onEnter: () => cheer(i), onEnterBack: () => cheer(i),
          });
        }).filter(Boolean);

        // The end of the page: everyone arrives, faces the reader, and the
        // tester ticks it off.
        const foot = document.querySelector('footer');
        const end = foot && ScrollTrigger.create({
          trigger: foot, start: 'bottom bottom+=4',
          onEnter: () => {
            gsap.to(flips, { scaleX: rtl ? -1 : 1, duration: 0.2 });
            cheer(-1);
            gsap.delayedCall(0.7, () => cheer(3));
          },
        });

        // Their eyes keep track of the pointer, loosely.
        const pupils = q('.cw-pupil');
        const look = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(pupils, { x: nx * 1.1, y: ny * 1.1, duration: 0.4, overwrite: 'auto' });
        };
        window.addEventListener('pointermove', look, { passive: true });

        return () => {
          st.kill(); cues.forEach((c) => c.kill()); end?.kill();
          ScrollTrigger.removeEventListener('scrollEnd', rest); ducking?.kill();
          window.removeEventListener('pointermove', look);
        };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  return (
    <div className="cw" ref={root} aria-hidden="true">
      <svg className="cw-svg" viewBox={`0 0 ${CAST.length * GAP + 40} 110`} width={CAST.length * GAP + 40} height="110" focusable="false">
        <g className="cw-line">
          {CAST.map(({ k, c }, i) => (
            <g key={k} transform={`translate(${30 + i * GAP} 100)`}>
            <g className={`cw-m cw-${k}`} style={{ '--c': c }}>
              <ellipse className="hs-shadow" cx="0" cy="2" rx="17" ry="3.5" />
              <g className="cw-body">
                <g className="cw-flip">
                  <path className="cw-leg cw-limb" d="M-6 -15v15" />
                  <path className="cw-leg cw-limb" d="M6 -15v15" />
                  <Body k={k} />
                </g>
                <Say k={k} />
              </g>
            </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
