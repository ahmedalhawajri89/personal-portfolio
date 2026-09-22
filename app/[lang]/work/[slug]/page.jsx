import { LANGS, T } from '../../../../lib/i18n';
import { SITE } from '../../../../lib/site.mjs';
import { PROJECTS, PROFILE } from '../../../../content/projects';
import { STORIES } from '../../../../content/stories';
import { HERO_TESTS } from '../../../../content/site';
import { shotsOf, coverOf, pagesOf, tourOf } from '../../../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, BackToTop } from '../../../../components/Chrome';
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
  const here = `${SITE}/${lang}/work/${slug}/`;
  return {
    title,
    description: c.tagline,
    // Without this the page inherits the layout's canonical, which points at
    // the home page — telling a crawler that every case study is a duplicate
    // of it. The language pair has to be per-page for the same reason.
    alternates: {
      canonical: here,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE}/${l}/work/${slug}/`])),
    },
    openGraph: { type: 'article', url: here, title, description: c.tagline, images: [{ url: '/og.png' }] },
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
  const tour = tourOf(p, lang);
  // The tests that belong to this project. Derived from the same list the
  // home page indexes, filtered to here — so a case study cannot claim a test
  // the index does not also carry.
  const held = HERO_TESTS.filter((x) => x.project === p.slug || x.project === p.shots);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <Reveal />
      <Nav lang={lang} path={`/work/${slug}/`} title={c.name} />

      <main id="main" className="wrap pb-8 pt-28 sm:pt-32">
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

            {/* Eight screens between the problem and the answer. A reader who
                has just been told what was wrong should see the thing before
                being told how it was fixed — and forty screenshots at equal
                weight is an archive, not an argument. The archive is still
                there, one button down. */}
            {tour.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow w-fit">{d.product.eyebrow}</p>
                <h2 className="mt-4 text-[clamp(24px,3.4vw,34px)] font-extrabold tracking-tight">{d.product.h}</h2>
                <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{d.product.lede}</p>
                <ul className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {tour.map((sh, i) => {
                    const band = i === 0 || i === tour.length - 1;
                    return (
                    <li key={sh.file} className={band ? 'lg:col-span-2' : undefined}>
                      <figure>
                        <div className="shot is-static">
                          <span className="chrome"><i /><i /><i /><span className="url">{sh.path}</span></span>
                          <span className="pic block" style={{ aspectRatio: band ? '21 / 9' : '16 / 10' }}>
                            {/* The 1600px capture is offered from `lg` up only.
                                A plain srcset hands a 3x phone the full file for
                                all eight screens — 549KB where the 960px
                                thumbnail is already 2.5x on a 390px slot. */}
                            <picture>
                              <source media="(min-width:1024px)"
                                      srcSet={`/shots/${p.shots}/${sh.thumb} ${sh.tw}w, /shots/${p.shots}/${sh.file} ${sh.w}w`}
                                      sizes={band ? '1150px' : '570px'} />
                              <img
                                src={`/shots/${p.shots}/${sh.thumb}`}
                                alt={`${c.name} — ${ar ? sh.labelAr : sh.labelEn}`}
                                width={sh.tw} height={sh.th}
                                loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
                            </picture>
                          </span>
                        </div>
                        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                          <span className="lat text-[12px] font-bold" style={{ color: 'var(--ink-3)' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[15px] font-extrabold">{ar ? sh.labelAr : sh.labelEn}</span>
                          <span className="mono text-[12px]" style={{ color: 'var(--ink-3)' }}>{sh.path}</span>
                        </figcaption>
                      </figure>
                    </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* The solution, in numbered steps. */}
            <div>
              <h2 className="mt-6 text-[clamp(24px,3.4vw,34px)] font-extrabold tracking-tight">{d.story.solution}</h2>
              <ol className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {story.solution.map((x, i) => (
                  <li key={x.h} className="card hover-lift rise flex flex-col p-6" style={{ '--i': i }}>
                    <span className="on-accent lat grid h-9 w-9 place-items-center rounded-full text-[13px] font-extrabold">{String(i + 1).padStart(2, '0')}</span>
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

        {/* --------------------------------------------------- evidence */}
        {/* The case study has said what was wrong and what was decided. This
            is the part that says it still holds — the actual test files, not
            a claim that tests exist. Projects without one simply do not show
            the block. */}
        {held.length > 0 && (
          <section className="mt-20">
            <p className="eyebrow w-fit">{d.evidence}</p>
            <h2 className="mt-4 text-[clamp(24px,3.4vw,34px)] font-extrabold tracking-tight">{d.evidenceH}</h2>
            <ul className="card mt-7 overflow-hidden">
              {held.map((x) => (
                <li key={x.file} className="flex flex-col gap-1.5 border-b px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    style={{ borderColor: 'var(--line)' }}>
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0" style={{ color: 'var(--accent-ink)' }} aria-hidden="true">
                      <Icon name="check" size={15} />
                    </span>
                    <span className="text-[15.5px] font-bold leading-[1.7]">{x[lang]}</span>
                  </span>
                  <span className="mono shrink-0 ps-8 text-[12px] sm:ps-0" style={{ color: 'var(--ink-3)' }}>{x.file}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------ gallery */}
        {/* The complete capture set, kept as evidence rather than as the
            argument — folded away so the tour above is what the page says. */}
        <Gallery lang={lang} project={p.shots} data={data} collapsible />

        {/* --------------------------------------------------- next project */}
        <nav className="mt-24">
          <a href={`/${lang}/work/${next.slug}/`} className="card hover-lift group flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
            <span>
              <span className="block text-[12.5px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{d.next_project}</span>
              <span className="mt-1.5 block text-[clamp(24px,3.5vw,34px)] font-extrabold tracking-tight">
                {next[lang].name} <span style={{ color: 'var(--ink-3)' }}>— {next[lang].kind}</span>
              </span>
            </span>
            <span className="on-accent grid h-12 w-12 place-items-center rounded-full transition-transform group-hover:scale-110" aria-hidden="true">
              <Icon name={ar ? 'arrowLeft' : 'arrowRight'} size={20} />
            </span>
          </a>
        </nav>
      </main>

      <Footer lang={lang} links={PROFILE.links} />
      <BackToTop lang={lang} />
      <Dock lang={lang} />
    </>
  );
}
