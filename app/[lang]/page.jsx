import { LANGS, T } from '../../lib/i18n';
import { PROJECTS, PROFILE } from '../../content/projects';
import { SERVICES, SKILLS, CAPABILITIES, PROCESS, TIMELINE, TESTIMONIALS, HERO_TESTS } from '../../content/site';
import { shotsOf, pagesOf } from '../../lib/shots';
import { Nav, Dock, Footer, Reveal, ScrollProgress, SmoothScroll, ContactForm, BackToTop, TimelineScroll, Logo } from '../../components/Chrome';
import Marquee from '../../components/Marquee';
import Motion from '../../components/Motion';
import Intro from '../../components/Intro';
import Hero from '../../components/Hero';
import Cover from '../../components/Cover';
import SystemStory from '../../components/SystemStory';
import RuleStack from '../../components/RuleStack';
import TestLab from '../../components/TestLab';
import Scenes from '../../components/Scenes';
import Pointer from '../../components/Pointer';
import Curtain from '../../components/Curtain';
import { BRIEFS } from '../../content/briefs';
import Icon from '../../components/Icons';
import { HUE, LIGHT } from '../../lib/hues';
import { curtainRoutes } from '../../lib/routes';
import { CvButton } from '../../components/CvPanel';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

// Services and tool groups take the project hues (lib/hues.js) by meaning.
const SV_HUE = { shop: 'var(--h-sec)', book: 'var(--h-ui)', dash: 'var(--h-api)', api: 'var(--h-db)', figma: 'var(--accent)', tests: 'var(--h-test)', diff: 'var(--ink-2)' };
const CAP_HUE = { layers: 'var(--h-api)', layout: 'var(--h-ui)', database: 'var(--h-db)', shield: 'var(--h-test)' };

/* A small moving mark for each service, drawn in its colour: what the
   service makes, in a gesture. They loop only while on screen
   (data-m="live" sets .is-live) and stand still for reduced motion. */
function Glyph({ kind }) {
  const g = {
    shop: (<><path d="M22 36 H74 L69 78 H27 Z" /><path d="M36 36 V30 a12 12 0 0 1 24 0 V36" /><rect className="g-drop" x="42" y="12" width="12" height="12" rx="3" /></>),
    book: (<><rect x="16" y="20" width="64" height="58" rx="8" /><path d="M16 36 H80 M32 14 V26 M64 14 V26" /><rect className="g-blink" x="44" y="48" width="14" height="10" rx="2" /><path d="M26 53 h10 M66 53 h6 M26 67 h10 M44 67 h14" /></>),
    dash: (<><path d="M16 80 H80" />{[0, 1, 2, 3].map((k) => <rect key={k} className="g-bar" x={22 + k * 15} y="28" width="9" height="50" rx="2" style={{ '--d': `${k * 0.15}s` }} />)}</>),
    api: (<><path d="M30 22 c-10 0 -10 8 -10 14 s-4 12 -8 12 c4 0 8 6 8 12 s0 14 10 14" /><path d="M66 22 c10 0 10 8 10 14 s4 12 8 12 c-4 0 -8 6 -8 12 s0 14 -10 14" /><circle className="g-move" cx="36" cy="48" r="5" /></>),
    figma: (<><path d="M18 28 V18 H28 M68 18 H78 V28 M78 68 V78 H68 M28 78 H18 V68" /><path className="g-draw" d="M28 64 C 40 30, 56 30, 68 52" pathLength="1" /></>),
    tests: (<>{[0, 1, 2].map((k) => (<g key={k}><path d={`M20 ${28 + k * 20} h36`} /><path className="g-pop" d={`M64 ${28 + k * 20} l4 4 l8 -8`} style={{ '--d': `${k * 0.35}s` }} /></g>))}</>),
    diff: (<><path className="g-swap g-out" d="M22 36 H74" /><path className="g-swap g-in" d="M22 60 H74" /><path d="M14 36 h4 M14 60 h2 M16 58 v4" /></>),
  }[kind];
  return <svg className="glyph" viewBox="0 0 96 96" aria-hidden="true">{g}</svg>;
}

/* Each section opens the same way: a label in the section's colour, then
   the heading set large with its lines rising out from behind a mask
   (data-m="lines"), then the lede. */
function SectionHead({ eyebrow, h, lede, center, hue }) {
  return (
    <header className={`sec-head mb-14 ${center ? 'mx-auto max-w-[62ch] text-center' : 'max-w-[62ch]'}`} style={hue ? { '--c': hue } : undefined}>
      <span className="sec-rule" data-m="rule" aria-hidden="true" />
      <p className="sec-label mask-rise">{eyebrow}</p>
      <h2 className="sec-h mt-4" data-m="lines">{h}</h2>
      {lede && <p className="sec-lede mask-rise d2">{lede}</p>}
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
  const totalTests = live.reduce((n, p) => n + (BRIEFS[p.slug]?.tests || 0), 0);
  // A tool matches a project's stack on its leading word, so `Vue 3` finds
  // `Vue 3.5` and `Tailwind CSS` finds `Tailwind 4`. Used by the tools.
  const head = (x) => x.toLowerCase().split(/[\s.]/)[0];

  // Words used inside the rule scenes. Code identifiers stay in English.
  const V = ar
    ? { stored: 'مُخزَّن', derived: 'مُشتقّ', approved: 'مُعتمَد', reversal: 'قيد مضاد', rows: 'عدد السجلات', query: 'زمن الاستعلام', server: 'من جهة الخادم' }
    : { stored: 'stored', derived: 'derived', approved: 'approved', reversal: 'counter-entry', rows: 'rows', query: 'query time', server: 'server-side' };
  // Where each rule came from: the projects it was learned in.
  const ORIGINS = [
    ['diwan', 'booking', 'takharruj', 'lamma', 'opsight'],
    ['diwan', 'booking'],
    ['diwan', 'booking', 'takharruj'],
    ['lamma', 'booking'],
    ['diwan', 'lamma'],
    ['takharruj', 'lamma'],
  ].map((slugs) => slugs.map((sl) => PROJECTS.find((x) => x.slug === sl)).filter(Boolean)
    .map((pr) => ({ name: pr[lang].name, href: `/${lang}/work/${pr.slug}/`, hue: HUE[pr.slug] })));

  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <Reveal />
      <TimelineScroll />
      <Motion />
      <Nav lang={lang} path="/" home />
      <Intro name={PROFILE.name[lang]} role={t.hero.roleLine} />
      <Curtain routes={curtainRoutes(lang)} here={`/${lang}/`} />
      <Pointer label={t.work.view} />
      <Scenes chapters={[
        { id: 'work', name: t.work.eyebrow, hue: LIGHT.accent },
        { id: 'services', name: t.services.eyebrow, hue: LIGHT.ui },
        { id: 'process', name: t.process.eyebrow, hue: LIGHT.api },
        { id: 'proof', name: t.proof.eyebrow, hue: LIGHT.test },
        { id: 'skills', name: t.skills.eyebrow, hue: LIGHT.db },
        { id: 'about', name: t.about.eyebrow, hue: LIGHT.sec },
        { id: 'contact', name: t.contact.eyebrow, hue: LIGHT.accent },
      ]} />

      {/* Every section a reader came for, under one landmark, so a
          screen reader can jump past the bar and the rail in one move. */}
      <main id="main">
        {/* ---------------------------------------------------------- hero */}
        {/* The offer, set as large as the screen allows and set moving
            (components/Hero.jsx): it arrives in pieces and scatters again on
            the way down, into the page that explains it. */}
        <section id="home" className="wrap hero relative scroll-mt-24">
          <Hero
            rtl={ar}
            status={t.hero.status}
            place={PROFILE.location[lang]}
            line1={t.hero.line1}
            line2={t.hero.line2}
            lede={PROFILE.lede[lang]}
            cta1={t.hero.cta1}
            cta2={t.hero.cta2}
            parts={t.hero.steps}
            stats={[
              { n: PROFILE.years, suffix: '+', l: t.stats.years },
              { n: PROJECTS.length, l: t.stats.projects },
              { n: totalPages, l: t.stats.shots },
              { n: 2, l: t.stats.langs },
            ]}
          >
            <CvButton lang={lang} variant="ghost" compact />
          </Hero>
        </section>

        {/* ----------------------------------------------------------- why */}
        {/* Why him, in one paragraph, read at reading speed: the words
            light up as the reader scrolls through them. */}
        <section id="why" className="wrap why">
          <p className="sec-label" style={{ '--c': 'var(--accent)' }}>{t.why.eyebrow}</p>
          <p className="why-text" data-m="read">{t.why.text}</p>
        </section>

        {/* ---------------------------------------------------------- stack */}
        <Marquee items={SKILLS} roles={t.hero.tools.roles} label={t.hero.tools.label} />

        {/* ---------------------------------------------------------- work */}
        {/* The five projects, one row each: the project's own cover -- its
            idea as a small scene in its colour, playing while on screen
            (components/Cover.jsx) -- beside the question it answered and the
            answer. The screenshots are the case study's proof. Diwan opens
            the list because its idea is the one a client grasps in a line. */}
        <section id="work" className="wrap scroll-mt-24 pt-28 sm:pt-36">
          <SectionHead eyebrow={t.work.eyebrow} h={t.work.h} lede={t.work.lede} hue="var(--accent)" />
          <ol className="pc-list">
            {live.map((p, i) => {
              const c = p[lang];
              const b = BRIEFS[p.slug]?.[lang];
              const href = `/${lang}/work/${p.slug}/`;
              return (
                <li key={p.slug} className={`pc${i % 2 ? ' is-flip' : ''}`} style={{ '--c': HUE[p.slug] }}>
                  <a href={href} className="pc-cover" data-cursor="view" tabIndex={-1} aria-hidden="true">
                    <Cover slug={p.slug} label={`${c.name}: ${c.kind}`} />
                    <span className="pc-n lat">{String(i + 1).padStart(2, '0')}</span>
                  </a>
                  <div className="pc-copy">
                    <p className="pc-label">{c.name}<span className="lat"> · {p.year}</span></p>
                    <h3 className="pc-say" data-m="lines"><a href={href}>{b?.hook || c.tagline}</a></h3>
                    <p className="pc-q"><b>{t.work.problem}</b>{b?.problem || c.summary}</p>
                    <ul className="pc-stack">{p.stack.slice(0, 4).map((x) => <li key={x} className="lat">{x}</li>)}</ul>
                    <a href={href} className="pill" data-magnetic>{t.work.open} <Icon name={arrow} size={15} /></a>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ------------------------------------------------------ services */}
        {/* Named the way a client names the thing they need, each with a
            small moving mark of what it makes and the project that already
            does it. A service with a case study behind it is a claim
            somebody can check. */}
        <section id="services" className="wrap scroll-mt-24 pt-28 sm:pt-36">
          <SectionHead eyebrow={t.services.eyebrow} h={t.services.h} lede={t.services.lede} hue="var(--h-ui)" />
          <ul className="sv-list">
            {SERVICES.map((sv) => {
              const pr = PROJECTS.find((x) => x.slug === sv.proof);
              return (
                <li key={sv.en.h} className="sv" style={{ '--c': SV_HUE[sv.visual] || 'var(--accent)' }}>
                  <div className="sv-mark" data-m="live"><Glyph kind={sv.visual} /></div>
                  <div className="sv-copy">
                    <h3 className="sv-label">{sv[lang].h}</h3>
                    <p className="sv-say" data-m="lines">{sv[lang].b}</p>
                    {pr ? (
                      <a href={`/${lang}/work/${pr.slug}/`} className="pill" style={{ '--c': HUE[pr.slug] }}>
                        <i className="pill-dot" aria-hidden="true" />{t.services.proof} {pr[lang].name} <Icon name={arrow} size={14} />
                      </a>
                    ) : sv.note ? (
                      <p className="sv-note"><span>{t.services.note}</span> <span className="lat">{sv.note}</span></p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ------------------------------------------------------- process */}
        <section id="process" className="wrap scroll-mt-24 pt-28 sm:pt-36">
          <SectionHead eyebrow={t.process.eyebrow} h={t.process.h} lede={t.process.lede} hue="var(--h-api)" />
          {/* Six rules as a deck of cards that stack as the reader scrolls,
              each with a scene that shows the rule happening and the
              projects it came from (components/RuleStack.jsx). */}
          <RuleStack rules={PROCESS[lang]} origins={ORIGINS} V={V} fromLabel={t.process.from} />
        </section>

        {/* --------------------------------------------------- behind the screen */}
        {/* What happens under one button, told by the scroll: the system is
            drawn part by part while each part is explained in plain words
            (components/SystemStory.jsx), and then the tests, by name. */}
        <section id="proof" className="scroll-mt-24 pt-28 sm:pt-36">
          <div className="wrap">
            <SectionHead eyebrow={t.proof.eyebrow} h={t.proof.h} lede={t.proof.lede} hue="var(--h-test)" />
          </div>
          <SystemStory
            parts={t.proof.parts}
            tests={HERO_TESTS.slice(0, 3).map((x) => x.file.replace('.php', ''))}
            total={totalTests}
            passed={t.hero.passed}
            diagramLabel={t.hero.diagram}
          />
          <div className="wrap pt-20">
            <p className="sec-label" style={{ '--c': 'var(--h-test)' }}>{t.proof.tests}</p>
            <h3 className="sec-h tl-h mt-4" data-m="lines">{t.proof.labH}</h3>
            <div className="mt-10">
              <TestLab
                lang={lang}
                tests={HERO_TESTS}
                projects={Object.fromEntries(PROJECTS.map((pr) => [pr.slug, { name: pr[lang].name, repo: pr.repo, hue: HUE[pr.slug] }]))}
                labels={{ list: t.proof.tests, passed: t.proof.passed, again: t.proof.again, problem: t.proof.lProblem, decision: t.proof.lDecision, repo: t.proof.repo }}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- tools */}
        {/* The tools, grouped the way the work divides, each group in its
            colour. Beside every tool, one dot per project in that project's
            colour, lit where the tool is actually used: a fact about the
            work, not a rating of the person. Practices that are not a
            package sit under their group's name. */}
        <section id="skills" className="wrap scroll-mt-24 pt-28 sm:pt-36">
          <SectionHead eyebrow={t.skills.eyebrow} h={t.skills.h} lede={t.skills.lede} hue="var(--h-db)" />
          <div className="tg">
            {CAPABILITIES.map((cap) => {
              const items = lang === 'en' && cap.itemsEn ? cap.itemsEn : cap.items;
              const tools = [], practices = [];
              items.forEach((label, k) => {
                const key = head(cap.items[k]);
                // Laravel is PHP: a project listing only `Laravel 12` still uses PHP.
                const implied = { php: ['laravel'] }[key] || [];
                const used = PROJECTS.map((pr) => pr.stack.some((st) => head(st) === key || implied.includes(head(st))));
                (used.some(Boolean) ? tools : practices).push({ label, used });
              });
              return (
                <section key={cap.icon} className="tg-col" style={{ '--c': CAP_HUE[cap.icon] }}>
                  <h3 className="tg-h">{cap[lang].h}</h3>
                  <p className="tg-b">{cap[lang].b}</p>
                  <ul className="tg-list" data-m="pop">
                    {tools.map((tl) => (
                      <li key={tl.label}>
                        <span className="tg-name lat">{tl.label}</span>
                        <span className="tg-dots">
                          {tl.used.map((u, n) => (
                            <i key={PROJECTS[n].slug} className={u ? 'on' : ''} style={{ '--p': HUE[PROJECTS[n].slug] }}
                               title={PROJECTS[n][lang].name} aria-label={u ? `${tl.label}: ${PROJECTS[n][lang].name}` : undefined} role={u ? 'img' : undefined} />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {practices.length > 0 && <p className="tg-practice">{practices.map((x) => x.label).join(' · ')}</p>}
                </section>
              );
            })}
          </div>
          <p className="tg-legend">
            <span>{t.skills.legend}</span>
            {PROJECTS.map((pr) => (
              <a key={pr.slug} href={`/${lang}/work/${pr.slug}/`} style={{ '--p': HUE[pr.slug] }}><i aria-hidden="true" />{pr[lang].name}</a>
            ))}
          </p>
        </section>

        {/* --------------------------------------------------------- about */}
        {/* Behind the camera: the mark drawn large, the name, the one line he
            works by lit as it is read, how he got here in his own words, and
            four figures the rest of the page already proves. */}
        <section id="about" className="wrap scroll-mt-24 pt-28 sm:pt-36">
          <p className="sec-label" style={{ '--c': 'var(--accent)' }}>{t.about.eyebrow}</p>
          <div className="ab2">
            <div className="ab2-mark" data-m="drawmark"><Logo size={168} /></div>
            <div className="ab2-copy">
              <h2 className="ab2-name" data-m="lines">{t.about.h}</h2>
              <p className="ab2-role">{t.about.role} · {PROFILE.location[lang]}</p>
              <blockquote className="ab2-quote" data-m="read">{t.about.quote}</blockquote>
              <div className="ab2-prose">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
              </div>
              <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="pill">
                <Icon name="github" size={15} />{t.about.code}
              </a>
            </div>
          </div>
          <ul className="ab2-figs">
            {[
              [PROFILE.years, '+', t.about.figs.years, 'var(--h-sec)'],
              [PROJECTS.length, '', t.about.figs.projects, 'var(--h-ui)'],
              [totalTests, '', t.about.figs.tests, 'var(--h-test)'],
              [2, '', t.about.figs.langs, 'var(--h-api)'],
            ].map(([n, suf, l, c]) => (
              <li key={l} style={{ '--c': c }}>
                <span className="lat"><b data-m="count" data-to={n}>{n.toLocaleString('en-US')}</b>{suf}</span>
                <small>{l}</small>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------ timeline */}
        {TIMELINE.length > 0 && (
          <section id="timeline" className="wrap scroll-mt-24 pt-24 sm:pt-28">
            <SectionHead eyebrow={t.timeline.eyebrow} h={t.timeline.h} center />
          </section>
        )}

        {/* --------------------------------------------------- testimonials */}
        {TESTIMONIALS.length > 0 && (
          <section id="testimonials" className="wrap scroll-mt-24 pt-24 sm:pt-28">
            <SectionHead eyebrow={t.testimonials.eyebrow} h={t.testimonials.h} center />
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((x, i) => (
                <li key={x[lang].name} className="card hover-lift rise p-6" style={{ '--i': i }}>
                  <p className="mt-1 text-[15.5px] leading-[1.85]" style={{ color: 'var(--ink-2)' }}>{x[lang].quote}</p>
                  <p className="mt-5 text-[14.5px] font-extrabold">{x[lang].name}</p>
                  <p className="text-[12.5px]" style={{ color: 'var(--ink-3)' }}>{x[lang].role}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------- contact */}
        {/* The cream band at the end, as the page's last colour change: the
            closing line read at reading speed, what happens after writing,
            and the form. */}
        <section id="contact" className="band scroll-mt-24" data-m="band">
          <div className="wrap band-in">
            <p className="finale" data-m="read">{t.contact.finale}</p>
            <div className="ct2">
              <div>
                <h2 className="ct2-h" data-m="lines">{t.contact.h}</h2>
                <p className="ct2-b">{t.contact.b}</p>

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
          </div>
        </section>
      </main>

      <Footer lang={lang} links={PROFILE.links} home />
      <BackToTop lang={lang} />
      <Dock lang={lang} home />
    </>
  );
}
