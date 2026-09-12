import { LANGS, T } from '../../lib/i18n';
import { PROJECTS, PROFILE } from '../../content/projects';
import { SERVICES, SKILLS, CORE, PROCESS, TIMELINE, SKILL_ROWS, TRAITS, TESTIMONIALS, HERO_TESTS } from '../../content/site';
import { shotsOf, coverOf, pagesOf } from '../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, CursorGlow, Tilt, ContactForm, BackToTop, TimelineScroll, LiveClock, TestRunner } from '../../components/Chrome';
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
  const skillRows = SKILL_ROWS.map((r) => ({
    ...r,
    n: PROJECTS.filter((p) => p.stack.some((s) => r.match.test(s))).length,
  })).sort((a, b) => b.n - a.n);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <ScrollProgress />
      <CursorGlow />
      <Reveal />
      <TimelineScroll />
      <Nav lang={lang} path="/" home />

      {/* ---------------------------------------------------------- hero */}
      <section id="home" className="wrap relative grid grid-cols-1 items-center gap-12 pb-16 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:gap-16 lg:pb-20">
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

          <p className="mt-8 text-[16px] font-bold" style={{ color: 'var(--ink-3)' }}>{t.hero.hi}</p>
          {/* Solid ink. The name is the loudest thing on the page and needs no gradient to be so. */}
          <h1 className="mt-1 text-[clamp(40px,6.4vw,74px)] font-extrabold leading-[1.08] tracking-tight" style={{ color: 'var(--ink)', textWrap: 'balance' }}>
            {PROFILE.name[lang]}
          </h1>
          <p className="lat mt-4 text-[13px] font-bold tracking-[.12em]" style={{ color: 'var(--accent-ink)' }}>{t.hero.roleLine}</p>

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
      <section id="work" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.work.eyebrow} h={t.work.h} lede={t.work.lede} />
        <ul className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {live.map((p, i) => {
            const shots = shotsOf(p.shots).shots;
            const cv = cover(p);
            const c = p[lang];
            const pages = pagesOf(p.shots);
            return (
              <li key={p.slug} className={i > 0 ? 'rise' : undefined} style={{ '--i': i % 2 }}>
                <Tilt className="card hover-lift h-full overflow-hidden">
                  <a href={`/${lang}/work/${p.slug}/`} className="group flex h-full flex-col">
                    <div className="zoom relative m-3 overflow-hidden rounded-[16px] border" style={{ borderColor: 'var(--line)' }}>
                      <img src={`/shots/${p.shots}/${cv.thumb}`} alt={c.name} width={cv.tw} height={cv.th}
                           loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} decoding="async"
                           className="block w-full"
                           style={{ aspectRatio: '16 / 10', objectFit: 'cover', objectPosition: 'top center' }} />
                      <span className="tint" />
                      <span className="absolute bottom-3 grid h-11 w-11 place-items-center rounded-full text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-1"
                            style={{ insetInlineEnd: 12, background: 'rgba(15,18,34,.55)', border: '1px solid rgba(255,255,255,.3)', backdropFilter: 'blur(10px)' }}>
                        <Icon name={arrow} size={18} />
                      </span>
                      <span className="absolute top-3 flex items-center gap-2" style={{ insetInlineStart: 12 }}>
                        <span className="glass lat px-2.5 py-1 text-[11.5px] font-bold" style={{ borderRadius: 999 }}>{p.year}</span>
                        <span className="glass px-2.5 py-1 text-[11.5px] font-bold" style={{ borderRadius: 999 }}>
                          {shots.length} {t.work.shots} · {pages} {t.work.pages}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                      <p className="text-[13px] font-bold" style={{ color: 'var(--accent-ink)' }}>{c.kind}</p>
                      <h3 className="mt-1 text-[24px] font-extrabold tracking-tight">{c.name}</h3>
                      <p className="mt-2 text-[15.5px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{c.tagline}</p>
                      <ul className="mono mt-4 flex flex-wrap gap-1.5">
                        {p.stack.slice(0, 5).map((s) => (
                          <li key={s} className="chip px-2.5 py-1 text-[11.5px]">{s}</li>
                        ))}
                      </ul>
                      <p className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14.5px] font-bold transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                         style={{ color: 'var(--accent-ink)' }}>
                        {t.work.open} <Icon name={arrow} size={15} />
                      </p>
                    </div>
                  </a>
                </Tilt>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------ services */}
      <section id="services" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.services.eyebrow} h={t.services.h} lede={t.services.lede} center />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.icon} className="rise" style={{ '--i': i }}>
              <div className="card hover-lift h-full p-6">
                <span className="icon-tile"><Icon name={s.icon} size={20} /></span>
                <h3 className="mt-5 text-[18px] font-extrabold leading-snug">{s[lang].h}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.8]" style={{ color: 'var(--ink-2)' }}>{s[lang].b}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------------- about */}
      <section id="about" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(27px,4.4vw,44px)] font-extrabold leading-[1.2] tracking-tight">{t.about.h}</h2>
            <p className="mt-5 text-[17px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{PROFILE.lede[lang]}</p>
            <p className="mt-4 text-[16px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>{PROFILE.role[lang]} · {PROFILE.location[lang]}</p>

            <h3 className="mt-8 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--ink-3)' }}>{t.about.core}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CORE[lang].map((x) => (
                <li key={x} className="chip chip-accent"><Icon name="check" size={13} />{x}</li>
              ))}
            </ul>
          </div>

          {/* Bento: four small facts that are true right now, not a résumé card. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="tile rise sm:col-span-2" style={{ '--i': 3 }}>
              <p className="tile-k">{t.about.code} · <span className="lat">BookingWriter.php</span></p>
              <pre className="code"><code>
<span className="c">// Takes the per-resource mutex. Everything after is serialised.</span>{'\n'}
<span className="k">private function</span> <span className="f">lockResource</span>(<span className="k">string</span> $resourceId): <span className="k">void</span>{'\n'}
{'{'}{'\n'}
{'    '}Resource::query()-&gt;whereKey($resourceId)-&gt;<span className="f">lockForUpdate</span>()-&gt;first();{'\n'}
{'}'}{'\n'}
{'\n'}
<span className="c">// Half-open overlap: touching edges do not collide.</span>{'\n'}
-&gt;where(<span className="s">'start_at'</span>, <span className="s">'&lt;'</span>, $end)-&gt;where(<span className="s">'end_at'</span>, <span className="s">'&gt;'</span>, $start)
              </code></pre>
              <p className="mt-3 text-[13.5px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>{t.about.codeB}</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- skills */}
      <section id="skills" className="wrap scroll-mt-24 pt-24 sm:pt-28">
        <SectionHead eyebrow={t.skills.eyebrow} h={t.skills.h} center />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="card rise p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-[17px] font-extrabold"><Icon name="layers" size={17} />{t.skills.arsenal}</h3>
              <span className="chip text-[11px]">{t.skills.basis}</span>
            </div>
            <ul className="mt-6 grid gap-5">
              {skillRows.map((r, i) => (
                <li key={r.en}>
                  <div className="flex items-center justify-between gap-3 text-[14px] font-bold">
                    <span className="flex items-center gap-2"><span className="icon-tile" style={{ width: 30, height: 30, borderRadius: 9 }}><Icon name={r.icon} size={14} /></span>{lang === 'ar' ? r.ar : r.en}</span>
                    <span className="lat chip px-2 py-0.5 text-[11px]">{r.n} / {PROJECTS.length} {t.skills.projects}</span>
                  </div>
                  <div className="bar mt-2.5" style={{ '--w': `${Math.round((r.n / PROJECTS.length) * 100)}%` }}><i style={{ transitionDelay: `${i * 90}ms` }} /></div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card rise p-6 sm:p-7" style={{ '--i': 1 }}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-[17px] font-extrabold"><Icon name="sparkles" size={17} />{t.skills.traits}</h3>
              <span className="chip text-[11px]">{t.skills.core}</span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TRAITS[lang].map((x, i) => (
                <li key={x} className="chip px-3.5 py-2 text-[13px]"
                    style={{ borderColor: `color-mix(in srgb, var(--accent${['', '-2', '-3'][i % 3]}) 35%, transparent)`, background: `color-mix(in srgb, var(--accent${['', '-2', '-3'][i % 3]}) 10%, transparent)` }}>
                  <Icon name="check" size={13} />{x}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex gap-4 rounded-2xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--card-2)' }}>
              <span className="icon-tile shrink-0" style={{ width: 40, height: 40, borderRadius: 12 }}><Icon name="sparkles" size={17} /></span>
              <span>
                <span className="block text-[15px] font-extrabold">{t.skills.learnerH}</span>
                <span className="mt-1 block text-[13.5px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>{t.skills.learnerB}</span>
              </span>
            </div>
          </div>
        </div>
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
                        <span className="block text-[14.5px] font-extrabold">{label}</span>
                        <span className="lat block truncate text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{sub}</span>
                      </span>
                      {href && <Icon name="external" size={14} className="ms-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />}
                    </>
                  );
                  const cls = 'group flex items-center gap-3 rounded-2xl border p-3 transition-colors';
                  const style = { borderColor: 'var(--line)', background: 'var(--card-2)' };
                  return (
                    <li key={icon}>
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
