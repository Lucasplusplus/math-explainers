// Site-wide motion foundation.
// Every animation on the site imports from here — no inline timing values.
// Tune page transitions and reveals here; nowhere else.

// ── The single easing curve ─────────────────────────────────────────────────
// One cubic-bezier for everything: entrances, exits, hovers, shared elements.
// This one value is most of the "smooth feel." Never the browser default.
export const EASE = [0.16, 1, 0.3, 1];

// Back-compat alias — content animations (curve self-draw, counters) import
// `ease`. Points at the same single curve so nothing uses the default.
export const ease = EASE;

// Longer content-animation durations (curve draw-in, value counters).
export const duration = { fast: 0.3, medium: 0.6, slow: 1.2 };

// ── Page navigation ─────────────────────────────────────────────────────────
// Entrances: opacity 0→1 + translateY(6px)→0, 350 ms. Exit: opacity only,
// 120 ms, no movement. Shared-element (layoutId) morph: 300 ms. All one curve.
export const nav = {
  enterDur:  0.35,   // 350 ms — first-mount entrance
  exitDur:   0.12,   // 120 ms — opacity-only fade out
  rise:      6,      // px — vertical entrance offset (SIX, not twenty)
  layoutDur: 0.3,    // 300 ms — shared-element position/size morph
  ease:      EASE,
  // Legacy names kept so existing imports resolve to the single curve:
  easeOut:   EASE,
  easeIn:    EASE,
};

// ── Section / sibling entrance stagger ──────────────────────────────────────
export const stagger = {
  childDelay: 0.025,  // 25 ms between siblings
  duration:   0.35,   // 350 ms per item
  rise:       6,      // px — matches nav.rise
};
