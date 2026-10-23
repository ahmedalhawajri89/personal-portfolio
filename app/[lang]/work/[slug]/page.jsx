import { LANGS, T } from '../../../../lib/i18n';
import { SITE } from '../../../../lib/site.mjs';
import { PROJECTS, PROFILE } from '../../../../content/projects';
import { STORIES } from '../../../../content/stories';
import { BRIEFS } from '../../../../content/briefs';
import { HERO_TESTS } from '../../../../content/site';
import { shotsOf, coverOf, pagesOf, shotOf } from '../../../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, SmoothScroll, BackToTop } from '../../../../components/Chrome';
import Gallery from '../../../../components/Gallery';
import Journey from '../../../../components/Journey';
import Motion from '../../../../components/Motion';
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

/* A case study, in the order a client asks the questions. What is it and for
   whom (the glance), what was wrong before it (the context, read slowly), how
   it is used (the journey through the real screens), how it was built so the
   promises hold (the solution), and what was handed over (the outcome). The
   engineering is all still here; it just comes after the reader knows why it
   matters. */
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
  const brief = BRIEFS[p.slug];
  const b = brief?.[lang];
  // The tests that belong to this project. Derived from the same list the
  // home page indexes, filtered to here — so a case study cannot claim a test
  // the index does not also carry.
  const held = HERO_TESTS.filter((x) => x.project === p.slug || x.project === p.shots);
  const src = (f) => `/shots/${p.shots}/${f}`;
  const nextCover = coverOf(next, lang);

  // A step whose screen has no capture is dropped rather than shown empty.
  const steps = (brief?.journey || []).map((st) => {
    const sh = shotOf(p.shots, st.shot, lang);
    if (!sh) return null;
    return {
      h: st[lang].h, b: st[lang].b, path: sh.path,
      file: src(sh.file), w: sh.w, ih: sh.h,
      thumb: src(sh.thumb), tw: sh.tw, th: sh.th,
      alt: `${c.name} — ${ar ? sh.labelAr : sh.labelEn}`,
    };
  }).filter(Boolean);

  const outcome = [
    [pages, d.outcome.pages],
    [shots.length, d.outcome.shots],
    brief?.tests ? [brief.tests, d.outcome.tests] : null,
    [2, d.outcome.langs],
  ].filter(Boolean);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <SmoothScroll />
      <Reveal />
      <Motion />
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
          <p className="pj-tag">{b?.hook || c.tagline}</p>
        </header>

        {/* The cover is the whole page, not its top: on a wide screen it
            scrolls inside its window as the reader scrolls past. */}
        <div className="pj-plate">
          <div className="pj-frame">
            <div className="pj-bar" aria-hidden="true"><i /><i /><i /><span className="lat">{cover.path}</span></div>
            <div className="pj-view" data-m="screen">
              <picture>
                <source media="(min-width:1024px)" srcSet={src(cover.file)} />
                <img src={src(cover.thumb)} alt={c.name} width={cover.tw} height={cover.th} fetchPriority="high" decoding="async" />
              </picture>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- glance */}
        {b && (
          <dl className="pj-glance">
            <div>
              <dt>{d.glance.who}</dt>
              <dd><ul>{b.who.map((x) => <li key={x}>{x}</li>)}</ul></dd>
            </div>
            <div><dt>{d.glance.problem}</dt><dd>{b.problem}</dd></div>
            <div><dt>{d.glance.does}</dt><dd>{b.does}</dd></div>
            <div>
              <dt>{d.glance.delivered}</dt>
              <dd><ul>{b.delivered.map((x) => <li key={x}>{x}</li>)}</ul></dd>
            </div>
          </dl>
        )}

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

        {/* --------------------------------------------------------- context */}
        {/* The problem as the people who had it would tell it, darkening word
            by word as it is read, then the pains it is made of. */}
        {b && (
          <section className="pj-sec">
            <h2 className="pj-h2" data-m="lines">{d.context.h}</h2>
            <p className="pj-read mt-8" data-m="read">{b.context}</p>
            <ul className="pj-pains">
              {b.pains.map((x) => (
                <li key={x.h}><b>{x.h}</b>{x.b}</li>
              ))}
            </ul>
          </section>
        )}

        {/* --------------------------------------------------------- journey */}
        {steps.length > 0 && (
          <section className="pj-sec">
            <h2 className="pj-h2" data-m="lines">{d.journey.h}</h2>
            <p className="pj-lede">{d.journey.lede}</p>
            <Journey steps={steps} labels={{ open: d.tourOpen }} />
          </section>
        )}

        {/* -------------------------------------------------------- solution */}
        {story && (
          <section className="pj-sec">
            <h2 className="pj-h2" data-m="lines">{d.story.solution}</h2>
            <p className="pj-lede">{d.built.lede}</p>
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

        {/* --------------------------------------------------------- outcome */}
        {/* Figures that can be checked: the pages and captures are counted from
            the gallery below, the tests from the repository. */}
        <section className="pj-sec">
          <h2 className="pj-h2" data-m="lines">{d.outcome.h}</h2>
          <dl className="pj-out">
            {outcome.map(([n, l]) => (
              <div key={l}><dt>{l}</dt><dd className="lat" data-m="count" data-to={n}>{n}</dd></div>
            ))}
          </dl>
          {b && (
            <ul className="pj-delivered">
              {b.delivered.map((x) => (
                <li key={x}><span aria-hidden="true"><Icon name="check" size={12} /></span><span>{x}</span></li>
              ))}
            </ul>
          )}

          {/* The part that says it still holds: the actual test files, set as
              the run that proves them. Projects without one skip the block. */}
          {held.length > 0 && (
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
          )}
        </section>

        {/* ------------------------------------------------------- gallery */}
        {/* The complete capture set, folded away as evidence rather than the
            argument -- the journey above is what the page says. */}
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
