'use client';

import { useEffect, useRef, useState } from 'react';
import { T } from '../lib/i18n';
import Icon from './Icons';

export const CV_FILE = '/cv/Ahmed-Al-Hawajiri-CV.pdf';

/**
 * The CV, shown rather than merely linked. A button anywhere on the page
 * opens a panel with the person's facts, the PDF itself previewed inline on
 * wide screens, and two clear exits: download, or open in a tab.
 */
export function CvButton({ lang, variant = 'ghost', compact = false }) {
  const t = T[lang].cv;
  const [open, setOpen] = useState(false);
  return (
    <>
      {compact ? (
        <button onClick={() => setOpen(true)} aria-label={t.btn} title={t.btn}
                className="grid h-9 w-9 place-items-center rounded-full border transition-all hover:scale-105 active:scale-95"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-2)', background: 'var(--card-2)' }}>
          <Icon name="fileText" size={15} />
        </button>
      ) : (
        <button onClick={() => setOpen(true)} className={`btn btn-${variant}`}>
          <Icon name="fileText" size={16} />{t.btn}
        </button>
      )}
      {open && <CvPanel lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}

function CvPanel({ lang, onClose }) {
  const t = T[lang].cv;
  const rtl = lang === 'ar';
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 220); };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`cvp${closing ? ' is-closing' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t.title} className="cvp-sheet">
        <div className="cvp-side">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{t.title}</p>
              <h2 className="mt-4 text-[26px] font-extrabold leading-tight">{t.name}</h2>
              <p className="mt-1 text-[14.5px] font-bold" style={{ color: 'var(--ink-2)' }}>{t.role}</p>
            </div>
            <button onClick={close} aria-label={T[lang].detail.close} className="lb-btn md:hidden"><Icon name="x" size={18} /></button>
          </div>

          <ul className="mt-6 grid gap-2.5 text-[14px]" style={{ color: 'var(--ink-2)' }}>
            {t.facts.map(([icon, txt]) => (
              <li key={txt} className="flex items-center gap-2.5">
                <span className="icon-tile shrink-0" style={{ width: 32, height: 32, borderRadius: 10 }}><Icon name={icon} size={14} /></span>
                <span className={/^[\x20-\x7E]+$/.test(txt) ? 'lat' : undefined}>{txt}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 grid gap-2.5">
            <a href={CV_FILE} download className="btn btn-primary justify-center">
              <Icon name="download" size={16} />{t.download}
            </a>
            <a href={CV_FILE} target="_blank" rel="noopener noreferrer" className="btn btn-ghost justify-center">
              <Icon name="external" size={16} />{t.open}
            </a>
          </div>
          <p className="lat mt-4 text-center text-[12px]" style={{ color: 'var(--ink-3)' }}>{t.meta}</p>
        </div>

        {/* The document itself, on screens wide enough to read it. */}
        <div className="cvp-doc hidden md:flex">
          <div className="cvp-doc-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="lat">Ahmed-Al-Hawajiri-CV.pdf</span>
            <button onClick={close} aria-label={T[lang].detail.close} className="lb-btn" style={{ width: 34, height: 34 }}><Icon name="x" size={16} /></button>
          </div>
          <iframe src={`${CV_FILE}#toolbar=0&navpanes=0&view=FitH`} title={t.title} className="cvp-frame" />
        </div>
      </div>
    </div>
  );
}
