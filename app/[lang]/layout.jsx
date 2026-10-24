import { SITE } from '../../lib/site.mjs';
import '../../styles/globals.css';
import { LANGS, T } from '../../lib/i18n';
import { PROFILE } from '../../content/projects';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// Anything that is not a known language (e.g. the browser's automatic
// /favicon.ico request) gets a plain 404 instead of a 500 under `output: export`.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const ar = lang === 'ar';
  const title = ar
    ? 'أحمد الحواجري — مطوّر ويب Full-Stack وجودة واختبارات'
    : 'Ahmed Al-Hawajiri — Full-Stack Web Developer & QA';
  const description = ar
    ? 'مطوّر ويب Full-Stack من غزة. أبني تطبيقات كاملة بلارافيل وPHP وVue — من مخطط قاعدة البيانات إلى الواجهة — وأحرس قواعدها باختبارات آلية.'
    : 'Full-stack web developer from Gaza. Complete applications in Laravel, PHP and Vue — from the database schema to the interface — with the rules held by automated tests.';
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    authors: [{ name: 'Ahmed Al-Hawajiri' }],
    alternates: {
      canonical: `${SITE}/${lang}/`,
      // x-default names the language the bare origin serves, so a crawler that
      // matches neither ar nor en lands where a human landing on `/` would.
      languages: { ar: `${SITE}/ar/`, en: `${SITE}/en/`, 'x-default': `${SITE}/en/` },
    },
    openGraph: {
      type: 'website',
      siteName: 'Ahmed Al-Hawajiri',
      locale: ar ? 'ar_PS' : 'en_US',
      title,
      description,
      url: `${SITE}/${lang}/`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
    icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico', sizes: '32x32' }] },
  };
}

// Runs before first paint: no flash of the wrong theme, and the reveal class
// is only armed when JS is actually alive. Dark is the default for a first
// visit -- the site is designed dark first, and the OS preference is not a
// statement about this page. Light is opt-in through the toggle, and once
// chosen it is remembered. The browser chrome follows the same choice, so a
// light-mode OS never frames a dark page in a light bar. The first home page
// of a visit opens behind the intro curtain (`intro`, components/Intro.jsx),
// once; a page reached through the page curtain opens with it still down
// (`curtain-in`, components/Curtain.jsx). A curtain page never runs the intro.
const BOOT = `(function(){try{
var d=localStorage.getItem('theme')!=='light';
document.documentElement.setAttribute('data-theme',d?'dark':'light');
var m=document.querySelector('meta[name=theme-color]');
if(m)m.setAttribute('content',d?'#0E0E0C':'#F7F6F3');
document.documentElement.classList.add('js');
if(location.hash)document.documentElement.classList.add('cv-off');
if(sessionStorage.getItem('curtain')){sessionStorage.removeItem('curtain');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('curtain-in');}
if(!location.hash&&!document.documentElement.classList.contains('curtain-in')&&['/','/ar','/ar/','/en','/en/'].indexOf(location.pathname)>-1&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('intro')){sessionStorage.setItem('intro','1');document.documentElement.classList.add('intro');}
}catch(e){}})();`;

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const t = T[lang] || T.ar;
  return (
    <html lang={lang} dir={t.dir} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0E0E0C" />
        {/* The two cuts every page paints with, for the language it is in.
            Arabic pages preload Plex Arabic, English pages preload Instrument Sans;
            preloading both would put the wrong script's 37KB ahead of the
            text actually on screen. Geist Mono is not preloaded: the only
            monospaced text above the fold is the runner, which starts later. */}
        {(lang === 'ar' ? ['plex-arabic-400', 'plex-arabic-700'] : ['instrument-400', 'instrument-700']).map((f) => (
          <link key={f} rel="preload" as="font" type="font/woff2" href={`/fonts/${f}.woff2`} crossOrigin="anonymous" />
        ))}
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ahmed Al-Hawajiri',
              alternateName: 'أحمد الحواجري',
              jobTitle: 'Full-Stack Web Developer & QA',
              url: SITE,
              address: { '@type': 'PostalAddress', addressLocality: 'Gaza', addressCountry: 'PS' },
              knowsLanguage: ['ar', 'en'],
              knowsAbout: ['Laravel', 'PHP', 'Vue.js', 'MySQL', 'REST APIs', 'Automated testing', 'RTL interfaces'],
              sameAs: [PROFILE.links.github, PROFILE.links.khamsat],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
