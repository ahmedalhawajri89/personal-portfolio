import { LANGS, T } from '../../../../lib/i18n';
import { PROJECTS, PROFILE } from '../../../../content/projects';
import { STORIES } from '../../../../content/stories';
import { shotsOf, coverOf, pagesOf } from '../../../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, CursorGlow, BackToTop } from '../../../../components/Chrome';
import Gallery from '../../../../components/Gallery';
import Icon from '../../../../components/Icons';

const LIVE = PROJECTS.filter((p) => shotsOf(p.shots).shots.length > 0);

export function generateStaticParams() {
  return LANGS.flatMap((lang) => LIVE.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const p = LIVE.find((x) => x.slug === slug);
  if (!p) return {};
  const c = p[lang];
  const title = `${c.name} — ${c.kind} · ${lang === 'ar' ? 'أحمد الحواجري' : 'Ahmed Al-Hawajiri'}`;
  return {
    title,
    description: c.tagline,
    openGraph: { title, description: c.tagline, images: [{ url: '/og.png' }] },
  };
}

export default async function Project({ params }) {
  const { lang, slug } = await params;
  const t = T[lang];
  const d = t.detail;
  const ar = lang === 'ar';
  const p = LIVE.find((x) => x.slug === slug);
  const c = p[lang];
  const data = shotsOf(p.shots);
  const shots = data.shots;
  const idx = LIVE.findIndex((x) => x.slug === slug);
  const next = LIVE[(idx + 1) % LIVE.length];
  const cover = coverOf(p, lang);
  const pages = pagesOf(p.shots);
  const story = STORIES[p.slug]?.[lang];

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <Reveal />
      <Nav lang={lang} path={`/work/${slug}/`} />

      <article className="wrap pb-8 pt-28 sm:pt-32">
        <a href={`/${lang}/#work`} className="chip transition-colors hover:text-[var(--accent-ink)]">
          <Icon name={ar ? 'arrowRight' : 'arrowLeft'} size={14} /> {t.nav.back}
        </a>

        {/* Header and the product side by side: the screenshot is visible
            before the visitor scrolls. */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
          <header>
            <p className="eyebrow"><span className="lat">{p.year}</span> · {c.kind}</p>
            <h1 className="mt-4 text-[clamp(34px,5.6vw,60px)] font-extrabold leading-[1.12] tracking-tight">
              <span className="grad-text">{c.name}</span>
            </h1>
            <p className="mt-4 max-w-[42ch] text-[clamp(18px,2.2vw,24px)] font-bold leading-[1.5]" style={{ color: 'var(--ink-2)' }}>
              {c.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {d.demo} <Icon name="external" size={15} />
                </a>
              )}
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <Icon name="github" size={16} /> {d.code}
              </a>
            </div>

            <p className="mt-6 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{d.stack}</p>
            <ul className="mono mt-2.5 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="chip px-2.5 py-1 text-[12px]">{s}</li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[[shots.length, t.work.shots], [pages, t.work.pages]].map(([n, l]) => (
                <li key={l}>
                  <p className="lat text-[26px] font-extrabold leading-none grad-text">{n}</p>
                  <p className="mt-1 text-[13px] font-bold" style={{ color: 'var(--ink-3)' }}>{l}</p>
                </li>
              ))}
            </ul>
          </header>

          <div className="gradient-border">
            <div className="frame" style={{ borderRadius: 'var(--radius)' }}>
              <div className="bar"><i /><i /><i /></div>
              <img src={`/shots/${p.shots}/${cover.thumb}`} alt={c.name} width={cover.tw} height={cover.th}
                   fetchPriority="high" decoding="async"
                   style={{ aspectRatio: '16 / 10', objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          </div>
        </div>

        <p className="mt-14 max-w-[70ch] text-[17px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{c.summary}</p>

        {/* ------------------------------------------------------ case study */}
        {story && (
          <section className="mt-20 grid gap-6">
            <p className="eyebrow w-fit">{d.story.eyebrow}</p>

            {/* Idea and problem side by side: what it is, and why it had to exist. */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="card p-7">
                <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-ink)' }}>
                  <Icon name="sparkles" size={15} />{d.story.idea}
                </p>
                <p className="mt-4 text-[16.5px] leading-[1.9]" style={{ color: 'var(--ink)' }}>{story.idea}</p>
              </div>
              <div className="card p-7" style={{ background: 'var(--card-2)' }}>
                <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>
                  <Icon name="shield" size={15} />{d.story.problem}
                </p>
                <p className="mt-4 text-[16.5px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{story.problem}</p>
              </div>
            </div>

            {/* The solution, in numbered steps. */}
            <div>
              <h2 className="mt-6 text-[clamp(24px,3.4vw,34px)] font-extrabold tracking-tight">{d.story.solution}</h2>
              <ol className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {story.solution.map((x, i) => (
                  <li key={x.h} className="card hover-lift rise flex flex-col p-6" style={{ '--i': i }}>
                    <span className="lat grid h-9 w-9 place-items-center rounded-full text-[13px] font-extrabold text-white"
                          style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-4 text-[18px] font-extrabold leading-snug">{x.h}</h3>
                    <p className="mt-2.5 text-[15px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{x.b}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Decisions worth a sentence each. */}
            <div className="card mt-2 p-6 sm:p-8">
              <p className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{d.story.extras}</p>
              <ul className="mt-5 grid gap-5 md:grid-cols-3">
                {story.extras.map((x) => (
                  <li key={x.h} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span>
                      <span className="block text-[15.5px] font-extrabold">{x.h}</span>
                      <span className="mt-1 block text-[14.5px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{x.b}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------ gallery */}
        <Gallery lang={lang} project={p.shots} data={data} />

        {/* --------------------------------------------------- next project */}
        <nav className="mt-24">
          <a href={`/${lang}/work/${next.slug}/`} className="card hover-lift group flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
            <span>
              <span className="block text-[12.5px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{d.next_project}</span>
              <span className="mt-1.5 block text-[clamp(24px,3.5vw,34px)] font-extrabold tracking-tight">
                {next[lang].name} <span style={{ color: 'var(--ink-3)' }}>— {next[lang].kind}</span>
              </span>
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-full text-white transition-transform group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }} aria-hidden="true">
              <Icon name={ar ? 'arrowLeft' : 'arrowRight'} size={20} />
            </span>
          </a>
        </nav>
      </article>

      <Footer lang={lang} links={PROFILE.links} />
      <BackToTop lang={lang} />
      <Dock lang={lang} />
    </>
  );
}
