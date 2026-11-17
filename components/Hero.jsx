'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK, motionWanted } from '../lib/motion';
import Icon from './Icons';
import HeroScene from './HeroScene';

const HUES = ['var(--h-db)', 'var(--h-api)', 'var(--h-ui)', 'var(--h-test)', 'var(--h-sec)'];

/* The opening: the offer set as large as the screen allows, and set moving.
   The headline arrives in pieces -- letters in English, each with its own
   turn and its own moment, and words in Arabic, because a span between two
   Arabic letters breaks the join -- and settles into a sentence. A mouse
   nudges the pieces it passes over. Scrolling away scatters them again, as
   if the sentence were being taken apart to show what it is made of, which
   is what the page does next.

   The face is variable in both languages -- Bricolage Grotesque in English
   (weight and width), Kufam in Arabic (weight): the claim is set heavy, the
   promise light, and the motion plays on those axes. Once the page is in view a wave runs through the
   headline, each piece taking part of the other line's shape and coming
   back; after that, pieces near the pointer take it again, like a lens
   following the mouse. The pieces are letters in English and whole words in
   Arabic, whose letters must stay joined. Each word keeps the width it was
   set at, so nothing after it moves.

   Under it the five parts of the work in their colours; one is lit at a
   time, and the line under the headline takes its colour. Without script,
   on a phone, or for reduced motion, it is a still sentence. */
export default function Hero({ rtl, status, place, line1, line2, lede, cta1, cta2, parts, stats, children }) {
  const [lit, setLit] = useState(0);
  const root = useRef(null);
  // The picture beside the headline lights the chip of the part it is
  // acting out; a chip, picked, plays that part's act.
  const scene = useRef(null);
  const onAct = useCallback((k) => setLit(k), []);
  const track = useRef(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setLive(true), []);
  const pick = (k) => { setLit(k); setPaused(false); scene.current?.go(k); };
  const toggle = () => setPaused(scene.current?.toggle() ?? false);

  useEffect(() => {
    let mm, gone = false, splits = [];
    if (!motionWanted()) return;
    const html = document.documentElement;
    // The entrance plays only while the page is still covered -- by the
    // intro on a first visit, or by the curtain from another page -- so the
    // headline is never seen, hidden and shown again. Otherwise it is simply
    // there when the page opens.
    const covered = () => html.classList.contains('intro') || html.classList.contains('curtain-in');
    const uncovered = () => new Promise((res) => {
      const mo = new MutationObserver(() => { if (!covered()) { mo.disconnect(); res(); } });
      mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    });

    (async () => {
      const { gsap, SplitText } = await loadMotion();
      if (gone || !root.current) return;
      const el = root.current;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const lines = el.querySelectorAll('.kh-line');
        splits = Array.from(lines).map((ln) => SplitText.create(ln, rtl
          ? { type: 'words', wordsClass: 'kh-u', aria: 'hidden' }
          : { type: 'words,chars', charsClass: 'kh-u', aria: 'hidden' }));
        const units = splits.flatMap((s) => (rtl ? s.words : s.chars));
        const rand = gsap.utils.random;
        gsap.set(units, { display: 'inline-block', willChange: 'transform' });

        // Each piece rests in its line's shape and is pulled part of the way
        // towards the other line's -- the heavy line thins, the light one
        // fills -- far enough to read as a change, not so far that a word
        // outgrows the width it was set at. --s is width in English; the
        // Arabic face has weight alone.
        const AXES = rtl ? {
          heavy: { rest: { w: 900, s: 0 }, pull: { w: 700, s: 0 } },
          light: { rest: { w: 400, s: 0 }, pull: { w: 560, s: 0 } },
        } : {
          heavy: { rest: { w: 800, s: 100 }, pull: { w: 620, s: 100 } },
          light: { rest: { w: 300, s: 80 }, pull: { w: 640, s: 75 } },
        };
        const shapes = units.map((u) => ({ u, ...AXES[u.closest('.is-soft') ? 'light' : 'heavy'] }));
        // Words keep the width they were set at, measured once the face has
        // loaded, so a letter changing shape cannot push the next word along.
        // The width is kept in em, so it follows the headline when the
        // window changes size (the headline is sized by width and height).
        const lockWords = () => splits.forEach((s) => s.words.forEach((w) => {
          w.style.width = '';
          const fs = parseFloat(getComputedStyle(w).fontSize) || 1;
          // offsetWidth is the laid-out width: a letter still turned from the
          // entrance would make the box, and the gap after the word, wider.
          w.style.width = `${(w.offsetWidth / fs).toFixed(4)}em`;
          w.style.whiteSpace = 'nowrap';
        }));
        const wave = () => {
          if (!shapes.length) return;
          gsap.timeline()
            .to(shapes.map((x) => x.u), {
              '--w': (i) => shapes[i].pull.w, '--s': (i) => shapes[i].pull.s,
              duration: rtl ? 0.6 : 0.45, ease: 'sine.inOut', stagger: { each: rtl ? 0.12 : 0.028, from: 'start' },
              yoyo: true, repeat: 1,
            });
        };
        if (covered()) {
          gsap.set(units, { yPercent: 120, rotation: () => rand(-28, 28), opacity: 0 });
          gsap.set(el.querySelectorAll('.kh-reveal'), { opacity: 0, y: 24 });
          uncovered().then(() => {
            if (gone) return;
            // Measured again now the page is uncovered: under the intro the
            // words are laid out before the face has settled, and come out wide.
            lockWords();
            gsap.to(units, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: { each: rtl ? 0.08 : 0.022, from: 'start' }, delay: 0.1, onComplete: wave });
            gsap.to(el.querySelectorAll('.kh-reveal'), { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: rtl ? 0.7 : 0.9 });
          });
        }
        (rtl ? document.fonts.load("900 1em 'Kufam'", 'أبني') : document.fonts.load("800 1em 'Bricolage'")).then(() => {
          if (gone) return;
          lockWords();
          if (!covered()) gsap.delayedCall(0.35, wave);
        });

        // Scrolling away takes the sentence apart.
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.8 } })
          .to(units, { y: () => rand(-160, 160), x: () => rand(-50, 50), rotation: () => rand(-45, 45), opacity: 0.12, ease: 'none', stagger: { each: 0.01, from: 'random' } }, 0)
          .to(el.querySelectorAll('.kh-reveal'), { y: -40, opacity: 0, ease: 'none' }, 0);

        // And again whenever the window changes size.
        let relock;
        const onResize = () => { clearTimeout(relock); relock = setTimeout(lockWords, 150); };
        window.addEventListener('resize', onResize);

        let off = () => {};
        if (pointer) {
          // The lens. Letter centres are read when the pointer arrives, not on
          // every move; each letter eases towards its share of the pull.
          const h = el.querySelector('.kh-h');
          const to = shapes.map(({ u }) => ({
            w: gsap.quickTo(u, '--w', { duration: 0.5, ease: 'power3' }),
            s: gsap.quickTo(u, '--s', { duration: 0.5, ease: 'power3' }),
          }));
          let centres = [];
          const read = () => { centres = shapes.map(({ u }) => { const r = u.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
          const move = (e) => {
            const reach = parseFloat(getComputedStyle(h).fontSize) * (rtl ? 1.8 : 1.3);
            shapes.forEach((x, k) => {
              const [cx, cy] = centres[k] || [0, 0];
              const f = Math.max(0, 1 - Math.hypot(e.clientX - cx, (e.clientY - cy) * 1.6) / reach);
              to[k].w(x.rest.w + (x.pull.w - x.rest.w) * f);
              to[k].s(x.rest.s + (x.pull.s - x.rest.s) * f);
            });
          };
          const rest = () => shapes.forEach((x, k) => { to[k].w(x.rest.w); to[k].s(x.rest.s); });
          h.addEventListener('pointerenter', read);
          h.addEventListener('pointermove', move);
          h.addEventListener('pointerleave', rest);
          off = () => { h.removeEventListener('pointerenter', read); h.removeEventListener('pointermove', move); h.removeEventListener('pointerleave', rest); };
        }

        return () => { off(); window.removeEventListener('resize', onResize); clearTimeout(relock); splits.forEach((s) => s.revert()); splits = []; };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [rtl]);

  return (
    <div className="kh" ref={root} style={{ '--hue': HUES[lit] }}>
      <div className="kh-main">
      <div className="kh-top kh-reveal">
        <p className="hx-status">
          <span className="hx-live" aria-hidden="true" />
          {status}<span aria-hidden="true">·</span><span className="hx-place">{place}</span>
        </p>
        <p className="kh-role lat">Laravel · PHP · MySQL · Vue 3</p>
      </div>

      <h1 className="kh-h" aria-label={`${line1} ${line2}`}>
        <span className="kh-line">{line1}</span>
        <span className="kh-line is-soft">{line2}</span>
      </h1>

      {/* One column under the headline: what he builds, the two actions,
          then the five layers the headline's bar walks through. */}
      <div className="kh-foot">
        <div className="kh-copy kh-reveal">
          {/* What he builds, said by him. */}
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

        {/* The five parts as one control: the picture beside plays them in
            turn, the lit one fills as its act runs, and any one can be
            picked. The motion can be stopped -- anything that moves on its
            own for more than five seconds must offer that. */}
        <div className="kh-play kh-reveal">
          <ul className="kh-parts" ref={track} aria-label={parts.join(rtl ? '، ' : ', ')}>
            {parts.map((p, k) => (
              <li key={p} className={k === lit ? 'is-on' : ''} style={{ '--c': HUES[k] }}>
                <button type="button" aria-pressed={k === lit} onClick={() => pick(k)}><i aria-hidden="true" />{p}</button>
              </li>
            ))}
          </ul>
          {live && (
            <button type="button" className="kh-pause" onClick={toggle}
              aria-label={paused ? (rtl ? 'تشغيل الحركة' : 'Play the animation') : (rtl ? 'إيقاف الحركة' : 'Pause the animation')}>
              {paused
                ? <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
                : <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2.5" width="3.6" height="11" rx="1" fill="currentColor" /><rect x="9.4" y="2.5" width="3.6" height="11" rx="1" fill="currentColor" /></svg>}
            </button>
          )}
        </div>
      </div>

      {stats?.length > 0 && <ul className="hx-stats kh-reveal">
        {stats.map((s) => (
          <li key={s.l}>
            <span className="lat">{s.n}{s.suffix || ''}</span>
            <small>{s.l}</small>
          </li>
        ))}
      </ul>}
      </div>
      <div className="kh-scene"><HeroScene onAct={onAct} onReady={onReady} api={scene} track={track} /></div>
    </div>
  );
}
