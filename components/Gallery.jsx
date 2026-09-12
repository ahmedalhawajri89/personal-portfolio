'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { T } from '../lib/i18n';
import Icon from './Icons';

/**
 * Project gallery.
 *
 * Desktop pages sit in a browser frame with their path in the address bar;
 * phone pages sit in a phone bezel. Sections (storefront, admin, …) are tabs.
 * The lightbox shows the full-page capture inside a scrollable frame, so a
 * visitor scrolls through the real page rather than squinting at a crop.
 */
export default function Gallery({ lang, project, data }) {
  const t = T[lang].detail;
  const rtl = lang === 'ar';
  const { groups = {}, shots = [] } = data;
  const src = (f) => `/shots/${project}/${f}`;
  const label = (s) => (rtl ? s.labelAr : s.labelEn);

  const locales = [...new Set(shots.map((s) => s.locale))];
  const hasBoth = locales.length > 1;
  const hasMobile = shots.some((s) => s.device === 'mobile');
  const groupIds = Object.keys(groups).filter((g) => shots.some((s) => s.group === g));

  const [device, setDevice] = useState('desktop');
  const [loc, setLoc] = useState(locales.includes(lang) ? lang : locales[0]);
  const [group, setGroup] = useState('all');
  const [open, setOpen] = useState(-1);
  const [dir, setDir] = useState(0);          // -1 / 1: which way the last step went
  const [closing, setClosing] = useState(false);
  const [loaded, setLoaded] = useState('');   // file name of the full image that has loaded

  const base = useMemo(
    () => shots.filter((s) => s.device === device && (!hasBoth || s.locale === loc)),
    [shots, device, loc, hasBoth]
  );
  const list = useMemo(() => (group === 'all' ? base : base.filter((s) => s.group === group)), [base, group]);
  const countIn = (g) => base.filter((s) => s.group === g).length;

  useEffect(() => { if (group !== 'all' && !countIn(group)) setGroup('all'); }, [device, loc]); // eslint-disable-line

  // Close plays a short exit animation before the overlay unmounts.
  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setOpen(-1); setClosing(false); }, 220);
  }, []);
  const step = useCallback((d) => {
    setDir(d);
    setOpen((i) => (i < 0 ? i : (i + d + list.length) % list.length));
  }, [list.length]);
  const jump = (i) => { setDir(i > open ? 1 : -1); setOpen(i); };
  const show = (i) => { setDir(0); setOpen(i); };

  /* lightbox: keys, body scroll lock, preload neighbours, strip follows */
  const overlayRef = useRef(null);
  const stripRef = useRef(null);
  useEffect(() => {
    if (open < 0) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
      else if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
      else if (e.key === 'Home') jump(0);
      else if (e.key === 'End') jump(list.length - 1);
    };
    window.addEventListener('keydown', onKey);
    // Warm the cache two steps either way so a step never shows an empty frame.
    [1, -1, 2, -2].forEach((d) => {
      const s = list[(open + d + list.length) % list.length];
      if (s) { new Image().src = src(s.thumb); new Image().src = src(s.file); }
    });
    stripRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, close, step, rtl, list]); // eslint-disable-line

  const cur = open >= 0 ? list[open] : null;
  const Seg = ({ value, onChange, items }) => (
    <div className="seg" role="group">
      {items.map(([v, l, n, icon]) => (
        <button key={v} aria-pressed={value === v} onClick={() => onChange(v)}>
          {icon && <Icon name={icon} size={14} />}{l}{n != null && <span className="n">{n}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <section id="gallery" className="mt-20 scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t.gallery}</p>
          <p className="mt-3 text-[15px]" style={{ color: 'var(--ink-3)' }}>
            {t.galleryLede} · <span className="lat">{shots.length}</span> {t.screens}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasMobile && (
            <Seg value={device} onChange={setDevice}
                 items={[['desktop', t.desktop, null, 'layout'], ['mobile', t.mobile, null, 'phone']]} />
          )}
          {hasBoth && (
            <Seg value={loc} onChange={setLoc} items={locales.map((l) => [l, l === 'ar' ? t.ar : t.en])} />
          )}
        </div>
      </div>

      {groupIds.length > 1 && (
        <div className="mb-7 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <Seg value={group} onChange={setGroup}
               items={[['all', t.allGroups, base.length], ...groupIds.map((g) => [g, rtl ? groups[g].ar : groups[g].en, countIn(g)])]} />
        </div>
      )}

      {device === 'desktop' ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.file} className={i > 2 ? 'rise' : undefined} style={{ '--i': i % 3 }}>
              <button className="shot" onClick={() => show(i)} aria-label={`${label(s)} — ${t.openImage}`}>
                <span className="chrome"><i /><i /><i /><span className="url">{s.path}</span></span>
                <span className="pic block" style={{ aspectRatio: '16 / 10' }}>
                  <img src={src(s.thumb)} alt={label(s)} width={s.tw} height={s.th} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
                  <span className="veil"><span><Icon name="maximize" size={15} />{t.fullPage}</span></span>
                </span>
                <span className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-[14.5px] font-extrabold">{label(s)}</span>
                  <span className="chip px-2 py-0.5 text-[11px]">{rtl ? groups[s.group]?.ar : groups[s.group]?.en}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((s, i) => (
            <li key={s.file} className={i > 4 ? 'rise' : undefined} style={{ '--i': i % 5 }}>
              <button className="phone" onClick={() => show(i)} aria-label={`${label(s)} — ${t.openImage}`}>
                <span className="bezel block">
                  <span className="glass-screen block">
                    <img src={src(s.thumb)} alt={label(s)} width={s.tw} height={s.th} loading={i < 5 ? 'eager' : 'lazy'} decoding="async" />
                  </span>
                </span>
                <span className="mt-3 block text-center text-[13.5px] font-extrabold">{label(s)}</span>
                <span className="lat block text-center text-[11px]" style={{ color: 'var(--ink-3)' }}>{s.path}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {cur && (
        <div ref={overlayRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label(cur)}
             className={`lb${closing ? ' lb-closing' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div key={cur.file} className="lb-fade min-w-0">
                <p className="truncate text-[15px] font-extrabold">{label(cur)}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px]" style={{ color: 'var(--ink-3)' }}>
                  <span>{rtl ? groups[cur.group]?.ar : groups[cur.group]?.en}</span>
                  <span>·</span>
                  <span className="lat">{cur.path}</span>
                  <span>·</span>
                  <span>{cur.full ? t.fullPage : t.viewport}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="lat chip px-3 py-1 text-[12px]">{open + 1} / {list.length}</span>
              <a href={src(cur.file)} target="_blank" rel="noopener noreferrer" className="lb-btn" aria-label={t.openImage} title={t.openImage}>
                <Icon name="external" size={17} />
              </a>
              <button onClick={close} aria-label={t.close} className="lb-btn"><Icon name="x" size={18} /></button>
            </div>
          </div>

          <div className="lb-stage" onClick={(e) => e.target === e.currentTarget && close()}>
            <button className="lb-btn hidden sm:grid" onClick={() => step(-1)} aria-label={rtl ? t.next : t.prev}>
              <Icon name="chevronLeft" size={20} />
            </button>
            <div key={cur.file}
                 className={`lb-frame${cur.device === 'mobile' ? ' is-phone' : ''} ${dir === 0 ? 'lb-pop' : (dir > 0) !== rtl ? 'lb-from-end' : 'lb-from-start'}`}>
              {cur.device === 'desktop' && (
                <div className="shot chrome flex items-center gap-2 px-3" style={{ borderRadius: 0, boxShadow: 'none', border: 0, borderBottom: '1px solid var(--line)', height: 34, cursor: 'default' }}>
                  <i /><i /><i /><span className="url">{cur.path}</span>
                </div>
              )}
              <div className="lb-scroll">
                {/* The grid thumbnail stands in until the full capture arrives. */}
                {loaded !== cur.file && (
                  <img className="lb-placeholder" src={src(cur.thumb)} alt="" aria-hidden="true"
                       width={cur.tw} height={cur.th} />
                )}
                <img src={src(cur.file)} alt={label(cur)} width={cur.w} height={cur.h} decoding="async"
                     className={loaded === cur.file ? 'is-loaded' : undefined}
                     onLoad={() => setLoaded(cur.file)} />
              </div>
            </div>
            <button className="lb-btn hidden sm:grid" onClick={() => step(1)} aria-label={rtl ? t.prev : t.next}>
              <Icon name="chevronRight" size={20} />
            </button>
          </div>

          {cur.full && cur.h > cur.w * 0.8 && (
            <p className="mt-2 text-center text-[12.5px]" style={{ color: 'var(--ink-3)' }}>
              <Icon name="mouse" size={13} className="inline-block align-[-2px]" /> {t.scrollHint}
            </p>
          )}

          <div ref={stripRef} className="lb-strip">
            {list.map((s, i) => (
              <button key={s.file} className={s.device === 'mobile' ? 'is-phone' : undefined} aria-current={i === open}
                      onClick={() => jump(i)} aria-label={label(s)}>
                <img src={src(s.thumb)} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
