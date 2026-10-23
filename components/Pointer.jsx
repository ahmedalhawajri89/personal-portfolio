'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, whenIdle, POINTER_OK } from '../lib/motion';

/* Two things a mouse gets that a finger does not.

   Over a picture of a project ([data-cursor]) a disc follows the pointer and
   names what a click does -- "view" -- instead of the reader guessing that
   the screenshot is a link. The system cursor is never hidden: the disc is
   a label beside it, not a replacement for it.

   A call to action ([data-magnetic]) leans toward the pointer as it comes
   near and springs back when it leaves, so the one button that matters on a
   screen answers the hand before it is clicked.

   Neither exists for touch, a coarse pointer or reduced motion. */
export default function Pointer({ label }) {
  const el = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap } = await loadMotion();
      if (gone || !el.current) return;
      mm = gsap.matchMedia();
      mm.add(POINTER_OK, () => {
        const c = el.current;
        const text = c.querySelector('.cur-label');
        const xTo = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3' });
        const yTo = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3' });
        const move = (e) => { xTo(e.clientX); yTo(e.clientY); };
        const over = (e) => {
          const t = e.target.closest?.('[data-cursor]');
          if (t) text.textContent = t.dataset.cursor === 'view' ? label : t.dataset.cursor;
          c.classList.toggle('is-on', !!t);
        };
        const out = (e) => { if (!e.relatedTarget) c.classList.remove('is-on'); };
        window.addEventListener('pointermove', move, { passive: true });
        document.addEventListener('pointerover', over);
        document.addEventListener('pointerout', out);

        const offs = gsap.utils.toArray('[data-magnetic]').map((m) => {
          const mx = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' });
          const my = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
          const pull = (e) => {
            const r = m.getBoundingClientRect();
            mx((e.clientX - (r.left + r.width / 2)) * 0.3);
            my((e.clientY - (r.top + r.height / 2)) * 0.4);
          };
          const free = () => gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true });
          m.addEventListener('pointermove', pull);
          m.addEventListener('pointerleave', free);
          return () => { m.removeEventListener('pointermove', pull); m.removeEventListener('pointerleave', free); gsap.set(m, { clearProps: 'transform' }); };
        });

        c.classList.add('is-live');
        return () => {
          window.removeEventListener('pointermove', move);
          document.removeEventListener('pointerover', over);
          document.removeEventListener('pointerout', out);
          offs.forEach((f) => f());
          c.classList.remove('is-live', 'is-on');
        };
      });
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [label]);

  return (
    <div className="cur" ref={el} aria-hidden="true">
      <span className="cur-disc"><span className="cur-label">{label}</span></span>
    </div>
  );
}
