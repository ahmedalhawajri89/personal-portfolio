'use client';

import { useEffect, useRef, useState } from 'react';
import { loadMotion, whenIdle, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

const pad = (n) => String(n).padStart(2, '0');

/* The work, shown as a reel: the five projects side by side like frames of
   film, each one its problem and its answer beside the product itself. On a
   wide screen the reel holds the screen and the page's own scroll runs it
   sideways, one project at a time in the light and the others dimmed at the
   edges; a counter and a bar say how far through it you are. Elsewhere --
   a phone, or reduced motion -- it is a row you swipe, snapping to each
   project, with the same counter. Nothing in it needs script to be read. */
export default function Reel({ items, labels, rtl }) {
  const [on, setOn] = useState(0);
  const root = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const n = items.length;

  // The swiped row: the project nearest the start edge is the current one.
  const onScroll = () => {
    const el = track.current;
    if (!el || root.current?.classList.contains('is-pinned')) return;
    const first = el.firstElementChild;
    if (!first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0);
    const k = Math.min(n - 1, Math.round(Math.abs(el.scrollLeft) / step));
    setOn(k);
    if (bar.current) bar.current.style.transform = `scaleX(${n > 1 ? k / (n - 1) : 1})`;
  };

  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadMotion();
      if (gone || !root.current) return;
      mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const el = root.current;
        const tr = track.current;
        el.classList.add('is-pinned');
        tr.scrollLeft = 0;
        // From the first frame to the last, measured on the frames: the row's
        // scroll width does not count its end padding the same way in both
        // directions, and every frame has to come to rest in the middle.
        const dist = () => {
          const c = tr.children;
          return c.length > 1 ? Math.abs(c[c.length - 1].offsetLeft - c[0].offsetLeft) : 0;
        };
        gsap.to(tr, {
          x: () => (rtl ? 1 : -1) * dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: el, start: 'top top', end: () => `+=${dist()}`,
            pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (self) => {
              const k = Math.round(self.progress * (n - 1));
              setOn((s) => (s === k ? s : k));
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        return () => el.classList.remove('is-pinned');
      });
      ScrollTrigger.refresh();
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [n, rtl]);

  return (
    <div className="reel" ref={root}>
      <ol className="reel-track" ref={track} onScroll={onScroll}>
        {items.map((x, k) => (
          <li key={x.href} className={`reel-card${k === on ? ' is-on' : ''}`}>
            <a href={x.href} className="reel-link">
              <div className="reel-frame">
                <div className="card-bar" aria-hidden="true"><span className="lat">{x.where}</span></div>
                <div className="zoom reel-view" data-m="peek" data-full={x.img.full}>
                  <img src={x.img.thumb} alt={`${x.name}: ${x.kind}`} width={x.img.tw} height={x.img.th}
                       loading={k === 0 ? 'eager' : 'lazy'} decoding="async" />
                  <span className="reel-num lat" aria-hidden="true">{pad(k + 1)}</span>
                </div>
              </div>
              <div className="reel-copy">
                <p className="reel-kind">{x.kind}</p>
                <h3 className="reel-name">{x.name}</h3>
                <dl className="reel-pa">
                  <div><dt>{labels.problem}</dt><dd>{x.problem}</dd></div>
                  <div><dt>{labels.answer}</dt><dd>{x.answer}</dd></div>
                </dl>
                <p className="reel-meta">{x.meta}</p>
                <span className="reel-open arrow-slide">
                  {labels.open} <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={15} />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ol>
      <div className="reel-hud" aria-hidden="true">
        <span className="lat">{pad(on + 1)}</span>
        <span className="reel-bar"><i ref={bar} /></span>
        <span className="lat">{pad(n)}</span>
        <span className="reel-now">{items[on]?.name}</span>
      </div>
    </div>
  );
}
