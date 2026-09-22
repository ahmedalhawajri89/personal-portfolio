'use client';

import { useEffect, useRef, useState } from 'react';
import { T, other } from '../lib/i18n';
import { PROFILE, PROJECTS } from '../content/projects';
import Icon from './Icons';

/* Inertial scrolling for a mouse or trackpad: the page glides to a stop
   instead of stepping with each notch of the wheel. Off for touch, where the
   platform already scrolls with momentum and a second layer of easing fights
   the finger, and off for reduced motion. Anchor links go through Lenis too,
   which reads each section's scroll-margin, so they land where native ones did. */
//
// Loaded on the first wheel or key press, not at startup. Created eagerly it
// cost the desktop score 15 points (97 -> 82, TBT 330ms): its per-frame loop
// ran through the window where the page is still becoming interactive. Now it
// is not in the initial bundle at all, and it arrives the moment it is needed.
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
    let lenis, gone = false;
    const start = async () => {
      window.removeEventListener('wheel', start);
      window.removeEventListener('keydown', start);
      const { default: Lenis } = await import('lenis');
      if (gone) return;
      lenis = new Lenis({
        autoRaf: true,
        // Follow-through, not a fixed-length glide. A 1.1s exponential ease made
        // the page trail the wheel and read as heavy; lerp closes 14% of the
        // gap each frame, so the page moves with the hand and only settles at
        // the very end.
        lerp: 0.14,
        wheelMultiplier: 1,
        // Lenis already honours each section's scroll-margin (96px); an extra
        // offset here doubled it and landed every anchor at 192. Jumps to a
        // section are a touch quicker than the old glide.
        anchors: { duration: 0.8 },
      });
    };
    window.addEventListener('wheel', start, { passive: true });
    window.addEventListener('keydown', start);
    return () => {
      gone = true;
      window.removeEventListener('wheel', start);
      window.removeEventListener('keydown', start);
      lenis?.destroy();
    };
  }, []);
  return null;
}

/* Reveal-on-scroll that can never hide content that is already on screen:
   anything within the first viewport is marked seen immediately. */
export function Reveal() {
  useEffect(() => {
    // A masked heading starts clipped to nothing, and an element with no
    // visible area never reports itself as intersecting -- observing it
    // directly left every section heading hidden for good. So each group of
    // masked lines is revealed by watching the box that contains them.
    const masks = Array.from(new Set(Array.from(document.querySelectorAll('.mask-rise')).map((m) => m.parentElement)));
    const showMasks = (box) => box.querySelectorAll(':scope > .mask-rise').forEach((m) => m.classList.add('seen'));
    const mio = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { showMasks(e.target); mio.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );
    masks.forEach((box) => mio.observe(box));
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

    // The two endless animations (the contact card's spinning border and the
    // pipeline's travelling dot) run only while on screen. Unlike `.seen`,
    // this toggles both ways: scroll away and they stop costing anything.
    const anims = document.querySelectorAll('.gradient-border, .pipe, .bento');
    const live = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)));
    anims.forEach((el) => live.observe(el));

    return () => { io.disconnect(); live.disconnect(); mio.disconnect(); };
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
    const lists = Array.from(document.querySelectorAll('.tl, .rules'));
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
        let reached = 0;
        tl.querySelectorAll(':scope li').forEach((li) => {
          const dot = li.getBoundingClientRect().top + 35;
          const on = dot <= focus;
          li.classList.toggle('on', on);
          if (on) reached++;
        });
        // which rule is current, for the counter beside the list (CSS counter)
        tl.style.setProperty('--tl-n', String(Math.max(1, reached)));
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
      ?.setAttribute('content', next === 'dark' ? '#0E0E0D' : '#F7F6F3');
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
export function Nav({ lang, path = '', home = false, title = '' }) {
  const t = T[lang];
  const o = other(lang);
  const ar = lang === 'ar';
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);

  // An editorial bar across the page: the name, the five places a reader
  // jumps to on purpose, and the tools. It replaces a floating pill that held
  // seven things -- a breadcrumb among them that only ever said "Home" -- and
  // the side rail, whose job the bar's own links and indicator now do.
  // Contact is the call to action on the right, not a sixth link.
  const links = [
    ['work', t.nav.work],
    ['services', t.nav.services],
    ['process', t.nav.process],
    ['proof', t.nav.proof],
    ['about', t.nav.about],
  ];
  const watched = ['home', 'work', 'services', 'process', 'proof', 'skills', 'about', 'contact'];

  // Reading down, the bar gets out of the way; any upward move brings it back,
  // and so does a pointer at the top edge. Travel is accumulated per
  // direction, so a few pixels of scroll anchoring from lazy images never
  // flaps it in and out mid-read.
  useEffect(() => {
    let last = window.scrollY, run = 0;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
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
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('mousemove', peek); };
  }, []);

  useEffect(() => {
    if (!home) return;
    const secs = watched.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((x, y) => y.intersectionRatio - x.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5] }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // One indicator that slides to the active link, measured from the link
  // itself so it fits any label in either language.
  const navRef = useRef(null);
  const [ind, setInd] = useState(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const a = nav.querySelector(`a[data-id="${active}"]`);
      // the word, not the padded box around it
      setInd(a ? { x: a.offsetLeft + 12, w: a.offsetWidth - 24 } : null);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  const link = (id) => (home ? `#${id}` : `/${lang}/#${id}`);

  return (
    <div className={`tb${scrolled ? ' is-scrolled' : ''}${away ? ' is-away' : ''}`}>
      <header className="wrap tb-in">
        <a href={`/${lang}/`} className="tb-brand">
          <Logo />
          <span className="tb-name">{PROFILE.name[lang]}</span>
        </a>

        {home ? (
          <nav ref={navRef} className="tb-nav" aria-label={t.nav.menu}>
            {links.map(([id, label]) => (
              <a key={id} data-id={id} href={link(id)} aria-current={active === id ? 'location' : undefined}>{label}</a>
            ))}
            {ind && <span className="tb-ind" aria-hidden="true" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />}
          </nav>
        ) : (
          <a href={`/${lang}/#work`} className="tb-back">
            <span aria-hidden="true">{ar ? '→' : '←'}</span> {title ? `${t.nav.back} · ${title}` : t.nav.back}
          </a>
        )}

        <div className="tb-tools">
          {/* Both languages shown, the current one lit; only the link to the
              other one carries a name. */}
          <div className="lang-seg">
            <span className={`lang-on${lang === 'en' ? ' lat' : ''}`} aria-hidden="true">{lang === 'en' ? 'EN' : 'ع'}</span>
            <a href={`/${o}${path}`} className={`lang-off${o === 'en' ? ' lat' : ''}`} aria-label={o === 'en' ? 'English' : 'العربية'} hrefLang={o}>
              {o === 'en' ? 'EN' : 'ع'}
            </a>
          </div>
          <ThemeToggle lang={lang} />
          <a href={link('contact')} className="tb-cta">{t.nav.cta}</a>
        </div>
      </header>
    </div>
  );
}

/* The mark: the favicon, drawn. An A written as one stroke -- up from the
   left foot, over the apex, down to the right -- and an orange dot where the
   pen stops, like the full stop at the end of a sentence. On load the stroke
   writes itself and the dot lands on the last point; on hover it writes again
   and the dot gives a small hop. The same geometry as /favicon.svg, so the tab
   and the page carry one mark, and it inverts with the theme through the ink
   and paper tokens. Still for reduced motion. */
export function Logo({ size = 30 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="logo-bg" />
      <path className="logo-a" d="M18 46 L32 17 L46 46" pathLength="1" />
      <circle className="logo-dot" cx="46" cy="46" r="5" />
    </svg>
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
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[var(--r-card)] border p-8 text-center"
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

      {/* A fixed, honest size: it used to stretch to the height of the column
          beside it, and a box that large reads as homework. */}
      <div className="flex flex-col">
        <label className="flabel" htmlFor="f-msg">{f.msg}</label>
        <textarea id="f-msg" name="msg" rows={6} className="field min-h-[150px] resize-y" value={v.msg} onChange={set('msg')} onBlur={blur('msg')}
                  disabled={busy} aria-invalid={!!show('msg') || undefined} aria-describedby="msg-hint" />
        {show('msg')
          ? <p id="msg-hint" className="ferr" role="alert"><Icon name="alert" size={13} className="mt-0.5 shrink-0" />{errors.msg} <span className="lat">({f.moreChars.replace('{n}', left)})</span></p>
          : <p id="msg-hint" className={`fhint${left === 0 ? ' ok' : ''}`}>
              {left === 0 ? <><Icon name="check" size={12} />{f.enough}</> : (v.msg ? f.moreChars : f.minChars).replace('{n}', left || MIN)}
            </p>}
      </div>

      {state === 'failed' && (
        <div className="rounded-[var(--r-ctl)] border px-4 py-3" role="alert"
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
  const f = t.foot;
  const ar = lang === 'ar';
  const link = (id) => (home ? `#${id}` : `/${lang}/#${id}`);
  const nav = [['work', t.nav.work], ['services', t.nav.services], ['process', t.nav.process], ['about', t.nav.about], ['contact', t.nav.contact]];
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(links.email); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${links.email}`; }
  };
  const channels = links ? [
    ['WhatsApp', links.whatsapp],
    ['GitHub', links.github],
    [ar ? 'خمسات' : 'Khamsat', links.khamsat],
  ] : [];
  return (
    <footer className="foot">
      <div className="wrap">
        {/* Four columns a visitor scans in the order they need them: who this
            is, where to go, how to reach him, and whether he is free. No
            statement card and no second call to action -- the contact section
            is directly above, and a footer that shouts again reads as unsure. */}
        <div className="foot-grid">
          <div>
            <p className="foot-name">{PROFILE.name[lang]}</p>
            <p className="foot-role">{t.about.role}</p>
            <p className="foot-line">{t.hero.h1b}</p>
          </div>
          <nav aria-label={f.nav}>
            <p className="foot-h">{f.nav}</p>
            <ul className="foot-list">
              {nav.map(([id, label]) => <li key={id}><a href={link(id)}>{label}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className="foot-h">{f.contact}</p>
            <ul className="foot-list">
              {links && (
                <li className="foot-mail">
                  <a href={`mailto:${links.email}`} className="lat">{links.email}</a>
                  <button type="button" onClick={copy} className="foot-copy" aria-live="polite">{copied ? f.copied : f.copy}</button>
                </li>
              )}
              {channels.map(([label, href]) => (
                <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="foot-h">{f.status}</p>
            <ul className="foot-list foot-status">
              <li><span className="foot-dot" aria-hidden="true" />{t.hero.status}</li>
              <li>{PROFILE.location[lang]}</li>
              <li><span className="lat">GMT+3</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* The name set as a signature across the full width, its descenders
          cropped by the page edge. Decorative: the same name is in the first
          column as text, so screen readers hear it once. */}
      <p className="foot-mark" aria-hidden="true"><span>{PROFILE.name[lang]}</span></p>

      <div className="wrap">
        <div className="foot-base-row">
          <p className="lat">© {new Date().getFullYear()} Ahmed Al-Hawajiri</p>
          <p>{t.footer}</p>
        </div>
      </div>
    </footer>
  );
}

/* The hero: a terminal that runs the real tests behind the site's claims.
   Lines appear one by one, each spins for a beat then passes; the summary
   lands, holds, and the run starts over. Reduced motion shows the finished run. */
export function TestRunner({ lang, tests }) {
  const t = T[lang].hero.runner;
  const [n, setN] = useState(0);        // how many lines have been started
  const [done, setDone] = useState(0);  // how many have passed
  const total = tests.length;
  const finished = done >= total;
  // Every row is on the page from the first frame, queued. The old runner
  // hid rows until they ran, so the first thing a visitor saw was an empty
  // white box -- it read as a page that had not loaded. Now the motion is a
  // change of state on rows that are already there.
  //
  // It runs once and then holds: a loop that re-rendered every few hundred
  // milliseconds forever was noise to read past and cost to scroll past. It
  // waits for the browser to be idle and for the panel to be on screen.
  const box = useRef(null);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : setTimeout(() => setReady(true), 1200);
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0 });
    if (box.current) io.observe(box.current);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle); else clearTimeout(idle);
      io.disconnect();
    };
  }, []);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(total); setDone(total); return; }
    if (!ready || !live || finished) return;
    const id = n === done
      ? setTimeout(() => setN((x) => x + 1), n === 0 ? 250 : 220)
      : setTimeout(() => setDone((x) => x + 1), 480);
    return () => clearTimeout(id);
  }, [n, done, finished, ready, live, total]);
  const rerun = () => { setN(0); setDone(0); };
  // Counted from the tests themselves, not typed: how many projects they span.
  const projects = new Set(tests.map((x) => x.project)).size;
  return (
    <div ref={box} className="runner" aria-label={t.cmd}>
      <div className="runner-bar">
        <span className="runner-cmd"><span aria-hidden="true">$ </span>{t.cmd}</span>
        <button type="button" onClick={rerun} className="runner-rerun" aria-label={t.rerun} title={t.rerun}><Icon name="arrowUp" size={12} /></button>
      </div>
      {/* The only orange on the panel: it fills as each rule passes. */}
      <div className="runner-progress" aria-hidden="true"><i style={{ transform: `scaleX(${done / total})` }} /></div>
      <ol className="runner-body">
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
      <div className="runner-sum">
        <span className="runner-status" aria-live="polite">
          {finished
            ? <span className="ok">✓ {total} {t.passed}</span>
            : <span>{n ? t.running : t.queued}</span>}
          <span className="runner-meta">{total} {t.rules} · {projects} {t.projects}</span>
        </span>
        <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="runner-code">{t.code} <span aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span></a>
      </div>
    </div>
  );
}

/* Local time in Gaza, ticking. Rendered empty on the server so there is no
   hydration mismatch, then filled on the client. */

/* The hero's background: a faint schema -- two tables, the API, the screen --
   and one orange request travelling from the database to the interface every
   few seconds. It is the headline drawn rather than a texture: "from database
   to interface". The names are the booking project's own: the API locks the
   `resources` row before writing to `bookings`, and the operator's board is
   a Vue screen.

   It never sits behind text. Every box is placed at runtime in the gaps the
   two columns leave -- the band above the runner, the corridor between the
   columns, the band below -- so it follows the layout rather than guessing
   it. Below 1024px the columns stack, there are no gaps, and it is hidden.

   Cheap on purpose: one canvas, drawn only while the hero is on screen, at
   most 2x pixel density, a still frame for reduced motion, colours read
   from the theme tokens so dark mode needs nothing extra. */
export function SchemaTrace() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;
    // Below lg the columns stack and the canvas is display:none. Hiding it is
    // not enough -- the effect would still size a hero-sized bitmap and keep
    // three observers alive on every phone -- so it does not start at all.
    if (!matchMedia('(min-width: 1024px)').matches) return;
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, nodes = [], path = [], len = 0, raf = 0, on = false, t0 = 0;
    let ink = '#141414', sig = '#FF4D00';
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue('--ink').trim() || ink;
      sig = cs.getPropertyValue('--accent').trim() || sig;
    };
    const rgba = (hex, a) => {
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };

    const layout = () => {
      const hr = host.getBoundingClientRect();
      const text = host.firstElementChild?.getBoundingClientRect();
      const run = host.querySelector('.runner')?.getBoundingClientRect();
      W = hr.width; H = hr.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!text || !run || W < 1000) { nodes = []; path = []; return; }
      const rx = (r) => ({ l: r.left - hr.left, t: r.top - hr.top, r: r.right - hr.left, b: r.bottom - hr.top });
      const T = rx(text), R = rx(run);
      const rtl = document.dir === 'rtl';
      // the corridor between the two columns
      const cx = rtl ? (R.r + T.l) / 2 : (T.r + R.l) / 2;
      const near = rtl ? R.r : R.l;                 // runner edge on the corridor side
      const dir = rtl ? -1 : 1;                     // away from the corridor
      const bw = 132, bh = 62, gap = 22;
      const topY = Math.max(92, R.t - bh - 30);
      const botY = Math.min(H - 58, R.b + 42);
      const x0 = rtl ? near - bw : near;
      // A box is never narrower than its longest label: sized from the text.
      ctx.font = "500 10.5px GeistMono, ui-monospace, monospace";
      const fit = (w, labels) => Math.max(w, ...labels.map((l) => Math.ceil(ctx.measureText(l).width) + 22));
      const box = (x, y, w, h, title, rows) => ({ x, y, w: fit(w, [title, ...rows]), h, title, rows, lit: 0 });
      const next = (prev, w) => (rtl ? prev.x - gap - w : prev.x + prev.w + gap);
      const place = (n) => { if (rtl) n.x = near - n.w; return n; };
      const resources = place(box(x0, topY, bw, bh, 'resources', ['id', 'capacity']));
      const bookings = box(0, topY, bw + 10, bh, 'bookings', ['starts_at', 'ends_at']);
      bookings.x = next(resources, bookings.w);
      const api = place(box(x0, botY, 118, 30, 'POST /api/bookings', []));
      const ui = box(0, botY, 118, 30, 'BookingBoard.vue', []);
      ui.x = next(api, ui.w) + dir * 60;
      nodes = [resources, bookings, api, ui];
      // bookings -> resources -> corridor -> down -> api -> ui
      const mid = (n) => n.y + n.h / 2;
      const edgeNear = (n) => (rtl ? n.x + n.w : n.x);
      const edgeFar = (n) => (rtl ? n.x : n.x + n.w);
      path = [
        [edgeNear(bookings), mid(bookings)],
        [edgeFar(resources), mid(resources)],
        [edgeNear(resources), mid(resources)],
        [cx, mid(resources)],
        [cx, mid(api)],
        [edgeNear(api), mid(api)],
        [edgeFar(api), mid(api)],
        [edgeNear(ui), mid(ui)],
      ];
      path.hit = [[1, resources], [6, api], [7, ui]];   // vertex index -> node it enters
      path.inside = new Set([1, 5]);                     // segments that cross a box: not drawn
      len = 0; path.seg = [];
      for (let i = 1; i < path.length; i++) {
        const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
        path.seg.push([len, d]); len += d;
      }
    };

    const at = (s) => {
      for (let i = 0; i < path.seg.length; i++) {
        const [start, d] = path.seg[i];
        if (s <= start + d) {
          const k = d ? (s - start) / d : 0;
          const [ax, ay] = path[i], [bx, by] = path[i + 1];
          return [ax + (bx - ax) * k, ay + (by - ay) * k, i];
        }
      }
      const e = path[path.length - 1]; return [e[0], e[1], path.length - 2];
    };

    const round = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    };

    const TRAVEL = 2600, REST = 3400;
    const draw = (now) => {
      ctx.clearRect(0, 0, W, H);
      if (!nodes.length) return;
      // links
      ctx.strokeStyle = rgba(ink, 0.12); ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < path.length; i++) {
        if (path.inside.has(i - 1)) continue;           // the line stops at the box edge
        ctx.moveTo(path[i - 1][0], path[i - 1][1]); ctx.lineTo(path[i][0], path[i][1]);
      }
      ctx.stroke();
      // the request
      if (!reduce && now) {
        const cycleId = Math.floor((now - t0) / (TRAVEL + REST));
        const cyc = (now - t0) % (TRAVEL + REST);
        if (cyc < TRAVEL) {
          const e = cyc / TRAVEL, s = (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2) * len;
          const [hx, hy, seg] = at(s);
          // a box lights once per trip, the moment the request reaches it
          path.hit.forEach(([v, n]) => {
            const reach = v < path.length - 1 ? path.seg[v][0] : len;
            if (s >= reach - 1 && n.cyc !== cycleId) { n.lit = 1; n.cyc = cycleId; }
          });
          for (let k = 1; k <= 14; k++) {            // a short tail that fades
            const [tx, ty, ts] = at(Math.max(0, s - k * 5));
            if (path.inside.has(ts)) continue;
            ctx.fillStyle = rgba(sig, 0.5 * (1 - k / 14)); ctx.beginPath(); ctx.arc(tx, ty, 1.6, 0, 7); ctx.fill();
          }
          if (!path.inside.has(seg)) {                   // inside a box the box lights instead
            ctx.fillStyle = sig; ctx.beginPath(); ctx.arc(hx, hy, 3, 0, 7); ctx.fill();
            ctx.fillStyle = rgba(sig, 0.18); ctx.beginPath(); ctx.arc(hx, hy, 7, 0, 7); ctx.fill();
          }
        }
      }
      // boxes
      nodes.forEach((n) => {
        n.lit = Math.max(0, n.lit - 0.02);
        ctx.fillStyle = rgba(ink, 0.015 + n.lit * 0.02);
        round(n.x, n.y, n.w, n.h, 4); ctx.fill();
        ctx.strokeStyle = n.lit > 0.05 ? rgba(sig, 0.25 + n.lit * 0.45) : rgba(ink, 0.14);
        ctx.stroke();
        ctx.font = "500 10.5px GeistMono, ui-monospace, monospace";
        // Table and file names are code: always left-to-right, anchored at the
        // box's left edge. The canvas would otherwise inherit dir="rtl" and
        // hang every label off the wrong side of its box on the Arabic page.
        ctx.direction = 'ltr'; ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const tx = n.x + 10;
        if (n.rows.length) {
          ctx.fillStyle = rgba(ink, 0.42); ctx.fillText(n.title, tx, n.y + 13);
          ctx.strokeStyle = rgba(ink, 0.08); ctx.beginPath(); ctx.moveTo(n.x, n.y + 24); ctx.lineTo(n.x + n.w, n.y + 24); ctx.stroke();
          ctx.fillStyle = rgba(ink, 0.3);
          n.rows.forEach((r, i) => ctx.fillText(r, tx, n.y + 36 + i * 13));
        } else {
          ctx.fillStyle = rgba(ink, 0.42); ctx.fillText(n.title, tx, n.y + n.h / 2);
        }
      });
    };

    // Between trips nothing moves, so the loop sleeps until the next one
    // instead of redrawing an identical frame sixty times a second.
    let nap = 0;
    const loop = (now) => {
      draw(now); raf = 0;
      if (!on) return;
      const cyc = (now - t0) % (TRAVEL + REST);
      const glowing = nodes.some((n) => n.lit > 0.01);
      if (cyc >= TRAVEL && !glowing) nap = setTimeout(() => { nap = 0; if (on) raf = requestAnimationFrame(loop); }, TRAVEL + REST - cyc);
      else raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !nap && on && !reduce) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop); } };

    readTheme(); layout(); draw(0);
    document.fonts?.ready.then(() => { layout(); draw(0); });
    const ro = new ResizeObserver(() => { layout(); draw(0); });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) start(); }, { threshold: 0 });
    io.observe(host);
    const mo = new MutationObserver(() => { readTheme(); draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { ro.disconnect(); io.disconnect(); mo.disconnect(); if (raf) cancelAnimationFrame(raf); clearTimeout(nap); };
  }, []);
  return <canvas ref={ref} className="schema-trace" aria-hidden="true" />;
}


/* Engineering proof as case files. The hero runs the six tests as a list;
   this is where each one is read in depth, one at a time: the problem in the
   client's words, the decision in the engineer's, and the test that proves
   it, with the repository it lives in. A list of cases on one side and the
   open file on the other -- a proper tablist, so arrow keys move between
   cases and the panel is labelled by the tab that opened it. */
export function CaseFiles({ lang, tests }) {
  const t = T[lang].proof;
  const ar = lang === 'ar';
  const L = ar ? 'Ar' : 'En';
  const [i, setI] = useState(0);
  const tabs = useRef([]);
  const proj = (slug) => PROJECTS.find((x) => x.slug === slug);
  const key = (e) => {
    const next = { ArrowDown: 1, ArrowUp: -1, ArrowRight: ar ? -1 : 1, ArrowLeft: ar ? 1 : -1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const n = (i + next + tests.length) % tests.length;
    setI(n); tabs.current[n]?.focus();
  };
  const x = tests[i];
  const pr = proj(x.project);
  return (
    <div className="cf">
      <div className="cf-list" role="tablist" aria-orientation="vertical" aria-label={t.eyebrow} onKeyDown={key}>
        {tests.map((y, n) => (
          <button key={y.file} ref={(el) => (tabs.current[n] = el)} type="button" role="tab"
                  id={`cf-tab-${n}`} aria-controls="cf-panel" aria-selected={n === i} tabIndex={n === i ? 0 : -1}
                  className={`cf-tab${n === i ? ' is-on' : ''}`} onClick={() => setI(n)}>
            <span className="cf-n lat">{String(n + 1).padStart(2, '0')}</span>
            <span className="cf-t">{y[`prob${L}`]}</span>
            <span className="cf-p">{proj(y.project)?.[lang].name}</span>
          </button>
        ))}
      </div>

      <div id="cf-panel" role="tabpanel" aria-labelledby={`cf-tab-${i}`} className="cf-panel">
        {/* keyed on the case so each one enters fresh rather than morphing */}
        <div key={i} className="cf-file">
          <p className="cf-head lat">CASE {String(i + 1).padStart(2, '0')} · {pr?.[lang].name}</p>
          <ol className="cf-steps">
            <li>
              <span className="cf-dot" aria-hidden="true" />
              <p className="cf-k">{t.lProblem}</p>
              <p className="cf-v">{x[`prob${L}`]}</p>
            </li>
            <li>
              <span className="cf-dot" aria-hidden="true" />
              <p className="cf-k">{t.lDecision}</p>
              <p className="cf-v">{x[`dec${L}`]}</p>
            </li>
            <li className="is-proof">
              <span className="cf-dot" aria-hidden="true"><Icon name="check" size={11} /></span>
              <p className="cf-k">{t.lProof}</p>
              <p className="cf-file-path lat">{x.project}/tests/{x.file}</p>
              <p className="cf-rule">{ar ? x.ar : x.en}</p>
              {pr?.repo && (
                <a className="cf-repo" href={pr.repo} target="_blank" rel="noopener noreferrer">
                  {t.repo} <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

/* Services as stacked panels. Each panel: the service, what it gets you, the
   project that proves it, and that project's real screen in a browser frame.
   From 1024px, with room above and below, each panel pins a little lower than
   the one before and the next slides over it; the covered one settles back
   (a slight scale and shade) so the stack reads as depth, not as a pile.
   The effect is one scroll listener, only while the section is on screen,
   writing one number per panel. */
export function ServiceStack({ items, lang, tests }) {
  const t = T[lang].services;
  const list = useRef(null);
  useEffect(() => {
    const ol = list.current;
    if (!ol || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = [...ol.children];
    let raf = 0, live = false;
    const paint = () => {
      raf = 0;
      const pinned = matchMedia('(min-width: 1024px) and (min-height: 700px)').matches;
      for (let i = 0; i < cards.length; i++) {
        let p = 0;
        if (pinned && i < cards.length - 1) {
          const me = cards[i].getBoundingClientRect(), next = cards[i + 1].getBoundingClientRect();
          p = Math.min(1, Math.max(0, (me.bottom - next.top) / me.height));
        }
        cards[i].style.setProperty('--sink', p.toFixed(3));
      }
    };
    const on = () => { if (live && !raf) raf = requestAnimationFrame(paint); };
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting; on(); });
    io.observe(ol);
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { io.disconnect(); removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const n = String(items.length).padStart(2, '0');
  const visual = (it) => {
    if (it.shot) {
      return (
        <div className="svs-frame">
          <div className="card-bar" aria-hidden="true"><span className="lat">{it.shot.path}</span></div>
          <img src={it.shot.thumb} srcSet={`${it.shot.thumb} ${it.shot.tw}w, ${it.shot.file} ${it.shot.w}w`}
               sizes="(min-width: 1024px) 640px, 92vw" alt={it.name} loading="lazy" decoding="async" width="960" height="600" />
        </div>
      );
    }
    if (it.visual === 'figma') {
      return (
        <div className="svs-art svs-figma" aria-hidden="true">
          <div className="svs-pane">
            <small className="lat">{t.design}</small>
            <div className="svs-mock">
              <i className="svs-mock-img" /><i className="svs-mock-l" /><i className="svs-mock-l is-short" /><i className="svs-mock-btn" />
              <b className="svs-red is-pad lat">24</b><b className="svs-red is-gap lat">16</b>
            </div>
          </div>
          <div className="svs-pane is-code lat">
            <small>{t.code}</small>
            <code>
              <span><em>{'<article'}</em> class=<q>"p-6 gap-4 rounded-[10px]"</q><em>{'>'}</em></span>
              <span>{'  '}<em>{'<img'}</em> class=<q>"aspect-[4/3]"</q> <em>{'/>'}</em></span>
              <span>{'  '}<em>{'<h3'}</em> class=<q>"text-lg font-bold"</q><em>{'>'}</em></span>
              <span>{'  '}<em>{'<button'}</em> class=<q>"h-10 px-4"</q><em>{'>'}</em></span>
              <span><em>{'</article>'}</em></span>
            </code>
          </div>
        </div>
      );
    }
    if (it.visual === 'tests') {
      return (
        <div className="svs-art svs-term lat" aria-hidden="true">
          <p className="svs-cmd">$ ./vendor/bin/pest</p>
          {tests.map((x) => (
            <p key={x.file} className="svs-pass"><span>✓</span><span>{x.file.replace('.php', '')}</span></p>
          ))}
        </div>
      );
    }
    return (
      <div className="svs-art svs-diff lat" aria-hidden="true">
        <p className="svs-hunk">@@ -41,3 +41,3 @@</p>
        <p>{'   '}$qty = $request-&gt;integer('qty');</p>
        <p className="is-del">-  $product = Product::find($id);</p>
        <p className="is-add">+  $product = Product::lockForUpdate()-&gt;find($id);</p>
        <p>{'   '}abort_if($product-&gt;stock &lt; $qty, 409);</p>
      </div>
    );
  };

  return (
    <ol ref={list} className="svs" style={{ '--count': items.length }}>
      {items.map((it, i) => (
        <li key={it.h} className="svs-card" style={{ '--i': i }}>
          <div className="svs-in">
            <div className="svs-text">
              <p className="svs-n lat" aria-hidden="true"><b>{String(i + 1).padStart(2, '0')}</b> / {n}</p>
              <h3 className="svs-h">{it.h}</h3>
              <p className="svs-b">{it.b}</p>
              {it.href ? (
                <a className="svs-proof" href={it.href}>
                  <small>{t.proof}</small><span>{it.name}</span><span aria-hidden="true">↗</span>
                </a>
              ) : it.note ? (
                <p className="svs-proof is-note"><small>{t.note}</small><span className="lat">{it.note}</span></p>
              ) : null}
            </div>
            <div className="svs-vis">{visual(it)}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
