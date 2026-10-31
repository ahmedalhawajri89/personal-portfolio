'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

const HUES = ['var(--h-ui)', 'var(--h-api)', 'var(--h-db)', 'var(--h-test)', 'var(--h-sec)'];
const CODE = ["Route::post('/orders')", 'DB::transaction(fn () =>', '  ->lockForUpdate())'];

/* Behind the screen: one order, seen from further and further in. A single
   window holds still while the scroll lifts its screen away, one layer at a
   time: the button, the server that takes the order, the row it locks, the
   tests that keep the rule, and the door that turns a stranger away. Each layer
   is named large beside the window, in its own colour, and plays as it lands.
   The tabs on the window jump straight to a layer.

   Only on a wide screen with motion allowed. On a phone, or for reduced motion,
   the layers are a plain list: the markup is each one's finished frame. */

// What each layer plays when it lands. Each returns a timeline from its first
// state to the finished frame in the markup.
const plays = [
  // The button, waiting to be pressed.
  (gsap, $) => gsap.timeline({ repeat: -1, repeatDelay: 1.3 })
    .to($('.bs-buy'), { scale: 0.96, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 0)
    .fromTo($('.bs-ping'), { scale: 0.9, opacity: 0.8 }, { scale: 1.32, opacity: 0, duration: 1, ease: 'power2.out' }, 0.1),
  // The order written out, down to the line that takes the lock.
  (gsap, $, $$) => gsap.timeline()
    .fromTo($$('.bs-ln'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, stagger: 0.4, ease: 'steps(18)' })
    .fromTo($('.bs-key'), { opacity: 0 }, { opacity: 1, duration: 0.35 }),
  // The row is locked, the last piece goes, and nobody else can take it.
  (gsap, $) => {
    const stock = $('.bs-stock');
    return gsap.timeline()
      .call(() => { stock.textContent = '1'; }, null, 0)
      .fromTo($('.bs-hit'), { '--hit': 0 }, { '--hit': 1, duration: 0.3 }, 0.25)
      .fromTo($('.bs-lock'), { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 0.4)
      .call(() => { stock.textContent = '0'; }, null, 1.1)
      .fromTo(stock, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, 1.1)
      .fromTo($('.bs-kept'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 1.3);
  },
  // The suite runs and the count climbs to the real total.
  (gsap, $, $$) => {
    const sum = $('.bs-sum b');
    const total = Number(sum.dataset.n);
    const n = { v: 0 };
    return gsap.timeline()
      .fromTo($$('.bs-test'), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.28 }, 0)
      .fromTo($$('.bs-tick'), { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.28, ease: 'back.out(3)' }, 0.2)
      .fromTo($('.bs-sum'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9)
      .fromTo(n, { v: 0 }, { v: total, duration: 1, ease: 'power2.out', onUpdate: () => { sum.textContent = Math.round(n.v).toLocaleString('en-US'); } }, 0.9);
  },
  // One request goes through the door, one is sent back from it.
  (gsap, $) => gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    .set([$('.bs-200'), $('.bs-403')], { opacity: 0 }, 0)
    .fromTo($('.bs-in-dot'), { attr: { cx: 500 } }, { attr: { cx: 150 }, duration: 1.1, ease: 'power1.inOut' }, 0)
    .to($('.bs-200'), { opacity: 1, duration: 0.3 }, 1)
    .fromTo($('.bs-out-dot'), { attr: { cx: 500 } }, { attr: { cx: 322 }, duration: 0.7, ease: 'power2.in' }, 1.3)
    .fromTo($('.bs-wall'), { strokeWidth: 3 }, { strokeWidth: 7, duration: 0.14, yoyo: true, repeat: 1 }, 2)
    .to($('.bs-out-dot'), { attr: { cx: 440 }, duration: 0.7, ease: 'power3.out' }, 2)
    .to($('.bs-403'), { opacity: 1, duration: 0.25 }, 2.05),
];

function Pane({ k, ui, tests, total, passed, outside }) {
  if (k === 0) return (
    <div className="bs-in bs-shop">
      <svg className="bs-chair" viewBox="0 0 150 124" aria-hidden="true">
        <path d="M26 12 L56 80 H116 M46 56 H104 M56 80 L42 114 M116 80 L128 114" />
      </svg>
      <p className="bs-name">{ui.item}</p>
      <p className="bs-left">{ui.left}</p>
      <span className="bs-press">
        <i className="bs-ping" />
        <span className="bs-buy">{ui.add}</span>
      </span>
      <p className="bs-cap lat">Vue · Blade</p>
    </div>
  );
  if (k === 1) return (
    <div className="bs-in bs-code lat">
      {CODE.map((c, i) => <code key={c} className={`bs-ln${i === 2 ? ' is-key' : ''}`}>{c}</code>)}
      <p className="bs-note bs-key">{ui.lock}</p>
      <p className="bs-cap">Laravel API</p>
    </div>
  );
  if (k === 2) return (
    <div className="bs-in bs-db lat">
      <div className="bs-tbl">
        <span className="bs-th">id</span><span className="bs-th">name</span><span className="bs-th">stock</span>
        {[41, 42, 43].map((id, r) => (
          <div key={id} className={`bs-row${r === 1 ? ' bs-hit' : ''}`}>
            <span>{id}</span>
            <span><i style={{ width: `${[70, 88, 58][r]}%` }} /></span>
            {r === 1 ? <b className="bs-stock">0</b> : <span>{r ? 7 : 3}</span>}
            {r === 1 && (
              <svg className="bs-lock" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="3" />
                <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="bs-note bs-kept">{ui.reserved}</p>
      <p className="bs-cap">MySQL</p>
    </div>
  );
  if (k === 3) return (
    <div className="bs-in bs-tests lat">
      <p className="bs-cmd">$ php artisan test</p>
      <ul>
        {tests.map((f) => (
          <li key={f} className="bs-test">
            <span className="bs-tick"><Icon name="check" size={13} /></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <p className="bs-sum"><b data-n={total}>{total.toLocaleString('en-US')}</b> {passed}</p>
    </div>
  );
  return (
    <div className="bs-in bs-door">
      <svg viewBox="0 0 560 300" aria-hidden="true">
        <path className="bs-lane" d="M40 96 H520" />
        <path className="bs-lane" d="M40 214 H520" />
        <path className="bs-wall" d="M310 24 V276" />
        <circle className="bs-in-dot" cx="150" cy="96" r="11" />
        <circle className="bs-out-dot" cx="440" cy="214" r="11" />
        <text className="bs-200" x="104" y="74" textAnchor="middle">200</text>
        <text className="bs-403" x="440" y="186" textAnchor="middle">403</text>
        <text className="bs-out-t" x="520" y="252" textAnchor="end">{outside}</text>
      </svg>
    </div>
  );
}

export default function BehindScreen({ parts, ui, tests, total, passed, outside, jumpLabel }) {
  const root = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    (async () => {
      const { gsap, ScrollTrigger, lenis } = await loadMotion();
      if (gone || !root.current) return;
      const el = root.current;
      const items = Array.from(el.querySelectorAll('.bs-part'));
      const make = items.map((item, k) => () => plays[k](gsap, (x) => item.querySelector(x), (x) => Array.from(item.querySelectorAll(x))));

      mm = gsap.matchMedia();

      // The window.
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const panes = items.map((x) => x.querySelector('.bs-pane'));
        const heads = items.map((x) => x.querySelector('.bs-h'));
        const says = items.map((x) => x.querySelector('.bs-b'));
        const tabs = Array.from(el.querySelectorAll('.bs-tab'));
        const edge = el.querySelector('.bs-edge');
        const scenes = make.map((f) => f().pause(0));

        gsap.set(heads.slice(1), { yPercent: 116 });
        gsap.set(says.slice(1), { y: 22, autoAlpha: 0 });
        gsap.set(edge, { yPercent: 100, autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        panes.slice(0, -1).forEach((pane, k) => {
          const at = k + 0.25;
          const lift = { duration: 0.7, ease: 'power2.inOut' };
          tl.set(edge, { '--c': HUES[k + 1], yPercent: 100 }, at)
            .to(edge, { autoAlpha: 1, duration: 0.04 }, at)
            .fromTo(pane, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', ...lift }, at)
            .to(edge, { yPercent: 0, ...lift }, at)
            .to(edge, { autoAlpha: 0, duration: 0.04 }, at + 0.68)
            .fromTo(panes[k + 1].firstChild, { scale: 0.94, opacity: 0.3 }, { scale: 1, opacity: 1, ...lift }, at)
            .to(heads[k], { yPercent: -116, duration: 0.34, ease: 'power2.in' }, at)
            .to(says[k], { y: -18, autoAlpha: 0, duration: 0.26 }, at)
            .to(heads[k + 1], { yPercent: 0, duration: 0.42, ease: 'power3.out' }, at + 0.34)
            .to(says[k + 1], { y: 0, autoAlpha: 1, duration: 0.34, ease: 'power2.out' }, at + 0.44);
        });
        tl.to({}, { duration: 0.3 });

        // Which layer is showing drives the tabs and its scene.
        let on = -1;
        const land = (i) => {
          if (i === on) return;
          on = i;
          tabs.forEach((t, k) => {
            t.classList.toggle('is-on', k === i);
            if (k === i) t.setAttribute('aria-current', 'step');
            else t.removeAttribute('aria-current');
          });
          scenes.forEach((t, k) => { if (k === i) t.restart(); else t.pause(); });
        };
        land(0);

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          animation: tl,
          scrub: true,
          onUpdate: () => land(Math.min(items.length - 1, Math.floor(tl.time() + 0.6))),
          onToggle: (self) => {
            if (self.isActive) scenes[on]?.play();
            else scenes.forEach((t) => t.pause());
          },
        });
        scenes[0].pause();

        const jump = tabs.map((t, k) => {
          const go = () => {
            const y = st.start + (k / tl.duration()) * (st.end - st.start);
            if (lenis) lenis.scrollTo(y, { duration: 1.2 });
            else window.scrollTo({ top: y, behavior: 'smooth' });
          };
          t.addEventListener('click', go);
          return () => t.removeEventListener('click', go);
        });

        return () => {
          jump.forEach((f) => f());
          st.kill();
          tl.kill();
          scenes.forEach((t) => t.kill());
        };
      });

      // The list: each layer plays while it is on screen.
      mm.add(`${MOTION_OK} and (max-width: 1023.98px)`, () => {
        const made = items.map((item, k) => {
          const t = make[k]().pause(0);
          const st = ScrollTrigger.create({
            trigger: item.querySelector('.bs-pane'),
            start: 'top 82%',
            end: 'bottom 12%',
            onToggle: (self) => (self.isActive ? t.play() : t.pause()),
          });
          return () => { st.kill(); t.kill(); };
        });
        return () => made.forEach((f) => f());
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, []);

  return (
    <div className="bs" ref={root} style={{ '--n': parts.length }}>
      <div className="bs-stage">
        <div className="bs-grid">
          <div className="bs-frame">
            <nav className="bs-tabs" aria-label={jumpLabel}>
              {parts.map((p, k) => <button key={p.h} type="button" className="bs-tab" style={{ '--c': HUES[k] }}>{p.h}</button>)}
            </nav>
          </div>
          <i className="bs-edge" aria-hidden="true" />
          <ol className="bs-list">
            {parts.map((p, k) => (
              <li key={p.h} className="bs-part" style={{ '--c': HUES[k], '--k': k }}>
                <div className="bs-copy">
                  <div className="bs-mask"><h3 className="bs-h">{p.h}</h3></div>
                  <p className="bs-b">{p.b}</p>
                </div>
                <div className="bs-pane" aria-hidden="true">
                  <Pane k={k} ui={ui} tests={tests} total={total} passed={passed} outside={outside} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
