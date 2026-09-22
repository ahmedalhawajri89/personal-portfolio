'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icons';

const pad = (n) => String(n).padStart(2, '0');

/* The product tour as a viewer: one screen at a time in a large browser
   frame, and the eight screens listed beside it by name and path. Eight
   full-width screenshots stacked down the page read as an archive; one frame
   and a list reads as the product being shown to you. A proper tablist --
   arrow keys move between screens and the frame is labelled by the tab that
   opened it. Only the screen on show is in the page; its neighbours are
   fetched ahead so a step never waits. */
export default function Tour({ items, labels, rtl }) {
  const [i, setI] = useState(0);
  const tabs = useRef([]);
  const n = items.length;
  const go = (k, focus) => {
    const j = (k + n) % n;
    setI(j);
    if (focus) tabs.current[j]?.focus();
  };

  useEffect(() => {
    [1, -1].forEach((d) => { const im = new Image(); im.src = items[(i + d + n) % n].thumb; });
  }, [i, items, n]);

  const onKey = (e) => {
    const d = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, Home: -i, End: n - 1 - i }[e.key];
    if (d === undefined) return;
    e.preventDefault();
    go(i + d, true);
  };

  const s = items[i];
  return (
    <div className="tour">
      <div className="tour-stage" id="tour-stage" role="tabpanel" aria-labelledby={`tour-tab-${i}`}>
        <div className="tour-frame">
          <div className="tour-bar" aria-hidden="true"><i /><i /><i /><span className="lat">{s.path}</span></div>
          <div className="tour-pic">
            <picture key={s.thumb}>
              <source media="(min-width:1024px)" srcSet={`${s.thumb} ${s.tw}w, ${s.file} ${s.w}w`} sizes="820px" />
              <img src={s.thumb} alt={s.alt} width={s.tw} height={s.th} decoding="async" className="tour-img" />
            </picture>
          </div>
        </div>
        <div className="tour-ctl">
          <button type="button" className="tour-btn" onClick={() => go(i - 1)} aria-label={labels.prev}>
            <Icon name={rtl ? 'arrowRight' : 'arrowLeft'} size={16} />
          </button>
          <span className="tour-count lat" aria-hidden="true">{pad(i + 1)} / {pad(n)}</span>
          <button type="button" className="tour-btn" onClick={() => go(i + 1)} aria-label={labels.next}>
            <Icon name={rtl ? 'arrowLeft' : 'arrowRight'} size={16} />
          </button>
          <a className="tour-open" href={s.file} target="_blank" rel="noopener noreferrer">
            {labels.open} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="tour-list" role="tablist" aria-orientation="vertical" aria-label={labels.list} onKeyDown={onKey}>
        {items.map((x, k) => (
          <button key={x.thumb} ref={(el) => (tabs.current[k] = el)} type="button" role="tab"
                  id={`tour-tab-${k}`} aria-controls="tour-stage" aria-selected={k === i} tabIndex={k === i ? 0 : -1}
                  className={`tour-tab${k === i ? ' is-on' : ''}`} onClick={() => setI(k)}>
            <span className="tour-n lat">{pad(k + 1)}</span>
            <span className="tour-l">{x.label}</span>
            <span className="tour-p lat">{x.path}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
