import { LANGS, T } from '../../../../lib/i18n';
import { SITE } from '../../../../lib/site.mjs';
import { PROJECTS, PROFILE } from '../../../../content/projects';
import { STORIES } from '../../../../content/stories';
import { BRIEFS } from '../../../../content/briefs';
import { HERO_TESTS } from '../../../../content/site';
import { shotsOf, coverOf, pagesOf, shotOf } from '../../../../lib/shots';
import { HUE, LIGHT, PROJECT_LIGHT } from '../../../../lib/hues';
import { Nav, Dock, Footer, Reveal, ScrollProgress, SmoothScroll, BackToTop } from '../../../../components/Chrome';
import Gallery from '../../../../components/Gallery';
import Journey from '../../../../components/Journey';
import Brief from '../../../../components/Brief';
import Motion from '../../../../components/Motion';
import Cover from '../../../../components/Cover';
import Scenes from '../../../../components/Scenes';
import Curtain from '../../../../components/Curtain';
import Pointer from '../../../../components/Pointer';
import Icon from '../../../../components/Icons';

const LIVE = PROJECTS.filter((p) => shotsOf(p.shots).shots.length > 0);
const pad = (n) => String(n).padStart(2, '0');

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

/* Each section of a case study opens the way the home page's do: a label in
   the section's colour, a line drawn across the top, the heading rising out
   of its mask. */
function Head({ label, h, lede }) {
  return (
    <header className="cs-head">
      <span className="sec-rule" data-m="rule" aria-hidden="true" />
      <p className="sec-label">{label}</p>
      {h && <h2 className="cs-h2" data-m="lines">{h}</h2>}
      {lede && <p className="sec-lede">{lede}</p>}
    </header>
  );
}

/* A case study, in the order a client asks the questions, in the project's
   own colour from the first frame to the last.

   The opening is the project's cover -- the same drawn scene that stands for
   it on the home page, playing -- beside its name set large and the promise
   it makes. Then the product itself in its browser frame, which comes up to
   full size as it is reached; four short answers (for whom, what was wrong,
   what it does, what was handed over), played one at a time like stories
   (components/Brief.jsx); what it was like before; the product
   walked once through its real screens; how it was built so the promises
   hold; and what was delivered, with the tests that still guard it. It ends
   on the next project as a scene of its own, in that project's colour.

   The chapter marker in the corner is the home page's (components/
   Scenes.jsx), so moving from the home page into a project is one film,
   not a change of site. */
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
  const nb = BRIEFS[next.slug]?.[lang];
  const hue = HUE[p.slug];
  const light = PROJECT_LIGHT[p.slug];
  // The tests that belong to this project. Derived from the same list the
  // home page indexes, filtered to here — so a case study cannot claim a test
  // the index does not also carry.
  const held = HERO_TESTS.filter((x) => x.project === p.slug || x.project === p.shots);
  const more = brief?.tests ? brief.tests - held.length : 0;
  const src = (f) => `/shots/${p.shots}/${f}`;
  const arrow = ar ? 'arrowLeft' : 'arrowRight';

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

  // Figures that can be checked: the screens and captures are counted from
  // the gallery below, the tests from the repository.
  const outcome = [
    [pages, d.outcome.pages],
    [shots.length, d.outcome.shots],
    brief?.tests ? [brief.tests, d.outcome.tests] : null,
    [2, d.outcome.langs],
  ].filter(Boolean);

  const chapters = [
    b && { id: 'glance', name: d.ch.glance, hue: light },
    b && { id: 'context', name: d.ch.context, hue: LIGHT.accent },
    steps.length > 0 && { id: 'journey', name: d.ch.journey, hue: light },
    story && { id: 'solution', name: d.ch.solution, hue: LIGHT.api },
    { id: 'outcome', name: d.ch.outcome, hue: LIGHT.test },
    { id: 'gallery', name: d.ch.gallery, hue: light },
  ].filter(Boolean);

  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <Reveal />
      <Motion />
      <Curtain />
      <Pointer label={t.work.view} />
      <Scenes chapters={chapters} />
      <Nav lang={lang} path={`/work/${slug}/`} title={c.name} />

      <main id="main" className="cs" style={{ '--c': hue }}>
        {/* ------------------------------------------------------ opening */}
        <header className="wrap cs-hero">
          <p className="cs-crumb cs-in" style={{ '--d': '0s' }}>
            <span className="lat">{pad(idx + 1)} / {pad(LIVE.length)}</span>
            <i aria-hidden="true" />
            <span>{c.kind}</span>
            <i aria-hidden="true" />
            <span className="lat">{p.year}</span>
          </p>

          <div className="cs-hgrid">
            <div className="cs-copy">
              <h1 className="cs-name"><span className="cs-mask"><span className="cs-rise">{c.name}</span></span></h1>
              <p className="cs-hook cs-in" style={{ '--d': '.18s' }}>{b?.hook || c.tagline}</p>
              <ul className="cs-stack cs-in" style={{ '--d': '.3s' }}>
                {p.stack.map((x) => <li key={x} className="lat">{x}</li>)}
              </ul>
              <div className="cs-ctas cs-in" style={{ '--d': '.4s' }}>
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-magnetic>
                    {d.demo} <Icon name="external" size={15} />
                  </a>
                )}
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <Icon name="github" size={16} /> {d.code}
                </a>
              </div>
            </div>

            <div className="cs-art cs-in" style={{ '--d': '.12s' }}>
              <Cover slug={p.slug} label={`${c.name}: ${c.kind}`} />
            </div>
          </div>

          <p className="cs-cue cs-in" style={{ '--d': '.6s' }} aria-hidden="true"><i />{d.scroll}</p>
        </header>

        {/* ------------------------------------------------------- screen */}
        {/* The product in its frame, coming up to full size as it is reached
            (data-m="zoom"); on a wide screen the whole page scrolls inside
            the window as the reader scrolls past (data-m="screen"). */}
        <section className="wrap cs-screen" aria-label={d.screenK}>
          <div className="cs-frame" data-m="zoom">
            <div className="cs-bar" aria-hidden="true"><i /><i /><i /><span className="lat">{cover.path}</span></div>
            <div className="cs-view" data-m="screen">
              <picture>
                <source media="(min-width:1024px)" srcSet={src(cover.file)} />
                <img src={src(cover.thumb)} alt={c.name} width={cover.tw} height={cover.th} fetchPriority="high" decoding="async" />
              </picture>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- glance */}
        {b && (
          <section id="glance" className="wrap cs-sec scroll-mt-24" aria-label={d.ch.glance}>
            <p className="sec-label cs-glance-k">{d.ch.glance}</p>
            <Brief rtl={ar} label={d.ch.glance} items={[
              { q: d.glance.who, a: b.who },
              { q: d.glance.problem, a: b.problem },
              { q: d.glance.does, a: b.does },
              { q: d.glance.delivered, a: b.delivered },
            ]} />
          </section>
        )}

        {/* ------------------------------------------------------ context */}
        {/* The problem as the people who had it would tell it, lit word by
            word as it is read, then the pains it is made of. */}
        {b && (
          <section id="context" className="wrap cs-sec scroll-mt-24" style={{ '--c': 'var(--accent)' }}>
            <Head label={d.context.h} />
            <p className="cs-read" data-m="read">{b.context}</p>
            <ul className="cs-pains">
              {b.pains.map((x, i) => (
                <li key={x.h} className="rise" style={{ '--i': i }}>
                  <span className="cs-x" aria-hidden="true"><Icon name="x" size={14} /></span>
                  <b>{x.h}</b>
                  <span>{x.b}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------ journey */}
        {steps.length > 0 && (
          <section id="journey" className="wrap cs-sec scroll-mt-24">
            <Head label={d.ch.journey} h={d.journey.h} lede={d.journey.lede} />
            <Journey steps={steps} labels={{ open: d.tourOpen }} />
          </section>
        )}

        {/* ----------------------------------------------------- solution */}
        {story && (
          <section id="solution" className="wrap cs-sec scroll-mt-24" style={{ '--c': 'var(--h-api)' }}>
            <Head label={d.story.solution} h={d.solutionH} lede={d.built.lede} />
            <ol className="cs-steps">
              {story.solution.map((x, i) => (
                <li key={x.h} className="cs-step rise">
                  <span className="cs-num lat" aria-hidden="true">{pad(i + 1)}</span>
                  <h3>{x.h}</h3>
                  <p>{x.b}</p>
                </li>
              ))}
            </ol>

            <p className="cs-k">{d.story.extras}</p>
            <ul className="cs-extras">
              {story.extras.map((x, i) => (
                <li key={x.h} className="rise" style={{ '--i': i }}>
                  <h3>{x.h}</h3>
                  <p>{x.b}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------ outcome */}
        <section id="outcome" className="wrap cs-sec scroll-mt-24" style={{ '--c': 'var(--h-test)' }}>
          <Head label={d.outcomeK} h={d.outcome.h} />
          <dl className="cs-figs">
            {outcome.map(([n, l]) => (
              <div key={l}>
                <dd className="lat" data-m="count" data-to={n}>{n.toLocaleString('en-US')}</dd>
                <dt>{l}</dt>
              </div>
            ))}
          </dl>

          <div className="cs-done">
            {b && (
              <ul className="cs-delivered">
                {b.delivered.map((x, i) => (
                  <li key={x} className="rise" style={{ '--i': i }}>
                    <span aria-hidden="true"><Icon name="check" size={12} /></span><span>{x}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* The part that says it still holds: the actual test files, set
                as the run that proves them. Projects without one skip it. */}
            {held.length > 0 && (
              <div className="cs-run" aria-label={d.testsH} role="group">
                <div className="cs-run-bar" aria-hidden="true">
                  <span className="tl-dots"><i /><i /><i /></span>
                  <span className="lat">./vendor/bin/pest</span>
                </div>
                <ul>
                  {held.map((x, i) => (
                    <li key={x.file} className="rise" style={{ '--i': i + 1 }}>
                      <span className="cs-pass lat">PASS</span>
                      <span className="cs-rule">{x[lang]}</span>
                      <span className="cs-file lat">{p.shots}/tests/{x.file}</span>
                    </li>
                  ))}
                </ul>
                {more > 0 && <p className="cs-more">{d.testsMore.replace('{n}', more.toLocaleString('en-US'))}</p>}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------ gallery */}
        {/* The complete capture set, folded away as evidence rather than the
            argument -- the journey above is what the page says. */}
        <section className="wrap cs-sec">
          <Head label={d.ch.gallery} h={d.galleryH} lede={d.galleryLede} />
          <Gallery lang={lang} project={p.shots} data={data} collapsible />
        </section>

        {/* ------------------------------------------------- next project */}
        {/* The next project as a scene of its own, in its own colour: its
            cover playing, its name large, the promise it makes. */}
        <nav className="wrap cs-sec" aria-label={d.next_project}>
          <a href={`/${lang}/work/${next.slug}/`} className="cs-next" style={{ '--c': HUE[next.slug] }} data-cursor="view">
            <span className="cs-next-copy">
              <span className="cs-next-k"><span className="lat">{pad(((idx + 1) % LIVE.length) + 1)}</span>{d.next_project}</span>
              <span className="cs-next-name">{next[lang].name}</span>
              <span className="cs-next-hook">{nb?.hook || next[lang].tagline}</span>
              <span className="cs-next-go" aria-hidden="true"><Icon name={arrow} size={20} /></span>
            </span>
            <span className="cs-next-art" aria-hidden="true">
              <Cover slug={next.slug} label="" />
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
