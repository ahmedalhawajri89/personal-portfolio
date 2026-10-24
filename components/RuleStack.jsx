'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';

const HUES = ['var(--h-ui)', 'var(--h-db)', 'var(--h-test)', 'var(--h-api)', 'var(--h-sec)', 'var(--accent)'];
const pad = (n) => String(n).padStart(2, '0');

/* How he works: six rules as a deck of cards. On a wide screen each card
   sticks below the header and the next one slides over it, while the one
   underneath steps back -- smaller, darker -- so the rule in front is always
   the one being read. Each card carries a small scene that shows its rule
   happening instead of restating it, and the projects the rule came from.

   A scene plays only while its card is the one in front (or, on a phone,
   while it is on screen). The markup is each scene's finished frame, so for
   reduced motion or without script every card is a complete still picture.
   Every label in a scene is code that exists in the projects
   (lockForUpdate, date_of_birth) or a plain word for what it shows. */

// The scenes. Each `art` is the drawing; each `play` returns a looping
// timeline that starts from the drawing's first state.
const scene = (k, V) => [
  // 01 Arabic from the first line: the same card laid out from each side.
  {
    art: (
      <>
        <g className="rs-toggle">
          <rect className="rs-chip" x="60" y="34" width="96" height="30" rx="15" />
          <rect className="rs-knob" x="62" y="36" width="46" height="26" rx="13" />
          <text className="rs-t rs-knob-t" x="85" y="54" textAnchor="middle">EN</text>
          <text className="rs-t rs-other-t" x="132" y="54" textAnchor="middle">AR</text>
        </g>
        <rect className="rs-card" x="60" y="86" width="400" height="214" rx="18" />
        <circle className="rs-fill rs-avatar" cx="112" cy="140" r="26" />
        <rect className="rs-bar rs-b1" x="152" y="124" width="170" height="12" rx="6" />
        <rect className="rs-bar rs-soft rs-b2" x="152" y="146" width="110" height="10" rx="5" />
        <rect className="rs-pill rs-badge" x="362" y="127" width="70" height="28" rx="14" />
        <text className="rs-t rs-num" x="397" y="146" textAnchor="middle">120</text>
        <rect className="rs-bar rs-soft rs-b3" x="88" y="196" width="244" height="10" rx="5" />
        <rect className="rs-bar rs-soft rs-b4" x="88" y="218" width="180" height="10" rx="5" />
        <rect className="rs-btn rs-b5" x="88" y="250" width="110" height="30" rx="8" />
      </>
    ),
    play: (gsap, $) => {
      // Every block moves to its mirrored place; the number keeps reading
      // left to right, because digits do.
      const m = (x, w) => 520 - x - w;
      return gsap.timeline({ repeat: -1, repeatDelay: 0.6, yoyo: true, defaults: { duration: 0.9, ease: 'expo.inOut' } })
        .to($('.rs-knob'), { attr: { x: 108 } }, 0.4)
        .to($('.rs-avatar'), { attr: { cx: 408 } }, 0.4)
        .to($('.rs-b1'), { attr: { x: m(152, 170) } }, 0.45)
        .to($('.rs-b2'), { attr: { x: m(152, 110) } }, 0.5)
        .to($('.rs-badge'), { attr: { x: m(362, 70) } }, 0.4)
        .to($('.rs-num'), { attr: { x: m(362, 70) + 35 } }, 0.4)
        .to($('.rs-b3'), { attr: { x: m(88, 244) } }, 0.55)
        .to($('.rs-b4'), { attr: { x: m(88, 180) } }, 0.6)
        .to($('.rs-b5'), { attr: { x: m(88, 110) } }, 0.65)
        .to({}, { duration: 1.2 });
    },
  },
  // 02 Rules in the data layer: two buyers, one last piece, one lock.
  {
    art: (
      <>
        {[0, 1, 2].map((r) => <rect key={r} className={`rs-row${r === 1 ? ' rs-target' : ''}`} x="170" y={86 + r * 50} width="180" height="38" rx="8" />)}
        <text className="rs-t rs-stock" x="260" y="160" textAnchor="middle">stock: 0</text>
        <g className="rs-lock">
          <rect x="358" y="134" width="20" height="16" rx="4" />
          <path d="M362 134 v-5 a6 6 0 0 1 12 0 v5" />
        </g>
        <circle className="rs-fill rs-buy1" cx="150" cy="155" r="10" />
        <circle className="rs-ink rs-buy2" cx="370" cy="155" r="10" />
        <text className="rs-t rs-ok" x="120" y="122" textAnchor="middle">✓ 200</text>
        <text className="rs-t rs-no" x="430" y="122" textAnchor="middle">✗ 409</text>
        <text className="rs-t rs-code" x="260" y="300" textAnchor="middle">lockForUpdate()</text>
      </>
    ),
    play: (gsap, $) => gsap.timeline({ repeat: -1, repeatDelay: 1 })
      .set($('.rs-stock'), { text: 'stock: 1' })
      .set([$('.rs-ok'), $('.rs-no')], { opacity: 0 })
      .set($('.rs-lock'), { scale: 0, transformOrigin: '50% 50%' })
      .set($('.rs-buy1'), { attr: { cx: 40 } })
      .set($('.rs-buy2'), { attr: { cx: 480 } })
      .to($('.rs-buy1'), { attr: { cx: 158 }, duration: 0.9, ease: 'power2.in' }, 0)
      .to($('.rs-buy2'), { attr: { cx: 362 }, duration: 1.0, ease: 'power2.in' }, 0)
      .to($('.rs-lock'), { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 0.9)
      .to($('.rs-target'), { stroke: 'var(--c)', duration: 0.2 }, 0.9)
      .set($('.rs-stock'), { text: 'stock: 0' }, 1.15)
      .to($('.rs-ok'), { opacity: 1, duration: 0.3 }, 1.15)
      .to($('.rs-buy2'), { attr: { cx: 480 }, duration: 0.7, ease: 'power3.out' }, 1.2)
      .to($('.rs-no'), { opacity: 1, duration: 0.3 }, 1.25)
      .to($('.rs-lock'), { scale: 0, duration: 0.3 }, 2.2)
      .to($('.rs-target'), { stroke: 'var(--line-2)', duration: 0.3 }, 2.2),
  },
  // 03 A test for every rule: the suite fills, one breaks, it is caught.
  {
    art: (
      <>
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} className={`rs-cell${i === 13 ? ' rs-flaky' : ''}`} x={78 + (i % 6) * 62} y={74 + Math.floor(i / 6) * 48} width="48" height="34" rx="7" />
        ))}
        <text className="rs-t rs-big rs-count" x="260" y="300" textAnchor="middle">24/24 ✓</text>
      </>
    ),
    play: (gsap, $, $$) => {
      const cells = $$('.rs-cell');
      const flaky = $('.rs-flaky');
      const count = $('.rs-count');
      const n = { v: 0 };
      return gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(cells, { fill: 'var(--card-2)' })
        .set(n, { v: 0 })
        .to(cells, { fill: 'var(--c)', duration: 0.2, stagger: 0.06 }, 0)
        .to(n, { v: 24, duration: 24 * 0.06, ease: 'none', onUpdate: () => { count.textContent = `${Math.round(n.v)}/24`; } }, 0)
        .set(count, { text: '24/24 ✓' })
        .to(flaky, { fill: 'var(--bad)', duration: 0.2 }, '+=0.8')
        .set(count, { text: '23/24 ✗' }, '<')
        .to(flaky, { scale: 1.12, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 3 }, '<')
        .to(flaky, { fill: 'var(--c)', duration: 0.3 }, '+=0.9')
        .set(count, { text: '24/24 ✓' }, '<');
    },
  },
  // 04 Store the fact, derive the rest: a year goes by.
  {
    art: (
      <>
        <rect className="rs-chip" x="214" y="36" width="92" height="32" rx="16" />
        <text className="rs-t rs-year" x="260" y="57" textAnchor="middle">2027</text>
        <rect className="rs-box" x="40" y="110" width="200" height="86" rx="14" />
        <text className="rs-t rs-key" x="60" y="140">date_of_birth</text>
        <text className="rs-t rs-big" x="60" y="178">2012-05-04</text>
        <text className="rs-t rs-tag" x="60" y="222">{V.stored}</text>
        <path className="rs-arrow" d="M250 153 H300 M292 145 l8 8 l-8 8" />
        <rect className="rs-box rs-hue" x="310" y="110" width="170" height="86" rx="14" />
        <text className="rs-t rs-key" x="330" y="140">age</text>
        <text className="rs-t rs-big rs-age" x="330" y="178">15</text>
        <text className="rs-t rs-tag rs-tag-hue" x="330" y="222">{V.derived}</text>
        <rect className="rs-box rs-ghost" x="310" y="246" width="170" height="64" rx="12" />
        <text className="rs-t rs-key" x="330" y="272">age</text>
        <text className="rs-t rs-stale" x="330" y="298">14</text>
        <path className="rs-strike" d="M326 292 H366" />
      </>
    ),
    play: (gsap, $) => gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
      .set($('.rs-year'), { text: '2026' })
      .set($('.rs-age'), { text: '14' })
      .set($('.rs-strike'), { drawSVG: 0 })
      .set($('.rs-ghost'), { stroke: 'var(--line-2)' })
      .to($('.rs-year'), { scale: 1.15, transformOrigin: '50% 50%', duration: 0.2, yoyo: true, repeat: 1 }, 1)
      .set($('.rs-year'), { text: '2027' }, 1.2)
      .to($('.rs-age'), { duration: 0.5, scrambleText: { text: '15', chars: '0123456789' } }, 1.35)
      .to($('.rs-hue'), { stroke: 'var(--c)', strokeWidth: 3, duration: 0.25, yoyo: true, repeat: 1 }, 1.35)
      .to($('.rs-ghost'), { stroke: 'var(--bad)', duration: 0.3 }, 2.1)
      .to($('.rs-strike'), { drawSVG: '100%', duration: 0.4, ease: 'power2.out' }, 2.2),
  },
  // 05 History is never deleted: a delete is refused, a counter-entry added.
  {
    art: (
      <>
        <rect className="rs-card" x="60" y="40" width="400" height="270" rx="18" />
        <path className="rs-line" d="M60 84 H460" />
        <text className="rs-t rs-key" x="84" y="68">ledger</text>
        <g className="rs-entry">
          <rect className="rs-row" x="84" y="102" width="352" height="44" rx="9" />
          <text className="rs-t rs-plus" x="104" y="130">+500</text>
          <text className="rs-t rs-tag" x="300" y="130">{V.approved}</text>
        </g>
        <g className="rs-rev">
          <rect className="rs-row rs-hue" x="84" y="160" width="352" height="44" rx="9" />
          <text className="rs-t rs-minus" x="104" y="188">−500</text>
          <text className="rs-t rs-tag rs-tag-hue" x="300" y="188">{V.reversal}</text>
        </g>
        <text className="rs-t rs-key" x="84" y="282">= 0</text>
        <g className="rs-del">
          <rect className="rs-btn-bad" x="350" y="250" width="86" height="32" rx="8" />
          <text className="rs-t rs-del-t" x="393" y="271" textAnchor="middle">delete</text>
        </g>
      </>
    ),
    play: (gsap, $) => gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
      .set($('.rs-rev'), { opacity: 0, y: -16 })
      .set($('.rs-del'), { x: 0, y: 0, opacity: 1 })
      .to($('.rs-del'), { x: -40, y: -128, duration: 0.8, ease: 'power2.inOut' }, 0.6)
      .to($('.rs-entry'), { x: 8, duration: 0.07, yoyo: true, repeat: 5 }, 1.45)
      .to($('.rs-del'), { opacity: 0, duration: 0.3 }, 1.9)
      .to($('.rs-rev'), { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 2.1),
  },
  // 06 Works at 500 rows like at 5,000: the rows grow, the time does not.
  {
    art: (
      <>
        <text className="rs-t rs-key" x="60" y="80">{V.rows}</text>
        <text className="rs-t rs-huge rs-rows" x="60" y="150">50,000</text>
        <text className="rs-t rs-key" x="60" y="214">{V.query}</text>
        <rect className="rs-track" x="60" y="228" width="400" height="14" rx="7" />
        <rect className="rs-fill rs-time" x="60" y="228" width="64" height="14" rx="7" />
        <text className="rs-t rs-ms" x="140" y="240">12 ms</text>
        <g className="rs-pages">
          {['‹', '1', '2', '3', '›'].map((p, i) => (
            <g key={i}>
              <rect className={`rs-pg${i === 1 ? ' is-on' : ''}`} x={60 + i * 46} y="276" width="36" height="32" rx="8" />
              <text className="rs-t rs-pg-t" x={78 + i * 46} y="297" textAnchor="middle">{p}</text>
            </g>
          ))}
        </g>
        <text className="rs-t rs-tag" x="460" y="297" textAnchor="end">{V.server}</text>
      </>
    ),
    play: (gsap, $, $$) => {
      const rows = $('.rs-rows');
      const n = { v: 500 };
      const fmt = () => { rows.textContent = Math.round(n.v).toLocaleString('en-US'); };
      const pages = $$('.rs-pg');
      return gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(n, { v: 500, onComplete: fmt })
        .call(fmt)
        .to(n, { v: 5000, duration: 1, ease: 'power2.inOut', onUpdate: fmt }, 0.6)
        .to($('.rs-time'), { scaleX: 1.08, transformOrigin: '0% 50%', duration: 0.2, yoyo: true, repeat: 1 }, 1.6)
        .to(n, { v: 50000, duration: 1, ease: 'power2.inOut', onUpdate: fmt }, 2.1)
        .to($('.rs-time'), { scaleX: 1.08, transformOrigin: '0% 50%', duration: 0.2, yoyo: true, repeat: 1 }, 3.1)
        .to(pages[1], { fill: 'var(--card-2)', duration: 0.2 }, 3.4)
        .to(pages[2], { fill: 'var(--c)', duration: 0.2 }, 3.4)
        .to(pages[2], { fill: 'var(--card-2)', duration: 0.2 }, 4)
        .to(pages[3], { fill: 'var(--c)', duration: 0.2 }, 4)
        .set([pages[3]], { fill: 'var(--card-2)' }, 4.8)
        .set([pages[1]], { fill: 'var(--c)' }, 4.8);
    },
  },
][k];

export default function RuleStack({ rules, origins, V, fromLabel }) {
  const root = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    (async () => {
      const [{ gsap, ScrollTrigger }, { DrawSVGPlugin }, { ScrambleTextPlugin }, { TextPlugin }] = await Promise.all([
        loadMotion(), import('gsap/DrawSVGPlugin'), import('gsap/ScrambleTextPlugin'), import('gsap/TextPlugin'),
      ]);
      gsap.registerPlugin(DrawSVGPlugin, ScrambleTextPlugin, TextPlugin);
      if (gone || !root.current) return;
      const cards = Array.from(root.current.querySelectorAll('.rs-item'));
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, wide: '(min-width: 1024px)' }, (ctx) => {
        const { motion, wide } = ctx.conditions;
        if (!motion) return;
        const cleanups = cards.map((card, k) => {
          const svg = card.querySelector('.rs-scene');
          const $ = (s) => svg.querySelector(s);
          const $$ = (s) => Array.from(svg.querySelectorAll(s));
          const tl = scene(k, V).play(gsap, $, $$);
          tl.pause(0);
          // Plays while the card is the one being read.
          const st = ScrollTrigger.create({
            trigger: card, start: wide ? 'top 70%' : 'top 85%', end: wide ? `bottom ${k === cards.length - 1 ? 'top' : '40%'}` : 'bottom 15%',
            onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
          });
          // On a wide screen the card underneath steps back as the next one
          // slides over it.
          let back = null;
          if (wide && cards[k + 1]) {
            back = gsap.to(card.querySelector('.rs-card-in'), {
              scale: 0.9, filter: 'brightness(0.55)', ease: 'none',
              scrollTrigger: { trigger: cards[k + 1], start: 'top bottom', end: 'top 15%', scrub: true },
            });
          }
          return () => { st.kill(); tl.kill(); back?.scrollTrigger?.kill(); back?.kill(); };
        });
        return () => cleanups.forEach((f) => f());
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [V]);

  return (
    <ol className="rs" ref={root}>
      {rules.map((r, k) => {
        const s = scene(k, V);
        return (
          <li key={r.h} className="rs-item" style={{ '--c': HUES[k], '--k': k }}>
            <div className="rs-card-in">
              <div className="rs-copy">
                <p className="rs-n lat"><b>{pad(k + 1)}</b> / {pad(rules.length)}</p>
                <h3 className="rs-h">{r.h}</h3>
                <p className="rs-b">{r.b}</p>
                {origins[k]?.length > 0 && (
                  <p className="rs-from">
                    <span>{fromLabel}</span>
                    {origins[k].map((o) => (
                      <a key={o.href} href={o.href} style={{ '--p': o.hue }}><i aria-hidden="true" />{o.name}</a>
                    ))}
                  </p>
                )}
              </div>
              <div className="rs-stage">
                <svg className="rs-scene" viewBox="0 0 520 340" aria-hidden="true">{s.art}</svg>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
