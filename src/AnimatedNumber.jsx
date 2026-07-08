import { useRef, useEffect } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { ease, duration } from "./motion.js";

const DEFAULT_FMT = (v) => {
  if (!isFinite(v)) return "—";
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
};

// Animates a number from its previous value to the new one using the
// imperative animate() API — no React re-render loop during the tween.
// Replace {value} displays with <AnimatedNumber value={x} /> wherever
// cause-and-effect between a slider and a result should be legible.
export function AnimatedNumber({ value, format = DEFAULT_FMT }) {
  const ref = useRef(null);
  const prevRef = useRef(value);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;

    // Skip animation for null/undefined/NaN, reduced motion, or unchanged value.
    if (!isFinite(from) || !isFinite(to) || shouldReduce || from === to) {
      node.textContent = format(to);
      return;
    }

    const controls = animate(from, to, {
      duration: duration.fast,
      ease,
      onUpdate: (v) => {
        if (node) node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, shouldReduce]); // format intentionally omitted — stable per call site

  return <span ref={ref}>{format(value)}</span>;
}
