'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';

/* A project's cover: its idea as a small scene in its own colour, played on
   a loop while it is on screen. Not a screenshot -- the screenshots are the
   case study's proof -- but the problem and the answer in one picture that
   moves:

     Diwan      a sofa measured at 240 walks up to an 80 cm door and clears it
     Waeda      a day of slots fills; the empty one is saved by the reply "1"
     Takharruj  a project walks its road from the idea to the cap
     Lamma      a coin follows its path to a home; the share that arrived fills
     Mawaheb    a spotlight sweeps the stage until it finds the talent

   The markup is each scene's finished frame, so without script or for
   reduced motion the cover is a complete still picture. The loop pauses
   whenever the cover is off screen. */

const SCENES = {
  diwan: {
    art: (
      <>
        <path className="cv-floor" d="M48 330 H592" />
        <rect className="cv-door" x="420" y="118" width="104" height="212" rx="6" />
        <rect className="cv-door-in" x="434" y="132" width="76" height="198" rx="3" />
        <path className="cv-dim" d="M434 96 H510 M434 88 v16 M510 88 v16" />
        <text className="cv-t" x="472" y="80" textAnchor="middle">80</text>
        <g className="cv-sofa">
          <rect className="cv-fill" x="104" y="206" width="216" height="64" rx="18" />
          <rect className="cv-fill-2" x="104" y="250" width="216" height="46" rx="12" />
          <rect className="cv-fill" x="86" y="234" width="30" height="64" rx="12" />
          <rect className="cv-fill" x="308" y="234" width="30" height="64" rx="12" />
          <path className="cv-ink" d="M212 254 V292 M114 300 v22 M310 300 v22" />
          <path className="cv-dim" d="M86 176 H338 M86 168 v16 M338 168 v16" />
          <text className="cv-t cv-num" x="212" y="160" textAnchor="middle" data-to="240">240</text>
        </g>
        <path className="cv-check" d="M446 232 l20 20 l36 -42" />
      </>
    ),
    play: (gsap, $, $$) => {
      const num = $('.cv-num');
      const v = { n: 0 };
      return gsap.timeline({ repeat: -1, repeatDelay: 1.4 })
        .set($('.cv-sofa'), { x: -40 })
        .set($('.cv-check'), { drawSVG: 0 })
        .set($('.cv-door-in'), { fillOpacity: 0.1 })
        .fromTo(v, { n: 0 }, { n: 240, duration: 1.1, ease: 'power2.out', onUpdate: () => { num.textContent = Math.round(v.n); } })
        .to($('.cv-sofa'), { x: 0, duration: 1.2, ease: 'power3.inOut' }, '-=0.3')
        .to($('.cv-sofa'), { rotation: -4, transformOrigin: '50% 100%', duration: 0.25, yoyo: true, repeat: 1 })
        .to($('.cv-door-in'), { fillOpacity: 0.32, duration: 0.4 })
        .to($('.cv-check'), { drawSVG: '100%', duration: 0.5, ease: 'power2.out' }, '<');
    },
  },

  booking: {
    art: (
      <>
        <rect className="cv-card" x="72" y="64" width="336" height="272" rx="20" />
        <path className="cv-line" d="M72 104 H408" />
        {[0, 1, 2, 3, 4].map((c) => <rect key={`d${c}`} className="cv-day" x={96 + c * 62} y="80" width="34" height="8" rx="4" />)}
        {[0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}-${c}`} className={`cv-slot${r === 2 && c === 2 ? ' cv-gap' : ''}`} x={92 + c * 62} y={124 + r * 50} width="46" height="32" rx="8" />
        )))}
        <g className="cv-bubble">
          <path className="cv-fill" d="M452 128 h112 a16 16 0 0 1 16 16 v52 a16 16 0 0 1 -16 16 h-74 l-20 18 v-18 h-18 a16 16 0 0 1 -16 -16 v-52 a16 16 0 0 1 16 -16 z" />
          <text className="cv-t cv-on" x="508" y="180" textAnchor="middle">1 ✓</text>
        </g>
      </>
    ),
    play: (gsap, $, $$) => {
      const slots = $$('.cv-slot:not(.cv-gap)');
      const gap = $('.cv-gap');
      return gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
        .set(slots, { fillOpacity: 0.12 })
        .set(gap, { fill: 'var(--bad)', fillOpacity: 0.0, stroke: 'var(--bad)' })
        .set($('.cv-bubble'), { scale: 0, transformOrigin: '20% 100%' })
        .to(slots, { fillOpacity: 0.85, duration: 0.25, stagger: { each: 0.05, from: 'random' } })
        .to(gap, { fillOpacity: 0.35, duration: 0.3, yoyo: true, repeat: 3 })
        .to($('.cv-bubble'), { scale: 1, duration: 0.6, ease: 'back.out(2.4)' })
        .to(gap, { fill: 'var(--c)', stroke: 'var(--c)', fillOpacity: 0.85, duration: 0.5 }, '+=0.2');
    },
  },

  takharruj: {
    art: (
      <>
        <path className="cv-road" d="M96 318 C 200 318, 180 236, 286 236 S 400 140, 520 132" />
        <path className="cv-route" d="M96 318 C 200 318, 180 236, 286 236 S 400 140, 520 132" />
        <circle className="cv-bulb" cx="96" cy="290" r="22" />
        <path className="cv-ink" d="M86 322 h20 M90 332 h12" />
        <circle className="cv-stop" cx="186" cy="290" r="9" />
        <circle className="cv-stop" cx="286" cy="236" r="9" />
        <circle className="cv-stop" cx="400" cy="168" r="9" />
        <g className="cv-cap">
          <path className="cv-fill" d="M478 116 l46 -21 l46 21 l-46 21 z" />
          <path className="cv-fill-2" d="M494 124 v20 c 18 11 42 11 60 0 v-20 l-30 13 z" />
          <path className="cv-ink" d="M570 116 v26" />
        </g>
        <circle className="cv-walker" cx="520" cy="132" r="10" />
      </>
    ),
    play: (gsap, $, $$) => {
      const route = $('.cv-route');
      const stops = $$('.cv-stop');
      return gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(stops, { fill: 'var(--card)' })
        .set($('.cv-cap'), { y: 0, rotation: 0 })
        .fromTo($('.cv-walker'), { opacity: 1 }, { duration: 2.6, ease: 'power1.inOut', motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] } })
        .to(stops, { fill: 'var(--c)', duration: 0.2, stagger: 0.62 }, 0.5)
        .to($('.cv-cap'), { y: -34, rotation: -14, transformOrigin: '50% 100%', duration: 0.35, ease: 'power2.out' })
        .to($('.cv-cap'), { y: 0, rotation: 0, duration: 0.8, ease: 'bounce.out' });
    },
  },

  lamma: {
    art: (
      <>
        <path className="cv-floor" d="M48 332 H592" />
        <path className="cv-road" d="M150 260 C 250 260, 300 300, 420 296" />
        <path className="cv-route" d="M150 260 C 250 260, 300 300, 420 296" />
        <g className="cv-coin">
          <circle className="cv-fill" cx="112" cy="260" r="42" />
          <text className="cv-t cv-on cv-big" x="112" y="276" textAnchor="middle">$</text>
        </g>
        <path className="cv-house" d="M420 262 l70 -58 l70 58 M436 252 V332 H544 V252 M476 332 V296 h28 V332" />
        <circle className="cv-track" cx="490" cy="118" r="50" />
        <circle className="cv-ring" cx="490" cy="118" r="50" transform="rotate(-90 490 118)" />
        <text className="cv-t cv-num" x="490" y="132" textAnchor="middle" data-to="93">93</text>
      </>
    ),
    play: (gsap, $, $$) => {
      const route = $('.cv-route');
      const num = $('.cv-num');
      const v = { n: 0 };
      return gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
        .set($('.cv-ring'), { drawSVG: 0 })
        .set($('.cv-coin'), { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: '50% 50%' })
        .set(v, { n: 0 })
        .to($('.cv-coin'), { duration: 1.6, ease: 'power1.inOut', motionPath: { path: route, alignOrigin: [0.5, 0.5], offsetX: -112, offsetY: -260 } })
        .to($('.cv-coin'), { scale: 0.2, opacity: 0, duration: 0.35 }, '-=0.25')
        .to($('.cv-ring'), { drawSVG: '0% 93%', duration: 1.3, ease: 'power2.out' })
        .to(v, { n: 93, duration: 1.3, ease: 'power2.out', onUpdate: () => { num.textContent = Math.round(v.n); } }, '<');
    },
  },

  mawaheb: {
    art: (
      <>
        <path className="cv-floor" d="M48 330 H592" />
        <g className="cv-lamp">
          <path className="cv-cone" d="M148 70 L60 330 H330 Z" />
          <path className="cv-fill" d="M128 52 l38 -12 l12 30 l-38 12 z" />
        </g>
        <path className="cv-star" d="M222 196 l12 26 l28 3 l-21 19 l6 28 l-25 -14 l-25 14 l6 -28 l-21 -19 l28 -3 z" />
        <path className="cv-ink" d="M222 290 v26 M206 316 h32" />
        <g className="cv-glass">
          <circle className="cv-lens" cx="470" cy="200" r="40" />
          <path className="cv-ink cv-thick" d="M498 228 l40 40" />
        </g>
      </>
    ),
    play: (gsap, $, $$) => gsap.timeline({ repeat: -1, repeatDelay: 1 })
      .set($('.cv-lamp'), { rotation: 28, svgOrigin: '148 70' })
      .set($('.cv-star'), { fill: 'transparent', scale: 0.8, transformOrigin: '50% 50%' })
      .set($('.cv-glass'), { x: 120, opacity: 0 })
      .to($('.cv-lamp'), { rotation: -14, duration: 1.4, ease: 'sine.inOut' })
      .to($('.cv-lamp'), { rotation: 0, duration: 0.8, ease: 'power3.out' })
      .to($('.cv-star'), { fill: 'var(--c)', scale: 1.15, duration: 0.35, ease: 'back.out(3)' })
      .to($('.cv-star'), { scale: 1, duration: 0.3 })
      .to($('.cv-glass'), { x: -160, opacity: 1, duration: 1.1, ease: 'power3.out' }, '-=0.2'),
  },
};

export default function Cover({ slug, label }) {
  const root = useRef(null);
  const scene = SCENES[slug];

  useEffect(() => {
    if (!scene) return;
    let mm, gone = false;
    (async () => {
      const [{ gsap, ScrollTrigger }, { DrawSVGPlugin }, { MotionPathPlugin }] = await Promise.all([
        loadMotion(), import('gsap/DrawSVGPlugin'), import('gsap/MotionPathPlugin'),
      ]);
      gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);
      if (gone || !root.current) return;
      const el = root.current;
      const $ = (s) => el.querySelector(s);
      const $$ = (s) => Array.from(el.querySelectorAll(s));
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = scene.play(gsap, $, $$);
        tl.pause();
        const st = ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 10%', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
        return () => { st.kill(); tl.kill(); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [scene]);

  if (!scene) return null;
  return (
    <svg ref={root} className={`cv cv-${slug}`} viewBox="0 0 640 400" role="img" aria-label={label}>
      {scene.art}
    </svg>
  );
}
