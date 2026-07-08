// Site-wide motion foundation.
// Every animation on the site imports from here — no inline timing values.

// Gentle ease-out: quick start, smooth decelerate, no bounce.
// [x1, y1, x2, y2] cubic-bezier control points.
export const ease = [0.22, 1, 0.36, 1];

// Duration tokens (seconds).
export const duration = {
  fast: 0.3,    // value counters, snappy interactions
  medium: 0.6,  // section reveals
  slow: 1.2,    // curve self-draws
};
