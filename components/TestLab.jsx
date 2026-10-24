'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

const pad = (n) => String(n).padStart(2, '0');

/* The tests, by name: six real test files from the projects, shown the way
   they are run -- in a test runner.

   On the list side, the suite. The first time it comes into view it runs:
   each test in turn waits, spins and passes, and the count climbs to six.
   On the other side, the case that is open: its command types itself, then
   the problem it guards against (in the client's words) and the decision
   that answers it (in the engineer's), and then the PASS lands on it with
   the file it lives in and a way to read the code. Picking another test
   runs that one; the button in the title bar runs the whole suite again.

   It is a proper tablist: arrow keys move between tests and the case is
   labelled by the test that opened it. For reduced motion, or without
   script, every test has passed and the open case is simply there. */
export default function TestLab({ lang, tests, projects, labels }) {
  const ar = lang === 'ar';
  const L = ar ? 'Ar' : 'En';
  const [i, setI] = useState(0);
  const root = useRef(null);
  const tabs = useRef([]);
  const g = useRef(null);          // gsap, once it has loaded and motion is allowed
  const runSuite = useRef(() => {});

  const x = tests[i];
  const pr = projects[x.project];
  const cmd = `php artisan test --filter=${x.file.replace('.php', '')}`;

  const key = (e) => {
    const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: ar ? -1 : 1, ArrowLeft: ar ? 1 : -1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const n = (i + next + tests.length) % tests.length;
    setI(n); tabs.current[n]?.focus();
  };

  // The suite: run once when it first comes into view, and again on demand.
  useEffect(() => {
    let mm, gone = false;
    (async () => {
      const [{ gsap, ScrollTrigger }, { TextPlugin }] = await Promise.all([loadMotion(), import('gsap/TextPlugin')]);
      gsap.registerPlugin(TextPlugin);
      if (gone || !root.current) return;
      const el = root.current;
      const rows = Array.from(el.querySelectorAll('.tl-tab'));
      const count = el.querySelector('.tl-count b');
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        g.current = gsap;
        let tl;
        runSuite.current = () => {
          tl?.kill();
          rows.forEach((r) => (r.dataset.state = 'idle'));
          count.textContent = '0';
          tl = gsap.timeline();
          rows.forEach((r, k) => {
            tl.call(() => { r.dataset.state = 'run'; }, null, k * 0.38)
              .call(() => { r.dataset.state = 'pass'; count.textContent = String(k + 1); }, null, k * 0.38 + 0.32);
          });
        };
        rows.forEach((r) => (r.dataset.state = 'idle'));
        count.textContent = '0';
        const st = ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => runSuite.current() });
        return () => { st.kill(); tl?.kill(); g.current = null; rows.forEach((r) => (r.dataset.state = 'pass')); count.textContent = String(rows.length); };
      });
    })();
    return () => { gone = true; mm?.revert(); };
  }, []);

  // The open case: run it each time it opens.
  useEffect(() => {
    const gsap = g.current;
    const el = root.current;
    if (!gsap || !el) return;
    const pane = el.querySelector('.tl-case');
    const row = tabs.current[i];
    const tl = gsap.timeline();
    if (row && row.dataset.state === 'pass') {
      tl.call(() => { row.dataset.state = 'run'; }).call(() => { row.dataset.state = 'pass'; }, null, 0.45);
    }
    tl.fromTo(pane.querySelector('.tl-cmd-t'), { text: '' }, { text: cmd, duration: Math.min(1, cmd.length * 0.022), ease: 'none' }, 0)
      .from(pane.querySelectorAll('.tl-step'), { opacity: 0, y: 18, duration: 0.55, ease: 'expo.out', stagger: 0.22 }, '>-0.05')
      .fromTo(pane.querySelector('.tl-stamp'), { scale: 1.8, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' }, '>-0.1')
      .from(pane.querySelectorAll('.tl-proof > *'), { opacity: 0, y: 10, duration: 0.4, stagger: 0.08 }, '<0.15');
    return () => tl.kill();
  }, [i, cmd]);

  return (
    <div className="tl" ref={root}>
      <div className="tl-bar">
        <span className="tl-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="tl-title lat">php artisan test</span>
        <span className="tl-count"><b className="lat">{tests.length}</b>/<span className="lat">{tests.length}</span> {labels.passed}</span>
        <button type="button" className="tl-again" onClick={() => runSuite.current()} aria-label={labels.again} title={labels.again}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
        </button>
      </div>

      <div className="tl-body">
        <div className="tl-list" role="tablist" aria-orientation="vertical" aria-label={labels.list} onKeyDown={key}>
          {tests.map((y, n) => {
            const p = projects[y.project];
            return (
              <button key={y.file} ref={(el) => (tabs.current[n] = el)} type="button" role="tab" data-state="pass"
                      id={`tl-tab-${n}`} aria-controls="tl-case" aria-selected={n === i} tabIndex={n === i ? 0 : -1}
                      className={`tl-tab${n === i ? ' is-on' : ''}`} style={{ '--p': p?.hue }} onClick={() => setI(n)}>
                <span className="tl-state" aria-hidden="true"><i className="tl-spin" /><Icon name="check" size={11} /></span>
                <span className="tl-name">{ar ? y.ar : y.en}</span>
                <span className="tl-meta"><span className="tl-file lat">{y.file.replace('.php', '')}</span><span className="tl-proj"><i />{p?.name}</span></span>
              </button>
            );
          })}
        </div>

        <div id="tl-case" role="tabpanel" aria-labelledby={`tl-tab-${i}`} className="tl-case" style={{ '--p': pr?.hue }}>
          <div key={i} className="tl-sheet">
            <p className="tl-cmd lat" dir="ltr"><span aria-hidden="true">$ </span><span className="tl-cmd-t">{cmd}</span></p>
            <div className="tl-step">
              <p className="tl-k">{labels.problem}</p>
              <p className="tl-v">{x[`prob${L}`]}</p>
            </div>
            <div className="tl-step">
              <p className="tl-k">{labels.decision}</p>
              <p className="tl-v">{x[`dec${L}`]}</p>
            </div>
            <div className="tl-proof">
              <span className="tl-stamp lat" aria-label="PASS">PASS <Icon name="check" size={16} /></span>
              <p className="tl-path lat" dir="ltr">{x.project}/tests/{x.file}</p>
              <p className="tl-rule">{ar ? x.ar : x.en}</p>
              {pr?.repo && (
                <a className="pill tl-repo" href={pr.repo} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" size={15} />{labels.repo} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
