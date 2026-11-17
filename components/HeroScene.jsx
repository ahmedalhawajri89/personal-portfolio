'use client';

import { useEffect, useRef } from 'react';
import { loadMotion, MOTION_OK, POINTER_OK, motionWanted } from '../lib/motion';

/* The hero's picture: the headline acted out. Five characters, one for each
   part of the work and in its colour, build one screen together and check
   it before anyone else sees it:

     Database  -- a cylinder that pumps rows up into the list
     Server    -- a cube that throws requests and gets its 200 back
     Interface -- rides the top of the window and paints the cards in
     Tests     -- sweeps a lens over the work and stamps each part
     Security  -- swats away the bug that tries to get in

   One act at a time, in the order of the chips under the headline, and the
   lit chip follows the act (onAct). A chip or a character, clicked, starts
   its own act. Eyes follow a mouse; characters blink, breathe and hop when
   touched.

   The markup is the finished frame -- everything built, checked and
   guarded -- so without script, on a phone or for reduced motion, the
   picture is complete and still. */

const PARTS = ['db', 'api', 'ui', 'test', 'sec'];

function Face({ x, y, mood = 'smile' }) {
  return (
    <g className="hs-face">
      <g className="hs-eyes">
        {[-10, 10].map((dx) => (
          <g key={dx}>
            <ellipse className="hs-eye" cx={x + dx} cy={y} rx="6.6" ry="7.6" />
            <circle className="hs-pupil" cx={x + dx} cy={y + 1} r="3.4" data-x={x + dx} data-y={y + 1} />
          </g>
        ))}
      </g>
      <circle className="hs-cheek" cx={x - 17} cy={y + 10} r="4.2" />
      <circle className="hs-cheek" cx={x + 17} cy={y + 10} r="4.2" />
      {mood === 'o'
        ? <ellipse className="hs-mouth-o" cx={x} cy={y + 14} rx="3.4" ry="4" />
        : <path className="hs-mouth" d={`M${x - 6} ${y + 12} q6 6 12 0`} />}
    </g>
  );
}

export default function HeroScene({ onAct, onReady, api, track }) {
  const svg = useRef(null);

  useEffect(() => {
    if (!motionWanted()) return;
    let gone = false, mm;
    const html = document.documentElement;
    const covered = () => html.classList.contains('intro') || html.classList.contains('curtain-in');

    (async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !svg.current) return;
      mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, pointer: POINTER_OK }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        const el = svg.current;
        const q = gsap.utils.selector(el);
        const one = (s) => q(s)[0];
        const body = (k) => one(`.hs-${k} .hs-body`);
        const rand = gsap.utils.random;

        const rows = q('.hs-row');
        const checks = q('.hs-ok');
        const pill = one('.hs-pill');
        const wipes = q('.hs-wipe');
        const mover = one('.hs-ui .hs-move');
        const lens = one('.hs-lens');
        const bug = one('.hs-bug');
        const shield = one('.hs-shield');
        const armThrow = one('.hs-api-throw');
        const antenna = one('.hs-antenna');

        gsap.set(rows, { transformOrigin: '0% 50%' });
        gsap.set([...checks, pill], { transformOrigin: '50% 50%' });
        gsap.set(shield, { svgOrigin: '548 330' });
        gsap.set(armThrow, { svgOrigin: '480 448' });
        PARTS.forEach((k) => gsap.set(body(k), { transformOrigin: '50% 100%' }));

        // Something carried along a drawn path: a row token or a request.
        const along = (node, path, vars) => {
          const len = path.getTotalLength();
          const o = { p: 0 };
          const put = () => { const pt = path.getPointAtLength(o.p * len); gsap.set(node, { x: pt.x, y: pt.y }); };
          return gsap.fromTo(o, { p: 0 }, {
            p: 1, ease: 'power1.inOut', ...vars,
            onStart: () => { gsap.set(node, { opacity: 1 }); put(); },
            onUpdate: put,
            onComplete: () => gsap.set(node, { opacity: 0 }),
          });
        };
        const squash = (k, at, tl) => tl
          .to(body(k), { scaleY: 0.84, scaleX: 1.1, duration: 0.14, ease: 'power1.in' }, at)
          .to(body(k), { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1,0.35)' });
        const hop = (k, h, tl, at) => tl
          .to(body(k), { y: -h, scaleY: 1.08, scaleX: 0.94, duration: 0.24, ease: 'power2.out' }, at)
          .to(body(k), { y: 0, scaleY: 1, scaleX: 1, duration: 0.5, ease: 'bounce.out' });

        const tl = gsap.timeline({ repeat: -1, paused: true });
        const act = (k) => tl.addLabel(`a${k}`).call(() => onAct?.(k));

        // Clear the screen for the next build. The painter walks back to the
        // start of the first card while the work fades.
        tl.addLabel('reset')
          .to([...rows, pill, ...checks], { opacity: 0, duration: 0.4 }, 'reset')
          .to(wipes, { attr: { width: 0 }, duration: 0.4, ease: 'power2.in' }, 'reset')
          .to(mover, { x: 114, duration: 1, ease: 'power2.inOut' }, 'reset')
          .set(rows, { scaleX: 0, opacity: 1 })
          .set([...checks, pill], { scale: 0, opacity: 1 })
          .set(bug, { x: 700, y: 150, rotation: 0, opacity: 0 });

        // Database: three pumps, three rows.
        act(0);
        const toRow = one('.hs-path-db');
        q('.hs-tok').forEach((tok, i) => {
          squash('db', `>${i ? -0.25 : 0.1}`, tl);
          tl.add(along(tok, toRow, { duration: 0.6 }), '<0.1')
            .to(rows[i], { scaleX: 1, duration: 0.45, ease: 'power3.out' }, '>-0.05');
        });

        // Server: the arm winds up, three requests go out, the answer is 200.
        act(1);
        const toCard = one('.hs-path-api');
        q('.hs-pk').forEach((pk, i) => {
          tl.to(armThrow, { rotation: -38, duration: 0.18, ease: 'power2.in' }, i ? '>-0.35' : '>0.15')
            .to(armThrow, { rotation: 0, duration: 0.35, ease: 'back.out(3)' })
            .to(antenna, { scale: 1.6, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, '<')
            .add(along(pk, toCard, { duration: 0.7 }), '<');
        });
        tl.to(pill, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, '>-0.1');
        hop('api', 24, tl, '<');

        // Interface: the brush's tip is the edge of the paint.
        act(2);
        [0, 1].forEach((i) => {
          const from = i ? 298 : 114;
          tl.to(mover, { x: from, y: -10, duration: 0.25, ease: 'power2.out' }, i ? '>' : '>0.1')
            .to(mover, { y: 0, duration: 0.2, ease: 'power2.in' })
            .to(wipes[i], { attr: { width: 168 }, duration: 1.05, ease: 'sine.inOut' })
            .to(mover, { x: from + 168, duration: 1.05, ease: 'sine.inOut' }, '<')
            .to(body('ui'), { rotation: 7, duration: 0.26, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<');
        });

        // Tests: the lens goes over each part and stamps it.
        act(3);
        [[228, 198], [412, 198], [330, 292]].forEach(([x, y], i) => {
          tl.to(lens, { x, y, duration: 0.55, ease: 'power3.inOut' }, i ? '>' : '>0.1')
            .to(lens, { scale: 1.18, transformOrigin: '50% 50%', duration: 0.15, yoyo: true, repeat: 1 })
            .to(checks[i], { scale: 1, duration: 0.45, ease: 'back.out(3)' }, '<0.1');
        });
        tl.to(lens, { x: 270, y: 440, duration: 0.6, ease: 'power3.inOut' });
        hop('test', 30, tl, '<0.2');

        // Security: a bug walks in; the guard jumps and swats it out.
        act(4);
        tl.to(bug, { opacity: 1, duration: 0.2 }, '>0.1')
          .to(bug, { x: 600, y: 200, duration: 1.1, ease: 'none' }, '<')
          .to(bug, { rotation: 10, duration: 0.11, yoyo: true, repeat: 9, ease: 'sine.inOut' }, '<')
          .to(body('sec'), { y: -70, duration: 0.26, ease: 'power3.out' }, '>-0.22')
          .to(shield, { rotation: -32, duration: 0.18, ease: 'power3.in' }, '<0.06')
          .to(bug, { x: 760, y: 20, rotation: 760, opacity: 0, duration: 0.8, ease: 'power2.out' }, '>-0.02')
          .to(shield, { rotation: 0, duration: 0.5, ease: 'back.out(2.5)' }, '<')
          .to(body('sec'), { y: 0, duration: 0.6, ease: 'bounce.out' }, '<')
          .to({}, { duration: 1.6 });

        // Everyone breathes, on their own clock.
        q('.hs-breath').forEach((b, i) => gsap.to(b, {
          scaleY: 1.035, transformOrigin: '50% 100%', duration: 1.3 + i * 0.17, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2,
        }));
        q('.hs-deco').forEach((d, i) => gsap.to(d, {
          y: rand(-14, 14), x: rand(-10, 10), rotation: rand(-40, 40), transformOrigin: '50% 50%',
          duration: rand(3, 5), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.3,
        }));

        // And blinks, one at a time, at no fixed rhythm.
        const eyes = q('.hs-eyes');
        let blinker;
        const blink = () => {
          gsap.to(eyes[Math.floor(Math.random() * eyes.length)], {
            scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.inOut',
          });
          blinker = gsap.delayedCall(rand(0.6, 2.4), blink);
        };
        blinker = gsap.delayedCall(1.2, blink);

        let started = false, held = false;

        // The lit chip fills as its act runs: how far into the act the
        // timeline is, written straight to the chips as --p.
        const marks = [...PARTS.map((_, k) => tl.labels[`a${k}`]), tl.duration()];
        tl.eventCallback('onUpdate', () => {
          const t = tl.time();
          let k = -1;
          marks.forEach((m, i) => { if (i < PARTS.length && t >= m) k = i; });
          const p = k < 0 ? 1 : (t - marks[k]) / (marks[k + 1] - marks[k]);
          track?.current?.style.setProperty('--p', p.toFixed(3));
        });
        // Running only while the hero can be seen.
        const view = ScrollTrigger.create({
          trigger: el, start: 'top bottom', end: 'bottom top',
          onToggle: (s) => (s.isActive && started && !held ? tl.play() : tl.pause()),
        });

        // The way in: the window opens and the cast drops in, one by one,
        // landing with a squash. On a later visit, when nothing covers the
        // page, the finished picture is already there and the loop starts
        // by clearing it.
        const start = (label) => { started = true; tl.play(label); };
        const cast = q('.hs-c');
        let stopWaiting = () => {};
        if (covered()) {
          tl.seek('a0', true);
          gsap.set(one('.hs-win'), { scale: 0.9, opacity: 0, transformOrigin: '50% 50%' });
          gsap.set(cast, { y: -220, opacity: 0 });
          const mo = new MutationObserver(() => {
            if (covered()) return;
            mo.disconnect();
            gsap.timeline({ delay: 0.25, onComplete: () => start('a0') })
              .to(one('.hs-win'), { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' })
              .to(cast, { y: 0, opacity: 1, duration: 0.85, ease: 'bounce.out', stagger: 0.12 }, 0.2);
          });
          mo.observe(html, { attributes: true, attributeFilter: ['class'] });
          stopWaiting = () => mo.disconnect();
        } else {
          gsap.delayedCall(1.4, () => start('reset'));
        }

        // Scrolling away, the picture lifts and the cast lifts further.
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 20%', end: 'bottom top', scrub: 0.8 } })
          .to(el, { y: -50, ease: 'none' }, 0)
          .to(one('.hs-cast'), { y: -70, ease: 'none' }, 0);

        // A chip or a character, picked, plays its act.
        if (api) {
          api.current = {
            go: (k) => { started = true; held = false; tl.play(`a${k}`); },
            toggle: () => { held = !held; if (held) tl.pause(); else { started = true; tl.play(); } return held; },
          };
          onReady?.();
        }

        let off = () => {};
        if (pointer) {
          // Eyes follow the pointer, each from where it sits.
          const pupils = q('.hs-pupil').map((p) => ({
            x0: +p.dataset.x, y0: +p.dataset.y,
            tx: gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3' }),
            ty: gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3' }),
          }));
          const look = (e) => {
            const m = el.getScreenCTM();
            if (!m) return;
            const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
            pupils.forEach((p) => {
              const dx = pt.x - p.x0, dy = pt.y - p.y0;
              const d = Math.hypot(dx, dy) || 1;
              const r = Math.min(2.8, d / 30);
              p.tx((dx / d) * r); p.ty((dy / d) * r);
            });
          };
          window.addEventListener('pointermove', look, { passive: true });

          // Touched, a character hops; clicked, it plays its act.
          const hits = cast.map((c) => {
            const k = PARTS.indexOf(c.dataset.part);
            const b = c.querySelector('.hs-breath');
            const enter = () => gsap.fromTo(b, { y: 0 }, { y: -16, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });
            const click = () => api?.current?.go(k);
            c.addEventListener('pointerenter', enter);
            c.addEventListener('click', click);
            return () => { c.removeEventListener('pointerenter', enter); c.removeEventListener('click', click); };
          });
          off = () => { window.removeEventListener('pointermove', look); hits.forEach((h) => h()); };
        }

        return () => { off(); stopWaiting(); blinker?.kill(); view.kill(); if (api) api.current = null; };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [onAct, onReady, api, track]);

  return (
    <svg ref={svg} className="hs" viewBox="0 0 640 560" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hs-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".16" />
          <stop offset="60%" stopColor="var(--h-api)" stopOpacity=".07" />
          <stop offset="100%" stopColor="var(--h-api)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hs-c1"><rect className="hs-wipe" x="144" y="146" width="168" height="104" rx="10" /></clipPath>
        <clipPath id="hs-c2"><rect className="hs-wipe" x="328" y="146" width="168" height="104" rx="10" /></clipPath>
      </defs>

      {/* Ground and air */}
      <circle cx="320" cy="280" r="280" fill="url(#hs-glow)" />
      <line className="hs-ground" x1="24" y1="506" x2="616" y2="506" />
      <g className="hs-deco" style={{ '--c': 'var(--h-ui)' }}><circle cx="58" cy="120" r="13" className="hs-ring" /></g>
      <g className="hs-deco" style={{ '--c': 'var(--accent)' }}><path d="M598 76v24M586 88h24" className="hs-plus" /></g>
      <g className="hs-deco" style={{ '--c': 'var(--h-test)' }}><path d="M40 300l14-24 14 24z" className="hs-tri" /></g>
      <g className="hs-deco" style={{ '--c': 'var(--h-sec)' }}><rect x="596" y="410" width="18" height="18" rx="4" className="hs-sq" /></g>

      {/* The screen being built */}
      <g className="hs-win">
        <rect className="hs-frame" x="120" y="70" width="400" height="300" rx="18" />
        <path className="hs-bar" d="M120 88a18 18 0 0 1 18-18h364a18 18 0 0 1 18 18v16H120z" />
        <circle className="hs-dot" cx="142" cy="87" r="4.5" />
        <circle className="hs-dot" cx="158" cy="87" r="4.5" />
        <circle className="hs-dot" cx="174" cy="87" r="4.5" />
        <rect className="hs-url" x="214" y="80" width="212" height="14" rx="7" />
        <rect className="hs-nav" x="144" y="120" width="96" height="10" rx="5" />
        <rect className="hs-nav2" x="400" y="120" width="40" height="10" rx="5" />
        <rect className="hs-nav2" x="452" y="120" width="44" height="10" rx="5" />

        <rect className="hs-slot" x="144" y="146" width="168" height="104" rx="10" />
        <rect className="hs-slot" x="328" y="146" width="168" height="104" rx="10" />
        <g clipPath="url(#hs-c1)" style={{ '--c': 'var(--h-ui)' }}>
          <rect className="hs-tint" x="144" y="146" width="168" height="104" rx="10" />
          {[[162, 30], [190, 52], [218, 40], [246, 70], [274, 58]].map(([x, h]) => (
            <rect key={x} className="hs-barc" x={x} y={236 - h} width="16" height={h} rx="4" />
          ))}
        </g>
        <g clipPath="url(#hs-c2)" style={{ '--c': 'var(--h-ui)' }}>
          <rect className="hs-tint" x="328" y="146" width="168" height="104" rx="10" />
          <circle cx="356" cy="176" r="13" fill="var(--h-api)" />
          <rect className="hs-txt" x="378" y="166" width="96" height="9" rx="4.5" />
          <rect className="hs-txt2" x="378" y="182" width="62" height="8" rx="4" />
        </g>
        <g className="hs-pill">
          <rect x="344" y="210" width="72" height="26" rx="13" fill="var(--h-test)" />
          <text x="380" y="227.5" textAnchor="middle" className="hs-pill-t">200 OK</text>
        </g>

        {[[266, 352], [290, 300], [314, 330]].map(([y, w]) => (
          <g key={y}>
            <rect className="hs-slot" x="144" y={y} width="352" height="14" rx="7" />
            <rect className="hs-row" x="144" y={y} width={w} height="14" rx="7" />
          </g>
        ))}

        {[[306, 152], [490, 152], [506, 297]].map(([x, y]) => (
          <g key={x} className="hs-ok">
            <circle cx={x} cy={y} r="12" />
            <path d={`M${x - 5} ${y} l3.6 3.8 l6.6 -7.4`} />
          </g>
        ))}
      </g>

      {/* Paths the work travels along (not drawn) */}
      <path className="hs-path hs-path-db" d="M100 386 C 96 320, 120 292, 150 273" />
      <path className="hs-path hs-path-api" d="M452 404 C 470 330, 450 250, 412 214" />

      <g className="hs-cast">
        {/* Database */}
        <g className="hs-c hs-db" data-part="db" style={{ '--c': 'var(--h-db)' }}>
          <ellipse className="hs-shadow" cx="100" cy="507" rx="50" ry="7" />
          <g className="hs-breath"><g className="hs-body">
            <path className="hs-limb" d="M84 488v14M116 488v14" />
            <path className="hs-limb" d="M54 448q-20 2 -24 -18M146 448q20 2 24 -18" />
            <path className="hs-f" d="M52 404v78a48 14 0 0 0 96 0v-78z" />
            <path className="hs-band" d="M52 458a48 14 0 0 0 96 0M52 478a48 14 0 0 0 96 0" />
            <ellipse className="hs-l" cx="100" cy="404" rx="48" ry="14" />
            <Face x={100} y={428} />
          </g></g>
        </g>

        {/* Server & API */}
        <g className="hs-c hs-api" data-part="api" style={{ '--c': 'var(--h-api)' }}>
          <ellipse className="hs-shadow" cx="520" cy="507" rx="48" ry="7" />
          <g className="hs-breath"><g className="hs-body">
            <path className="hs-limb" d="M504 488v14M536 488v14" />
            <path className="hs-limb" d="M560 450q18 8 18 28" />
            <path className="hs-limb hs-api-throw" d="M480 448q-22 -4 -28 -40" />
            <path className="hs-thin" d="M520 408v-20" />
            <circle className="hs-l hs-antenna" cx="520" cy="384" r="7" />
            <rect className="hs-f" x="478" y="406" width="84" height="84" rx="18" />
            <rect className="hs-l" x="478" y="406" width="84" height="16" rx="8" opacity=".55" />
            <Face x={520} y={444} />
          </g></g>
        </g>

        {/* Interface: sits on the window's top edge, brush down to the cards */}
        <g className="hs-c hs-ui" data-part="ui" style={{ '--c': 'var(--h-ui)' }}>
          <g className="hs-move" transform="translate(466 70)">
            <g className="hs-breath"><g className="hs-body">
              <path className="hs-limb" d="M-9 -4l-3 18M9 -4l3 18" />
              <path className="hs-thin hs-handle" d="M18 -14L30 100" />
              <rect className="hs-f hs-brush" x="22" y="96" width="16" height="26" rx="6" />
              <path className="hs-limb" d="M20 -18q8 4 4 10" />
              <circle className="hs-f" cx="0" cy="-28" r="27" />
              <path className="hs-l" d="M-24 -40a27 27 0 0 1 48 0q-24 -12 -48 0z" />
              <Face x={0} y={-30} mood="o" />
            </g></g>
          </g>
        </g>

        {/* Tests: clipboard in one hand, lens in the other */}
        <g className="hs-c hs-test" data-part="test" style={{ '--c': 'var(--h-test)' }}>
          <ellipse className="hs-shadow" cx="320" cy="507" rx="42" ry="7" />
          <g className="hs-breath"><g className="hs-body">
            <path className="hs-limb" d="M306 486v16M334 486v16" />
            <ellipse className="hs-f" cx="320" cy="452" rx="36" ry="40" />
            <path className="hs-limb" d="M354 458q10 0 14 -8" />
            <rect className="hs-board" x="350" y="444" width="28" height="36" rx="5" />
            <path className="hs-board-t" d="M357 456l3 3 6 -6M357 468l3 3 6 -6" />
            <path className="hs-limb" d="M286 456q-10 -2 -12 -10" />
            <Face x={320} y={442} />
          </g></g>
        </g>

        {/* Security: the guard and its shield, right of the window */}
        <g className="hs-c hs-sec" data-part="sec" style={{ '--c': 'var(--h-sec)' }}>
          <ellipse className="hs-shadow" cx="584" cy="352" rx="36" ry="6" />
          <g className="hs-breath"><g className="hs-body">
            <path className="hs-limb" d="M572 334v14M596 334v14" />
            <rect className="hs-f" x="550" y="266" width="68" height="72" rx="24" />
            <path className="hs-l" d="M560 270q24 -14 48 0v8h-48z" opacity=".6" />
            <Face x={584} y={296} />
            <g className="hs-shield">
              <path className="hs-shield-b" d="M540 300l20 7v20c0 15-10 24-20 30c-10-6-20-15-20-30v-20z" />
              <path className="hs-shield-t" d="M532 326l6 6 10 -12" />
            </g>
          </g></g>
        </g>
      </g>

      {/* Moving pieces, hidden until their act */}
      <g className="hs-lens" transform="translate(270 440)">
        <path className="hs-lens-h" d="M14 14l16 16" />
        <circle className="hs-lens-g" r="19" />
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={`t${i}`} className="hs-tok" x="-9" y="-5" width="18" height="10" rx="3" style={{ opacity: 0 }} />
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={`p${i}`} className="hs-pk" r="7" style={{ opacity: 0 }} />
      ))}
      <g className="hs-bug" transform="translate(700 150)" style={{ opacity: 0 }}>
        <path className="hs-bug-l" d="M-8 -9l-5 -6M8 -9l5 -6M-12 0h-8M12 0h8M-9 8l-6 6M9 8l6 6" />
        <ellipse className="hs-bug-b" rx="12" ry="10" />
        <circle cx="-4" cy="-3" r="2.4" fill="#fff" /><circle cx="4" cy="-3" r="2.4" fill="#fff" />
      </g>
    </svg>
  );
}
