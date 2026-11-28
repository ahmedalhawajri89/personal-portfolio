'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK, motionWanted } from '../lib/motion';
import Icon from './Icons';

/* The opening: the offer, standing in front of the work itself. Behind the
   headline a wall of the projects' real screens leans back and drifts, one
   column up and the next down, so the first thing a visitor sees is how
   much has actually been built; a veil darkens it towards the middle so the
   words always read. The headline says what he does, with the word that
   sets him apart -- test -- in the accent. Under it, the numbers that are
   true of the work: projects, screens, languages.

   On a desktop the wall drifts, leans away from a mouse and sinks as the
   page scrolls on. On a phone, or for reduced motion, it is the same
   picture, still. */

const ACCENT = { ar: 'وأختبره', en: 'test' };

// The headline line with its accent word wrapped, punctuation left outside.
function Line({ text, accent }) {
  return text.split(' ').map((w, i, all) => {
    const m = w.match(/^(.*?)([،,.]*)$/);
    const sp = i < all.length - 1 ? ' ' : '';
    return m[1] === accent
      ? <span key={i}><em className="hw-acc">{m[1]}</em>{m[2]}{sp}</span>
      : <span key={i}>{w}{sp}</span>;
  });
}

export default function Hero({ rtl, status, place, line1, line2, lede, cta1, cta2, wall = [], stats = [], children }) {
  const root = useRef(null);

  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    const html = document.documentElement;
    const covered = () => html.classList.contains('intro') || html.classList.contains('curtain-in');

    (async () => {
      const { gsap } = await loadMotion();
      if (gone || !root.current) return;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const el = root.current;
        const q = (s) => el.querySelectorAll(s);
        const wallEl = el.querySelector('.hw-wall');
        const cols = [...q('.hw-col')];

        // The columns drift, alternately, slowly enough to read a screen.
        const drift = cols.map((c, i) => gsap.fromTo(c,
          { yPercent: i % 2 ? -22 : 0 },
          { yPercent: i % 2 ? 0 : -22, duration: 34 + i * 5, ease: 'none', repeat: -1, yoyo: true }));

        // The way in, once, while the page is still covered or as it opens.
        const enter = () => gsap.timeline()
          .fromTo(wallEl, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }, 0)
          .from(q('.hw-line'), { yPercent: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.15)
          .from(q('.hw-reveal'), { y: 22, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.45)
          .from(q('.hw-n'), { textContent: 0, duration: 1.4, ease: 'power2.out', snap: { textContent: 1 }, stagger: 0.12 }, 0.6);
        if (covered()) {
          gsap.set(wallEl, { opacity: 0 });
          gsap.set(q('.hw-line, .hw-reveal'), { opacity: 0 });
          const mo = new MutationObserver(() => {
            if (covered()) return;
            mo.disconnect();
            gsap.set(q('.hw-line, .hw-reveal'), { clearProps: 'opacity' });
            enter();
          });
          mo.observe(html, { attributes: true, attributeFilter: ['class'] });
          ctx.add(() => () => mo.disconnect());
        } else {
          enter();
        }

        // Scrolling on, the wall sinks back and the words lift away.
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 } })
          .to(wallEl, { scale: 0.92, yPercent: 8, opacity: 0.25, ease: 'none' }, 0)
          .to(el.querySelector('.hw-in'), { yPercent: -14, opacity: 0, ease: 'none' }, 0);

        // A mouse moves the wall the other way, a little.
        let off = () => {};
        if (pointer) {
          const tx = gsap.quickTo(wallEl, 'x', { duration: 1.2, ease: 'power3' });
          const ty = gsap.quickTo(wallEl, 'y', { duration: 1.2, ease: 'power3' });
          const move = (e) => { tx((e.clientX / innerWidth - 0.5) * -50); ty((e.clientY / innerHeight - 0.5) * -34); };
          window.addEventListener('pointermove', move, { passive: true });
          off = () => window.removeEventListener('pointermove', move);
        }
        return () => { off(); drift.forEach((d) => d.kill()); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  // Four columns of four, the screens taken in turn so neighbours differ.
  const COLS = 4, PER = 4;
  const columns = Array.from({ length: COLS }, (_, c) =>
    Array.from({ length: PER }, (_, r) => wall.length ? wall[(c * PER + r) % wall.length] : null).filter(Boolean));
  const accent = ACCENT[rtl ? 'ar' : 'en'];

  return (
    <div className="hw" ref={root}>
      <div className="hw-back" aria-hidden="true">
        <div className="hw-wall">
          {columns.map((col, c) => (
            <div key={c} className="hw-col">
              {col.map((s, r) => (
                <div key={r} className="hw-card"><img src={s} alt="" width="960" height="600" decoding="async" fetchPriority="low" /></div>
              ))}
            </div>
          ))}
        </div>
        <div className="hw-veil" />
      </div>

      <div className="hw-in">
        <p className="hx-status hw-reveal">
          <span className="hx-live" aria-hidden="true" />
          {status}<span aria-hidden="true">·</span><span className="hx-place">{place}</span>
        </p>

        <h1 className="hw-h" aria-label={`${line1} ${line2}`}>
          <span className="hw-line" aria-hidden="true"><Line text={line1} accent={accent} /></span>
          <span className="hw-line" aria-hidden="true"><Line text={line2} accent={accent} /></span>
        </h1>

        <p className="hw-lede hw-reveal">{lede}</p>

        {stats.length > 0 && (
          <ul className="hw-stats hw-reveal">
            {stats.map((s) => (
              <li key={s.l}><b className="hw-n lat">{s.n}</b><span>{s.l}</span></li>
            ))}
          </ul>
        )}

        <div className="hx-ctas hw-ctas hw-reveal">
          <a href="#work" className="btn btn-primary hx-cta" data-magnetic>{cta1} <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={16} /></a>
          <a href="#contact" className="btn btn-ghost" data-magnetic>{cta2}</a>
          {children}
        </div>
      </div>
    </div>
  );
}
