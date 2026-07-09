import { motion, useReducedMotion } from "framer-motion";
import { nav, stagger } from "./motion.js";

// Drop-in replacement for <section className="dx-section">.
// Pass `index` (0-based sibling order) to stagger multiple sections.
// Respects prefers-reduced-motion: instant reveal when set.
export function RevealSection({ children, className = "dx-section", index = 0 }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: stagger.rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{
        duration: shouldReduce ? 0 : stagger.duration,
        ease: nav.easeOut,
        delay: shouldReduce ? 0 : index * stagger.childDelay,
      }}
    >
      {children}
    </motion.section>
  );
}
