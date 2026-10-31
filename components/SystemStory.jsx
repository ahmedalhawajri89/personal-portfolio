'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

const pad = (n) => String(n).padStart(2, '0');
const HUES = ['var(--h-db)', 'var(--h-api)', 'var(--h-ui)', 'var(--h-test)', 'var(--h-sec)'];

/* Behind the screen: what happens under one button, told by the scroll.

   On a wide screen the section holds still while the reader scrolls, and
   the scroll builds a drawing of the system in the order a request depends
   on it -- the database, then the server with its code writing itself, then
   the interface, then the tests that hold it up, then the guard round the
   server. Beside it the five parts are explained in plain words, the one
   being drawn lit in its own colour. When the drawing is finished it starts
   working: a request leaves the interface, locks its row in the database and
   comes back as a 200, and a request from outside is turned away at the
   guard with a 403.

   On a phone, for reduced motion, or without script, the drawing is simply
   finished and the five parts are a list beside it. */
export default function SystemStory({ parts, tests, total, passed, diagramLabel }) {
  const [step, setStep] = useState(-1);
  const root = useRef(null);

  useEffect(() => {
    let mm, gone = false;
    (async () => {
      const [{ gsap, ScrollTrigger }, { DrawSVGPlugin }, { MotionPathPlugin }, { ScrambleTextPlugin }] = await Promise.all([
        loadMotion(), import('gsap/DrawSVGPlugin'), import('gsap/MotionPathPlugin'), import('gsap/ScrambleTextPlugin'),
      ]);
      gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin);
      if (gone || !root.current) return;
      const el = root.current;
      const $ = (s) => el.querySelector(s);
      const $$ = (s) => Array.from(el.querySelectorAll(s));

      mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const code = $$('.hd-code').map((t) => t.textContent);
        const files = $$('.hd-file').map((t) => t.textContent);
        const sum = $('.hd-sum b');
        const glyphs = '01{}<>/=;$_';

        // From the finished drawing back to a blank sheet.
        gsap.set($$('.hd-l, .hd-w'), { drawSVG: 0 });
        gsap.set($$('.hd-b'), { scaleX: 0, transformOrigin: '0% 50%' });
        gsap.set($$('.hd-cap, .hd-ok, .hd-dot, .hd-test, .hd-sum'), { opacity: 0 });
        gsap.set($$('.hd-tick, .hd-lock'), { scale: 0, transformOrigin: '50% 50%' });
        gsap.set($$('.hd-code'), { text: '' });
        gsap.set($('.hd-tests'), { opacity: 0, y: 12 });

        const draw = (tl, sel, pos) => tl.to($$(sel), { drawSVG: '100%', duration: 1, ease: 'none', stagger: 0.15 }, pos);

        // The working run, once the drawing is finished.
        const req = $('.hd-req'), res = $('.hd-res'), bad = $('.hd-bad'), no = $('.hd-403'), ok = $('.hd-ok');
        const down = $('.hd-route-down'), up = $('.hd-route-up');
        const run = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1 })
          .set(ok, { opacity: 0 })
          .set(req, { opacity: 1 })
          .to(req, { duration: 1.3, ease: 'power1.inOut', motionPath: { path: down, align: down, alignOrigin: [0.5, 0.5] } })
          .to($('.hd-api-box'), { stroke: 'var(--h-api)', duration: 0.2, yoyo: true, repeat: 1 }, '-=0.85')
          .set(req, { opacity: 0 })
          .to($('.hd-dblock'), { scale: 1, duration: 0.35, ease: 'back.out(3)' })
          .to($('.hd-dblock'), { scale: 0, duration: 0.3, ease: 'power2.in' }, '+=0.4')
          .set(res, { opacity: 1 })
          .to(res, { duration: 1.2, ease: 'power1.inOut', motionPath: { path: up, align: up, alignOrigin: [0.5, 0.5] } })
          .set(res, { opacity: 0 })
          .fromTo(ok, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(3)' })
          .fromTo(bad, { opacity: 0, x: 0 }, { opacity: 1, x: -92, duration: 0.8, ease: 'power2.in' }, '+=0.5')
          .to($('.hd-guard'), { stroke: 'var(--bad)', duration: 0.15, yoyo: true, repeat: 1 })
          .to(bad, { x: 0, opacity: 0, duration: 0.7, ease: 'power2.out' }, '<')
          .fromTo(no, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, '<')
          .to(no, { opacity: 0, duration: 0.4 }, '+=0.7');

        // The build, scrubbed by the scroll while the section holds still.
        const build = gsap.timeline({
          scrollTrigger: {
            trigger: el.querySelector('.ss-pin'), start: 'top top', end: () => `+=${innerHeight * 2.2}`,
            pin: true, scrub: 0.6, invalidateOnRefresh: true,
            onUpdate: (self) => {
              const label = build.currentLabel();
              setStep(label ? Number(label.slice(1)) : -1);
              if (self.progress > 0.985) run.play(); else run.pause();
            },
          },
        });
        build.addLabel('s0');
        draw(build, '.hd-db .hd-l');
        draw(build, '.hd-db .hd-w', '-=0.5');
        build.to($$('.hd-db .hd-cap'), { opacity: 1, duration: 0.5 }, '<');
        build.addLabel('s1', '+=0.2');
        draw(build, '.hd-wire-db', 's1');
        draw(build, '.hd-api .hd-l:not(.hd-guard)', '-=0.4');
        build.to($$('.hd-api .hd-cap'), { opacity: 1, duration: 0.5 }, '-=0.5');
        $$('.hd-code').forEach((t, k) => build.to(t, { duration: 1, scrambleText: { text: code[k], chars: glyphs }, ease: 'none' }, k ? '-=0.6' : '-=0.2'));
        build.addLabel('s2', '+=0.2');
        draw(build, '.hd-wire-ui', 's2');
        draw(build, '.hd-ui .hd-l', '-=0.4');
        build.to($$('.hd-ui .hd-dot'), { opacity: 1, duration: 0.3, stagger: 0.08 }, '-=0.4');
        build.to($$('.hd-ui .hd-b'), { scaleX: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, '-=0.3');
        build.to($$('.hd-ui .hd-cap, .hd-ok'), { opacity: 1, duration: 0.5 }, '<');
        build.addLabel('s3', '+=0.2');
        build.to($('.hd-tests'), { opacity: 1, y: 0, duration: 0.6 }, 's3');
        $$('.hd-test').forEach((row, k) => {
          build.to(row, { opacity: 1, duration: 0.3 }, k ? '-=0.3' : '>')
            .to(row.querySelector('.hd-file'), { duration: 0.7, scrambleText: { text: files[k], chars: glyphs } }, '<')
            .to(row.querySelector('.hd-tick'), { scale: 1, duration: 0.4 }, '-=0.2');
        });
        const count = { n: 0 };
        build.to($('.hd-sum'), { opacity: 1, duration: 0.3 })
          .to(count, { n: total, duration: 1, onUpdate: () => { sum.textContent = Math.round(count.n).toLocaleString('en-US'); } }, '<');
        build.addLabel('s4', '+=0.2');
        draw(build, '.hd-guard', 's4');
        build.to($('.hd-lock'), { scale: 1, duration: 0.5 }, '-=0.3');
        build.to({}, { duration: 0.6 });

        return () => { run.kill(); setStep(-1); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, [total]);

  return (
    <div className="ss" ref={root}>
      <div className="ss-pin">
        <div className="ss-grid">
          <ol className="ss-parts">
            {parts.map((p, k) => (
              <li key={p.h} className={k === step ? 'is-on' : step >= 0 ? 'is-dim' : ''} style={{ '--hue': HUES[k] }}>
                <span className="ss-n lat">{pad(k + 1)}</span>
                <div>
                  <h3>{p.h}</h3>
                  <p>{p.b}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="hd">
            <div className="hd-sheet">
              <svg viewBox="0 0 520 440" role="img" aria-label={diagramLabel}>
                <g transform="translate(44 0)">
                  <g className="hd-ui">
                    <path className="hd-l" d="M160 24 H360 a10 10 0 0 1 10 10 V126 a10 10 0 0 1 -10 10 H160 a10 10 0 0 1 -10 -10 V34 a10 10 0 0 1 10 -10 z" />
                    <path className="hd-l" d="M150 44 H370" />
                    <circle className="hd-dot" cx="162" cy="34" r="2.6" /><circle className="hd-dot" cx="171" cy="34" r="2.6" /><circle className="hd-dot" cx="180" cy="34" r="2.6" />
                    <rect className="hd-b" x="166" y="58" width="72" height="9" rx="2.5" />
                    <rect className="hd-b is-soft" x="166" y="75" width="112" height="6" rx="2" />
                    <rect className="hd-b is-soft" x="166" y="87" width="92" height="6" rx="2" />
                    <rect className="hd-b is-ink" x="166" y="106" width="58" height="18" rx="5" />
                    <path className="hd-l" d="M302 58 h46 a6 6 0 0 1 6 6 v50 a6 6 0 0 1 -6 6 h-46 a6 6 0 0 1 -6 -6 v-50 a6 6 0 0 1 6 -6 z" />
                    <text className="hd-ok" x="325" y="96" textAnchor="middle">200</text>
                    <text className="hd-cap" x="370" y="16" textAnchor="end">Vue · Blade</text>
                  </g>

                  <path className="hd-w hd-wire-ui" d="M226 136 C226 156 212 166 212 190" />
                  <path className="hd-w hd-wire-ui" d="M308 190 C308 166 294 156 294 136" />
                  <path className="hd-w hd-wire-db" d="M212 276 C212 300 222 310 222 326" />
                  <path className="hd-w hd-wire-db" d="M298 326 C298 310 308 300 308 276" />
                  <path className="hd-route hd-route-down" d="M226 136 C226 156 212 166 212 190 L212 276 C212 300 222 310 222 326" />
                  <path className="hd-route hd-route-up" d="M298 326 C298 310 308 300 308 276 L308 190 C308 166 294 156 294 136" />

                  <g className="hd-api">
                    <path className="hd-l hd-guard" d="M156 166 H364 a24 24 0 0 1 24 24 V272 a24 24 0 0 1 -24 24 H156 a24 24 0 0 1 -24 -24 V190 a24 24 0 0 1 24 -24 z" />
                    <g className="hd-lock">
                      <rect x="379" y="160" width="18" height="14" rx="3" />
                      <path d="M383 160 v-4 a5 5 0 0 1 10 0 v4" />
                    </g>
                    <path className="hd-l hd-api-box" d="M180 190 H340 a10 10 0 0 1 10 10 V266 a10 10 0 0 1 -10 10 H180 a10 10 0 0 1 -10 -10 V200 a10 10 0 0 1 10 -10 z" />
                    <text className="hd-cap hd-cap-in" x="184" y="210">Laravel API</text>
                    <text className="hd-code" x="184" y="232">Route::post('/orders')</text>
                    <text className="hd-code" x="184" y="248">DB::transaction(fn () =&gt;</text>
                    <text className="hd-code is-key" x="196" y="264">-&gt;lockForUpdate())</text>
                  </g>

                  <g className="hd-db">
                    <path className="hd-l" d="M186 340 a74 14 0 1 0 148 0 a74 14 0 1 0 -148 0" />
                    <path className="hd-l" d="M186 340 V400 a74 14 0 0 0 148 0 V340" />
                    <path className="hd-l" d="M186 370 a74 14 0 0 0 148 0" />
                    <path className="hd-w" d="M204 362 h34 M246 362 h34 M288 362 h22" />
                    <path className="hd-w" d="M204 392 h34 M246 392 h34 M288 392 h22" />
                    <g className="hd-dblock">
                      <rect x="342" y="352" width="18" height="14" rx="3" />
                      <path d="M346 352 v-4 a5 5 0 0 1 10 0 v4" />
                    </g>
                    <text className="hd-cap" x="260" y="434" textAnchor="middle">MySQL</text>
                  </g>

                  <circle className="hd-pkt hd-req" r="6" cx="0" cy="0" />
                  <circle className="hd-pkt hd-res" r="6" cx="0" cy="0" />
                  <circle className="hd-bad" r="6" cx="484" cy="231" />
                  <text className="hd-403" x="430" y="214" textAnchor="middle">403</text>
                </g>
              </svg>

              <div className="hd-tests" dir="ltr">
                <p className="hd-cmd">$ php artisan test</p>
                <ul>
                  {tests.map((f) => (
                    <li key={f} className="hd-test">
                      <span className="hd-tick" aria-hidden="true"><Icon name="check" size={10} /></span>
                      <span className="hd-file">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="hd-sum"><b>{total.toLocaleString('en-US')}</b> {passed}</p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
