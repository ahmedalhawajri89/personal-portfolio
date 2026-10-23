'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';

/* A strip of real screens from the five projects, running past under the
   hero like a showreel. It runs on its own, and the reader's scroll drives
   it: scrolling quickly speeds it up and leans it into the movement,
   scrolling back up runs it backwards, and when the page settles so does
   the strip. A hovered screen slows it to a crawl. Each screen opens its
   project. Off screen it stops; for reduced motion it is a still row that
   scrolls sideways by hand. */
export default function Showreel({ items, label, rtl }) {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !track.current) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = track.current;
        root.current.classList.add('is-live');
        // The row is two copies of the same screens; half its width is one
        // full turn, so the loop never shows a seam.
        const loop = gsap.fromTo(el, { xPercent: rtl ? -50 : 0 }, { xPercent: rtl ? 0 : -50, duration: 80, ease: 'none', repeat: -1 });
        let dir = 1, hover = false;
        const settle = () => gsap.to(loop, { timeScale: (hover ? 0.15 : 1) * dir, duration: 1.2, ease: 'power2.out', overwrite: true });

        const lean = { v: 0 };
        const setSkew = gsap.quickSetter(el, 'skewX', 'deg');
        const clamp = gsap.utils.clamp(-7, 7);

        const st = ScrollTrigger.create({
          trigger: root.current, start: 'top bottom', end: 'bottom top',
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (!v) return;
            dir = v < 0 ? -1 : 1;
            gsap.to(loop, { timeScale: dir * (1 + Math.min(7, Math.abs(v) / 260)), duration: 0.25, overwrite: true, onComplete: settle });
            const s = clamp(v / -320);
            if (Math.abs(s) > Math.abs(lean.v)) {
              lean.v = s;
              gsap.to(lean, { v: 0, duration: 0.9, ease: 'power3', overwrite: true, onUpdate: () => setSkew(lean.v) });
            }
          },
        });
        const enter = () => { hover = true; settle(); };
        const leave = () => { hover = false; settle(); };
        el.addEventListener('pointerenter', enter);
        el.addEventListener('pointerleave', leave);
        return () => {
          st.kill(); loop.kill();
          el.removeEventListener('pointerenter', enter);
          el.removeEventListener('pointerleave', leave);
          root.current?.classList.remove('is-live');
        };
      });
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [rtl]);

  const row = (copy) => items.map((x, k) => (
    <li key={`${copy}-${k}`} className="sr-item">
      <a href={x.href} data-cursor="view" tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined}>
        <img src={x.src} alt={copy ? '' : x.alt} width={x.w} height={x.h} loading="lazy" decoding="async" />
        <span className="sr-cap">{x.name}</span>
      </a>
    </li>
  ));

  return (
    <section className="sr" ref={root} aria-label={label}>
      <ul className="sr-track" ref={track}>{row(0)}{row(1)}</ul>
    </section>
  );
}
