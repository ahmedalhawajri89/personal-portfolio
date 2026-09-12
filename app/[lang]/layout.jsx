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
    ? 'أحمد الحواجري — مطوّر ويب Full-Stack'
    : 'Ahmed Al-Hawajiri — Full-Stack Web Developer';
  const description = ar
    ? 'مطوّر ويب Full-Stack من غزة. أبني تطبيقات كاملة بلارافيل وPHP وVue — من مخطط قاعدة البيانات إلى الواجهة، بعربية RTL من أول سطر.'
    : 'Full-stack web developer from Gaza. Complete applications in Laravel, PHP and Vue — from the database schema to the interface, Arabic-first.';
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    authors: [{ name: 'Ahmed Al-Hawajiri' }],
    alternates: {
      canonical: `${SITE}/${lang}/`,
      languages: { ar: `${SITE}/ar/`, en: `${SITE}/en/` },
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
// is only armed when JS is actually alive. Light is the default for a first
// visit — the site is designed light first, and the OS preference is not a
// statement about this page. Dark is opt-in through the toggle, and once
// chosen it is remembered. The browser chrome follows the same choice, so a
// dark-mode OS never frames a light page in a dark bar.
const BOOT = `(function(){try{
var d=localStorage.getItem('theme')==='dark';
document.documentElement.setAttribute('data-theme',d?'dark':'light');
var m=document.querySelector('meta[name=theme-color]');
if(m)m.setAttribute('content',d?'#0A0B10':'#F6F7FB');
document.documentElement.classList.add('js');
}catch(e){}})();`;

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const t = T[lang] || T.ar;
  return (
    <html lang={lang} dir={t.dir} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#F6F7FB" />
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ahmed Al-Hawajiri',
              alternateName: 'أحمد الحواجري',
              jobTitle: 'Full-Stack Web Developer',
              url: SITE,
              address: { '@type': 'PostalAddress', addressLocality: 'Gaza', addressCountry: 'PS' },
              knowsLanguage: ['ar', 'en'],
              knowsAbout: ['Laravel', 'PHP', 'Vue.js', 'MySQL', 'REST APIs', 'RTL interfaces'],
              sameAs: [PROFILE.links.github, PROFILE.links.khamsat],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
