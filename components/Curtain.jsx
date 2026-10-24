'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { MOTION_OK } from '../lib/motion';

const keyOf = (path) => (path.endsWith('/') ? path : `${path}/`);

/* The cut between pages, and the wait for the next one, as a title card.
   Following a link to another page of the site raises a curtain in the
   colour of where it leads -- a project's own hue for its case study, the
   signal orange for the home page -- and on it the place is named: a small
   line above, the name set large rising out of its mask, what it is under
   it, and a thin line gliding across while the next page loads. The next
   page opens on the same card, still down: the line fills, the name leaves
   upward, and the curtain lifts onto the page.

   The pages are separate documents, so the two halves meet through
   sessionStorage: the click leaves a note, and the boot script of the next
   page reads it before first paint (html.curtain-in), so the new page is
   never seen uncovered and then covered again. Each page draws its own card
   (`here`); the leaving page draws the card of the page it is going to,
   looked up in `routes` (lib/routes.js), and a link to a page with no card
   gets a plain curtain.

   Only plain clicks on links to another page here are taken: a new tab, a
   modified click, a download, an in-page anchor or another site all go as
   the browser sends them. Off for reduced motion. If script fails on the
   next page, a CSS timer lifts the curtain anyway. */
export default function Curtain({ routes = {}, here }) {
  const el = useRef(null);
  const [to, setTo] = useState(null);
  const card = to || routes[here] || null;

  useEffect(() => {
    const html = document.documentElement;
    let gsap, tl;
    const ok = matchMedia(MOTION_OK).matches;
    const get = () => (gsap ? Promise.resolve(gsap) : import('gsap').then((m) => (gsap = m.gsap)));
    const $ = (s) => el.current.querySelectorAll(s);

    // Arriving: the card is down already. The line fills, the name leaves,
    // the curtain lifts. After a change of language the bands open the page
    // instead (components/LangFx.jsx); this curtain stays put away.
    if (html.classList.contains('curtain-in') && html.dataset.curtain !== 'lines') {
      get().then((g) => {
        tl = g.timeline({ onComplete: () => { html.classList.remove('curtain-in'); g.set(el.current, { clearProps: 'transform,visibility' }); g.set([...$('.ct-up'), ...$('.ct-fill'), ...$('.ct-seg')], { clearProps: 'all' }); } })
          .to($('.ct-fill'), { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, 0)
          .to($('.ct-seg'), { opacity: 0, duration: 0.2 }, 0.1)
          .to($('.ct-up'), { yPercent: -110, duration: 0.45, ease: 'expo.in', stagger: 0.04 }, 0.3)
          .to(el.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.5);
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
      // The card of the page being opened, drawn before the curtain moves.
      flushSync(() => setTo(routes[keyOf(url.pathname)] || { plain: true }));
      get().then((g) => {
        g.timeline({ onComplete: () => { location.href = url.href; } })
          .set(el.current, { visibility: 'visible' })
          .fromTo(el.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
          .fromTo($('.ct-up'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }, 0.35)
          .fromTo($('.ct-line'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
      });
    };
    // Back to a page kept in memory: it comes back as it was left, curtain
    // down. Put it away.
    const onShow = (e) => {
      if (!e.persisted) return;
      html.classList.remove('curtain-in');
      setTo(null);
      if (el.current) {
        el.current.removeAttribute('style');
        el.current.querySelectorAll('[style]').forEach((n) => n.removeAttribute('style'));
      }
    };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onShow);
    return () => {
      tl?.kill();
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onShow);
    };
  }, [routes]);

  return (
    <div className="curtain" ref={el} aria-hidden="true" style={card?.hue ? { '--c': card.hue } : undefined}>
      {card && !card.plain && (
        <div className="ct-card">
          <p className="ct-k"><span className="ct-mask"><span className="ct-up">
            {card.n && <span className="lat">{card.n}</span>}{card.k}
          </span></span></p>
          <p className="ct-name"><span className="ct-mask"><span className="ct-up">{card.name}</span></span></p>
          <p className="ct-kind"><span className="ct-mask"><span className="ct-up">{card.kind}</span></span></p>
          <span className="ct-line"><i className="ct-seg" /><i className="ct-fill" /></span>
        </div>
      )}
    </div>
  );
}
