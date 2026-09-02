/* ==========================================================================
   main.js — the only entry point. Everything is progressive: if this file
   fails to load, the page is still readable, navigable and contactable.
   ========================================================================== */

/* Loaded as a classic script after i18n.js, so both work from `file://`.
   `I18N` and `applyLanguage` come from that file via `window`. */
(function () {
'use strict';
var I18N = window.I18N;
var applyLanguage = window.applyLanguage;

/* ---- 1. Language --------------------------------------------------------
   Order of preference: what the visitor chose last → the browser's language
   → Arabic. */
function initLanguage() {
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  const browser = (navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  const lang = saved || browser;

  applyLanguage(lang);

  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('lang') === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
  });
}

/* ---- 2. Theme -----------------------------------------------------------
   The visitor's explicit choice wins; otherwise we follow the operating
   system, and keep following it if they change it mid-visit. */
function initTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}

  const set = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#131211' : '#f3f1ec');
  };

  set(saved || (media.matches ? 'dark' : 'light'));

  media.addEventListener('change', (e) => {
    let explicit = null;
    try { explicit = localStorage.getItem('theme'); } catch (err) {}
    if (!explicit) set(e.matches ? 'dark' : 'light');
  });

  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* ---- 3. Reveal on scroll ------------------------------------------------
   One shared IntersectionObserver for the whole page rather than one per
   element, and each element is unobserved once it has appeared — the work
   is done once, not on every scroll frame. */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  items.forEach((el, i) => {
    // Stagger only within a group, so a long list never waits seconds.
    el.style.setProperty('--reveal-delay', `${(i % 6) * 70}ms`);
    io.observe(el);
  });
}

/* ---- 4. Nav state: stuck shadow, scroll progress, current section ------- */
function initNav() {
  const nav = document.querySelector('.site-nav');
  const bar = document.querySelector('.progress');
  const toTop = document.querySelector('.to-top');
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (nav) nav.classList.toggle('is-stuck', y > 8);
      if (bar) bar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
      if (toTop) toTop.classList.toggle('is-shown', y > window.innerHeight * 0.8);

      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Current section highlight — a second observer, deliberately separate
  // from the reveal one because its thresholds are different.
  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }
}

/* ---- 5. Copy email ------------------------------------------------------
   With a real fallback: if the Clipboard API is unavailable (it needs a
   secure context), we select the address so the visitor can copy it. */
function initCopyEmail() {
  const btn = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  if (!btn) return;

  const email = btn.dataset.email || '';

  const flash = () => {
    if (!toast) return;
    const lang = document.documentElement.getAttribute('lang') || 'ar';
    toast.textContent = I18N[lang].ct_copied;
    toast.classList.add('is-shown');
    clearTimeout(flash._t);
    flash._t = setTimeout(() => toast.classList.remove('is-shown'), 2200);
  };

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      flash();
    } catch (e) {
      const node = document.querySelector('.contact__mail');
      if (node && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  });
}

/* ---- 6. Year in the footer ---------------------------------------------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ---- 7. Mobile menu -----------------------------------------------------
   The same <nav> the desktop uses, revealed as a panel. Closes on: a link
   click, Escape, a click outside, and on resize past the breakpoint — the
   four ways a menu is actually dismissed in practice. */
function initMobileMenu() {
  const btn = document.getElementById('navToggle');
  const panel = document.getElementById('navLinks');
  if (!btn || !panel) return;

  const close = () => {
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  panel.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) { close(); btn.focus(); }
  });

  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('is-open')) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    close();
  });

  window.matchMedia('(min-width: 860px)').addEventListener('change', close);
}

/* ---- boot --------------------------------------------------------------- */
document.documentElement.classList.remove('no-js');

initLanguage();
initTheme();
initReveal();
initNav();
initCopyEmail();
initMobileMenu();
initYear();
})();
