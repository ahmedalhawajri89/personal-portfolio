'use client';

import { useEffect } from 'react';
import { loadMotion, MOTION_OK, motionWanted } from '../lib/motion';

/* The work, switched on as it is reached. Each project's picture opens like
   a screen powering up -- a thin bright line, tipped back, that opens to its
   full height and stands up as the reader scrolls -- while the picture
   inside drifts slower than the page. The words arrive from the screen's
   side, in reading order. Behind the list one light takes the colour of the
   project in view and passes from one to the next; a large outlined number
   moves at its own pace behind the words; and a project leaving the top
   steps back and dims as the next one comes on.

   Nothing to render: it works on the markup of #work. Only where there is
   motion; on a phone the list is simply there. */
export default function WorkMotion({ rtl }) {
  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    (async () => {
      const { gsap } = await loadMotion();
      const sec = document.getElementById('work');
      if (gone || !sec) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The light: one layer that stays in view while the list scrolls.
        const glow = document.createElement('div');
        glow.className = 'wk-glow';
        glow.setAttribute('aria-hidden', 'true');
        sec.prepend(glow);
        sec.classList.add('wk-on');

        const cards = [...sec.querySelectorAll('.pc')];
        const hue = (el) => getComputedStyle(el).getPropertyValue('--c').trim() || '#FF5A1F';
        gsap.set(glow, { '--wk': hue(cards[0]) });

        cards.forEach((li) => {
          const cover = li.querySelector('.pc-cover');
          const art = cover?.firstElementChild;
          const copy = li.querySelector('.pc-copy');
          const ghost = li.querySelector('.pc-ghost');
          if (!cover || !copy) return;

          // The screen powers on.
          gsap.fromTo(cover,
            { clipPath: 'inset(47% 6% 47% 6% round 26px)', rotateX: 16, scale: 0.9, transformPerspective: 1400, transformOrigin: '50% 60%', filter: 'brightness(1.8)' },
            { clipPath: 'inset(0% 0% 0% 0% round 26px)', rotateX: 0, scale: 1, filter: 'brightness(1)', ease: 'none',
              scrollTrigger: { trigger: li, start: 'top 92%', end: 'top 38%', scrub: 0.8 } });

          // The picture inside drifts slower than the page.
          if (art) {
            gsap.fromTo(art, { yPercent: -6, scale: 1.12 }, {
              yPercent: 6, scale: 1.12, ease: 'none',
              scrollTrigger: { trigger: li, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          }

          // The words come from the screen's side, once.
          const cr = cover.getBoundingClientRect(), pr = copy.getBoundingClientRect();
          const from = (cr.left + cr.width / 2 < pr.left + pr.width / 2 ? -1 : 1) * 56;
          const parts = copy.querySelectorAll('.pc-label, .pc-kind, .pc-q, .pc-stack, .pc-acts');
          gsap.from(parts, {
            x: from, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: li, start: 'top 62%', once: true },
          });

          // The number behind the words, at its own pace.
          if (ghost) {
            gsap.fromTo(ghost, { yPercent: 18 }, {
              yPercent: -18, ease: 'none',
              scrollTrigger: { trigger: li, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            });
          }

          // Leaving the top, it steps back and dims.
          gsap.to(li, {
            scale: 0.95, opacity: 0.4, ease: 'none',
            scrollTrigger: { trigger: li, start: 'bottom 42%', end: 'bottom top', scrub: 0.8 },
          });

          // The light takes this project's colour while it is the one in view.
          gsap.timeline({
            scrollTrigger: {
              trigger: li, start: 'top 55%', end: 'bottom 55%',
              onToggle: (s) => { if (s.isActive) gsap.to(glow, { '--wk': hue(li), duration: 0.9, ease: 'power2.out', overwrite: 'auto' }); },
            },
          });
        });

        return () => { glow.remove(); sec.classList.remove('wk-on'); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);
  return null;
}
