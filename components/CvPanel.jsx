'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { T } from '../lib/i18n';
import { loadMotion, MOTION_OK } from '../lib/motion';
import Icon from './Icons';

export const CV_FILE = '/cv/Ahmed-Al-Hawajiri-CV.pdf';
// The PDF's pages drawn as pictures, so the résumé reads as paper in every
// browser (a phone shows an embedded PDF as one grey page, or not at all).
// Made from the PDF by scripts/cv-pages.py; run it again whenever the PDF
// changes, or the pictures will show the old one.
const PAGES = [
  { src: '/cv/page-1.webp', w: 1240, h: 1605 },
  { src: '/cv/page-2.webp', w: 1240, h: 1605 },
];
// Where each fact goes when it is followed.
const HREF = {
  mail: (x) => `mailto:${x}`,
  whatsapp: (x) => `https://wa.me/${x.replace(/\D/g, '')}`,
  github: (x) => `https://${x}`,
};

/**
 * The CV, shown rather than merely linked. A button anywhere on the page
 * opens it; the viewer itself is mounted on <body>, outside whatever section
 * holds the button, so nothing that moves or fades that section can reach it.
 */
export function CvButton({ lang, variant = 'ghost', compact = false }) {
  const t = T[lang].cv;
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  const close = () => { setOpen(false); btn.current?.focus(); };
  return (
    <>
      {compact ? (
        <button ref={btn} onClick={() => setOpen(true)} aria-label={t.btn} title={t.btn} className="icon-btn" aria-haspopup="dialog">
          <Icon name="fileText" size={16} />
        </button>
      ) : (
        <button ref={btn} onClick={() => setOpen(true)} className={`btn btn-${variant}`} aria-haspopup="dialog">
          <Icon name="fileText" size={16} />{t.btn}
        </button>
      )}
      {open && createPortal(<CvViewer lang={lang} onClose={close} />, document.body)}
    </>
  );
}

/* The résumé as paper on a desk. One side carries the person -- the mark,
   the name, the facts, each one something to act on -- and the two ways to
   take the document away; the other is the desk, with the two pages lying
   on it to read, and a count of the page in view.

   It opens like the site's curtain: the room dims, the sheet is wiped up
   from the bottom, the mark draws itself, the name rises out of its mask,
   the facts follow, and the pages are laid down one after the other, each
   turning straight as it lands. Closing plays it backwards, quicker. For
   reduced motion it simply appears and goes. */
function CvViewer({ lang, onClose }) {
  const t = T[lang].cv;
  const rtl = lang === 'ar';
  const root = useRef(null);
  const desk = useRef(null);
  const tl = useRef(null);
  const leaving = useRef(false);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const close = () => {
    if (leaving.current) return;
    leaving.current = true;
    if (tl.current) tl.current.timeScale(1.8).reverse().eventCallback('onReverseComplete', onClose);
    else onClose();
  };

  // The page behind stands still, Escape closes, and focus stays inside.
  useEffect(() => {
    const el = root.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let lenis;
    loadMotion().then((m) => { lenis = m.lenis; lenis?.stop(); });
    el.querySelector('.cvx-sheet').focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = el.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; lenis?.start(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The entrance, reversed for the exit.
  useEffect(() => {
    let gone = false;
    if (!matchMedia(MOTION_OK).matches) return;
    Promise.all([loadMotion(), import('gsap/DrawSVGPlugin')]).then(([{ gsap }, { DrawSVGPlugin }]) => {
      if (gone || !root.current) return;
      gsap.registerPlugin(DrawSVGPlugin);
      const el = root.current;
      const $ = (s) => el.querySelectorAll(s);
      const lean = rtl ? -1 : 1;
      // Full screen on a phone, so square corners there.
      const r = matchMedia('(min-width: 900px)').matches ? 22 : 0;
      tl.current = gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(el.querySelector('.cvx-veil'), { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' })
        .fromTo(el.querySelector('.cvx-sheet'),
          { clipPath: `inset(100% 0% 0% 0% round ${r}px)` },
          { clipPath: `inset(0% 0% 0% 0% round ${r}px)`, duration: 0.85, ease: 'expo.inOut' }, 0.05)
        .fromTo($('.cvx-a'), { drawSVG: 0 }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, 0.55)
        .fromTo($('.cvx-check'), { drawSVG: 0 }, { drawSVG: '100%', duration: 0.35, ease: 'power2.out' }, '>-0.05')
        .from($('.cvx-rise'), { yPercent: 110, duration: 0.9, stagger: 0.07 }, 0.6)
        .from($('.cvx-in'), { y: 18, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.75)
        .from($('.cvx-page'), {
          y: 140, rotation: (i) => (i % 2 ? -3 : 4) * lean, opacity: 0, duration: 1.1, stagger: 0.14, ease: 'expo.out',
        }, 0.55);
    });
    return () => { gone = true; tl.current?.kill(); };
  }, [rtl]);

  // The page in view, for the count in the desk's bar. The desk scrolls on
  // a wide screen; on a phone the whole sheet does.
  useEffect(() => {
    const scroller = matchMedia('(min-width: 900px)').matches ? desk.current : root.current.querySelector('.cvx-sheet');
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) setPage(Number(e.target.dataset.n));
    }), { root: scroller, threshold: 0.4 });
    desk.current.querySelectorAll('.cvx-page').forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  const copy = async (txt) => {
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <div ref={root} className="cvx" data-lenis-prevent>
      <div className="cvx-veil" onClick={close} aria-hidden="true" />
      <div className="cvx-sheet" role="dialog" aria-modal="true" aria-labelledby="cvx-name" tabIndex={-1}>
        <aside className="cvx-side">
          <div className="cvx-head">
            <svg className="cvx-mark" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="14" />
              <path className="cvx-a" d="M17 50 L32 14 L47 50" />
              <path className="cvx-check" d="M21 38 L28 44 L44 27" />
            </svg>
            <p className="cvx-k"><span className="cvx-mask"><span className="cvx-rise">{t.title}</span></span></p>
            <button type="button" onClick={close} className="cvx-x" aria-label={T[lang].detail.close}><Icon name="x" size={18} /></button>
          </div>

          <h2 id="cvx-name" className="cvx-name"><span className="cvx-mask"><span className="cvx-rise">{t.name}</span></span></h2>
          <p className="cvx-role"><span className="cvx-mask"><span className="cvx-rise">{t.role}</span></span></p>

          <ul className="cvx-facts">
            {t.facts.map(([icon, txt]) => {
              const lat = /^[\x20-\x7E]+$/.test(txt);
              const href = HREF[icon]?.(txt);
              const body = (<><span className="cvx-ico"><Icon name={icon} size={15} /></span><span className={lat ? 'lat' : undefined}>{txt}</span></>);
              return (
                <li key={txt} className="cvx-in">
                  {href
                    ? <a href={href} target={icon === 'mail' ? undefined : '_blank'} rel="noopener noreferrer" className="cvx-fact">{body}<span className="cvx-go" aria-hidden="true">↗</span></a>
                    : <span className="cvx-fact">{body}</span>}
                  {icon === 'mail' && (
                    <button type="button" className="cvx-copy" onClick={() => copy(txt)} aria-label={copied ? t.copied : t.copy}>
                      <Icon name={copied ? 'check' : 'copy'} size={14} /><span>{copied ? t.copied : t.copy}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="cvx-acts cvx-in">
            <a href={CV_FILE} download className="btn btn-primary"><Icon name="download" size={16} />{t.download}</a>
            <a href={CV_FILE} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Icon name="external" size={16} />{t.open}</a>
          </div>
          <p className="cvx-meta cvx-in">{t.meta}</p>
        </aside>

        <div className="cvx-desk">
          <div className="cvx-bar">
            <span className="lat">Ahmed-Al-Hawajiri-CV.pdf</span>
            <span className="cvx-count lat" aria-live="polite">{t.page} {page} / {PAGES.length}</span>
          </div>
          <div className="cvx-paper" ref={desk} tabIndex={0} aria-label={t.title}>
            {PAGES.map((p, k) => (
              <img key={p.src} className="cvx-page" data-n={k + 1} src={p.src} width={p.w} height={p.h}
                   alt={`${t.title}, ${t.page} ${k + 1}`} decoding="async" loading={k ? 'lazy' : 'eager'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
