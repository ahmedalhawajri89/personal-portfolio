// GSAP and Lenis, loaded once and only when a page asks for them. Imported at
// the top of a client component they would sit in the first bundle and run a
// per-frame loop through the window where the page is still becoming
// interactive -- measured once at 15 points of the desktop score. So the
// modules arrive together, after the page is idle, and every caller shares
// the one promise.
//
// One clock for everything: Lenis is driven by GSAP's ticker rather than its
// own requestAnimationFrame, and tells ScrollTrigger about every scroll it
// makes. Two loops, one easing the page and one reading it, drift a frame
// apart, and a pinned section shows it as a shiver; one loop cannot.
let ready;

export function loadMotion() {
  if (!ready) {
    ready = Promise.all([
      import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('lenis'),
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // Pinned and scrubbed sections measure real heights; sections skipped
      // by content-visibility report a guess (see globals.css), so the
      // skipping ends here, after first paint, once and for the whole page.
      document.documentElement.classList.add('cv-off');

      // Inertia for a mouse or trackpad only: on touch the platform already
      // scrolls with momentum and a second layer of easing fights the finger.
      let lenis = null;
      if (!matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) {
        lenis = new Lenis({
          autoRaf: false,
          // Follow-through rather than a fixed glide: the page moves with the
          // hand and settles at the very end.
          lerp: 0.11,
          // Each section's scroll-margin already sets where an anchor lands.
          anchors: { duration: 1 },
        });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
      return { gsap, ScrollTrigger, SplitText, lenis };
    });
  }
  return ready;
}

/** Runs `fn` when the browser is idle, and returns a function that cancels it. */
export function whenIdle(fn) {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(fn, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
/** A real mouse: hover and a precise pointer, with motion allowed. */
export const POINTER_OK = `${MOTION_OK} and (hover: hover) and (pointer: fine)`;
