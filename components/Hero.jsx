'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK } from '../lib/motion';
import Icon from './Icons';

const HUES = ['var(--h-db)', 'var(--h-api)', 'var(--h-ui)', 'var(--h-test)', 'var(--h-sec)'];

/* The opening: the offer set as large as the screen allows, and set moving.
   The headline arrives in pieces -- letters in English, each with its own
   turn and its own moment, and words in Arabic, because a span between two
   Arabic letters breaks the join -- and settles into a sentence. A mouse
   nudges the pieces it passes over. Scrolling away scatters them again, as
   if the sentence were being taken apart to show what it is made of, which
   is what the page does next.

   Under it the five parts of the work in their colours; one is lit at a
   time, and the line under the headline takes its colour. Without script,
   or for reduced motion, it is a still sentence. */
export default function Hero({ rtl, status, place, line1, line2, lede, cta1, cta2, parts, stats, children }) {
  const [lit, setLit] = useState(0);
  const root = useRef(null);

  useEffect(() => {
    let mm, gone = false, splits = [];
    const html = document.documentElement;
    // The entrance plays only while the page is still covered -- by the
    // intro on a first visit, or by the curtain from another page -- so the
    // headline is never seen, hidden and shown again. Otherwise it is simply
    // there when the page opens.
    const covered = () => html.classList.contains('intro') || html.classList.contains('curtain-in');
    const uncovered = () => new Promise((res) => {
      const mo = new MutationObserver(() => { if (!covered()) { mo.disconnect(); res(); } });
      mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    });

    (async () => {
      const { gsap, SplitText } = await loadMotion();
      if (gone || !root.current) return;
      const el = root.current;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const lines = el.querySelectorAll('.kh-line');
        splits = Array.from(lines).map((ln) => SplitText.create(ln, rtl
          ? { type: 'words', wordsClass: 'kh-u' }
          : { type: 'words,chars', charsClass: 'kh-u' }));
        const units = splits.flatMap((s) => (rtl ? s.words : s.chars));
        const rand = gsap.utils.random;
        gsap.set(units, { display: 'inline-block', willChange: 'transform' });
        if (covered()) {
          gsap.set(units, { yPercent: 120, rotation: () => rand(-28, 28), opacity: 0 });
          gsap.set(el.querySelectorAll('.kh-reveal'), { opacity: 0, y: 24 });
          uncovered().then(() => {
            if (gone) return;
            gsap.to(units, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: { each: rtl ? 0.08 : 0.022, from: 'start' }, delay: 0.1 });
            gsap.to(el.querySelectorAll('.kh-reveal'), { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: rtl ? 0.7 : 0.9 });
          });
        }

        // Scrolling away takes the sentence apart.
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 } })
          .to(units, { y: () => rand(-160, 160), x: () => rand(-50, 50), rotation: () => rand(-45, 45), opacity: 0.12, ease: 'none', stagger: { each: 0.01, from: 'random' } }, 0)
          .to(el.querySelectorAll('.kh-reveal'), { y: -40, opacity: 0, ease: 'none' }, 0);

        let off = () => {};
        if (pointer) {
          const jump = (e) => {
            const u = e.currentTarget;
            gsap.timeline()
              .to(u, { y: -22, rotation: rand(-14, 14), duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
              .to(u, { y: 0, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
          };
          units.forEach((u) => u.addEventListener('pointerenter', jump));
          off = () => units.forEach((u) => u.removeEventListener('pointerenter', jump));
        }

        const timer = setInterval(() => setLit((k) => (k + 1) % HUES.length), 1800);
        return () => { off(); clearInterval(timer); splits.forEach((s) => s.revert()); splits = []; };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  return (
    <div className="kh" ref={root} style={{ '--hue': HUES[lit] }}>
      <div className="kh-top kh-reveal">
        <p className="hx-status">
          <span className="hx-live" aria-hidden="true" />
          {status}<span aria-hidden="true">·</span><span className="hx-place">{place}</span>
        </p>
        <p className="kh-role lat">Full-Stack · QA · Laravel · Vue</p>
      </div>

      <h1 className="kh-h">
        <span className="kh-line">{line1}</span>
        <span className="kh-line is-soft">{line2}</span>
      </h1>

      <div className="kh-foot">
        <ul className="kh-parts kh-reveal" aria-label={parts.join('، ')}>
          {parts.map((p, k) => (
            <li key={p} className={k === lit ? 'is-on' : ''} style={{ '--c': HUES[k] }}><i aria-hidden="true" />{p}</li>
          ))}
        </ul>
        <div className="kh-copy kh-reveal">
          <p className="kh-lede">{lede}</p>
          <div className="hx-ctas">
            <a href="#work" className="btn btn-primary hx-cta" data-magnetic>{cta1} <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={16} /></a>
            <a href="#contact" className="btn btn-ghost" data-magnetic>{cta2}</a>
            {children}
          </div>
        </div>
      </div>

      <ul className="hx-stats kh-reveal">
        {stats.map((s) => (
          <li key={s.l}>
            <span className="lat">{s.n}{s.suffix || ''}</span>
            <small>{s.l}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
