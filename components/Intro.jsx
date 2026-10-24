'use client';

import { useEffect, useRef } from 'react';

const WORD = 'PORTFOLIO';

/* The loader that opens a visit, with one word as its subject. The first
   home page of a session starts behind a curtain with PORTFOLIO set as large
   as the screen allows: first as an outline, its letters rising into place,
   then filling with ink from the first letter to the last as the page
   actually arrives (the fonts, then everything else) -- the loading bar is
   the word itself. When it is full, the check on the mark is ticked, the
   letters leave upwards one after another and the curtain lifts onto the
   page, which settles into frame under it. Never shorter than a beat,
   never longer than a few seconds.

   The word is Latin in both languages: it is used as a mark here, like the
   logo, not as a sentence. The boot script decides whether the loader runs
   at all (html.intro: once a visit, home page only, never for reduced
   motion), so the curtain is already over the first paint. If script fails
   after that, a CSS timer takes it away regardless (globals.css,
   .intro-panel). The panel's class must never be `intro` itself: that is the
   flag on <html>, and a rule for it would hide the whole page. */
export default function Intro({ name, role }) {
  const root = useRef(null);
  const num = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro')) return;
    let gone = false, tl, tick, gsapRef;
    const begin = performance.now();

    (async () => {
      const [{ gsap }, { DrawSVGPlugin }] = await Promise.all([import('gsap'), import('gsap/DrawSVGPlugin')]);
      gsap.registerPlugin(DrawSVGPlugin);
      gsapRef = gsap;
      if (gone || !root.current) return;
      const el = root.current;
      const fill = el.querySelector('.ip-fill');
      const letters = el.querySelectorAll('.ip-l');
      const check = el.querySelector('.intro-check');
      gsap.set(check, { drawSVG: 0, opacity: 1 });
      gsap.set(fill, { clipPath: 'inset(0% 100% 0% 0%)' });
      // Both layers' letters rise together, the outline and its ink.
      gsap.from(letters, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: (i) => (i % WORD.length) * 0.05, delay: 0.1 });
      gsap.from(el.querySelectorAll('.ip-line'), { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 });

      const shown = { v: 0 };
      let target = 12;
      const raise = (v) => { target = Math.max(target, v); };
      document.fonts?.ready.then(() => raise(62));
      if (document.readyState === 'complete') raise(100);
      else window.addEventListener('load', () => raise(100), { once: true });
      // A page that never fires load still opens.
      const cap = setTimeout(() => raise(100), 3200);

      tick = () => {
        // Ease toward what has arrived; never past it, never backwards. The
        // step is scaled by the frame's length, so a slow device counts at
        // the same pace in fewer frames.
        const r = gsap.ticker.deltaRatio(60);
        shown.v = Math.min(target, shown.v + ((target - shown.v) * 0.07 + 0.12) * r);
        if (num.current) num.current.textContent = String(Math.floor(shown.v)).padStart(3, '0');
        gsap.set(fill, { clipPath: `inset(0% ${100 - shown.v}% 0% 0%)` });
        const t = performance.now() - begin;
        if ((shown.v >= 99.5 && t > 1500) || t > 4800) {
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
        .set(el.querySelector('.ip-fill'), { clipPath: 'inset(0% 0% 0% 0%)' })
        .to(el.querySelector('.intro-check'), { drawSVG: '100%', duration: 0.4, ease: 'power2.out' })
        .to(el.querySelectorAll('.ip-l'), { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: (i) => (i % WORD.length) * 0.035 }, '+=0.1')
        .to(el.querySelectorAll('.ip-line'), { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.04 }, '<0.1')
        .to(el, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.25')
        // The page under it settles into frame as the curtain goes, like a
        // camera finding its focus: a touch closer and soft, then exact.
        .fromTo(document.querySelector('main'), { scale: 1.045, filter: 'blur(8px)', transformOrigin: '50% 0%' },
          { scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', clearProps: 'transform,filter' }, '<0.25');
    };

    return () => { gone = true; tl?.kill(); if (tick && gsapRef) gsapRef.ticker.remove(tick); };
  }, []);

  const letters = () => WORD.split('').map((ch, k) => <span key={k} className="ip-l">{ch}</span>);
  return (
    <div className="intro-panel" ref={root} aria-hidden="true">
      <div className="ip-row">
        <p className="ip-mask"><span className="ip-line ip-brand">
          <svg className="ip-mark" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" className="intro-bg" />
            <path className="intro-a" d="M17 50 L32 14 L47 50" />
            <path className="intro-check" d="M21 38 L28 44 L44 27" />
          </svg>
          {name}
        </span></p>
        <p className="ip-mask"><span className="ip-line lat">©{new Date().getFullYear()}</span></p>
      </div>

      <div className="ip-word">
        <span className="ip-ghost">{letters()}</span>
        <span className="ip-fill">{letters()}</span>
      </div>

      <div className="ip-row">
        <p className="ip-mask"><span className="ip-line ip-role lat">{role}</span></p>
        <p className="ip-mask"><span className="ip-line ip-count lat"><b ref={num}>000</b>%</span></p>
      </div>
    </div>
  );
}
