import { Fragment } from 'react';
import { LANGS, T } from '../../lib/i18n';
import { PROJECTS, PROFILE } from '../../content/projects';
import { SERVICES, SKILLS, CAPABILITIES, PROCESS, TIMELINE, TESTIMONIALS, HERO_TESTS } from '../../content/site';
import { shotsOf, coverOf, pagesOf } from '../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, CursorGlow, ContactForm, BackToTop, TimelineScroll, LiveClock, TestRunner } from '../../components/Chrome';
import Marquee from '../../components/Marquee';
import Icon from '../../components/Icons';
import { CvButton } from '../../components/CvPanel';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

function SectionHead({ eyebrow, h, lede, center }) {
  return (
    <header className={`mb-12 ${center ? 'mx-auto max-w-[62ch] text-center' : 'max-w-[62ch]'}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.2] tracking-tight">{h}</h2>
      {lede && <p className="mt-4 text-[16.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{lede}</p>}
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
  // Skill bars: how many projects use each tool. Nothing self-assessed.
  // Where each capability has actually been used. A count out of five reads
  // as a score however it is labelled — `5/5 Laravel` is indistinguishable
  // from a self-rating — so the evidence is the project names instead.
  const head = (x) => x.toLowerCase().split(/[\s.]/)[0];
  const usedIn = (cap) => {
    const keys = cap.items.map(head);
    return PROJECTS.filter((pr) => pr.stack.some((st) => keys.includes(head(st))));
  };

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <Reveal />
      <TimelineScroll />
      <Nav lang={lang} path="/" home />

      {/* ---------------------------------------------------------- hero */}
      <section id="home" className="wrap relative grid scroll-mt-24 grid-cols-1 items-center gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-16 lg:pb-20">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold"
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

          {/* The name is a label; the headline is the offer. Someone who has
              never heard of me needs to know what gets built before they need
              to know who builds it — and the name is on the bar, in the footer
              and in the page title anyway. Two lines with the second lighter,
              so the promise and its reach read as one sentence with a hinge. */}
          <p className="mt-8 text-[14px] font-bold tracking-[.14em]" style={{ color: 'var(--ink-3)' }}>
            {PROFILE.name[lang]}
          </p>
          <h1 className="mt-3 text-[clamp(29px,3.9vw,44px)] font-extrabold leading-[1.2] tracking-tight" style={{ color: 'var(--ink)' }}>
            <span className="block" style={{ textWrap: 'balance' }}>{t.hero.h1a}</span>
            <span className="block font-bold" style={{ color: 'var(--ink-2)', textWrap: 'balance' }}>{t.hero.h1b}</span>
          </h1>
          <p className="lat mt-5 text-[13px] font-bold tracking-[.12em]" style={{ color: 'var(--accent-ink)' }}>{t.hero.roleLine}</p>

          <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>
            {PROFILE.lede[lang]}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              {t.hero.cta1} <Icon name={arrow} size={16} />
            </a>
            <a href="#contact" className="btn btn-ghost">{t.hero.cta2}</a>
            <CvButton lang={lang} />
            {/* Direct channels as one segmented pill: it reads as a unit and wraps as a unit. */}
            <div className="social-pill" role="group" aria-label={t.contact.eyebrow}>
              <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><Icon name="github" size={18} /></a>
              <a href={`mailto:${PROFILE.links.email}`} aria-label="Email" title={PROFILE.links.email}><Icon name="mail" size={18} /></a>
              <a href={PROFILE.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><Icon name="whatsapp" size={18} /></a>
            </div>
          </div>

          {/* Four figures on one baseline: two-word labels, no wrapping, hairlines between. */}
          <ul className="mt-12 grid grid-cols-2 border-t pt-8 sm:grid-cols-4" style={{ borderColor: 'var(--line)' }}>
            {stats.map(([n, l], i) => (
              <li key={l} className="flex flex-col items-start gap-1.5 py-2 ps-5 first:ps-0 sm:[&:nth-child(n+2)]:border-s"
                  style={{ borderColor: 'var(--line)', marginInlineEnd: i < 3 ? 20 : 0 }}>
                <span className="lat text-[30px] font-extrabold leading-none tracking-tight" style={{ color: 'var(--ink)' }}>{n}</span>
                <span className="whitespace-nowrap text-[13px] font-bold" style={{ color: 'var(--ink-3)' }}>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The proof, not a picture of it: the real tests behind the claims, running. */}
        <div className="relative">
          <TestRunner lang={lang} tests={HERO_TESTS} />
          <p className="mt-3 text-center text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{t.hero.runner.caption}</p>
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

            const frame = (extra = '') => (
              <div className={`zoom relative m-3 overflow-hidden rounded-[16px] border ${extra}`} style={{ borderColor: 'var(--line)' }}>
                {img}
                <span className="tint" />
                <span className="glass lat absolute top-3 px-2.5 py-1 text-[11.5px] font-bold"
                      style={{ insetInlineStart: 12, borderRadius: 999 }}>{num}</span>
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
                    {p.stack.slice(0, layout === 'half' ? 4 : 6).map((x) => (
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

      {/* ------------------------------------------------------- process */}
      <section id="process" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.process.eyebrow} h={t.process.h} center />
        <div className="tl">
          <span className="tl-head" aria-hidden="true" />
          <ol className="grid gap-8 lg:gap-10">
            {PROCESS[lang].map((p, i) => {
              const side = i % 2 === 0;
              return (
                <li key={p.h} className="relative rise" style={{ '--i': i % 2 }}>
                  <span className="tl-dot" />
                  <div className={`ps-14 lg:w-1/2 lg:ps-0 ${side ? 'lg:pe-14' : 'lg:ms-auto lg:ps-14'}`}>
                    <div className="card hover-lift p-6">
                      <p className="lat text-[12px] font-bold tracking-widest" style={{ color: 'var(--accent-ink)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-1.5 text-[19px] font-extrabold">{p.h}</h3>
                      <p className="mt-2 text-[15px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{p.b}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------- engineering proof */}
      {/* The runner in the hero shows the rules passing; this is the index of
          what they are. Same six tests, read rather than watched: the rule in
          plain language, the file that holds it, and the project it guards. */}
      <section id="proof" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.proof.eyebrow} h={t.proof.h} lede={t.proof.lede} />
        {/* The order the rows are read in, stated once instead of labelling
            all eighteen cells. */}
        <p className="-mt-4 mb-8 flex flex-wrap items-center gap-2 text-[12.5px] font-bold uppercase tracking-widest"
           style={{ color: 'var(--ink-3)' }}>
          <span>{t.proof.lProblem}</span><Icon name={arrow} size={13} />
          <span>{t.proof.lDecision}</span><Icon name={arrow} size={13} />
          <span>{t.proof.lProof}</span>
        </p>
        <div className="card overflow-hidden">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b px-6 py-5" style={{ borderColor: 'var(--line)' }}>
            <span className="lat text-[30px] font-extrabold leading-none tracking-tight">{HERO_TESTS.length}/{HERO_TESTS.length}</span>
            <span className="text-[14px] font-bold" style={{ color: 'var(--ink-2)' }}>{t.proof.count}</span>
          </p>
          <ul>
            {HERO_TESTS.map((x) => {
              const owner = PROJECTS.find((pr) => pr.slug === x.project || pr.shots === x.project);
              return (
                <li key={x.file} className="border-b last:border-0" style={{ borderColor: 'var(--line)' }}>
                  <a href={owner ? `/${lang}/work/${owner.slug}/` : undefined}
                     className="group grid gap-2 px-6 py-5 transition-colors hover:bg-[var(--card-2)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_auto] lg:items-baseline lg:gap-8">
                    {/* What goes wrong, in the words of whoever it goes wrong
                        for. This is the layer a non-technical reader needs
                        first, so it is the one set in the page's body weight. */}
                    <span className="flex items-start gap-3">
                      <span className="mt-1 shrink-0" style={{ color: 'var(--accent-ink)' }} aria-hidden="true">
                        <Icon name="check" size={16} />
                      </span>
                      <span className="text-[15.5px] font-bold leading-[1.7]">{x[`prob${L}`]}</span>
                    </span>
                    {/* What was decided about it. */}
                    <span className="ps-8 text-[14.5px] leading-[1.75] lg:ps-0" style={{ color: 'var(--ink-2)' }}>
                      {x[`dec${L}`]}
                    </span>
                    {/* And the file that keeps it true. */}
                    <span className="flex shrink-0 items-center gap-2.5 ps-8 lg:ps-0">
                      <span className="mono text-[12px]" style={{ color: 'var(--ink-3)' }}>{x.file}</span>
                      {owner && <span className="chip px-2.5 py-1 text-[11.5px] font-bold">{owner[lang].name}</span>}
                      {owner && (
                        <span className="opacity-0 transition-opacity group-hover:opacity-100"
                              style={{ color: 'var(--ink-3)' }} aria-hidden="true">
                          <Icon name={arrow} size={15} />
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------ services */}
      {/* Named the way a client names the thing they need, not the way a stack
          names itself — and each one cites the project that already does it.
          A service with a case study behind it is a claim somebody can check. */}
      <section id="services" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.services.eyebrow} h={t.services.h} lede={t.services.lede} center />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((sv, i) => {
            const proof = sv.proof ? PROJECTS.find((x) => x.slug === sv.proof) : null;
            return (
              <li key={sv.icon + i} className="rise" style={{ '--i': i % 3 }}>
                <div className="card hover-lift flex h-full flex-col p-6">
                  <span className="icon-tile"><Icon name={sv.icon} size={20} /></span>
                  <h3 className="mt-5 text-[18px] font-extrabold leading-snug">{sv[lang].h}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{sv[lang].b}</p>
                  {proof && (
                    <a href={`/${lang}/work/${proof.slug}/`}
                       className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-bold hover:underline"
                       style={{ color: 'var(--accent-ink)' }}>
                      {t.services.proof} {proof[lang].name} <Icon name={arrow} size={14} />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------ capabilities */}
      {/* Not a rating out of five. The old bars were honest underneath — each
          one counted the projects using that tool — but a filled bar next to a
          tool name reads as a self-assessment whatever the number means. The
          same fact is a sentence now, and the tools are grouped the way the
          work itself divides. */}
      <section id="skills" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.skills.eyebrow} h={t.skills.h} lede={t.skills.lede} center />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, i) => {
            const where = usedIn(cap);
            return (
            <li key={cap.icon} className="rise" style={{ '--i': i % 4 }}>
              <div className="card flex h-full flex-col p-6">
                <span className="icon-tile"><Icon name={cap.icon} size={19} /></span>
                <h3 className="mt-4 text-[17px] font-extrabold">{cap[lang].h}</h3>
                <p className="mt-2 text-[14px] leading-[1.75]" style={{ color: 'var(--ink-2)' }}>{cap[lang].b}</p>
                <ul className="mono mt-5 flex flex-wrap gap-1.5">
                  {(lang === 'en' && cap.itemsEn ? cap.itemsEn : cap.items).map((x) => (
                    <li key={x} className="chip px-2.5 py-1 text-[11.5px]">{x}</li>
                  ))}
                </ul>
                {/* Named projects, not a score. `Laravel in all five` is a
                    stronger and less ambiguous fact than `5/5 Laravel`. */}
                {where.length > 0 && (
                  <p className="mt-auto pt-5 text-[13px] leading-[1.7]" style={{ color: 'var(--ink-3)' }}>
                    <span className="font-bold">{t.skills.usedIn}</span>{' '}
                    {where.length === PROJECTS.length
                      ? <span style={{ color: 'var(--ink-2)' }}>{t.skills.allFive}</span>
                      : where.map((pr, k) => (
                          <span key={pr.slug}>
                            {k > 0 && <span aria-hidden="true"> · </span>}
                            <a href={`/${lang}/work/${pr.slug}/`} className="font-bold hover:underline"
                               style={{ color: 'var(--accent-ink)' }}>{pr[lang].name}</a>
                          </span>
                        ))}
                  </p>
                )}
              </div>
            </li>
            );
          })}
        </ul>


      </section>

      {/* --------------------------------------------------------- about */}
      <section id="about" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Who, then what, then why — in that order, because that is the
              order a client asks them in. The tool badges that used to sit
              here said the same thing the capabilities section says, in the
              same words; what belongs here is the work those tools produce. */}
          <div>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.15] tracking-tight">{t.about.h}</h2>
            <p className="mt-2.5 text-[15px] font-bold" style={{ color: 'var(--accent-ink)' }}>
              {t.about.role} <span style={{ color: 'var(--ink-3)' }}>· {PROFILE.location[lang]}</span>
            </p>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{PROFILE.lede[lang]}</p>

            <h3 className="mt-9 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{t.about.builds}</h3>
            {/* Hairline rows rather than another wrap of badges: the same
                restraint the engineering index uses, and it lets six client
                phrases read as a list instead of a pile. */}
            <ul className="mt-3 grid gap-0 sm:grid-cols-2 sm:gap-x-8">
              {t.about.buildsList.map((x) => (
                <li key={x} className="border-b py-2.5 text-[15.5px] font-bold" style={{ borderColor: 'var(--line)' }}>{x}</li>
              ))}
            </ul>

            <h3 className="mt-9 text-[19px] font-extrabold tracking-tight">{t.about.whyH}</h3>
            <p className="mt-2.5 max-w-[58ch] text-[16px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{t.about.whyB}</p>

            {/* What working together looks like, which is the one thing the
                section never said. Not a card and not the method again — the
                six working rules above are how the engineering is done; these
                five words are how the weeks are shaped from the other side of
                the table. Plain type on a hairline, so it stays a sentence. */}
            <h3 className="mt-9 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{t.about.startH}</h3>
            <p className="mt-2.5 max-w-[54ch] text-[16px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{t.about.startB}</p>
            <ol className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t pt-4"
                style={{ borderColor: 'var(--line)' }}>
              {t.about.startSteps.map((x, i) => (
                <li key={x} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span style={{ color: 'var(--ink-3)', opacity: .55 }} aria-hidden="true">
                      <Icon name={arrow} size={13} />
                    </span>
                  )}
                  <span className="text-[14.5px] font-bold">{x}</span>
                </li>
              ))}
            </ol>

            {/* The method and the tests already have sections of their own,
                a screen or two up. This points at them instead of saying it
                all a second time. */}
            <p className="mt-6 text-[15px] leading-[1.9]" style={{ color: 'var(--ink-3)' }}>
              {t.about.seeMore}{' '}
              <a href="#process" className="font-bold hover:underline" style={{ color: 'var(--accent-ink)' }}>{t.about.seeProcess}</a>
              {' · '}
              <a href="#proof" className="font-bold hover:underline" style={{ color: 'var(--accent-ink)' }}>{t.about.seeProof}</a>
            </p>
          </div>

          {/* Bento: small facts that are true right now, not a résumé card.
              `content-start` matters here. The outer two-column grid stretches
              this column to match the text beside it, and a grid's default
              align-content then spreads that height across its auto rows —
              which inflated three 170-220px cards into 392-440px boxes with a
              quarter of a screen of nothing under each. The rows keep their
              own height now, and the leftover falls to the bottom of a
              container that has no background of its own.

              From `lg` the column also sticks. Two things are needed for that
              and neither works alone: `self-start` so the item stops being
              stretched to the row's height — a sticky box cannot travel inside
              a containing block it already fills — and then `sticky`, which
              moves it within the grid area the row still occupies. The result
              is that the facts stay beside the prose that they support for the
              whole read, and the space under them is never looked at. */}
          <div className="grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:sticky lg:top-24 lg:self-start">
            <div className="tile rise" style={{ '--i': 0 }}>
              <p className="tile-k">{t.about.now}</p>
              <div className="mt-3"><LiveClock lang={lang} /></div>
              <p className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold" style={{ color: 'var(--ink-2)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="pulse-ring absolute inline-flex h-full w-full rounded-full" style={{ background: 'var(--ok)' }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--ok)' }} />
                </span>
                {t.about.available}
              </p>
            </div>

            <div className="tile rise" style={{ '--i': 1 }}>
              <p className="tile-k">{t.about.langs}</p>
              <p className="mt-2 text-[13.5px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>{t.about.langsB}</p>
              <div className="mt-4 flex gap-3" aria-hidden="true">
                <div className="flex-1 rounded-xl border p-2.5" style={{ borderColor: 'var(--line)', background: 'var(--card-2)' }} dir="rtl">
                  <span className="lat text-[10px] font-bold" style={{ color: 'var(--ink-3)' }}>AR · RTL</span>
                  <div className="dir-demo"><i className="a" style={{ width: '70%' }} /><i style={{ width: '100%' }} /><i style={{ width: '55%' }} /></div>
                </div>
                <div className="flex-1 rounded-xl border p-2.5" style={{ borderColor: 'var(--line)', background: 'var(--card-2)' }} dir="ltr">
                  <span className="lat text-[10px] font-bold" style={{ color: 'var(--ink-3)' }}>EN · LTR</span>
                  <div className="dir-demo"><i className="a" style={{ width: '70%' }} /><i style={{ width: '100%' }} /><i style={{ width: '55%' }} /></div>
                </div>
              </div>
            </div>

            <div className="tile rise sm:col-span-2" style={{ '--i': 2 }}>
              <p className="tile-k">{t.about.pipeline}</p>
              <div className="pipe" aria-hidden="true">
                <div className="node"><span className="icon-tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name="database" size={17} /></span><span>{t.about.db}</span></div>
                <div className="wire" />
                <div className="node"><span className="icon-tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name="code" size={17} /></span><span>{t.about.api}</span></div>
                <div className="wire" />
                <div className="node"><span className="icon-tile" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name="layout" size={17} /></span><span>{t.about.ui}</span></div>
              </div>
              <p className="mt-4 text-[13.5px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>{t.about.pipelineB}</p>
            </div>

          </div>
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
        <div className="gradient-border rise">
          <div className="card grid grid-cols-1 gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]" style={{ boxShadow: 'none' }}>
            <div>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2 className="mt-4 max-w-[16ch] text-[clamp(28px,4.6vw,46px)] font-extrabold leading-[1.2] tracking-tight">
                {t.contact.h}
              </h2>
              <p className="mt-4 max-w-[48ch] text-[16.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{t.contact.b}</p>
              {/* Names both ways in, so neither reader has to wonder whether
                  the form is meant for them. */}
              <p className="mt-3 max-w-[48ch] border-s-2 ps-4 text-[15px] leading-[1.8]"
                 style={{ color: 'var(--ink-3)', borderColor: 'var(--accent-soft)' }}>{t.contact.paths}</p>
              <ul className="mt-7 grid gap-3">
                {[
                  ['mail', `mailto:${PROFILE.links.email}`, t.contact.email, PROFILE.links.email, false],
                  ['github', PROFILE.links.github, t.contact.github, 'github.com/ahmedalhawajri89', true],
                  ['whatsapp', PROFILE.links.whatsapp, t.contact.whatsapp, '+972 599 520 085', true],
                  ['store', PROFILE.links.khamsat, t.contact.khamsat, 'khamsat.com/user/ahmed12089', true],
                  ['mapPin', null, PROFILE.location[lang], 'GMT+3', false],
                ].map(([icon, href, label, sub, ext]) => {
                  const inner = (
                    <>
                      <span className="icon-tile shrink-0" style={{ width: 42, height: 42, borderRadius: 999 }}><Icon name={icon} size={17} /></span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-extrabold">{label}</span>
                        <span className="lat block truncate text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{sub}</span>
                      </span>
                      {href && <Icon name="external" size={14} className="ms-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />}
                    </>
                  );
                  const cls = 'group flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition-colors';
                  const style = { borderColor: 'var(--line)', background: 'var(--card-2)' };
                  return (
                    <li key={icon} className="min-w-0">
                      {href
                        ? <a href={href} className={cls} style={style} target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}>{inner}</a>
                        : <span className={cls} style={style}>{inner}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
            <ContactForm lang={lang} to={PROFILE.links.email} />
          </div>
        </div>
      </section>

      <Footer lang={lang} links={PROFILE.links} home />
      <BackToTop lang={lang} />
      <Dock lang={lang} home />
    </>
  );
}
