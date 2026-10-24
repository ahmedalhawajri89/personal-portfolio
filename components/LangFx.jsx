'use client';

import { useEffect, useRef } from 'react';
import { MOTION_OK, whenIdle } from '../lib/motion';

const BARS = 10;
const NAME = { ar: 'العربية', en: 'English' };

/* The change of language, drawn in lines. Choosing the other language does
   not cut to the other page: bands of ink close over this one, the name of
   the language being opened rises in the middle, and on the other side the
   name leaves and the bands open again onto the page in its new direction.

   The bands are never laid the same way twice in a row; each switch takes
   the next of four:

     columns  bars rise from the floor, the middle first, and leave upward
              from the edges in
     rows     bands draw across in the old reading direction and withdraw
              in the new one, so the page turns from left-to-right to
              right-to-left (or back) in the motion itself
     blinds   bars open from their own centres at scattered moments, like
              slats turning
     slant    leaning bars slide up in order and carry on up and away

   The two pages are separate documents, so they meet the way the page
   curtain's halves do (components/Curtain.jsx): the click leaves a note,
   `curtain` = `lines:<pattern>`, and the next page's boot script reads it
   before first paint, marking <html> curtain-in with data-curtain="lines"
   and data-lfx=<pattern>, so the bands are already closed when it is first
   seen. Everything else that waits for the curtain (the hero's entrance)
   waits for these bands the same way. Off for reduced motion, and a CSS
   timer opens the page anyway if script fails. */

const shut = {
  columns: { from: { scaleY: 0, transformOrigin: '50% 100%' }, to: { stagger: { each: 0.045, from: 'center' }, duration: 0.7, ease: 'power4.inOut' } },
  rows: { from: (rtl) => ({ scaleX: 0, transformOrigin: rtl ? '100% 50%' : '0% 50%' }), to: { stagger: 0.05, duration: 0.65, ease: 'power4.inOut' } },
  blinds: { from: { scaleX: 0, transformOrigin: '50% 50%' }, to: { stagger: { amount: 0.35, from: 'random' }, duration: 0.55, ease: 'power3.inOut' } },
  slant: { from: { yPercent: 102 }, to: { stagger: { each: 0.05, from: 'start' }, duration: 0.75, ease: 'expo.inOut' } },
};
const open = {
  columns: () => ({ scaleY: 0, transformOrigin: '50% 0%', stagger: { each: 0.045, from: 'edges' }, duration: 0.75, ease: 'power4.inOut' }),
  rows: (rtl) => ({ scaleX: 0, transformOrigin: rtl ? '0% 50%' : '100% 50%', stagger: 0.05, duration: 0.7, ease: 'power4.inOut' }),
  blinds: () => ({ scaleX: 0, transformOrigin: '50% 50%', stagger: { amount: 0.35, from: 'random' }, duration: 0.6, ease: 'power3.inOut' }),
  slant: () => ({ yPercent: -102, stagger: { each: 0.05, from: 'start' }, duration: 0.8, ease: 'expo.inOut' }),
};
const PATTERNS = Object.keys(shut);
// Each name in the face its own page sets it in, at the weight it is drawn.
// The English page has no Arabic face in its stack, so without this the
// Arabic name was drawn in a system font there and changed face on arrival.
const FACE = { ar: "800 100px PlexArFx", en: "800 100px InstrumentFx" };
const fontOf = (l) => (document.fonts ? document.fonts.load(FACE[l], NAME[l]).catch(() => {}) : Promise.resolve());
// Never wait long for anything before moving: a slow font loses to the cut.
const within = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
const frames = (n) => new Promise((r) => { const f = () => (--n <= 0 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });

export default function LangFx({ lang }) {
  const root = useRef(null);
  const rtl = lang === 'ar';

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    let gsap, tl;
    const get = () => (gsap ? Promise.resolve(gsap) : import('gsap').then((m) => (gsap = m.gsap)));
    const bars = () => el.querySelectorAll('.lfx-bar');
    const word = (l) => el.querySelector(`.lfx-w[data-l="${l}"]`);
    // The page's scroll engine tells GSAP never to smooth over a late frame
    // (lib/motion.js), which is right for scrolling but makes a cut jump
    // when a frame is late -- and the frames around a page change are the
    // latest there are. While the bands move, a late frame is smoothed;
    // after, the engine's rule is put back.
    const smooth = (g) => g.ticker.lagSmoothing(200, 33);
    const restore = (g) => { if (html.classList.contains('lenis')) g.ticker.lagSmoothing(0); };

    // Arriving: the bands are closed already; the name leaves, they open.
    if (html.classList.contains('curtain-in') && html.dataset.curtain === 'lines') {
      const p = PATTERNS.includes(html.dataset.lfx) ? html.dataset.lfx : 'columns';
      // Wait for the page to finish starting up, so the bands open on frames
      // that arrive on time, and for the name's face.
      Promise.all([get(), within(fontOf(lang), 500)]).then(() => frames(2)).then(() => {
        const g = gsap;
        smooth(g);
        tl = g.timeline({
          onComplete: () => {
            restore(g);
            html.classList.remove('curtain-in');
            delete html.dataset.curtain;
            delete html.dataset.lfx;
            g.set([el, ...bars(), word(lang)], { clearProps: 'all' });
          },
        })
          .set(el, { visibility: 'visible' })
          .to(word(lang), { yPercent: -110, duration: 0.5, ease: 'expo.in' }, 0.15)
          .to(el.querySelector('.lfx-tag'), { opacity: 0, duration: 0.3 }, 0.15)
          .to(bars(), open[p](rtl), 0.5);
      });
    }

    // Leaving: close the bands over this page, name the language, go.
    const onClick = (e) => {
      const a = e.target.closest?.('a[hreflang]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!matchMedia(MOTION_OK).matches) return;
      e.preventDefault();
      let k = 0;
      try {
        k = (Number(sessionStorage.getItem('lfx')) || 0) % PATTERNS.length;
        sessionStorage.setItem('lfx', String(k + 1));
        sessionStorage.setItem('curtain', `lines:${PATTERNS[k]}`);
      } catch {}
      const p = PATTERNS[k];
      const to = a.getAttribute('hreflang');
      html.dataset.lfx = p;
      Promise.all([get(), within(fontOf(to), 300)]).then(() => {
        const g = gsap;
        const s = shut[p];
        smooth(g);
        g.timeline({ onComplete: () => { location.href = a.href; } })
          .set(el, { visibility: 'visible' })
          .fromTo(bars(), typeof s.from === 'function' ? s.from(rtl) : s.from, { scaleX: 1, scaleY: 1, yPercent: 0, ...s.to })
          .fromTo(word(to), { yPercent: 110, opacity: 1 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, '-=0.3')
          .fromTo(el.querySelector('.lfx-tag'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, '<0.1')
          .to({}, { duration: 0.12 });
      });
    };

    // Back to a page kept in memory: it comes back with the bands closed.
    const onShow = (e) => {
      if (!e.persisted) return;
      html.classList.remove('curtain-in');
      delete html.dataset.curtain;
      delete html.dataset.lfx;
      get().then((g) => g.set([el, ...bars(), word('ar'), word('en')], { clearProps: 'all' }));
    };

    // Ready before it is asked for: GSAP, the other language's face, and the
    // other page itself, so the click starts moving at once and the page
    // behind the bands arrives from the cache.
    const cancel = whenIdle(() => {
      get();
      const other = lang === 'ar' ? 'en' : 'ar';
      fontOf(other);
      const a = document.querySelector('a[hreflang]');
      if (a && !document.querySelector(`link[rel="prefetch"][href="${a.getAttribute('href')}"]`)) {
        const l = document.createElement('link');
        l.rel = 'prefetch'; l.href = a.getAttribute('href');
        document.head.appendChild(l);
      }
    });

    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onShow);
    return () => { cancel(); tl?.kill(); document.removeEventListener('click', onClick); window.removeEventListener('pageshow', onShow); };
  }, [lang, rtl]);

  return (
    <div className="lfx" ref={root} aria-hidden="true">
      <div className="lfx-bars">{Array.from({ length: BARS }, (_, k) => <i key={k} className="lfx-bar" />)}</div>
      <div className="lfx-word">
        <span className="lfx-mask">
          {['ar', 'en'].map((l) => (
            <span key={l} data-l={l} className={`lfx-w${l === lang ? ' is-here' : ''}${l === 'en' ? ' lat' : ''}`}>{NAME[l]}</span>
          ))}
        </span>
        <span className="lfx-tag lat">ع <i /> EN</span>
      </div>
    </div>
  );
}
