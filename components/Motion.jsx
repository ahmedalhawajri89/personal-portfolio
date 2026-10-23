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
   pullback -- the opening shot recedes as the first scene arrives.
   drift  -- a scene number slides against the scroll, behind its heading.
   count  -- a figure counts up to its value once, when it comes into view.
   peek   -- on a card, hovering with a mouse scrolls the screenshot down to
             show the whole page, and leaving scrolls it back.

   Everything waits for the page to be idle, so none of it is in front of the
   first paint, and nothing runs for reduced motion: the markup is already
   the final frame. Lines are split, never characters -- Arabic letters join,
   and a span between two of them breaks the word. */
export default function Motion() {
  useEffect(() => {
    let mm, gone = false;
    const off = [];
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
          const img = box.querySelector('img');
          if (!img) return;
          // A third of the page at most: enough to show there is a page under
          // the fold, not so much that the frame becomes a scrollbar.
          gsap.to(img, {
            y: () => -Math.max(0, Math.min(img.offsetHeight - box.offsetHeight, box.offsetHeight * 1.6)),
            ease: 'none',
            scrollTrigger: { trigger: box, start: 'top 60%', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
          });
        });

        // The camera pulling back from the opening shot: the hero sinks a
        // little and dims as the first scene comes up under it.
        gsap.utils.toArray('[data-m="pullback"]').forEach((el) => {
          gsap.to(el, {
            scale: 0.94, yPercent: -4, opacity: 0.2, transformOrigin: '50% 0%', ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        // A scene number slides against the scroll, slower than the page,
        // so the title card has depth without moving anything that is read.
        gsap.utils.toArray('[data-m="drift"]').forEach((el) => {
          const dir = document.dir === 'rtl' ? 1 : -1;
          gsap.fromTo(el, { xPercent: -14 * dir, yPercent: 30 }, {
            xPercent: 14 * dir, yPercent: -30, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });

        gsap.utils.toArray('[data-m="count"]').forEach((el) => {
          const to = Number(el.dataset.to || el.textContent);
          const n = { v: 0 };
          gsap.to(n, {
            v: to, duration: 1.4, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(n.v); },
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });

      // Hover is a mouse thing; a phone gets the top of the page and a tap.
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        gsap.utils.toArray('[data-m="peek"]').forEach((box) => {
          let full, tween;
          const enter = () => {
            if (!full) {
              full = new Image();
              full.src = box.dataset.full;
              full.alt = '';
              full.className = 'peek-img';
              box.appendChild(full);
            }
            full.decode().then(() => {
              if (!box.matches(':hover')) return;
              const dist = Math.max(0, full.offsetHeight - box.offsetHeight);
              tween?.kill();
              tween = gsap.timeline()
                .to(full, { autoAlpha: 1, duration: 0.25 })
                .to(full, { y: -dist, duration: Math.min(6, dist / 450), ease: 'power1.inOut' }, 0.15);
            }).catch(() => {});
          };
          const leave = () => {
            if (!full) return;
            tween?.kill();
            tween = gsap.timeline()
              .to(full, { y: 0, duration: 0.6, ease: 'power3.out' })
              .to(full, { autoAlpha: 0, duration: 0.2 });
          };
          box.addEventListener('pointerenter', enter);
          box.addEventListener('pointerleave', leave);
          off.push(() => {
            box.removeEventListener('pointerenter', enter);
            box.removeEventListener('pointerleave', leave);
            full?.remove();
          });
        });
        return () => { off.splice(0).forEach((f) => f()); };
      });
      ScrollTrigger.refresh();
    });
    return () => { gone = true; cancel(); mm?.revert(); off.splice(0).forEach((f) => f()); };
  }, []);
  return null;
}
