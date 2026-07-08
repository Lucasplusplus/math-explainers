import { motion, useReducedMotion } from "framer-motion";
import { ease, duration } from "./motion.js";

// Drop-in replacement for <section className="dx-section">.
// Fades in and rises 12px on scroll-into-view, once per mount.
// Respects prefers-reduced-motion: shows final state immediately when set.
export function RevealSection({ children, className, ...props }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.section
      className={className}
      {...props}
      initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: shouldReduce ? 0 : duration.medium, ease }}
    >
      {children}
    </motion.section>
  );
}
