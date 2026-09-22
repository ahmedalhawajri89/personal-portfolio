import { Fragment } from 'react';
import { LANGS, T } from '../../lib/i18n';
import { PROJECTS, PROFILE } from '../../content/projects';
import { SERVICES, SKILLS, CAPABILITIES, PROCESS, TIMELINE, TESTIMONIALS, HERO_TESTS } from '../../content/site';
import { shotsOf, coverOf, pagesOf } from '../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, SmoothScroll, ContactForm, BackToTop, TimelineScroll, TestRunner, CaseFiles, ServiceStack } from '../../components/Chrome';
import Marquee from '../../components/Marquee';
import Icon from '../../components/Icons';
import { CvButton } from '../../components/CvPanel';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

function SectionHead({ eyebrow, h, lede, center }) {
  return (
    <header className={`mb-12 ${center ? 'mx-auto max-w-[62ch] text-center' : 'max-w-[62ch]'}`}>
      {/* Label, then the heading rising out from behind a mask, then the lede:
          one short sequence per section instead of the whole block fading. */}
      <p className="eyebrow mask-rise">{eyebrow}</p>
      <h2 className="mask-rise d1 mt-4 text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.2] tracking-tight">{h}</h2>
      {lede && <p className="mask-rise d2 mt-4 text-[16.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{lede}</p>}
    </header>
  );
}

export default async function Home({ params }) {
  const { lang } = await params;
  const t = T[lang];
  const ar = lang === 'ar';
  const L = ar ? 'Ar' : 'En';   // suffix for the per-language fields on HERO_TESTS
  const arrow = ar ? 'arrowLeft' : 'arrowRight';
  const live = PROJECTS.filter((p) => shotsOf(p.shots).shots.length > 0);
  const totalPages = live.reduce((n, p) => n + pagesOf(p.shots), 0);
  const stats = [
    [`${PROFILE.years}+`, t.stats.years],
    [String(PROJECTS.length), t.stats.projects],
    [String(totalPages), t.stats.shots],
    ['2', t.stats.langs],
  ];
  const cover = (p) => coverOf(p, lang);
  // A tool matches a project's stack on its leading word, so `Vue 3` finds
  // `Vue 3.5` and `Tailwind CSS` finds `Tailwind 4`. Used by the evidence matrix.
  const head = (x) => x.toLowerCase().split(/[\s.]/)[0];

  // Words used inside the rule scenes. Code identifiers stay in English.
  const V = ar
    ? { stored: 'مُخزَّن', derived: 'مُشتقّ', approved: 'مُعتمَد', reversal: 'قيد مضاد', rows: 'سجل', server: 'من جهة الخادم' }
    : { stored: 'stored', derived: 'derived', approved: 'approved', reversal: 'counter-entry', rows: 'rows', server: 'server-side' };
  const scene = (i) => {
    switch (i) {
      case 0: // Arabic from the first line: the same line, built from each side
        return (
          <div className="v-rtl">
            {['EN', 'AR'].map((l) => (
              <div key={l} className={`v-rtl-row${l === 'AR' ? ' is-ar' : ''}`}>
                <span className="v-tag lat">{l}</span>
                <span className="v-line"><i style={{ '--w': '46%' }} /><i style={{ '--w': '22%' }} /><i style={{ '--w': '14%' }} /></span>
              </div>
            ))}
          </div>
        );
      case 1: // rules in the data layer: a row locked inside the transaction
        return (
          <div className="v-lock">
            <div className="v-table">
              <span /><span className="is-locked">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              </span><span />
            </div>
            <i className="v-req a" /><i className="v-req b" />
            <code className="v-code lat">lockForUpdate()</code>
          </div>
        );
      case 2: // a test for every rule: a suite filling green
        return <div className="v-suite">{Array.from({ length: 18 }, (_, k) => <i key={k} style={{ '--d': `${k * 90}ms` }} />)}</div>;
      case 3: // store the fact, derive the rest
        return (
          <div className="v-fact">
            <span className="v-box lat">date_of_birth<small>{V.stored}</small></span>
            <span className="v-flow"><i /></span>
            <span className="v-box is-derived lat">age<small>{V.derived}</small></span>
          </div>
        );
      case 4: // history is never deleted: an approved entry, then its counter-entry
        return (
          <div className="v-ledger">
            <span className="v-entry"><b className="lat">+</b>{V.approved}</span>
            <span className="v-entry is-rev"><b className="lat">−</b>{V.reversal}</span>
          </div>
        );
      default: // works at 500 rows like at 5,000
        return (
          <div className="v-scale">
            <span className="v-count lat"><span className="v-n" /> {V.rows}</span>
            <span className="v-pages lat"><i>‹</i><i className="on">1</i><i>2</i><i>3</i><i>›</i></span>
            <small>{V.server}</small>
          </div>
        );
    }
  };

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <SmoothScroll />
      <Reveal />
      <TimelineScroll />
      <Nav lang={lang} path="/" home />

      {/* Every section a reader came for, under one landmark, so a
          screen reader can jump past the bar and the rail in one move. */}
      <main id="main">
        {/* ---------------------------------------------------------- hero */}
        {/* An editorial opening. A masthead strip -- availability and place on
            one side, the stack on the other -- then the offer, set large across
            the whole measure, with the three words that carry it underlined by
            the same pen that writes the logo. Under it the argument in two
            columns: what I do and how to start, and the proof, running. */}
        <section id="home" className="wrap hero relative scroll-mt-24 pb-16 pt-28 sm:pt-32 lg:pb-20">
          <div className="hero-top">
            <p className="inline-flex items-center gap-2.5 rounded-[var(--r-chip)] border px-3.5 py-1.5 text-[13px] font-bold"
               style={{ borderColor: 'var(--line)', background: 'var(--glass)', color: 'var(--ink-2)' }}>
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full" style={{ background: 'var(--ok)' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--ok)' }} />
              </span>
              {t.hero.status}
              <span style={{ color: 'var(--ink-3)' }}>·</span>
              <span className="inline-flex items-center gap-1" style={{ color: 'var(--ink-3)' }}>
                <Icon name="mapPin" size={13} />{PROFILE.location[lang]}
              </span>
            </p>
            <p className="hero-role lat">{t.hero.roleLine}</p>
          </div>

          {/* The name is on the bar, in the footer and in the title; the
              headline is the offer. */}
          <h1 className="hero-h">
            <span className="hero-l">
              {t.hero.h1a.split(t.hero.mark)[0]}
              <span className="hero-mark">
                {t.hero.mark}
                <svg className="hero-pen" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 11 C 70 5, 170 3, 297 8" pathLength="1" />
                </svg>
              </span>
              {t.hero.h1a.split(t.hero.mark)[1]}
            </span>
            <span className="hero-l is-soft">{t.hero.h1b}</span>
          </h1>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="max-w-[48ch] text-[17px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>
                {PROFILE.lede[lang]}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#work" className="btn btn-primary">
                  {t.hero.cta1} <Icon name={arrow} size={16} />
                </a>
                <a href="#contact" className="btn btn-ghost">{t.hero.cta2}</a>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CvButton lang={lang} />
                {/* Direct channels as one segmented pill: it reads as a unit and wraps as a unit. */}
                <div className="social-pill" role="group" aria-label={t.contact.eyebrow}>
                  <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Icon name="github" size={18} /></a>
                  <a href={`mailto:${PROFILE.links.email}`} aria-label="Email" title={PROFILE.links.email}><Icon name="mail" size={18} /></a>
                  <a href={PROFILE.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><Icon name="whatsapp" size={18} /></a>
                </div>
              </div>

              {/* Four figures as a ruled two-by-two: each cell a number and a
                  two-word label, hairlines between, nothing to wrap. */}
              <ul className="hero-stats">
                {stats.map(([n, l]) => (
                  <li key={l}>
                    <span className="lat">{n}</span>
                    <small>{l}</small>
                  </li>
                ))}
              </ul>
            </div>

            {/* The proof, not a picture of it: the real tests behind the claims,
                running -- set on a plate of the one strong colour on the page. */}
            <div className="hero-proof">
              <div className="hero-plate">
                <TestRunner lang={lang} tests={HERO_TESTS} />
              </div>
              <p className="mt-5 text-center text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{t.hero.runner.caption}</p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- marquee */}
        <div className="wrap rise">
          <div className="glass px-2" style={{ borderRadius: 999 }}>
            <Marquee items={SKILLS} />
          </div>
        </div>

        {/* ---------------------------------------------------------- work */}
        {/* Five projects at one size is a contact sheet, not an exhibition: it
            tells a visitor that nothing here is worth more than anything else.
            Three layouts instead — a lead with the image full width above it,
            two features with the image beside the text (mirrored, so the page
            does not march), and a pair of halves between them. Diwan leads
            because it is the one whose product idea a non-technical client
            understands in a sentence. The lead is also the tallest card: a
            21:9 band across the full column outranks a 4:3 beside text. */}
        <section id="work" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          <SectionHead eyebrow={t.work.eyebrow} h={t.work.h} lede={t.work.lede} />
          <ol className="grid gap-7 lg:grid-cols-2">
            {live.map((p, i) => {
              const c = p[lang];
              const cv = cover(p);
              const shots = shotsOf(p.shots).shots.length;
              const pages = pagesOf(p.shots);
              // The first three carry the argument: a shop whose product idea a
              // client grasps in a sentence, a booking system whose hardest part
              // is concurrency, and a platform whose hardest part is roles. The
              // last two are evidence that the range is not three projects wide,
              // and they are sized as evidence rather than as headline.
              const layout = i === 0 ? 'lead' : i < 3 ? 'side' : 'half';
              const wide = layout !== 'half';
              const flip = i === 2;                                   // the third mirrors the second
              const num = String(i + 1).padStart(2, '0');
              const ratio = layout === 'lead' ? '21 / 9' : layout === 'side' ? '4 / 3' : '16 / 10';

              // The 960px thumbnail and the 1600px capture are the same top crop,
              // so either can fill the frame. The larger one is offered only from
              // `lg` up: a phone slot is 390px, where 960 is already 2.5x, and a
              // plain srcset would hand a 3x phone the 1600px file five times
              // over — measured at 360KB against 120KB for the same picture.
              const img = (
                <picture>
                  <source media="(min-width:1024px)"
                          srcSet={`/shots/${p.shots}/${cv.thumb} ${cv.tw}w, /shots/${p.shots}/${cv.file} ${cv.w}w`}
                          sizes={layout === 'lead' ? '1100px' : '560px'} />
                  <img
                    src={`/shots/${p.shots}/${cv.thumb}`}
                    alt={`${c.name} — ${c.kind}`}
                    width={cv.tw} height={cv.th}
                    loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async"
                    className="block w-full"
                    style={{ aspectRatio: ratio, objectFit: 'cover', objectPosition: 'top center' }}
                  />
                </picture>
              );

              // A thin browser bar with the address the screen actually lives at:
              // the live demo where there is one, otherwise the repository. It
              // says "this is a product that runs" before a word is read.
              const where = p.demo ? new URL(p.demo).host : p.repo.replace('https://', '');
              const frame = (extra = '') => (
                <div className={`m-3 overflow-hidden rounded-[var(--r-ctl)] border ${extra}`} style={{ borderColor: 'var(--line)' }}>
                  <div className="card-bar" aria-hidden="true"><span className="lat">{where}</span></div>
                  <div className="zoom relative overflow-hidden">
                    {img}
                    <span className="tint" />
                    <span className="glass lat absolute top-3 px-2 py-0.5 text-[11.5px] font-bold"
                          style={{ insetInlineStart: 12, borderRadius: 'var(--r-chip)' }}>{num}</span>
                  </div>
                </div>
              );

              const body = (
                <div className={`flex flex-1 flex-col gap-5 px-6 pb-6 ${layout === 'side' ? 'pt-6 lg:justify-center' : 'pt-2'}${layout === 'lead' ? ' lg:flex-row lg:items-end lg:gap-10' : ''}`}>
                  <div className={layout === 'lead' ? 'lg:flex-1' : undefined}>
                    <p className="text-[13px] font-bold" style={{ color: 'var(--accent-ink)' }}>{c.kind}</p>
                    <h3 className={`mt-1 font-extrabold tracking-tight ${layout === 'lead' ? 'text-[clamp(26px,3.4vw,38px)]' : layout === 'side' ? 'text-[26px]' : 'text-[23px]'}`}>{c.name}</h3>
                    <p className={`mt-2 leading-[1.8] ${layout === 'half' ? 'text-[15.5px]' : 'max-w-[52ch] text-[16.5px]'}`} style={{ color: 'var(--ink-2)' }}>
                      {c.tagline}
                    </p>
                  </div>
                  <div className={`flex flex-col gap-3.5${layout === 'lead' ? ' lg:items-end lg:text-end' : ''}`}>
                    <p className="mono flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px]" style={{ color: 'var(--ink-3)' }}>
                      <span className="lat">{p.year}</span>
                      <span aria-hidden="true">·</span>
                      <span><span className="lat">{pages}</span> {t.work.pages}</span>
                      <span aria-hidden="true">·</span>
                      <span><span className="lat">{shots}</span> {t.work.shots}</span>
                    </p>
                    <ul className="mono flex flex-wrap gap-1.5">
                      {/* Three is what a client reads; the full stack is on the case study. */}
                      {p.stack.slice(0, 3).map((x) => (
                        <li key={x} className="chip px-2.5 py-1 text-[11.5px]">{x}</li>
                      ))}
                    </ul>
                    <p className="arrow-slide inline-flex items-center gap-1.5 text-[14.5px] font-bold"
                       style={{ color: 'var(--accent-ink)' }}>
                      {t.work.open} <Icon name={arrow} size={15} />
                    </p>
                  </div>
                </div>
              );

              return (
                <Fragment key={p.slug}>
                {i === 3 && (
                  <li className="lg:col-span-2 mt-6 flex items-center gap-4" aria-hidden="true">
                    <span className="text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{t.work.more}</span>
                    <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
                  </li>
                )}
                <li className={`${wide ? 'lg:col-span-2 ' : ''}${i > 0 ? 'rise ' : ''}min-w-0`} style={{ '--i': i % 2 }}>
                  <a href={`/${lang}/work/${p.slug}/`} className="card hover-lift group block h-full overflow-hidden">
                    {layout === 'side' ? (
                      <div className="grid h-full lg:grid-cols-[1.02fr_.98fr]">
                        {frame(flip ? 'lg:order-2' : '')}
                        <div className={`flex ${flip ? 'lg:order-1' : ''}`}>{body}</div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">{frame()}{body}</div>
                    )}
                  </a>
                </li>
                </Fragment>
              );
            })}
          </ol>
        </section>

        {/* ------------------------------------------------------ services */}
        {/* Named the way a client names the thing they need, not the way a stack
            names itself — and each one cites the project that already does it.
            A service with a case study behind it is a claim somebody can check. */}
        <section id="services" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          <SectionHead eyebrow={t.services.eyebrow} h={t.services.h} lede={t.services.lede} />
          {/* One panel per service, stacked: what it is on one side, and on the
              other a drawn interface of what the service delivers, and the
              project that already does it where one does. On a wide screen each panel pins and the next slides
              over it. */}
          <ServiceStack
            lang={lang}
            tests={HERO_TESTS.map((x) => ({ file: x.file.replace('.php', ''), project: x.project }))}
            items={SERVICES.map((sv) => {
              const pr = PROJECTS.find((x) => x.slug === sv.proof);
              return {
                h: sv[lang].h, b: sv[lang].b, visual: sv.visual || null, note: sv.note || null,
                href: pr ? `/${lang}/work/${pr.slug}/` : null,
                name: pr ? pr[lang].name : null,
              };
            })}
          />
        </section>

        {/* ------------------------------------------------------- process */}
        <section id="process" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          <SectionHead eyebrow={t.process.eyebrow} h={t.process.h} />
          {/* Six rules as a bento, each with a small scene that shows the rule
              instead of restating it. Every label in the scenes is either code
              that exists in the projects (lockForUpdate, date_of_birth) or a
              word for what the scene shows -- no invented data. The scenes run
              only while the grid is on screen (.in-view, from <Reveal>) and
              hold their final frame for reduced motion. */}
          <ol className="bento grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            {PROCESS[lang].map((p, i) => {
              const span = ['md:col-span-2 lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2',
                            'md:col-span-2 lg:col-span-4', 'lg:col-span-3', 'lg:col-span-3'][i];
              return (
                <li key={p.h} className={`bn-tile rise ${span}`} style={{ '--i': i % 3 }}>
                  <div className="bn-vis" aria-hidden="true">{scene(i)}</div>
                  <div className="bn-copy">
                    <span className="bn-num lat">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{p.h}</h3>
                    <p>{p.b}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* --------------------------------------------------- engineering proof */}
        {/* The runner in the hero shows the rules passing; this is the index of
            what they are. Same six tests, read rather than watched: the rule in
            plain language, the file that holds it, and the project it guards. */}
        <section id="proof" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          <SectionHead eyebrow={t.proof.eyebrow} h={t.proof.h} lede={t.proof.lede} />
          <CaseFiles lang={lang} tests={HERO_TESTS} />
        </section>

        {/* ------------------------------------------------------ capabilities */}
        {/* Not a rating out of five. The old bars were honest underneath — each
            one counted the projects using that tool — but a filled bar next to a
            tool name reads as a self-assessment whatever the number means. The
            same fact is a sentence now, and the tools are grouped the way the
            work itself divides. */}
        <section id="skills" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          <SectionHead eyebrow={t.skills.eyebrow} h={t.skills.h} lede={t.skills.lede} center />
          {/* An evidence matrix: every tool against every project, a mark where
              it was actually used. Read across, a tool's reach; read down, a
              project's stack. It is the same fact the old cards carried in small
              print, set so it can be checked at a glance -- and it cannot be read
              as a self-rating, because the only thing it counts is the work.
              Practices that are not a package (REST APIs, schema design, locks)
              sit beside their group's name rather than faking a row of marks. */}
          <div className="mx-wrap rise">
            <table className="mx">
              <caption className="sr-only">{t.skills.h}</caption>
              {/* equal project columns, whatever the length of a project's name */}
              <colgroup><col className="mx-c-tool" />{PROJECTS.map((pr) => <col key={pr.slug} />)}</colgroup>
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">{t.skills.eyebrow}</span></th>
                  {PROJECTS.map((pr) => (
                    <th key={pr.slug} scope="col">
                      <a href={`/${lang}/work/${pr.slug}/`}>{pr[lang].name}</a>
                    </th>
                  ))}
                </tr>
              </thead>
              {CAPABILITIES.map((cap) => {
                const items = lang === 'en' && cap.itemsEn ? cap.itemsEn : cap.items;
                const tools = [], practices = [];
                items.forEach((label, k) => {
                  const key = head(cap.items[k]);
                  // Laravel is PHP: a project listing only `Laravel 12` still uses PHP,
                  // and a dash there would tell the reader something false.
                  const implied = { php: ['laravel'] }[key] || [];
                  const used = PROJECTS.map((pr) => pr.stack.some((st) => head(st) === key || implied.includes(head(st))));
                  (used.some(Boolean) ? tools : practices).push({ label, used });
                });
                return (
                  <tbody key={cap.icon}>
                    <tr className="mx-group">
                      <th scope="colgroup" colSpan={PROJECTS.length + 1}>
                        <span>{cap[lang].h}</span>
                        {practices.length > 0 && <small>{practices.map((x) => x.label).join(' · ')}</small>}
                      </th>
                    </tr>
                    {tools.map((tl) => (
                      <tr key={tl.label}>
                        <th scope="row" className="lat">{tl.label}</th>
                        {tl.used.map((u, n) => (
                          <td key={PROJECTS[n].slug}>
                            {u
                              ? <span className="mx-dot" role="img" aria-label={`${tl.label} — ${PROJECTS[n][lang].name}`} />
                              : <span className="mx-none" aria-hidden="true" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                );
              })}
            </table>
          </div>
        </section>

        {/* --------------------------------------------------------- about */}
        <section id="about" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          {/* A portrait in words, and a sheet of facts beside it. Everything this
              section used to hold that another section already says has gone:
              the build list (Services), the time-zone tile (footer, hero), the
              schema-to-screen diagram (hero), the start-up steps (contact). What
              is left is what only this section can say -- how he thinks, and
              where the rules came from. */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] lg:gap-16">
            <div>
              <p className="eyebrow mask-rise">{t.about.eyebrow}</p>
              <h2 className="mask-rise d1 mt-4 text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.15] tracking-tight">{t.about.h}</h2>
              <p className="mt-2 text-[15px] font-bold" style={{ color: 'var(--ink-2)' }}>{t.about.role}</p>
              <blockquote className="ab-quote mask-rise d2">{t.about.quote}</blockquote>
              <div className="ab-prose">
                <p>{t.about.pipelineB}</p>
                <p>{t.about.lede}</p>
              </div>
            </div>

            {/* Facts, not claims: every value comes from the data the rest of the
                page is built from, so the sheet cannot drift from the site. */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <dl className="ab-facts">
                {[
                  [t.about.facts.focus, 'Laravel · Vue · MySQL · QA', true],
                  [t.about.facts.shipped, t.about.facts.shippedV.replace('{n}', PROJECTS.length), false],
                  [t.about.facts.years, t.about.facts.yearsV.replace('{n}', PROFILE.years), false],
                  [t.about.facts.langs, t.about.facts.langsV, false],
                  [t.about.facts.works, t.about.facts.worksV, false],
                  [t.about.facts.based, PROFILE.location[lang], false],
                ].map(([k, v, lat]) => (
                  <div key={k} className="ab-row">
                    <dt>{k}</dt>
                    <dd className={lat ? 'lat' : undefined}>{v}</dd>
                  </div>
                ))}
              </dl>
              <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="ab-code">
                {t.about.code} <span aria-hidden="true">↗</span>
              </a>
            </aside>
          </div>
        </section>

        {/* ------------------------------------------------------ timeline */}
        {TIMELINE.length > 0 && (
          <section id="timeline" className="wrap scroll-mt-24 pt-24 sm:pt-28">
            <SectionHead eyebrow={t.timeline.eyebrow} h={t.timeline.h} center />
            <div className="tl">
              <span className="tl-head" aria-hidden="true" />
              <ol className="grid gap-8 lg:gap-10">
                {TIMELINE.map((x, i) => {
                  const side = i % 2 === 0;
                  return (
                    <li key={x.period + x[lang].h} className="relative rise" style={{ '--i': i % 2 }}>
                      <span className="tl-dot" />
                      <div className={`ps-14 lg:w-1/2 lg:ps-0 ${side ? 'lg:pe-14' : 'lg:ms-auto lg:ps-14'}`}>
                        <div className="card hover-lift p-6">
                          <p className="lat text-[12px] font-bold tracking-widest" style={{ color: 'var(--accent-ink)' }}>{x.period}</p>
                          <h3 className="mt-1.5 text-[19px] font-extrabold">{x[lang].h}</h3>
                          <p className="text-[14px] font-bold" style={{ color: 'var(--ink-3)' }}>{x[lang].org}</p>
                          <p className="mt-2 text-[15px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{x[lang].b}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* --------------------------------------------------- testimonials */}
        {TESTIMONIALS.length > 0 && (
          <section id="testimonials" className="wrap scroll-mt-24 pt-24 sm:pt-28">
            <SectionHead eyebrow={t.testimonials.eyebrow} h={t.testimonials.h} center />
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((x, i) => (
                <li key={x[lang].name} className="card hover-lift rise p-6" style={{ '--i': i }}>
                  <p className="text-[28px] leading-none grad-text" aria-hidden="true">“</p>
                  <p className="mt-1 text-[15.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{x[lang].quote}</p>
                  <p className="mt-5 text-[14.5px] font-extrabold">{x[lang].name}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{x[lang].role}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------- contact */}
        <section id="contact" className="wrap scroll-mt-24 pt-24 sm:pt-28">
          {/* One card, two jobs. The left answers "and then what?" -- the thing a
              client is actually unsure about before writing -- in three steps,
              and offers the two direct channels. The full list of channels is
              in the footer directly below, so it is not repeated here. */}
          <div className="card rise grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-14" style={{ boxShadow: 'none' }}>
            <div>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2 className="mt-4 max-w-[16ch] text-[clamp(28px,4.6vw,46px)] font-extrabold leading-[1.2] tracking-tight">{t.contact.h}</h2>
              <p className="mt-4 max-w-[46ch] text-[16.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{t.contact.b}</p>

              <p className="ct-h">{t.contact.next}</p>
              <ol className="ct-steps">
                {t.contact.steps.map((st, i) => (
                  <li key={st.h}>
                    <span className="ct-n lat" aria-hidden="true">{i + 1}</span>
                    <span><b>{st.h}</b><span>{st.b}</span></span>
                  </li>
                ))}
              </ol>

              <p className="ct-h">{t.contact.direct}</p>
              <p className="ct-direct">
                <a href={`mailto:${PROFILE.links.email}`}><Icon name="mail" size={15} /><span className="lat">{PROFILE.links.email}</span></a>
                <a href={PROFILE.links.whatsapp} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={15} />{t.contact.whatsapp}</a>
              </p>
            </div>
            <ContactForm lang={lang} to={PROFILE.links.email} />
          </div>
        </section>
      </main>

      <Footer lang={lang} links={PROFILE.links} home />
      <BackToTop lang={lang} />
      <Dock lang={lang} home />
    </>
  );
}
