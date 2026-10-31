'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

const pad = (n) => String(n).padStart(2, '0');

/* Problems met in real projects, each one solved in front of the reader. The
   problem is set large. As it comes up the page a line is drawn through it, a
   tick is drawn beside it, and the decision that solved it rises underneath,
   with the test that keeps it solved. The scroll drives it, so scrolling back
   brings the problem back. A count beside the list keeps the score.

   The markup is the finished reading: without script, or for reduced motion,
   every problem and its solution simply stand there, unstruck. */
export default function Problems({ lang, tests, projects, labels, children }) {
  const ar = lang === 'ar';
  const L = ar ? 'Ar' : 'En';
  const root = useRef(null);
  const [solved, setSolved] = useState(tests.length);

  useEffect(() => {
    let mm;
    let gone = false;
    (async () => {
      const [{ gsap }, { DrawSVGPlugin }] = await Promise.all([loadMotion(), import('gsap/DrawSVGPlugin')]);
      gsap.registerPlugin(DrawSVGPlugin);
      if (gone || !root.current) return;
      const rows = Array.from(root.current.querySelectorAll('.pb-row'));
      mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const done = rows.map(() => false);
        const count = () => setSolved(done.filter(Boolean).length);
        setSolved(0);

        const made = rows.map((row, k) => {
          const problem = row.querySelector('.pb-problem');
          const ring = row.querySelector('.pb-ring');
          const tick = row.querySelector('.pb-tick');
          const pass = row.querySelector('.pb-pass');
          const answer = Array.from(row.querySelectorAll('.pb-answer > *'));

          // The strike has to pass over the letters, so it runs on a clear copy
          // of the sentence laid on top. Being inline it follows the wrapping in
          // either direction, which SplitText's lines do not do in Arabic.
          const over = document.createElement('span');
          const strike = document.createElement('span');
          over.className = 'pb-over';
          over.setAttribute('aria-hidden', 'true');
          strike.className = 'pb-strike';
          strike.textContent = problem.textContent;
          over.append(strike);
          problem.append(over);

          gsap.set([ring, tick], { drawSVG: 0 });
          gsap.set(answer, { y: 26, autoAlpha: 0 });
          gsap.set(pass, { scale: 0.6, autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: row,
              start: 'top 72%',
              end: 'top 26%',
              scrub: 0.4,
              onUpdate: (st) => {
                const now = st.progress > 0.86;
                if (now !== done[k]) {
                  done[k] = now;
                  count();
                }
              },
            },
          });
          tl.fromTo(strike, { '--s': 0 }, { '--s': 1, duration: 0.6, ease: 'power1.inOut' }, 0)
            .to(problem, { color: 'var(--ink-3)', duration: 0.3 }, 0.36)
            .to(ring, { drawSVG: '100%', duration: 0.3 }, 0.34)
            .to(tick, { drawSVG: '100%', duration: 0.2 }, 0.56)
            .to(answer, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.07, ease: 'power2.out' }, 0.5)
            .to(pass, { scale: 1, autoAlpha: 1, duration: 0.18, ease: 'back.out(3)' }, 0.8);

          return () => over.remove();
        });

        return () => {
          made.forEach((f) => f());
          setSolved(tests.length);
        };
      });
    })();
    return () => {
      gone = true;
      mm?.revert();
    };
  }, [tests.length]);

  return (
    <div className="pb" ref={root}>
      <div className="pb-side">
        {children}
        <p className="pb-score" aria-hidden="true">
          <b className="lat">{pad(solved)}</b>
          <span className="lat">/ {pad(tests.length)}</span>
          <small>{labels.solved}</small>
        </p>
      </div>

      <ol className="pb-list">
        {tests.map((x) => {
          const pr = projects[x.project];
          return (
            <li key={x.file} className="pb-row" style={{ '--p': pr.hue }}>
              <p className="pb-from"><i aria-hidden="true" />{pr.name}</p>
              <div className="pb-head">
                <svg className="pb-check" viewBox="0 0 44 44" aria-hidden="true">
                  <circle className="pb-ring" cx="22" cy="22" r="19" />
                  <path className="pb-tick" d="M13 23 l6 6 l12 -14" />
                </svg>
                <h3 className="pb-problem">{x[`prob${L}`]}</h3>
              </div>
              <div className="pb-answer">
                <p className="pb-k">{labels.decision}</p>
                <p className="pb-decision">{x[`dec${L}`]}</p>
                <p className="pb-proof">
                  <span className="pb-pass">{labels.passed}</span>
                  <code className="lat">{x.file.replace('.php', '')}</code>
                  <a href={pr.repo} target="_blank" rel="noopener noreferrer">{labels.repo} <Icon name="external" size={13} /></a>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
