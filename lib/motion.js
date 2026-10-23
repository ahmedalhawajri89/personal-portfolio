// GSAP, loaded once and only when a page asks for it. Imported at the top of
// a client component it would sit in the first bundle and run its ticker
// through the window where the page is still becoming interactive -- the same
// cost that got Lenis moved behind the first wheel (see SmoothScroll). So the
// three modules arrive together, after the page is idle, and every caller
// shares the one promise.
let ready;

export function loadMotion() {
  if (!ready) {
    ready = Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(
      ([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
        gsap.registerPlugin(ScrollTrigger, SplitText);
        // Pinned and scrubbed sections measure real heights; sections skipped
        // by content-visibility report a guess (see globals.css), so the
        // skipping ends here, after first paint, once and for the whole page.
        document.documentElement.classList.add('cv-off');
        return { gsap, ScrollTrigger, SplitText };
      }
    );
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
