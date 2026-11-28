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

        // The work's opening.
        const wm = document.querySelector('.wm');
        if (wm) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: wm, start: 'top 75%', once: true } });
          tl.from(wm.querySelector('.wm-word'), { yPercent: 30, opacity: 0, duration: 1, ease: 'expo.out' })
            .fromTo(wm.querySelectorAll('.wm-tb'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.3)
            .fromTo(wm.querySelectorAll('.wm-tf'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 1.05)
            .from(wm.querySelector('.wm-ring'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)' }, 1.2)
            .from(wm.querySelectorAll('.wm-ast, .wm-sel, .wm-key'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'back.out(2)', stagger: 0.12 }, 0.6)
            .from(wm.querySelectorAll('.wm-spk path'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(3)', stagger: 0.08 }, 1.1);
          // The pieces float on parts that carry no placing transform of
          // their own, so their place on the picture is kept.
          wm.querySelectorAll('.wm-ast use, .wm-sel use, .wm-key use, .wm-spk').forEach((n, i) => {
            gsap.to(n, { y: -12, duration: 2.3 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 });
          });
          gsap.to(wm.querySelector('.wm-ast use'), { rotation: 360, svgOrigin: '0 0', duration: 20, repeat: -1, ease: 'none' });
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
