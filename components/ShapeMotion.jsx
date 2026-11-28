'use client';

import { useEffect } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK, motionWanted } from '../lib/motion';

/* Motion for the shape family (components/Shapes.jsx). Every shape pops in
   once as it is reached, then floats on a clock of its own and leans a
   little with the mouse, at a depth of its own. The work's opening draws its
   tube in, behind the word and back over it, then brings the family in
   around it. Desktop and tablet only; on a phone, or for reduced motion,
   the shapes are simply there. */
export default function ShapeMotion() {
  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    (async () => {
      const { gsap } = await loadMotion();
      if (gone) return;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const shapes = gsap.utils.toArray('.sx');

        shapes.forEach((el, i) => {
          const svg = el.querySelector('svg');
          gsap.from(el, {
            scale: 0.4, opacity: 0, rotation: -18, duration: 0.9, ease: 'back.out(2)',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
          gsap.to(svg, {
            y: -9, rotation: i % 2 ? 3 : -3, duration: 2.2 + (i % 4) * 0.35,
            yoyo: true, repeat: -1, ease: 'sine.inOut', delay: (i % 5) * 0.2,
          });
          if (el.classList.contains('sx-spin')) gsap.to(svg.querySelector('use'), { rotation: 360, svgOrigin: '80 80', duration: 18, repeat: -1, ease: 'none' });
        });

        // The work's opening, played by the scroll itself: as it comes up
        // the word rises, the tube draws round it from end to end, the
        // pieces open out; as it leaves, each drifts up at its own depth.
        // Scrubbed with a little lag, so a flick of the wheel still glides.
        const wm = document.querySelector('.wm');
        if (wm) {
          const q = (x) => wm.querySelectorAll(x);
          gsap.set(q('.wm-t'), { strokeDasharray: 1 });
          // The head rides the tip: the same path, read at the drawn length.
          const line = wm.querySelector('.wm-back .wm-t');
          const head = wm.querySelector('.wm-head');
          const len = line.getTotalLength();
          const draw = { p: 0 };
          const paint = () => {
            q('.wm-t').forEach((t) => { t.style.strokeDashoffset = String(1 - draw.p); });
            const pt = line.getPointAtLength(draw.p * len);
            head.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
            head.style.opacity = draw.p > 0.002 && draw.p < 0.995 ? '1' : '0';
          };
          paint();
          // The word arrives as the section comes up; the tube is drawn,
          // start to end, while the whole word is in view.
          gsap.timeline({ scrollTrigger: { trigger: wm, start: 'top 90%', end: 'top 15%', scrub: 1 } })
            .fromTo(wm.querySelector('.wm-word span'), { yPercent: 45, opacity: 0, scale: 0.92 }, { yPercent: 0, opacity: 1, scale: 1, ease: 'power3.out', duration: 0.8 }, 0)
            .to(draw, { p: 1, ease: 'none', duration: 2, onUpdate: paint }, 0.45)
            .fromTo(q('.wm-ring'), { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.1, stagger: 0.75 }, 1.32)
            .fromTo(q('.wm-ast, .wm-sel, .wm-key'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.7, stagger: 0.5 }, 0.9)
            .fromTo(q('.wm-spk'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4, stagger: 0.3 }, 1);
          gsap.timeline({ scrollTrigger: { trigger: wm, start: 'top 15%', end: 'bottom top', scrub: 1 } })
            .to(wm.querySelector('.wm-word span'), { yPercent: -18, ease: 'none' }, 0)
            .to(q('.wm-ast'), { y: -90, ease: 'none' }, 0)
            .to(q('.wm-sel'), { y: -50, ease: 'none' }, 0)
            .to(q('.wm-key'), { y: -130, ease: 'none' }, 0)
            .to(q('.wm-spk'), { y: -60, ease: 'none' }, 0)
            .to(q('.wm-back, .wm-front'), { yPercent: -6, ease: 'none' }, 0);
          // A slow turn of the idea, on the inner drawing only.
          gsap.to(wm.querySelector('.wm-ast use'), { rotation: 360, svgOrigin: '0 0', duration: 24, repeat: -1, ease: 'none' });
        }

        if (!pointer) return;
        // Leaning with the mouse, sideways only (the float owns the vertical).
        const movers = [
          ...shapes.map((el, i) => ({ el, d: 6 + (i % 3) * 5 })),
          ...gsap.utils.toArray('.wm-front, .wm-back').map((el, i) => ({ el, d: 10 + (i % 4) * 8 })),
        ].map(({ el, d }) => ({ d, x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }) }));
        const move = (e) => { const nx = e.clientX / innerWidth - 0.5; movers.forEach((m) => m.x(nx * m.d)); };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, []);
  return null;
}
