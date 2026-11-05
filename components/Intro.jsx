'use client';

import { useEffect, useRef } from 'react';

/* The loader that opens a visit, telling the work while the page loads. The
   first home page of a session starts behind a curtain where four words take
   their turn in the middle of the screen -- plan, build, test, ship -- each
   rising from a mask thin and filling to full weight as if being built, then
   leaving upwards for the next. The words follow what has actually arrived
   (the fonts, then everything else), with the count and a line along the
   foot keeping the score. When the page is in, the check on the mark is
   ticked, the last word takes the accent and the curtain lifts onto the
   page, which settles into frame under it. Never shorter than a beat, never
   longer than a few seconds.

   The words are in the page's language and its headline face: Bricolage
   Grotesque in English (letters), Kufam in Arabic (whole words, whose letters
   must stay joined). The boot script decides whether the loader runs at all
   (html.intro: once a visit, home page only, wide screens only, never for
   reduced motion), so the curtain is already over the first paint. If script
   fails after that, a CSS timer takes it away regardless (globals.css,
   .intro-panel). The panel's class must never be `intro` itself: that is the
   flag on <html>, and a rule for it would hide the whole page. */
export default function Intro({ name, role, words, rtl }) {
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
      const check = el.querySelector('.intro-check');
      const slots = Array.from(el.querySelectorAll('.ip-w'));
      const step = el.querySelector('.ip-step b');
      const bar = el.querySelector('.ip-bar i');
      // Weight from thin to full, on the face's own axis.
      const THIN = rtl ? 400 : 200, FULL = rtl ? 900 : 800;
      const pieces = (w) => Array.from(w.querySelectorAll('.ip-p'));

      gsap.set(check, { drawSVG: 0, opacity: 1 });
      gsap.set(slots, { autoAlpha: 0 });
      gsap.from(el.querySelectorAll('.ip-line'), { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.1 });

      // The words run on their own beat, each given its full turn whatever
      // the speed of the page: rising piece by piece, thin, filling to full
      // weight, then leaving upwards as the next one arrives. The count below
      // follows the real loading; the curtain waits for both.
      // Per word: in by 0.5s (weight full by about the same), held, out from
      // STEP - 0.28 -- the exit never starts before the entrance is done.
      const STEP = 0.85;
      const words = gsap.timeline();
      slots.forEach((w, k) => {
        const ps = pieces(w);
        const at = k * STEP;
        words
          .set(w, { autoAlpha: 1 }, at)
          .call(() => { if (step) step.textContent = String(k + 1).padStart(2, '0'); }, null, at)
          .fromTo(ps, { yPercent: 110, '--w': THIN }, { yPercent: 0, duration: 0.4, ease: 'expo.out', stagger: rtl ? 0 : 0.025 }, at)
          .to(ps, { '--w': FULL, duration: 0.35, ease: 'power2.inOut', stagger: rtl ? 0 : 0.025 }, at + 0.08);
        // The word leaves before the next arrives, so the two never share the frame.
        if (k < slots.length - 1) words.to(ps, { yPercent: -110, duration: 0.26, ease: 'expo.in', stagger: rtl ? 0 : 0.01 }, at + STEP - 0.28);
      });

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
        const t = performance.now() - begin;
        shown.v = Math.min(target, shown.v + ((target - shown.v) * 0.07 + 0.12) * r);
        if (num.current) num.current.textContent = String(Math.floor(shown.v)).padStart(3, '0');
        if (bar) bar.style.transform = `scaleX(${(shown.v / 100).toFixed(3)})`;
        if ((shown.v >= 99.5 && words.progress() === 1) || t > 4800) {
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
      const last = el.querySelectorAll('.ip-w')[el.querySelectorAll('.ip-w').length - 1];
      tl = gsap.timeline({ onComplete: () => html.classList.remove('intro') })
        .set(el.querySelector('.ip-bar i'), { transform: 'scaleX(1)' })
        .to(el.querySelector('.intro-check'), { drawSVG: '100%', duration: 0.4, ease: 'power2.out' })
        .to(last, { color: 'var(--accent)', duration: 0.3 }, '<')
        .to(last.querySelectorAll('.ip-p'), { yPercent: -110, duration: 0.6, ease: 'expo.in', stagger: 0.03 }, '+=0.25')
        .to(el.querySelectorAll('.ip-line'), { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.04 }, '<0.1')
        .to(el, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.25')
        // The page under it settles into frame as the curtain goes, like a
        // camera finding its focus: a touch closer and soft, then exact.
        .fromTo(document.querySelector('main'), { scale: 1.045, filter: 'blur(8px)', transformOrigin: '50% 0%' },
          { scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', clearProps: 'transform,filter' }, '<0.25');
    };
    return () => { gone = true; tl?.kill(); if (tick && gsapRef) gsapRef.ticker.remove(tick); };
  }, [rtl]);

  // Letters in English, whole words in Arabic.
  const pieces = (w) => (rtl ? [w] : w.split('')).map((ch, k) => <span key={k} className="ip-p">{ch}</span>);
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

      <div className="ip-stage">
        {words.map((w) => <span key={w} className="ip-w">{pieces(w)}</span>)}
      </div>

      <div>
        <div className="ip-row">
          <p className="ip-mask"><span className={`ip-line ip-role${rtl ? '' : ' lat'}`}>{role}</span></p>
          <p className="ip-mask"><span className="ip-line ip-step lat"><b>01</b> / {String(words.length).padStart(2, '0')}</span></p>
          <p className="ip-mask"><span className="ip-line ip-count lat"><b ref={num}>000</b>%</span></p>
        </div>
        <div className="ip-bar"><i /></div>
      </div>
    </div>
  );
}
