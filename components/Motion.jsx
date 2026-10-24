'use client';

import { useEffect } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';

/* The page's motion, declared in the markup and run by GSAP. Each effect is
   named by a data-m attribute so a page opts in element by element:

   lines  -- a heading's lines rise out from behind a mask as it arrives.
   read   -- a paragraph darkens word by word as it is scrolled through: the
             problem is read at the speed the visitor reads it.
   screen -- a browser frame whose page scrolls with yours. The captures are
             whole pages; a frame shows the top, and scrolling past it shows
             the rest, the way the visitor would see it in the product.
   live   -- a small loop that runs only while it is on screen (.is-live).
   pop    -- the lit dots in a list come on one after another.
   drawmark -- the logo, drawn large as it arrives.
   count  -- a figure counts up to its value once, when it comes into view.

   Everything waits for the page to be idle, so none of it is in front of the
   first paint, and nothing runs for reduced motion: the markup is already
   the final frame. Lines are split, never characters -- Arabic letters join,
   and a span between two of them breaks the word. */
export default function Motion() {
  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger, SplitText } = await loadMotion();
      if (gone) return;
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-m="lines"]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines', mask: 'lines', autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
          });
        });

        gsap.utils.toArray('[data-m="read"]').forEach((el) => {
          SplitText.create(el, {
            type: 'words', autoSplit: true,
            onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.16 }, {
              opacity: 1, ease: 'none', stagger: 0.12,
              scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: 0.4 },
            }),
          });
        });

        gsap.utils.toArray('[data-m="screen"]').forEach((box) => {
          const img = box.querySelector('img, .gx-art');
          if (!img) return;
          // A third of the page at most: enough to show there is a page under
          // the fold, not so much that the frame becomes a scrollbar.
          gsap.to(img, {
            y: () => -Math.max(0, Math.min(img.offsetHeight - box.offsetHeight, box.offsetHeight * 1.6)),
            ease: 'none',
            scrollTrigger: { trigger: box, start: 'top 60%', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
          });
        });

        // Small loops (the service marks) run only while they are on screen.
        gsap.utils.toArray('[data-m="live"]').forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: 'top 95%', end: 'bottom 5%', toggleClass: 'is-live' });
        });

        // The lit dots in a list come on one after another, the first time
        // the list is seen.
        gsap.utils.toArray('[data-m="pop"]').forEach((el) => {
          const dots = el.querySelectorAll('.on');
          gsap.from(dots, { scale: 0, duration: 0.5, ease: 'back.out(3)', stagger: 0.035,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });

        // The mark, drawn large as it comes up the page: the A first, the
        // check last, as in the logo.
        gsap.utils.toArray('[data-m="drawmark"]').forEach((el) => {
          const a = el.querySelector('.logo-a'), c = el.querySelector('.logo-check');
          if (!a || !c) return;
          gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
            .fromTo(a, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', immediateRender: false })
            .fromTo(c, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', immediateRender: false });
        });

        gsap.utils.toArray('[data-m="count"]').forEach((el) => {
          const to = Number(el.dataset.to || el.textContent);
          const n = { v: 0 };
          gsap.to(n, {
            v: to, duration: 1.4, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(n.v).toLocaleString('en-US'); },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });

      ScrollTrigger.refresh();
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, []);
  return null;
}
