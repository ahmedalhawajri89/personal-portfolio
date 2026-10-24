'use client';

import { useEffect, useRef, useState } from 'react';
import { T, other } from '../lib/i18n';
import { PROFILE, PROJECTS } from '../content/projects';
import Icon from './Icons';
import LangFx from './LangFx';
import { loadMotion, whenIdle } from '../lib/motion';

/* Inertial scrolling for a mouse or trackpad, from the one engine every
   animation on the page shares (lib/motion.js): Lenis driven by GSAP's ticker.
   It starts when the page is idle, off for touch and for reduced motion, and
   anchor links go through it too, landing on each section's scroll-margin. */
export function SmoothScroll() {
  // Off-screen sections skip layout until they near the screen (see
  // globals.css). Any jump must be computed against real heights, so the
  // first in-page link click or hash change lays the whole page out first --
  // in the capture phase, before Lenis or the browser reads the target.
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('cv-off')) return;
    const full = () => {
      root.classList.add('cv-off');
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHash);
    };
    const onClick = (e) => {
      const a = e.target.closest?.('a[href*="#"]');
      if (a && a.pathname === location.pathname) full();
    };
    // A hash typed into the address bar (or reached with Back) scrolls before
    // hashchange fires, against guessed heights; lay out, then land again.
    const onHash = () => {
      full();
      const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);
  useEffect(() => whenIdle(() => { loadMotion(); }), []);
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
    const anims = document.querySelectorAll('.gradient-border, .pipe, .bento, .tk');
    const live = new IntersectionObserver((entries) =>
      entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)));
    anims.forEach((el) => live.observe(el));

    return () => { io.disconnect(); live.disconnect(); mio.disconnect(); };
  }, []);
  return null;
}

/* How far down the page we are, as --p, on the elements that draw it (those
   marked data-progress: the header's line). It used to be set on the root,
   where every element on the page inherits it, so each scroll frame made the
   browser restyle the whole document -- measured at about 9 ms a frame, 16 s
   of a 19 s scroll, and the reason scrolling felt heavy. Set on the header
   alone, a frame restyles a handful of elements. */
export function ScrollProgress() {
  useEffect(() => {
    const h = document.documentElement;
    let last = '';
    const on = () => {
      const v = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4);
      if (v === last) return;
      last = v;
      document.querySelectorAll('[data-progress]').forEach((el) => el.style.setProperty('--p', v));
    };
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
      ?.setAttribute('content', next === 'dark' ? '#0E0E0C' : '#F7F6F3');
    try { localStorage.setItem('theme', next); } catch {}
    setDark(!dark);
  };
  // The switch is a reveal, not a fade: the page in its new colours opens
  // out of the button in a circle until it has covered the screen. The View
  // Transitions API holds a picture of the old page and of the new one; GSAP
  // drives the circle's radius on the new picture (--vt-r, read by the
  // ::view-transition-new rule in globals.css), so the curve of the reveal
  // is GSAP's and the content inside it is the real page, not a flat colour.
  // The icon turns over with it. Reduced motion, or a browser without the
  // API, gets the switch alone.
  const icon = useRef(null);
  const flip = async (e) => {
    const root = document.documentElement;
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const [{ gsap }] = await Promise.all([import('gsap')]);
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', '0px');
    root.classList.add('vt-theme');
    const vt = document.startViewTransition(apply);
    try {
      await vt.ready;
      gsap.fromTo(root, { '--vt-r': '0px' }, { '--vt-r': `${radius}px`, duration: 1.1, ease: 'expo.inOut' });
      if (icon.current) gsap.fromTo(icon.current, { rotate: -180, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.9, ease: 'back.out(2)' });
      await vt.finished;
    } finally {
      root.classList.remove('vt-theme');
    }
  };
  const t = T[lang];
  return (
    <button
      onClick={flip}
      aria-label={dark ? t.themeLight : t.themeDark}
      title={dark ? t.themeLight : t.themeDark}
      className="icon-btn"
    >
      <span ref={icon} style={{ display: 'grid' }}><Icon name={dark ? 'sun' : 'moon'} size={16} /></span>
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

  // At the top of the page the header is an open editorial bar across the
  // measure: the mark, the name with the role under it, the places a reader
  // jumps to, and on the far side the language, the theme and the one action. Once the page moves it gathers itself into a
  // floating capsule -- the mark, the links and the action -- so it takes
  // less of the screen the more there is to read under it. Contact is the
  // call to action, not a sixth link.
  const links = [
    ['work', t.nav.work],
    ['services', t.nav.services],
    ['process', t.nav.process],
    ['proof', t.nav.proof],
    ['about', t.nav.about],
  ];
  const watched = ['home', 'work', 'services', 'process', 'proof', 'skills', 'about', 'contact'];

  // Reading down, the capsule gets out of the way; any upward move brings it
  // back, and so does a pointer at the top edge. Travel is accumulated per
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

  // One lit pill with a line along its foot, under the section you are in,
  // and under the link the pointer is on while it is over the bar. It moves
  // as two edges rather than one box: the edge in the direction of travel
  // leaves first and fast, the other follows a beat later, so the pill
  // stretches toward the link it is going to and gathers itself there. It
  // appears with a small spring where there was none, and presses when a
  // link is chosen. Measured from the links themselves, so it fits any label
  // in either language, and measured again when the bar changes shape.
  const navRef = useRef(null);
  const indRef = useRef(null);
  const gsapRef = useRef(null);
  const hovering = useRef(false);
  const edge = useRef({ l: 0, r: 0, shown: false });
  useEffect(() => { import('gsap').then((m) => { gsapRef.current = m.gsap; }); }, []);

  const draw = () => {
    const el = indRef.current, s = edge.current;
    if (el) { el.style.left = `${s.l}px`; el.style.width = `${s.r - s.l}px`; }
  };
  const moveTo = (a) => {
    const el = indRef.current, gsap = gsapRef.current, s = edge.current;
    if (!el) return;
    const motion = gsap && matchMedia('(prefers-reduced-motion: no-preference)').matches;    if (!a) {
      if (!s.shown) return;
      s.shown = false;
      if (motion) gsap.to(el, { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
      else el.style.visibility = 'hidden';
      return;
    }
    const l = a.offsetLeft, r = l + a.offsetWidth;
    if (!motion || !s.shown) {
      if (gsap) gsap.killTweensOf(s);
      Object.assign(s, { l, r, shown: true });
      draw();
      if (motion) gsap.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', overwrite: 'auto' });
      else { el.style.visibility = 'visible'; el.style.opacity = '1'; }
      return;
    }
    const right = l > s.l;
    const lead = { duration: 0.34, ease: 'power3.out' };
    const trail = { duration: 0.62, ease: 'power3.inOut', delay: 0.04 };
    gsap.to(s, { r, ...(right ? lead : trail), overwrite: 'auto', onUpdate: draw });
    gsap.to(s, { l, ...(right ? trail : lead), overwrite: 'auto', onUpdate: draw });
  };
  const linkOf = (id) => navRef.current?.querySelector(`a[data-id="${id}"]`);

  // The section in view, whenever the pointer is not choosing.
  useEffect(() => { if (!hovering.current) moveTo(linkOf(active)); }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // The bar changed shape: put the pill back under its link, without travel.
  useEffect(() => {
    const fit = () => {
      const a = linkOf(active), s = edge.current;
      if (!a || !s.shown) return;
      gsapRef.current?.killTweensOf(s);
      Object.assign(s, { l: a.offsetLeft, r: a.offsetLeft + a.offsetWidth });
      draw();
    };
    const late = setTimeout(fit, 560);
    window.addEventListener('resize', fit);
    return () => { clearTimeout(late); window.removeEventListener('resize', fit); };
  }, [scrolled]); // eslint-disable-line react-hooks/exhaustive-deps

  const navOver = (e) => {
    const a = e.target.closest?.('a[data-id]');
    if (!a) return;
    hovering.current = true;
    moveTo(a);
  };
  const navLeave = () => { hovering.current = false; moveTo(linkOf(active)); };
  const press = () => {
    const gsap = gsapRef.current;
    if (gsap && indRef.current) gsap.fromTo(indRef.current, { scaleY: 0.78 }, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1,0.45)' });
  };

  const link = (id) => (home ? `#${id}` : `/${lang}/#${id}`);
  // A label that rolls on hover: the word slides up and its twin rises in
  // from below. The twin is drawn by CSS from data-t and carries no text of
  // its own for a screen reader; the link's name is the label once.
  const roll = (label) => <span className="roll" aria-hidden="true"><span className="roll-in" data-t={label}>{label}</span></span>;

  return (
    <>
    {/* Outside the bar: the bar moves by transform, which would hold a
        fixed overlay inside it. */}
    <LangFx lang={lang} />
    <div className={`tb${scrolled ? ' is-scrolled' : ''}${away ? ' is-away' : ''}`} data-progress>
      <header className="tb-in">
        <a href={`/${lang}/`} className="tb-brand" aria-label={PROFILE.name[lang]}>
          <Logo />
          <span className="tb-id" aria-hidden="true">
            <span className="tb-name">{PROFILE.name[lang]}</span>
            <span className="tb-role lat">Full-Stack · QA</span>
          </span>
        </a>

        {home ? (
          <nav ref={navRef} className="tb-nav" aria-label={t.nav.menu} onMouseOver={navOver} onMouseLeave={navLeave}>
            <span ref={indRef} className="tb-ind" aria-hidden="true" />
            {links.map(([id, label]) => (
              <a key={id} data-id={id} href={link(id)} aria-label={label} aria-current={active === id ? 'location' : undefined}
                 onClick={press} onFocus={(e) => moveTo(e.currentTarget)} onBlur={navLeave}>{roll(label)}</a>
            ))}
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
          <a href={link('contact')} className="tb-cta" data-magnetic aria-label={t.nav.cta}>
            {roll(t.nav.cta)}
            <span className="tb-cta-dot" aria-hidden="true" />
          </a>
        </div>
      </header>
    </div>
    </>
  );
}

/* The mark. An A drawn as one stroke -- up from the left foot, over the apex,
   down to the right -- with an orange check mark where its crossbar would
   be: a letter for the name, and a passing test for the way the work is
   held up. On load the A writes itself and the check is ticked after it; on
   hover the check is ticked again. The same geometry as /favicon.svg, so the
   tab and the page carry one mark, and it inverts with the theme through the
   ink and paper tokens. Still for reduced motion. */
export function Logo({ size = 34 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" className="logo-bg" />
      <path className="logo-a" d="M17 50 L32 14 L47 50" pathLength="1" />
      <path className="logo-check" d="M21 38 L28 44 L44 27" pathLength="1" />
    </svg>
  );
}

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
  const root = useRef(null);
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
  const roll = (label) => <span className="roll" aria-hidden="true"><span className="roll-in" data-t={label}>{label}</span></span>;

  // The name at the foot, in pieces GSAP can move: letters in English, words
  // in Arabic, where a span between two letters would break the join.
  const name = PROFILE.name[lang];
  const units = ar ? name.split(' ') : [...name];

  /* The footer's motion. As the page reaches its end the giant name rises
     out of the page edge piece by piece, from the middle outwards, tied to
     the scroll; the columns above it come up from behind. A mouse moving
     over the name lifts the letters nearest to it, a wave that follows the
     pointer and settles when it leaves. Off for reduced motion and, for the
     wave, for touch. */
  useEffect(() => {
    let mm, gone = false;
    const cancel = whenIdle(async () => {
      const { gsap } = await loadMotion();
      if (gone || !root.current) return;
      const el = root.current;
      const mark = el.querySelector('.foot-mark');
      const parts = Array.from(mark.querySelectorAll('.fm-u'));
      mm = gsap.matchMedia();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', pointer: '(hover: hover) and (pointer: fine)' }, (ctx) => {
        const { motion, pointer } = ctx.conditions;
        if (!motion) return;
        gsap.fromTo(parts, { yPercent: 105 }, {
          yPercent: 0, ease: 'none', stagger: { each: 0.04, from: 'center' },
          scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        });
        gsap.from(el.querySelector('.foot-in'), {
          y: 70, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: true },
        });
        if (!pointer) return;
        const lift = parts.map((u) => gsap.quickTo(u, 'y', { duration: 0.5, ease: 'power3' }));
        const move = (e) => {
          const size = parseFloat(getComputedStyle(mark).fontSize) || 120;
          parts.forEach((u, k) => {
            const r = u.getBoundingClientRect();
            const d = Math.abs(e.clientX - (r.left + r.width / 2));
            lift[k](-Math.max(0, 1 - d / (size * 1.6)) * size * 0.22);
          });
        };
        const rest = () => lift.forEach((q) => q(0));
        mark.addEventListener('pointermove', move);
        mark.addEventListener('pointerleave', rest);
        return () => { mark.removeEventListener('pointermove', move); mark.removeEventListener('pointerleave', rest); };
      });
    });
    return () => { gone = true; cancel(); mm?.revert(); };
  }, [lang]);

  return (
    <footer className="foot" ref={root}>
      <div className="wrap foot-in">
        {/* The last thing the page says, and the one way to answer it. */}
        <div className="foot-cta">
          <p className="foot-ask">{f.ask}</p>
          {links && (
            <a href={`mailto:${links.email}`} className="foot-big" data-magnetic aria-label={f.write}>
              {roll(f.write)}
              <span className="foot-big-dot" aria-hidden="true"><Icon name={ar ? 'arrowLeft' : 'arrowRight'} size={18} /></span>
            </a>
          )}
        </div>

        {/* Four columns a visitor scans in the order they need them: who this
            is, where to go, how to reach him, and whether he is free. */}
        <div className="foot-grid">
          <div>
            <p className="foot-name">{PROFILE.name[lang]}</p>
            <p className="foot-role">{t.about.role}</p>
            <p className="foot-line">{f.line}</p>
          </div>
          <nav aria-label={f.nav}>
            <p className="foot-h">{f.nav}</p>
            <ul className="foot-list">
              {nav.map(([id, label]) => <li key={id}><a href={link(id)} aria-label={label}>{roll(label)}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className="foot-h">{f.contact}</p>
            <ul className="foot-list">
              {links && (
                <li className="foot-mail">
                  <a href={`mailto:${links.email}`} className="lat">{links.email}</a>
                  <button type="button" onClick={copy} className={`foot-copy${copied ? ' is-done' : ''}`} aria-live="polite">{copied ? f.copied : f.copy}</button>
                </li>
              )}
              {channels.map(([label, href]) => (
                <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{roll(label)} <span className="foot-arr" aria-hidden="true">↗</span></a></li>
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

      {/* The name set as a signature across the full width, rising out of
          the page edge. Decorative: the same name is in the first column as
          text, so screen readers hear it once. */}
      <p className="foot-mark" aria-hidden="true">
        {units.map((u, k) => (
          <span key={k} className={`fm-u${u === ' ' ? ' is-space' : ''}`}>{u === ' ' ? ' ' : u}{ar && k < units.length - 1 ? ' ' : ''}</span>
        ))}
      </p>

      <div className="wrap">
        <div className="foot-base-row">
          <p className="lat">© {new Date().getFullYear()} Ahmed Al-Hawajiri</p>
          <p>{t.footer}</p>
        </div>
      </div>
    </footer>
  );
}
