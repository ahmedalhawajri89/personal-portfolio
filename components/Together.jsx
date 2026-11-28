'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK, motionWanted } from '../lib/motion';
import Icon from './Icons';

/* How we work together: the road from a first message to a handover, with
   the money on it. Four stages along one line; under the line, where each
   payment falls -- a first part at the start, then a part as each stage is
   delivered -- so the price and the work are read as one thing. Then the
   questions a client asks before writing, answered plainly.

   Only terms Ahmed has confirmed are stated as terms: a fixed price set once
   the scope is agreed, and payment by stages. Everything else is "agreed in
   the proposal". As the section is read the line draws itself and each
   stage lights as it is reached; without motion it is all simply there. */
export default function Together({ t, whatsapp, rtl }) {
  const root = useRef(null);

  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    (async () => {
      const { gsap } = await loadMotion();
      if (gone || !root.current) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current;
        const steps = [...el.querySelectorAll('.wt-step')];
        const fill = el.querySelector('.wt-fill');
        // Down the side on a narrow screen, across on a wide one.
        const rail = el.querySelector('.wt-rail');
        const down = rail.offsetHeight > rail.offsetWidth;
        const axis = down ? 'scaleY' : 'scaleX';
        gsap.set(fill, down ? { scaleY: 0, transformOrigin: '50% 0%' } : { scaleX: 0, transformOrigin: rtl ? '100% 50%' : '0% 50%' });
        gsap.set(steps, { '--lit': 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el.querySelector('.wt-road'), start: 'top 75%', end: 'bottom 45%', scrub: 0.8 },
        });
        tl.to(fill, { [axis]: 1, ease: 'none', duration: steps.length }, 0);
        steps.forEach((s, i) => {
          tl.to(s, { '--lit': 1, duration: 0.4, ease: 'power2.out' }, i + 0.1);
          tl.from(s.querySelector('.wt-copy'), { y: 26, opacity: 0, duration: 0.5, ease: 'power2.out' }, i);
          const pay = s.querySelector('.wt-pay');
          if (pay) tl.from(pay, { y: -10, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)' }, i + 0.3);
        });
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  return (
    <div className="wt" ref={root}>
      <div className="wt-road">
        <span className="wt-rail" aria-hidden="true"><span className="wt-fill" /></span>
        <ol className="wt-ol">
        {t.steps.map((s, i) => (
          <li key={s.h} className="wt-step">
            <span className="wt-dot" aria-hidden="true"><span className="lat">{String(i + 1).padStart(2, '0')}</span></span>
            <div className="wt-copy">
              <h3 className="wt-h">{s.h}</h3>
              <p className="wt-b">{s.b}</p>
            </div>
            {s.pay && <p className="wt-pay"><Icon name="check" size={14} />{s.pay}</p>}
          </li>
        ))}
        </ol>
      </div>

      <div className="wt-faq">
        <h3 className="wt-faq-h">{t.faqH}</h3>
        {t.faq.map((f) => (
          <details key={f.q} className="wt-q">
            <summary>{f.q}<Icon name="plus" size={18} /></summary>
            <p>{f.a}</p>
          </details>
        ))}
        <div className="wt-acts">
          <a href="#contact" className="btn btn-primary" data-magnetic>{t.cta} <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={16} /></a>
          <a href={whatsapp} className="btn btn-ghost" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={16} />{t.wa}</a>
        </div>
      </div>
    </div>
  );
}
