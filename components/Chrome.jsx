'use client';

import { useEffect, useRef, useState } from 'react';
import { T, other } from '../lib/i18n';
import { PROFILE } from '../content/projects';
import Icon from './Icons';
import { CvButton } from './CvPanel';

/* Reveal-on-scroll that can never hide content that is already on screen:
   anything within the first viewport is marked seen immediately. */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rise'));
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('seen');
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('seen')),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    els.forEach((el) => !el.classList.contains('seen') && io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/* Thin gradient bar at the very top showing how far down the page you are. */
/* How far down the page we are, published on the root as --p. It used to live
   on this one bar; the rail reads it too now, and a number that two things
   depend on belongs above both of them. */
export function ScrollProgress() {
  useEffect(() => {
    const h = document.documentElement;
    const on = () => h.style.setProperty('--p', String(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return <div className="progress" aria-hidden="true" />;
}

/* Drives every `.tl` timeline: --tl-p is how far the viewport's focus line
   (45% down the screen) has travelled through the list, so the fill grows on
   the way down and shrinks on the way up. Items whose dot is above that line
   get `.on`. */
export function TimelineScroll() {
  useEffect(() => {
    const lists = Array.from(document.querySelectorAll('.tl'));
    if (!lists.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lists.forEach((tl) => tl.querySelectorAll('li').forEach((li) => li.classList.add('on')));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const focus = window.innerHeight * 0.45;
      lists.forEach((tl) => {
        const r = tl.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (focus - r.top) / r.height));
        tl.style.setProperty('--tl-p', p.toFixed(4));
        tl.querySelectorAll(':scope li').forEach((li) => {
          const dot = li.getBoundingClientRect().top + 35;
          li.classList.toggle('on', dot <= focus);
        });
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

/* Soft light that follows the pointer. Desktop only, off for reduced motion. */
export function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    let raf = 0, x = 0, y = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x - 260}px, ${y - 260}px)`;
        el.classList.add('on');
        raf = 0;
      });
    };
    const leave = () => el.classList.remove('on');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" style={{ transform: 'translate(-50%,-50%)' }} aria-hidden="true" />;
}

/* Cycles through a list of phrases; the widest one reserves the space. */
export function Rotating({ words, interval = 2600 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className="rot">
      {words.map((w, n) => (
        <span key={w} aria-hidden={n !== i}>{w}</span>
      ))}
    </span>
  );
}

/* Subtle 3D tilt for cards. Pointer-only, no effect on touch. */
export function Tilt({ children, className, max = 6 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-4px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ transition: 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s, border-color .3s', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

export function ThemeToggle({ lang }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);
  const apply = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    // Keep the browser chrome in step with the page it frames.
    document.querySelector('meta[name=theme-color]')
      ?.setAttribute('content', next === 'dark' ? '#0A0B10' : '#F6F7FB');
    try { localStorage.setItem('theme', next); } catch {}
    setDark(!dark);
  };
  // Circular reveal from the button via the View Transitions API.
  const flip = (e) => {
    const root = document.documentElement;
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${radius}px`);
    document.startViewTransition(apply);
  };
  const t = T[lang];
  return (
    <button
      onClick={flip}
      aria-label={dark ? t.themeLight : t.themeDark}
      title={dark ? t.themeLight : t.themeDark}
      className="icon-btn"
    >
      <Icon name={dark ? 'sun' : 'moon'} size={16} />
    </button>
  );
}

/* Floating glass dock. Tracks the active section on the home page. */
/* The in-page section navigation.
 *
 * It used to carry the header's four links, which is why it read as an
 * ornament rather than a map: a rail that lists half the page cannot tell
 * anyone where they are in it. It now carries every section the page
 * actually renders, and the header keeps its four — two lists because they
 * answer two questions. The header asks "where do you want to go on this
 * site"; the rail answers "where are you in this page, and what is left".
 *
 * The marks are the same short rules used elsewhere rather than the dots a
 * carousel would use: length and weight carry the state, and the accent —
 * spent nowhere else in this component — marks the section in view.
 */
function SectionRail({ items, active, label, lang }) {
  // The rail maps the sections; the footer is not one of them. Once the page
  // has run out of sections the rail has nothing left to point at, and a map
  // of a finished thing floating over the closing panel reads as a leftover.
  // So it retires — at the moment the footer reaches the rail's own height,
  // which is the viewport's middle, because that is where the rail sits.
  // Observed rather than computed from a scroll offset: the footer moves when
  // content above it changes, and a number would not.
  const [done, setDone] = useState(false);
  const railRef = useRef(null);
  const idx = items.findIndex(([id]) => id === active);
  useEffect(() => {
    const foot = document.querySelector('footer.foot-sheet');
    if (!foot) return;
    let io;
    // The line to cross is the rail's *lowest* mark, because that is where an
    // overlap starts. The rail is centred, so its bottom edge sits at half the
    // viewport plus half its own height from the top — which is the same
    // distance up from the bottom, and that is what rootMargin takes.
    const watch = () => {
      io?.disconnect();
      const h = railRef.current?.offsetHeight || 240;
      const up = Math.max(0, Math.round(window.innerHeight / 2 - h / 2));
      io = new IntersectionObserver(([e]) => setDone(e.isIntersecting), {
        rootMargin: `0px 0px -${up}px 0px`,
        threshold: 0,
      });
      io.observe(foot);
    };
    watch();
    // Recomputed on resize because both terms are viewport-dependent — no
    // scroll listener, and no number baked into the stylesheet.
    window.addEventListener('resize', watch);
    return () => { io?.disconnect(); window.removeEventListener('resize', watch); };
  }, []);

  return (
    <nav ref={railRef} className={`rail${done ? ' is-done' : ''}`} aria-label={label} aria-hidden={done || undefined}>
      <span className="rail-track" aria-hidden="true" />
      <span className="rail-fill" aria-hidden="true" />
      {/* One marker that travels between the items rather than eight that
          each blink on and off. The move is the only animation here, and it
          is the thing that reads as scrolling. */}
      {idx >= 0 && <span className="rail-thumb" style={{ '--i': idx }} aria-hidden="true" />}
      <ol className="rail-list">
        {items.map(([id, text, icon]) => {
          const on = active === id;
          return (
            <li key={id}>
              {/* `location` rather than `true`: this is a position within the
                  page, which is the one thing that value is for. */}
              <a href={`#${id}`} className="rail-item" aria-current={on ? 'location' : undefined}>
                <span className="rail-ico" aria-hidden="true"><Icon name={icon} size={15} /></span>
                <span className="rail-label">{text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Nav({ lang, path = '', home = false, title = '' }) {
  const t = T[lang];
  const o = other(lang);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);

  // Icon + name. The name stays visible for the active section and unfolds
  // on hover for the rest, so the bar reads as icons but never has to be guessed.
  // Four destinations in the bar: the places somebody jumps to on purpose.
  const items = [
    ['work', t.nav.work, 'layout'],
    ['services', t.nav.services, 'layers'],
    ['about', t.nav.about, 'user'],
    ['contact', t.nav.contact, 'send'],
  ];

  // …and every section the page renders, for the rail. `timeline` and
  // `testimonials` are deliberately absent: their content lists are empty, so
  // those sections are not in the document and must not be in the map of it.
  const sections = [
    ['home', t.nav.home2, 'home'],
    ['work', t.nav.work, 'layout'],
    // A list, because the section is a numbered list of working rules.
    ['process', t.nav.process, 'list'],
    // The same shield the capabilities grid uses for `الجودة` — tests are
    // what that section is about, so the glyph is borrowed, not invented.
    ['proof', t.nav.proof, 'shield'],
    ['services', t.nav.services, 'layers'],
    ['skills', t.nav.skills, 'code'],
    ['about', t.nav.about, 'user'],
    ['contact', t.nav.contact, 'send'],
  ];

  // Reading down, the bar is in the way and the rail can name the sections on
  // its own, so the bar leaves. Any upward move is a reader looking for it
  // again, and so is a pointer at the very top edge — that one costs no
  // scrolling at all.
  //
  // Travel is accumulated per direction rather than judged frame by frame: a
  // page of lazy images re-anchors the scroll by a few pixels now and then,
  // and against a single-frame test that reads as "went up" and flaps the bar
  // back into view mid-read. 24px of deliberate movement is the price of a
  // flip, and the run resets whenever the direction genuinely changes.
  useEffect(() => {
    let last = window.scrollY, run = 0;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const d = y - last;
      if (d) {
        run = (d > 0) === (run > 0) ? run + d : d;
        if (y < 140) setAway(false);
        else if (run > 24) setAway(true);
        else if (run < -24) setAway(false);
        last = y;
      }
    };
    on();
    const peek = (e) => { if (e.clientY < 10) setAway(false); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('mousemove', peek, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('mousemove', peek);
    };
  }, []);

  useEffect(() => {
    if (!home) return;
    const secs = sections.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  const link = (id) => (home ? `#${id}` : `/${lang}/#${id}`);

  // What the location field says. On the home page it is the section in view;
  // on a case study the page is the location, so it names the project.
  const here = home
    ? (sections.find(([id]) => id === active)?.[1] ?? sections[0][1])
    : (title || t.nav.back);

  return (
    <>
    {home && <SectionRail items={sections} active={active} label={t.nav.inPage} lang={lang} />}
    <div className={`hdr-wrap fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4${away ? ' is-away' : ''}`} style={{ pointerEvents: 'none' }}>
      <header
        className={`glass hdr transition-all duration-500${scrolled ? ' hdr-tight' : ''}`}
        style={{
          pointerEvents: 'auto',
          '--hdr-max': scrolled ? '860px' : '1200px',
          borderRadius: scrolled ? 999 : 20,
          boxShadow: scrolled ? 'var(--glow)' : 'var(--shadow)',
        }}
      >
        <div className="flex h-14 items-center justify-between gap-3 ps-2.5 pe-2 sm:ps-3">
          {/* Two lines at the top of the page, one after that. A visitor who
              has not scrolled yet has no idea who this is; a visitor who has
              read three sections does, and wants the bar out of the way. */}
          <a href={`/${lang}/`} className="brand">
            <span className="brand-mark"><span className="lat">A</span></span>
            <span className="brand-id hidden sm:grid">
              <span className="brand-name">{PROFILE.name[lang]}</span>
              {/* Latin only, and deliberately: this line is letter-spaced, and
                  letter-spacing on Arabic pulls the joined letterforms apart.
                  It also states the role rather than two of the tools — the
                  whole point of the positioning is that it is not a tech list. */}
              <span className="lat brand-role">FULL-STACK</span>
            </span>
          </a>

          {/* Where you are, in the field treatment the gallery uses for a page
              URL. The screenshots in this site all sit in a browser frame with
              their real path in an inset mono field; the bar borrows that one
              element — not the frame, not the traffic lights, which inside a
              real browser would be fancy dress. */}
          <span className="hdr-sep hdr-sep-loc" aria-hidden="true" />
          {/* Hidden from assistive tech on purpose. The rail already carries
              the position as aria-current, and a live region repeating it on
              every scroll would announce the same fact twice, continuously.
              One source of truth; this one is the visual half of it. */}
          <span className="hdr-loc" aria-hidden="true">
            <span className="hdr-loc-slash lat" aria-hidden="true">/</span>
            <span className="hdr-loc-text">{here}</span>
          </span>

          {home && (
          <nav className="nav-dock hidden md:flex xl:hidden" aria-label={t.nav.menu}>
            {items.map(([id, label, icon]) => (
              <a key={id} href={link(id)} className="dock-item" aria-current={active === id ? 'true' : undefined} aria-label={label}>
                <Icon name={icon} size={17} />
                <span className="dock-label">{label}</span>
              </a>
            ))}
          </nav>
          )}

          <div className="flex items-center gap-1">
            <a href={home ? '#contact' : `/${lang}/#contact`} className="hdr-cta">{t.nav.cta}</a>
            <span className="hdr-sep" aria-hidden="true" />
            {/* Both languages are shown, the current one lit. A single button
                labelled with the *other* language asks the reader to work out
                which way it goes; a pair states where they are and where they
                can be. The lit half is decoration — the reader is already
                there — so only the link carries a name. */}
            <div className="lang-seg">
              <span className={`lang-on${lang === 'en' ? ' lat' : ''}`} aria-hidden="true">
                {lang === 'en' ? 'EN' : 'ع'}
              </span>
              <a
                href={`/${o}${path}`}
                className={`lang-off${o === 'en' ? ' lat' : ''}`}
                aria-label={o === 'en' ? 'English' : 'العربية'}
                hrefLang={o}
              >
                {o === 'en' ? 'EN' : 'ع'}
              </a>
            </div>
            <CvButton lang={lang} compact />
            <ThemeToggle lang={lang} />
          </div>
        </div>
      </header>
    </div>
    </>
  );
}

/* Phone navigation: a thumb-reachable dock at the bottom of the screen. The
   active section's tab widens to show its name, the rest stay as icons.
   Hidden on desktop, where the top bar does the job. */
export function Dock({ lang, home = false }) {
  const t = T[lang];
  const [active, setActive] = useState('home');
  const [hidden, setHidden] = useState(false);
  const items = [
    ['home', t.nav.home, 'home'],
    ['work', t.nav.work, 'layout'],
    ['services', t.nav.services, 'layers'],
    ['about', t.nav.about, 'user'],
    ['contact', t.nav.contact, 'send'],
  ];
  const link = (id) => (home ? (id === 'home' ? '#home' : `#${id}`) : `/${lang}/#${id}`);

  useEffect(() => {
    if (!home) return;
    const secs = items.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] }
    );
    secs.forEach((s) => io.observe(s));
    // Slip away while the keyboard is up (a focused field) or the lightbox is open.
    const onFocus = () => setHidden(!!document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName));
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', () => setTimeout(onFocus, 50));
    return () => { io.disconnect(); document.removeEventListener('focusin', onFocus); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  return (
    <nav className={`dock md:hidden${hidden ? ' is-hidden' : ''}`} aria-label={t.nav.menu}>
      {items.map(([id, label, icon]) => {
        const on = active === id;
        return (
          <a key={id} href={link(id)} className="dock-item" aria-current={on ? 'true' : undefined} aria-label={label}>
            <Icon name={icon} size={18} />
            <span className="dock-label">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

/* Phrases cross-fade: the leaving one dissolves into a heavy blur while the
   next one condenses out of it, both at the same instant, so the card is
   never empty. Latin phrases get the tight, heavy setting Geist-style
   wordmarks use. */
export function CyclingStatement({ phrases, hold = 1900 }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(-1);
  const box = useRef(null);
  // The dissolve blurs to 64px across a line as wide as the footer, which is
  // expensive enough to hold the main thread. Only spend it while someone is
  // actually looking: the footer sits off-screen for most of the visit.
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!live || matchMedia('(prefers-reduced-motion: reduce)').matches || phrases.length < 2) return;
    const id = setInterval(() => {
      setI((n) => { setPrev(n); return (n + 1) % phrases.length; });
    }, hold);
    return () => clearInterval(id);
  }, [live, phrases.length, hold]);
  const latin = (s) => /^[ -~]+$/.test(s);
  const cls = (s) => `xf-word${latin(s) ? ' lat xf-latin' : ''}`;
  return (
    <span ref={box} className="xf" aria-live="polite">
      {prev >= 0 && <span key={`o${prev}-${i}`} className={`${cls(phrases[prev])} xf-out`} aria-hidden="true">{phrases[prev]}</span>}
      <span key={`i${i}`} className={`${cls(phrases[i])}${prev >= 0 ? ' xf-in' : ''}`}>{phrases[i]}</span>
      {/* The longest phrase reserves the height so the card never jumps. */}
      <span className="invisible block" aria-hidden="true">{[...phrases].sort((a, b) => b.length - a.length)[0]}</span>
    </span>
  );
}

/* Contact form. With NEXT_PUBLIC_WEB3FORMS_KEY set it posts to Web3Forms and
   the message lands in the inbox; without a key it falls back to composing a
   mailto: link. Topic chips prefill the message so nobody faces an empty box. */
/* Which service receives the message. One variable swaps providers, because
   availability is a network fact, not a code choice: Web3Forms sits behind a
   Cloudflare edge that blocks some networks outright, and a portfolio whose
   contact form fails for the owner's own country is worse than no form.

   The payload carries the field names of every supported provider at once —
   they each read the ones they know and pass the rest through into the email,
   so no per-provider branching is needed. */
const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT
  || (W3F_KEY ? 'https://api.web3forms.com/submit' : '');

export function ContactForm({ lang, to }) {
  const f = T[lang].contact.form;
  const NL = String.fromCharCode(10);
  const [v, setV] = useState({ name: '', email: '', msg: '' });
  const [topics, setTopics] = useState([]);
  const [state, setState] = useState('idle'); // idle | sending | sent | failed
  const [gotcha, setGotcha] = useState('');   // honeypot: bots fill it, people never see it
  const [touched, setTouched] = useState({});  // fields the visitor has left once
  const [custom, setCustom] = useState([]);    // topics the visitor typed themselves
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const otherRef = useRef(null);
  const [shake, setShake] = useState(false);
  const MIN = 20;

  // One rule per field. Errors show only after a field is left, or on submit.
  const check = (k, val) => {
    const x = (val ?? v[k]).trim();
    if (k === 'name') return x.length >= 2 ? '' : f.errors.name;
    if (k === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x) ? '' : f.errors.email;
    if (k === 'msg') return x.length >= MIN ? '' : f.errors.msg;
    return '';
  };
  const errors = { name: check('name'), email: check('email'), msg: check('msg') };
  const show = (k) => touched[k] && errors[k];
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const left = Math.max(0, MIN - v.msg.trim().length);
  const anyShown = Object.keys(touched).some((k) => touched[k] && errors[k]);

  const subjectLine = () => `${topics.length ? topics.join(' · ') + ' — ' : ''}${v.name || ''}`;
  const openMail = () => {
    const subject = encodeURIComponent(subjectLine());
    const body = encodeURIComponent([v.msg, '', v.name, v.email].join(NL));
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (gotcha) return;                      // a bot filled the hidden field
    const bad = ['name', 'email', 'msg'].filter((k) => errors[k]);
    if (bad.length) {
      setTouched({ name: true, email: true, msg: true });
      setShake(true); setTimeout(() => setShake(false), 550);
      e.currentTarget.querySelector(`[name="${bad[0]}"]`)?.focus();
      return;
    }
    if (!ENDPOINT) return openMail();
    setState('sending');
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          message: v.msg,
          topics: topics.join(', ') || '—',
          language: lang,
          access_key: W3F_KEY,                    // Web3Forms
          subject: `[Portfolio] ${subjectLine()}`, // Web3Forms
          from_name: v.name,                      // Web3Forms
          _subject: `[Portfolio] ${subjectLine()}`, // FormSubmit
          _template: 'table',                     // FormSubmit
          _captcha: 'false',                      // FormSubmit
        }),
      });
      const data = await r.json().catch(() => ({}));
      // Providers disagree on the success flag: Web3Forms sends `success`,
      // FormSubmit sends `success: "true"` as a string. A 2xx with no explicit
      // failure counts as delivered.
      if (!r.ok || data.success === false || data.success === 'false') throw new Error(data.message || r.statusText);
      setState('sent');
    } catch {
      setState('failed');
    }
  };

  const reset = () => { setV({ name: '', email: '', msg: '' }); setTopics([]); setState('idle'); };
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const known = (l) => [...f.topics, ...custom].some((t) => l === `• ${t}`);
  const toggle = (tp) => {
    const next = topics.includes(tp) ? topics.filter((x) => x !== tp) : [...topics, tp];
    setTopics(next);
    // Keep the message in step: one bullet per chosen topic, the visitor's
    // own text untouched.
    setV((s) => {
      const own = s.msg.split(NL).filter((l) => !known(l)).join(NL).replace(/^\s+/, '');
      const head = next.map((t) => `• ${t}`).join(NL);
      return { ...s, msg: head && own ? `${head}${NL}${NL}${own}` : head || own };
    });
  };
  // A typed topic becomes a selected chip; removing it un-selects it too.
  const addCustom = () => {
    const x = draft.trim().replace(/\s+/g, ' ').slice(0, 40);
    setDraft(''); setAdding(false);
    if (!x || [...f.topics, ...custom].some((t) => t.toLowerCase() === x.toLowerCase())) { if (x) toggle(x); return; }
    setCustom((c) => [...c, x]);
    toggle(x);
  };
  const removeCustom = (x) => { setCustom((c) => c.filter((t) => t !== x)); if (topics.includes(x)) toggle(x); };
  useEffect(() => { if (adding) otherRef.current?.focus(); }, [adding]);

  if (state === 'sent') {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border p-8 text-center"
           style={{ borderColor: 'var(--line)', background: 'var(--card-2)' }} role="status" aria-live="polite">
        <span className="on-accent grid h-16 w-16 place-items-center rounded-full">
          <Icon name="check" size={28} />
        </span>
        <p className="mt-5 text-[22px] font-extrabold">{f.sentH}</p>
        <p className="mt-2 max-w-[38ch] text-[15px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{f.sentB}</p>
        <button type="button" onClick={reset} className="btn btn-ghost mt-6" style={{ padding: '10px 18px', fontSize: 13.5 }}>{f.again}</button>
      </div>
    );
  }

  const busy = state === 'sending';
  return (
    <form onSubmit={submit} noValidate className={`flex h-full flex-col gap-3${shake ? ' shake' : ''}`} aria-busy={busy}>
      <div className="grid gap-3 sm:grid-cols-2">
        {[['name', 'text', f.name, 'name', undefined], ['email', 'email', f.email, 'email', 'ltr']].map(([k, type, label, ac, dir]) => {
          const bad = !!show(k);
          const ok = touched[k] && !errors[k] && v[k];
          return (
            <div key={k}>
              <label className="flabel" htmlFor={`f-${k}`}>{label}</label>
              <div className="fwrap" dir={dir}>
                <input id={`f-${k}`} name={k} className="field" type={type} value={v[k]} onChange={set(k)} onBlur={blur(k)}
                       autoComplete={ac} dir={dir} disabled={busy}
                       aria-invalid={bad || undefined} aria-describedby={bad ? `err-${k}` : undefined} />
                {(bad || ok) && <span className={`fmark ${bad ? 'bad' : 'ok'}`} aria-hidden="true"><Icon name={bad ? 'x' : 'check'} size={12} /></span>}
              </div>
              {bad && <p id={`err-${k}`} className="ferr" role="alert"><Icon name="alert" size={13} className="mt-0.5 shrink-0" />{errors[k]}</p>}
            </div>
          );
        })}
      </div>
      {/* Honeypot: off-screen, tab-skipped, never announced. */}
      <input type="text" name="botcheck" value={gotcha} onChange={(e) => setGotcha(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
             style={{ position: 'absolute', top: 0, insetInlineStart: 0, width: 1, height: 1, opacity: 0, overflow: 'hidden', clipPath: 'inset(50%)', pointerEvents: 'none' }} />

      <div>
        <p className="mb-2 text-[12.5px] font-bold" style={{ color: 'var(--ink-3)' }}>{f.topicsLabel}</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label={f.topicsLabel}>
          {f.topics.map((tp) => {
            const on = topics.includes(tp);
            return (
              <button key={tp} type="button" onClick={() => toggle(tp)} aria-pressed={on} disabled={busy}
                      className={`chip transition-all${on ? ' on-accent' : ''}`}
                      style={on ? { borderColor: 'transparent' } : undefined}>
                {on && <Icon name="check" size={12} />}{tp}
              </button>
            );
          })}
          {custom.map((tp) => (
            <span key={tp} className="chip on-accent" aria-pressed="true" style={{ borderColor: 'transparent' }}>
              <Icon name="check" size={12} />{tp}
              <button type="button" className="chip-x" onClick={() => removeCustom(tp)} aria-label={`${f.remove}: ${tp}`} disabled={busy}>
                <Icon name="x" size={10} />
              </button>
            </span>
          ))}
          {adding ? (
            <span className="chip-in">
              <input ref={otherRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={f.otherPh} aria-label={f.otherPh} maxLength={40}
                     aria-label={f.other}
                     onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
                     onBlur={() => (draft.trim() ? addCustom() : setAdding(false))} />
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={addCustom} disabled={!draft.trim()} aria-label={f.otherAdd}>
                <Icon name="check" size={12} />
              </button>
            </span>
          ) : (
            <button type="button" className="chip chip-add" onClick={() => setAdding(true)} disabled={busy}>
              <Icon name="plus" size={12} />{f.other}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <label className="flabel" htmlFor="f-msg">{f.msg}</label>
        <textarea id="f-msg" name="msg" className="field min-h-[140px] flex-1 resize-none" value={v.msg} onChange={set('msg')} onBlur={blur('msg')}
                  disabled={busy} aria-invalid={!!show('msg') || undefined} aria-describedby="msg-hint" />
        {show('msg')
          ? <p id="msg-hint" className="ferr" role="alert"><Icon name="alert" size={13} className="mt-0.5 shrink-0" />{errors.msg} <span className="lat">({f.moreChars.replace('{n}', left)})</span></p>
          : <p id="msg-hint" className={`fhint${left === 0 ? ' ok' : ''}`}>
              {left === 0 ? <><Icon name="check" size={12} />{f.enough}</> : (v.msg ? f.moreChars : f.minChars).replace('{n}', left || MIN)}
            </p>}
      </div>

      {state === 'failed' && (
        <div className="rounded-xl border px-4 py-3" role="alert"
             style={{ borderColor: 'color-mix(in srgb, #E11D48 40%, transparent)', background: 'color-mix(in srgb, #E11D48 8%, transparent)' }}>
          <p className="text-[13.5px] font-bold">
            {f.failed} <a href={`mailto:${to}`} className="lat underline">{to}</a>
          </p>
          {/* Nothing the visitor wrote is lost: this hands the whole message to
              their mail app, so a blocked request still reaches the inbox. */}
          <button type="button" onClick={openMail} className="btn btn-ghost mt-3" style={{ padding: '9px 16px', fontSize: 13 }}>
            <Icon name="mail" size={14} /> {f.openMailBtn}
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px]" style={{ color: anyShown ? '#E11D48' : 'var(--ink-3)' }}>
          {anyShown ? f.fix : (ENDPOINT ? f.secure : f.hint)}
        </p>
        <button type="submit" className="btn btn-primary" disabled={busy} style={busy ? { opacity: .7 } : undefined}>
          {busy ? f.sending : f.send} <Icon name="send" size={15} />
        </button>
      </div>

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1.5 border-t pt-3 text-[12.5px] font-bold" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }}>
        {f.trust.map((x) => (
          <li key={x} className="inline-flex items-center gap-1.5">
            <span className="grid h-4 w-4 place-items-center rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}><Icon name="check" size={10} /></span>{x}
          </li>
        ))}
      </ul>
    </form>
  );
}

export function BackToTop({ lang }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={T[lang].top}
      className="glass to-top fixed z-40 grid h-11 w-11 place-items-center transition-all"
      style={{
        insetInlineEnd: 20, borderRadius: 999,
        opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(12px)', pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <Icon name="arrowUp" size={17} />
    </button>
  );
}

export function Footer({ lang, links, home = false }) {
  const t = T[lang];
  const link = (id) => (home ? `#${id}` : `/${lang}/#${id}`);
  const items = [['work', t.nav.work], ['services', t.nav.services], ['about', t.nav.about], ['contact', t.nav.contact]];
  const social = links && [
    ['github', links.github, 'GitHub', true],
    ['mail', `mailto:${links.email}`, 'Email', false],
    ['whatsapp', links.whatsapp, 'WhatsApp', true],
    ['store', links.khamsat, 'Khamsat', true],
  ];
  return (
    <div className="foot-base">
      <footer className="foot-sheet">
        <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
          <a href={`/${lang}/`} className="flex items-center gap-3">
            <span className="on-accent lat grid h-10 w-10 place-items-center rounded-2xl text-[14px] font-extrabold">A</span>
            <span>
              <span className="block text-[15px] font-extrabold leading-tight">{lang === 'ar' ? 'أحمد الحواجري' : 'Ahmed Al-Hawajiri'}</span>
              <span className="block text-[10.5px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{t.badge.title}</span>
            </span>
          </a>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 13.5 }}>
            {t.top} <Icon name="arrowUp" size={14} />
          </button>
        </div>

        {/* Big statement, like a closing title card. */}
        <div className="foot-statement my-8 rounded-[28px] border px-6 py-14 text-center sm:py-20"
             style={{ borderColor: 'var(--line)' }}>
          <p className="eyebrow">{t.footerEyebrow}</p>
          <p className="mt-4 text-[clamp(30px,6vw,64px)] font-extrabold leading-[1.15] tracking-tight">
            <CyclingStatement phrases={t.footerStatement} />
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-b pb-6 text-[14px] font-bold" style={{ borderColor: 'var(--line)', color: 'var(--ink-2)' }}>
          {items.map(([id, label]) => <a key={id} href={link(id)} className="link-underline block py-1">{label}</a>)}
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-[13.5px] sm:flex-row" style={{ color: 'var(--ink-3)' }}>
          {social && (
            <p className="flex items-center gap-2">
              {social.map(([icon, href, label, ext]) => (
                <a key={icon} href={href} aria-label={label} target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}
                   className="grid h-10 w-10 place-items-center rounded-full border transition-all hover:-translate-y-0.5 hover:text-[var(--accent-ink)]"
                   style={{ borderColor: 'var(--line)', background: 'var(--card)' }}><Icon name={icon} size={16} /></a>
              ))}
            </p>
          )}
          <p>{t.footer}</p>
          <p className="lat">© {new Date().getFullYear()} Ahmed Al-Hawajiri</p>
        </div>
        </div>
      </footer>
    </div>
  );
}

/* The hero: a terminal that runs the real tests behind the site's claims.
   Lines appear one by one, each spins for a beat then passes; the summary
   lands, holds, and the run starts over. Reduced motion shows the finished run. */
export function TestRunner({ lang, tests }) {
  const t = T[lang].hero.runner;
  const [n, setN] = useState(0);        // how many lines have been started
  const [done, setDone] = useState(0);  // how many have passed
  const [cycle, setCycle] = useState(0);
  const finished = done >= tests.length;
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(tests.length); setDone(tests.length); return; }
    let a, b;
    if (!finished) {
      if (n === done) a = setTimeout(() => setN((x) => x + 1), n === 0 ? 700 : 260);
      else b = setTimeout(() => setDone((x) => x + 1), 520);
    } else {
      a = setTimeout(() => { setN(0); setDone(0); setCycle((c) => c + 1); }, 4200);
    }
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [n, done, finished, tests.length]);
  const rerun = () => { setN(0); setDone(0); setCycle((c) => c + 1); };
  return (
    <div className="runner" aria-live="polite" aria-label={t.cmd}>
      <div className="runner-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="runner-cmd">$ {t.cmd}</span>
        <button type="button" onClick={rerun} className="runner-rerun" aria-label={t.rerun} title={t.rerun}><Icon name="arrowUp" size={12} /></button>
      </div>
      <ol className="runner-body" key={cycle}>
        {tests.map((x, i) => {
          const state = i < done ? 'pass' : i < n ? 'run' : 'wait';
          return (
            <li key={x.file} className={`runner-line is-${state}`}>
              <span className="runner-mark" aria-hidden="true">{state === 'pass' ? <Icon name="check" size={11} /> : state === 'run' ? <span className="spin" /> : ''}</span>
              <span className="runner-text">
                <span>{lang === 'ar' ? x.ar : x.en}</span>
                <span className="runner-file">{x.project}/tests/{x.file}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className={`runner-sum${finished ? ' is-on' : ''}`}>
        <span className="ok">✓ {tests.length} {t.passed}</span>
        <span>{t.total} {tests.length}</span>
        <span>1.{(cycle * 7 + 24) % 90 + 10}{t.time}</span>
      </div>
    </div>
  );
}

/* Local time in Gaza, ticking. Rendered empty on the server so there is no
   hydration mismatch, then filled on the client. */
