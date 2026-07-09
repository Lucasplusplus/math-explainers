// Site-wide motion foundation.
// Every animation on the site imports from here — no inline timing values.
// Tune page transitions and reveals here; nowhere else.

// ── Existing (curve self-draws, value counters) ──────────────────────────────
export const ease = [0.22, 1, 0.36, 1];
export const duration = { fast: 0.3, medium: 0.6, slow: 1.2 };

// ── Page navigation ───────────────────────────────────────────────────────────
// duration in seconds; drift in px (= --space-5)
export const nav = {
  duration: 0.2,                       // enter: 200 ms
  exitDur:  0.15,                      // exit: 150 ms — exits slightly faster
  easeOut:  [0.0, 0.0, 0.2, 1.0],     // decelerate on enter
  easeIn:   [0.4, 0.0, 1.0, 1.0],     // accelerate on exit
  drift:    8,                         // px lateral shift on transition
  layoutDur: 0.28,                     // shared-element position morph
};

// ── Section entrance stagger ─────────────────────────────────────────────────
export const stagger = {
  childDelay: 0.04,   // 40 ms between siblings
  duration:   0.25,   // 250 ms per item
  rise:       8,      // px — same value as nav.drift for consistency
};
