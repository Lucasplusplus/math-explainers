// Site-wide motion foundation.
//
// All entrance/reveal/page-transition animations have been removed — pages
// render fully and instantly on load. The only motion left is a RESPONSE to a
// user action, and just two things import from here:
//
//   1. AnimatedNumber — a fast count-up when a slider the user is dragging
//      changes a result (ease + duration.fast).
//   2. Shared-element navigation — the layoutId title morph on click
//      (nav.layoutDur + nav.easeOut). A layoutId with no predecessor doesn't
//      animate, so direct loads/refreshes have nothing to animate.

export const EASE = [0.16, 1, 0.3, 1]; // the one easing curve
export const ease = EASE;              // AnimatedNumber count-up

export const duration = { fast: 0.3 }; // AnimatedNumber tween length (300 ms)

// Shared-element (layoutId) card → page-title morph: the only cross-page motion.
export const nav = {
  layoutDur: 0.3,   // 300 ms position/size morph
  easeOut: EASE,
};
