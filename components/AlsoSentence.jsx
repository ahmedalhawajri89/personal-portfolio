'use client';

import { useState } from 'react';
import Icon from './Icons';

// The services that are not the main offer, said as one sentence rather than
// a row of cards: "I also take on A, B and C." Each one is a phrase that can
// be pointed at, focused or tapped; the line under the sentence then says
// what it is and where it was built. The first is shown to begin with.
export default function AlsoSentence({ lead, and, items, arrow, rtl }) {
  const [on, setOn] = useState(0);
  const sep = rtl ? '، ' : ', ';
  return (
    <div className="as">
      <p className="as-say">
        <span className="as-lead">{lead} </span>
        {items.map((it, k) => (
          <span key={it.key}>
            {k > 0 && (k === items.length - 1 ? <span className="as-lead">{` ${and}`}</span> : <span className="as-lead">{sep}</span>)}
            {k === items.length - 1 && !rtl && ' '}
            <button type="button" className={`as-w${k === on ? ' is-on' : ''}`} style={{ '--c': it.hue }}
                    aria-expanded={k === on} aria-controls={`as-${it.key}`}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(k)} onFocus={() => setOn(k)} onClick={() => setOn(k)}>
              {it.phrase}
            </button>
          </span>
        ))}
        <span className="as-lead">.</span>
      </p>
      {items.map((it, k) => (
        <div key={it.key} id={`as-${it.key}`} className="as-read" hidden={k !== on} style={{ '--c': it.hue }}>
          <p>{it.b}</p>
          {it.proof ? (
            <a href={it.proof.href} className="pill" style={{ '--c': it.proof.hue }}>
              <i className="pill-dot" aria-hidden="true" />{it.proof.label} <Icon name={arrow} size={14} />
            </a>
          ) : it.note ? (
            <p className="sv-note"><span>{it.note.label}</span> <span className="lat">{it.note.text}</span></p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
