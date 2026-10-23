'use client';

import { useEffect, useRef } from 'react';

/* The opening of a visit. The first home page of a session starts behind a
   paper-coloured curtain with the name and a counter; the counter follows
   the page actually arriving (the fonts, then everything else) rather than a
   timer, and is never shorter than a beat or longer than a few seconds. Then
   the curtain lifts and the headline rises out from under it.

   The boot script decides whether it runs at all (html.intro: once a visit,
   home page only, never for reduced motion), so the curtain is already over
   the first paint and nothing flashes. If script fails after that, a CSS
   timer takes the curtain away regardless (globals.css, .intro-panel). The
   panel's class must never be `intro` itself: that is the flag on <html>,
   and a rule for it would hide the whole page. */
export default function Intro({ name, role }) {
  const root = useRef(null);
  const num = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro')) return;
    let gone = false, tl;
    const begin = performance.now();

    (async () => {
      const { gsap } = await import('gsap');
      if (gone) return;
      const shown = { v: 0 };
      let target = 12;
      const raise = (v) => { target = Math.max(target, v); };
      document.fonts?.ready.then(() => raise(62));
      if (document.readyState === 'complete') raise(100);
      else window.addEventListener('load', () => raise(100), { once: true });
      // A page that never fires load still opens.
      const cap = setTimeout(() => raise(100), 3200);

      const tick = () => {
        // Ease toward what has arrived; never past it, never backwards. The
        // step is scaled by the frame's length, so a slow device counts at
        // the same pace in fewer frames.
        const r = gsap.ticker.deltaRatio(60);
        shown.v = Math.min(target, shown.v + ((target - shown.v) * 0.08 + 0.15) * r);
        if (num.current) num.current.textContent = String(Math.floor(shown.v));
        const t = performance.now() - begin;
        if ((shown.v >= 99.5 && t > 1100) || t > 4500) {
          gsap.ticker.remove(tick);
          clearTimeout(cap);
          lift(gsap);
        }
      };
      gsap.ticker.add(tick);
    })();

    const lift = (gsap) => {
      const el = root.current;
      if (!el || gone) return;
      if (num.current) num.current.textContent = '100';
      tl = gsap.timeline({ onComplete: () => html.classList.remove('intro') })
        .to(el.querySelectorAll('.intro-line'), { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.05 })
        .add(() => html.classList.add('intro-play'))
        .to(el, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '-=0.15');
    };

    return () => { gone = true; tl?.kill(); };
  }, []);

  return (
    <div className="intro-panel" ref={root} aria-hidden="true">
      <div className="intro-in">
        <p className="intro-mask"><span className="intro-line intro-name">{name}</span></p>
        <p className="intro-mask"><span className="intro-line intro-role lat">{role}</span></p>
      </div>
      <p className="intro-mask intro-foot"><span className="intro-line intro-count lat"><b ref={num}>0</b><small>%</small></span></p>
    </div>
  );
}
