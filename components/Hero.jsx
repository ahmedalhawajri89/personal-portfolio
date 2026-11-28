'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK, motionWanted } from '../lib/motion';
import Icon from './Icons';

/* The opening: the offer, and the offer at work. Four of its words do what
   they say:

     build  -- is a button, and a cursor comes and presses it
     system -- is laid on the three layers it is made of: data, server,
               interface
     test   -- fails first, a red line under it and a shake, then passes:
               the line turns green and a tick lands
     see    -- is selected, the way text is on a screen

   and the sentence ends on a text cursor. It plays once as the page opens
   and rests on its finished frame; a word, touched, plays its part again.

   The markup is the finished frame -- pressed, layered, passed, selected --
   so without script, on a phone or for reduced motion the sentence is
   complete and still. Arabic is never split into letters: the four words
   are found whole and wrapped whole. */

const ROLES = {
  en: { build: 'build', system: 'system', test: 'test', see: 'see' },
  ar: { build: 'أبني', system: 'النظام', test: 'وأختبره', see: 'تراه' },
};

function Word({ role, children }) {
  switch (role) {
    case 'build':
      return <span className="kw kw-btn" data-role="build"><i className="kw-fill" /><i className="kw-rip" /><span className="kw-t">{children}</span></span>;
    case 'system':
      return <span className="kw kw-sys" data-role="system"><b className="kw-l kw-l1" /><b className="kw-l kw-l2" /><b className="kw-l kw-l3" /><span className="kw-t">{children}</span></span>;
    case 'test':
      return (
        <span className="kw kw-test" data-role="test">
          <span className="kw-t">{children}</span>
          <svg className="kw-lines" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            <path className="kw-sq" pathLength="1" d="M2 10 q6 -9 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" />
            <path className="kw-ok" pathLength="1" d="M2 10 H98" />
          </svg>
          <i className="kw-badge" aria-hidden="true" />
        </span>
      );
    case 'see':
      return <span className="kw kw-see" data-role="see"><i className="kw-sel" /><span className="kw-t">{children}</span></span>;
    default:
      return children;
  }
}

// A line of the headline with its working words wrapped. Words are matched
// whole, with any punctuation left outside the wrapper.
function Line({ text, roles }) {
  const byWord = Object.fromEntries(Object.entries(roles).map(([r, w]) => [w, r]));
  return text.split(' ').map((w, i, all) => {
    const m = w.match(/^(.*?)([،,.]*)$/);
    const role = byWord[m[1]];
    const sp = i < all.length - 1 ? ' ' : '';
    return role
      ? <span key={i}><Word role={role}>{m[1]}</Word>{m[2]}{sp}</span>
      : <span key={i}>{w}{sp}</span>;
  });
}

export default function Hero({ rtl, status, place, line1, line2, lede, cta1, cta2, children }) {
  const root = useRef(null);

  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    const html = document.documentElement;
    const covered = () => html.classList.contains('intro') || html.classList.contains('curtain-in');

    (async () => {
      const { gsap } = await loadMotion();
      if (gone || !root.current) return;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const el = root.current;
        const q = (s) => el.querySelector(s);
        const cur = q('.kh-cur');
        const W = {
          build: q('[data-role="build"]'), system: q('[data-role="system"]'),
          test: q('[data-role="test"]'), see: q('[data-role="see"]'),
        };

        // Where the cursor goes: a point on the word, in the hero's own space.
        const spot = (w, dy = 0.75) => {
          const a = el.getBoundingClientRect(), r = w.getBoundingClientRect();
          return { x: r.left - a.left + r.width * 0.55, y: r.top - a.top + r.height * dy };
        };

        // Each word's part, from its blank state to its finished one.
        const parts = {
          build: () => {
            const w = W.build;
            return gsap.timeline()
              .set(w.querySelector('.kw-fill'), { scaleX: 0 })
              .set(w, { '--on': 0 })
              .to(w, { scale: 0.93, duration: 0.1, ease: 'power2.in' })
              .fromTo(w.querySelector('.kw-rip'), { scale: 0, opacity: 1 }, { scale: 7, opacity: 0, duration: 0.6, ease: 'power2.out' }, '<')
              .to(w.querySelector('.kw-fill'), { scaleX: 1, duration: 0.45, ease: 'power3.out' }, '<')
              .to(w, { '--on': 1, duration: 0.2 }, '<0.1')
              .to(w, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' }, '<');
          },
          system: () => {
            const w = W.system;
            return gsap.timeline()
              .set(w.querySelectorAll('.kw-l'), { scaleX: 0 })
              .set(w, { '--on': 0 })
              .to(w.querySelectorAll('.kw-l'), { scaleX: 1, duration: 0.55, ease: 'expo.out', stagger: 0.14 })
              .to(w, { '--on': 1, duration: 0.3 }, '-=0.35');
          },
          test: () => {
            const w = W.test;
            return gsap.timeline()
              .set(w.querySelector('.kw-sq'), { strokeDashoffset: 1, opacity: 1 })
              .set(w.querySelector('.kw-ok'), { strokeDashoffset: 1 })
              .set(w.querySelector('.kw-badge'), { scale: 0 })
              .to(w.querySelector('.kw-sq'), { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' })
              .to(w.querySelector('.kw-t'), { x: rtl ? 6 : -6, duration: 0.06, yoyo: true, repeat: 5 })
              .to(w.querySelector('.kw-sq'), { opacity: 0, duration: 0.25 }, '+=0.3')
              .to(w.querySelector('.kw-ok'), { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' })
              .to(w.querySelector('.kw-badge'), { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '<0.2');
          },
          see: () => gsap.timeline()
            .set(W.see.querySelector('.kw-sel'), { scaleX: 0 })
            .to(W.see.querySelector('.kw-sel'), { scaleX: 1, duration: 0.5, ease: 'power2.out' }),
        };
        const order = ['build', 'system', 'test', 'see'].filter((k) => W[k]);

        // Clear every word to blank, then play them in turn with the cursor
        // travelling from one to the next.
        const blank = () => {
          gsap.set(el.querySelectorAll('.kw-fill, .kw-l, .kw-sel'), { scaleX: 0 });
          gsap.set(el.querySelectorAll('.kw-btn, .kw-sys'), { '--on': 0 });
          gsap.set(el.querySelectorAll('.kw-sq, .kw-ok'), { strokeDashoffset: 1 });
          gsap.set(el.querySelectorAll('.kw-badge'), { scale: 0 });
        };
        const show = () => {
          const tl = gsap.timeline();
          const start = spot(W[order[0]]);
          tl.set(cur, { x: start.x + (rtl ? -260 : 260), y: start.y + 180, opacity: 0 })
            .to(cur, { opacity: 1, duration: 0.25 });
          order.forEach((k, i) => {
            const p = spot(W[k]);
            tl.to(cur, { x: p.x, y: p.y, duration: i ? 0.65 : 0.85, ease: 'power3.inOut' }, i ? '+=0.25' : '>')
              .add(parts[k]());
          });
          tl.to(cur, { opacity: 0, duration: 0.35 }, '+=0.5');
          return tl;
        };

        let running = null;
        if (covered()) {
          blank();
          gsap.set(el.querySelectorAll('.kh-line'), { yPercent: 40, opacity: 0 });
          gsap.set(el.querySelectorAll('.kh-reveal'), { y: 24, opacity: 0 });
          const mo = new MutationObserver(() => {
            if (covered()) return;
            mo.disconnect();
            gsap.to(el.querySelectorAll('.kh-line'), { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1 });
            gsap.to(el.querySelectorAll('.kh-reveal'), { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.35 });
            running = gsap.delayedCall(0.7, () => { running = show(); });
          });
          mo.observe(html, { attributes: true, attributeFilter: ['class'] });
          ctx.add(() => () => mo.disconnect());
        } else {
          // Already open: the finished sentence is on screen, so it is
          // cleared word by word only as the cursor reaches each one (each
          // part starts from its own blank state).
          running = gsap.delayedCall(0.5, () => { running = show(); });
        }

        // A word, touched, plays its part again.
        let off = () => {};
        if (pointer) {
          const busy = new WeakMap();
          const offs = order.map((k) => {
            const w = W[k];
            const go = () => {
              if (running?.isActive?.() || busy.get(w)?.isActive()) return;
              busy.set(w, parts[k]());
            };
            w.addEventListener('pointerenter', go);
            return () => w.removeEventListener('pointerenter', go);
          });
          off = () => offs.forEach((f) => f());
        }

        // Scrolling away, the sentence lifts and fades a little.
        gsap.to(el.querySelector('.kh-h'), {
          yPercent: -12, opacity: 0.35, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
        });

        return () => { off(); running?.kill?.(); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  const roles = ROLES[rtl ? 'ar' : 'en'];
  return (
    <div className="kh kh-words" ref={root}>
      <div className="kh-top kh-reveal">
        <p className="hx-status">
          <span className="hx-live" aria-hidden="true" />
          {status}<span aria-hidden="true">·</span><span className="hx-place">{place}</span>
        </p>
        <p className="kh-role lat">Laravel · PHP · MySQL · Vue 3</p>
      </div>

      <h1 className="kh-h" aria-label={`${line1} ${line2}`}>
        <span className="kh-line" aria-hidden="true"><Line text={line1} roles={roles} /></span>{' '}
        <span className="kh-line is-soft" aria-hidden="true"><Line text={line2} roles={roles} /><i className="kh-caret" /></span>
      </h1>

      <div className="kh-foot">
        <div className="kh-copy kh-reveal">
          <div className="kh-say">
            <img className="kh-face" src="/ahmed.webp" alt="" width="56" height="56" decoding="async" />
            <p className="kh-lede">{lede}</p>
          </div>
          <div className="hx-ctas">
            <a href="#work" className="btn btn-primary hx-cta" data-magnetic>{cta1} <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={16} /></a>
            <a href="#contact" className="btn btn-ghost" data-magnetic>{cta2}</a>
            {children}
          </div>
        </div>
      </div>

      <svg className="kh-cur" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
        <path d="M5 3l16 9-7 2-3 7z" />
      </svg>
    </div>
  );
}
