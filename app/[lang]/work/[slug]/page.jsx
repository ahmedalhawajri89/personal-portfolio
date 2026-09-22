import { LANGS, T } from '../../../../lib/i18n';
import { SITE } from '../../../../lib/site.mjs';
import { PROJECTS, PROFILE } from '../../../../content/projects';
import { STORIES } from '../../../../content/stories';
import { HERO_TESTS } from '../../../../content/site';
import { shotsOf, coverOf, pagesOf, tourOf } from '../../../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, SmoothScroll, BackToTop } from '../../../../components/Chrome';
import Gallery from '../../../../components/Gallery';
import Tour from '../../../../components/Tour';
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
  const src = (f) => `/shots/${p.shots}/${f}`;
  const nextCover = coverOf(next, lang);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <SmoothScroll />
      <Reveal />
      <Nav lang={lang} path={`/work/${slug}/`} title={c.name} />

      <main id="main" className="wrap pb-8 pt-28 sm:pt-32">
        {/* An editorial opening, the same language as the home page: a strip
            with the year, the kind and the two ways in; the name set large in
            ink; what it does in one line; then the product itself across the
            full measure on the accent plate. The back link lives in the bar. */}
        <header className="pj-head">
          <div className="pj-top">
            <p className="pj-meta"><span className="lat">{p.year}</span> · {c.kind}</p>
            <div className="pj-links">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  {d.demo} <Icon name="external" size={15} />
                </a>
              )}
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <Icon name="github" size={16} /> {d.code}
              </a>
            </div>
          </div>
          <h1 className="pj-h">{c.name}</h1>
          <p className="pj-tag">{c.tagline}</p>
        </header>

        <div className="pj-plate">
          <div className="pj-frame">
            <div className="pj-bar" aria-hidden="true"><i /><i /><i /><span className="lat">{cover.path}</span></div>
            <picture>
              <source media="(min-width:1024px)" srcSet={`${src(cover.thumb)} ${cover.tw}w, ${src(cover.file)} ${cover.w}w`} sizes="1200px" />
              <img src={src(cover.thumb)} alt={c.name} width={cover.tw} height={cover.th} fetchPriority="high" decoding="async" />
            </picture>
          </div>
        </div>

        {/* The facts a client scans for, ruled like a spec sheet. */}
        <dl className="pj-facts">
          <div><dt>{d.facts.year}</dt><dd className="lat">{p.year}</dd></div>
          <div><dt>{d.facts.type}</dt><dd>{c.kind}</dd></div>
          <div className="is-wide">
            <dt>{d.stack}</dt>
            <dd><ul className="pj-stack">{p.stack.map((s) => <li key={s} className="lat">{s}</li>)}</ul></dd>
          </div>
          <div><dt>{d.facts.scope}</dt><dd><span className="lat">{pages}</span> {t.work.pages} · <span className="lat">{shots.length}</span> {t.work.shots}</dd></div>
        </dl>

        {/* ----------------------------------------------------------- brief */}
        <section className="pj-brief">
          <p className="pj-lead">{c.summary}</p>
          {story && (
            <div className="pj-rows">
              <div className="pj-row">
                <p className="pj-k">{d.story.problem}</p>
                <p className="pj-v is-soft">{story.problem}</p>
              </div>
              <div className="pj-row">
                <p className="pj-k is-acc">{d.story.idea}</p>
                <p className="pj-v">{story.idea}</p>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------ tour */}
        {tour.length > 0 && (
          <section className="pj-sec">
            <p className="eyebrow w-fit">{d.product.eyebrow}</p>
            <h2 className="pj-h2">{d.product.h}</h2>
            <p className="pj-lede">{d.product.lede}</p>
            <Tour rtl={ar}
                  labels={{ prev: d.prev, next: d.next, open: d.tourOpen, list: d.tourList }}
                  items={tour.map((sh) => ({
                    thumb: src(sh.thumb), file: src(sh.file), tw: sh.tw, th: sh.th, w: sh.w,
                    path: sh.path, label: ar ? sh.labelAr : sh.labelEn,
                    alt: `${c.name} — ${ar ? sh.labelAr : sh.labelEn}`,
                  }))} />
          </section>
        )}

        {/* -------------------------------------------------------- solution */}
        {story && (
          <section className="pj-sec">
            <h2 className="pj-h2">{d.story.solution}</h2>
            <ol className="pj-steps">
              {story.solution.map((x, i) => (
                <li key={x.h} className="rise" style={{ '--i': i }}>
                  <span className="pj-num lat" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{x.h}</h3>
                  <p>{x.b}</p>
                </li>
              ))}
            </ol>

            <div className="pj-extras">
              <p className="pj-k">{d.story.extras}</p>
              <ul>
                {story.extras.map((x) => (
                  <li key={x.h}>
                    <h3>{x.h}</h3>
                    <p>{x.b}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- evidence */}
        {/* The part that says it still holds: the actual test files, set as
            the run that proves them. Projects without one skip the block. */}
        {held.length > 0 && (
          <section className="pj-sec">
            <p className="eyebrow w-fit">{d.evidence}</p>
            <h2 className="pj-h2">{d.evidenceH}</h2>
            <div className="pj-tests">
              <p className="pj-cmd lat">$ ./vendor/bin/pest</p>
              <ul>
                {held.map((x) => (
                  <li key={x.file}>
                    <span className="pj-ok" aria-hidden="true"><Icon name="check" size={12} /></span>
                    <span className="pj-rule">{x[lang]}</span>
                    <span className="pj-file lat">{p.shots}/tests/{x.file}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------- gallery */}
        {/* The complete capture set, folded away as evidence rather than the
            argument -- the tour above is what the page says. */}
        <Gallery lang={lang} project={p.shots} data={data} collapsible />

        {/* --------------------------------------------------- next project */}
        <nav className="pj-next-wrap" aria-label={d.next_project}>
          <a href={`/${lang}/work/${next.slug}/`} className="pj-next">
            <span className="pj-next-text">
              <span className="pj-next-k">{d.next_project}</span>
              <span className="pj-next-name">{next[lang].name}</span>
              <span className="pj-next-kind">{next[lang].kind}</span>
            </span>
            <span className="pj-next-pic" aria-hidden="true">
              <img src={`/shots/${next.shots}/${nextCover.thumb}`} alt="" width={nextCover.tw} height={nextCover.th} loading="lazy" decoding="async" />
            </span>
            <span className="pj-next-go" aria-hidden="true"><Icon name={ar ? 'arrowLeft' : 'arrowRight'} size={20} /></span>
          </a>
        </nav>
      </main>

      <Footer lang={lang} links={PROFILE.links} />
      <BackToTop lang={lang} />
      <Dock lang={lang} />
    </>
  );
}
