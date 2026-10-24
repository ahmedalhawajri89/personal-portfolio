'use client';

import { useEffect, useRef } from 'react';
import { MOTION_OK } from '../lib/motion';

/* The cut between pages. Following a link to another page of the site draws
   an ink curtain up over this one; the next page opens with the curtain
   still down and lifts it. The pages are separate documents, so the two
   halves meet through sessionStorage: the click leaves a note, and the boot
   script of the next page reads it before first paint (html.curtain-in), so
   the new page is never seen uncovered and then covered again.

   Only plain clicks on links to another page here are taken: a new tab, a
   modified click, a download, an in-page anchor or another site all go as
   the browser sends them. Off for reduced motion. If script fails on the
   next page, a CSS timer lifts the curtain anyway. */
export default function Curtain() {
  const el = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    let gsap, tl;
    const ok = matchMedia(MOTION_OK).matches;
    const get = () => (gsap ? Promise.resolve(gsap) : import('gsap').then((m) => (gsap = m.gsap)));

    // After a change of language the bands open the page instead
    // (components/LangFx.jsx); this curtain stays put away.
    if (html.classList.contains('curtain-in') && html.dataset.curtain !== 'lines') {
      get().then((g) => {
        tl = g.timeline({ onComplete: () => { html.classList.remove('curtain-in'); g.set(el.current, { clearProps: 'all' }); } })
          .fromTo(el.current, { yPercent: 0 }, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.1 });
      });
    }

    const onClick = (e) => {
      if (!ok || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      // The language link has its own cut (components/LangFx.jsx).
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('hreflang')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      try { sessionStorage.setItem('curtain', '1'); } catch {}
      get().then((g) => {
        g.set(el.current, { visibility: 'visible' });
        g.fromTo(el.current, { yPercent: 100 }, {
          yPercent: 0, duration: 0.7, ease: 'expo.inOut',
          onComplete: () => { location.href = url.href; },
        });
      });
    };
    // Back to a page kept in memory: it comes back as it was left, curtain
    // down. Put it away.
    const onShow = (e) => {
      if (!e.persisted) return;
      html.classList.remove('curtain-in');
      if (el.current) el.current.removeAttribute('style');
    };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onShow);
    return () => {
      tl?.kill();
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onShow);
    };
  }, []);

  return <div className="curtain" ref={el} aria-hidden="true"><span className="curtain-dot" /></div>;
}
