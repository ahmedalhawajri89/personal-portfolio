import { shotsOf, coverOf, src } from '../lib/shots';

/* A project shown as itself: its real screens in the devices they were
   built for. A browser window carries the wide layout, with the demo's own
   address in its bar; a phone stands in front of it with the same product
   on a small screen. The window's screen is a whole page, so the motion
   (components/WorkMotion.jsx) can scroll it as the reader scrolls -- the
   product reads itself. Without motion it shows the top of the page. */
export default function ProjectShot({ p, lang, label }) {
  const { shots } = shotsOf(p.shots);
  const desk = coverOf(p, lang);
  const mobs = shots.filter((s) => s.device !== 'desktop');
  const mob =
    mobs.find((s) => s.key === p.cover && s.locale === lang) ||
    mobs.find((s) => ['home', 'landing'].includes(s.key) && s.locale === lang) ||
    mobs.find((s) => s.locale === lang) ||
    mobs[0];
  const host = (() => { try { return new URL(p.demo).host; } catch { return ''; } })();
  if (!desk) return null;
  return (
    <div className="ps" role="img" aria-label={label}>
      <div className="ps-win">
        <div className="ps-bar" aria-hidden="true">
          <i /><i /><i />
          {host && <span className="ps-url lat">{host}</span>}
        </div>
        <div className="ps-view">
          <img className="ps-img" src={src(p.shots, desk.thumb || desk.file)} alt="" width={desk.tw || desk.w} height={desk.th || desk.h} loading="lazy" decoding="async" />
        </div>
      </div>
      {mob && (
        <div className="ps-phone" aria-hidden="true">
          <div className="ps-pview">
            <img src={src(p.shots, mob.thumb || mob.file)} alt="" width={mob.tw || mob.w} height={mob.th || mob.h} loading="lazy" decoding="async" />
          </div>
        </div>
      )}
    </div>
  );
}
