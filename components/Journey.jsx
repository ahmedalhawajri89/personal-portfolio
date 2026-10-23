'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';

const pad = (n) => String(n).padStart(2, '0');

/* The case study's one big moment: the product used once, from the first
   screen a user meets to the last, told as steps beside the screen each step
   happens on. On a wide screen the browser frame holds still while the steps
   scroll past it; each step that reaches the middle of the screen brings its
   page into the frame, wiped up from the bottom, and the page inside scrolls
   while the step is being read -- the captures are whole pages, so the frame
   shows what lies under the fold too. On a phone each step simply carries
   its own picture under the text.

   The step that is current is decided by scroll position for everyone; the
   wipe and the scrolling page are motion, and are off for reduced motion,
   where the frame just changes. Without script the frame shows step one and
   every step still has its words. */
export default function Journey({ steps, labels }) {
  const [on, setOn] = useState({ i: 0, prev: -1 });
  const root = useRef(null);
  const imgs = useRef([]);
  const wipe = useRef(null);
  const n = steps.length;

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !root.current) return;
      const items = gsap.utils.toArray('.jr-step', root.current);
      mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        items.forEach((li, k) => {
          ScrollTrigger.create({
            trigger: li, start: 'top 55%', end: 'bottom 55%',
            onToggle: (self) => self.isActive && setOn((s) => (s.i === k ? s : { i: k, prev: s.i })),
          });
        });
      });

      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        wipe.current = (el, done) => gsap.fromTo(el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.out', onComplete: done });

        items.forEach((li, k) => {
          const img = imgs.current[k];
          const view = img?.parentElement;
          if (!img) return;
          gsap.to(img, {
            y: () => -Math.max(0, Math.min(img.offsetHeight - view.offsetHeight, view.offsetHeight * 1.6)),
            ease: 'none',
            scrollTrigger: { trigger: li, start: 'top 55%', end: 'bottom 45%', scrub: 0.6, invalidateOnRefresh: true },
          });
        });

        gsap.fromTo(root.current.querySelector('.jr-progress i'), { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: root.current.querySelector('.jr-steps'), start: 'top 55%', end: 'bottom 55%', scrub: true },
        });
        return () => { wipe.current = null; };
      });
      ScrollTrigger.refresh();
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, []);

  // A new step wipes in over the one before; the one before stays drawn
  // underneath until the wipe has covered it, so the frame is never empty.
  useEffect(() => {
    if (on.prev < 0) return;
    const el = imgs.current[on.i];
    const t = wipe.current
      ? wipe.current(el, () => setOn((s) => (s.i === on.i ? { ...s, prev: -1 } : s)))
      : (setOn((s) => ({ ...s, prev: -1 })), null);
    return () => t?.kill();
  }, [on.i]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = steps[on.i];
  return (
    <div className="jr" ref={root}>
      <ol className="jr-steps">
        {steps.map((x, k) => (
          <li key={x.h} className={`jr-step${k === on.i ? ' is-on' : ''}`}>
            <span className="jr-n lat" aria-hidden="true">{pad(k + 1)}</span>
            <h3>{x.h}</h3>
            <p>{x.b}</p>
            <p className="jr-where lat">{x.path}</p>
            <div className="jr-shot-m">
              <img src={x.thumb} alt={x.alt} width={x.tw} height={x.th} loading="lazy" decoding="async" />
            </div>
          </li>
        ))}
      </ol>

      <div className="jr-stage">
        <div className="jr-frame">
          <div className="jr-bar" aria-hidden="true"><i /><i /><i /><span className="lat">{s.path}</span></div>
          <div className="jr-view">
            {steps.map((x, k) => (
              <img key={x.h} ref={(el) => (imgs.current[k] = el)}
                   className={`jr-img${k === on.i ? ' is-on' : k === on.prev ? ' was-on' : ''}`}
                   src={x.file} alt={k === on.i ? x.alt : ''} aria-hidden={k !== on.i}
                   width={x.w} height={x.ih} loading={k === 0 ? 'eager' : 'lazy'} decoding="async" />
            ))}
          </div>
          <div className="jr-progress" aria-hidden="true"><i /></div>
        </div>
        <p className="jr-count" aria-hidden="true">
          <span className="lat">{pad(on.i + 1)} / {pad(n)}</span>
          <span>{s.h}</span>
        </p>
        {labels?.open && (
          <a className="jr-open" href={s.file} target="_blank" rel="noopener noreferrer">
            {labels.open} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
