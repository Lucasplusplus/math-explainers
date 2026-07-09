import { useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { nav } from "./motion.js";
import Home from "./Home.jsx";
import ExplainerIndex from "./ExplainerIndex.jsx";
import DomainIndex from "./DomainIndex.jsx";
import { explainers, domains } from "./explainers/registry.js";

// Depth of a pathname: "/" = 0, "/explainers" = 1, "/advanced-math/disc" = 2
const segmentCount = (p) =>
  p === "/" ? 0 : p.split("/").filter(Boolean).length;

// Entrance: opacity 0→1 with a 6px rise. Exit: opacity only, no movement.
// One easing curve for both (nav.ease). No lateral direction logic.
const pageVariants = {
  initial: { opacity: 0, y: nav.rise },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: nav.enterDur, ease: nav.ease },
  },
  exit: {
    opacity: 0,
    transition: { duration: nav.exitDur, ease: nav.ease },
  },
};

// Keyed wrapper — AnimatePresence freezes this element (with its location
// snapshot) during exit, so Routes renders the OLD page while it fades out.
function AnimatedRoutes({ location, dir }) {
  const reduce = useReducedMotion();

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/explainers" element={<ExplainerIndex />} />
      {domains.map(({ slug }) => (
        <Route key={slug} path={`/${slug}`} element={<DomainIndex domainSlug={slug} />} />
      ))}
      {explainers.map(({ slug, domain, Component }) => (
        <Route
          key={`${domain}/${slug}`}
          path={`/${domain}/${slug}`}
          element={<Component />}
        />
      ))}
    </Routes>
  );

  // prefers-reduced-motion: instant cut, no framer-motion overhead on the wrapper
  if (reduce) {
    return <div style={{ minHeight: "100vh" }}>{routes}</div>;
  }

  return (
    <motion.div
      custom={dir}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      {routes}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  // Track navigation depth to determine direction.
  // Forward (deeper): dir = +1. Backward (shallower): dir = -1.
  const prevDepth = useRef(segmentCount(location.pathname));
  const dirRef = useRef(1);

  const depth = segmentCount(location.pathname);
  if (depth !== prevDepth.current) {
    dirRef.current = depth >= prevDepth.current ? 1 : -1;
    prevDepth.current = depth;
  }

  const dir = dirRef.current;

  return (
    // LayoutGroup scopes shared-element (layoutId) animations so they survive
    // across page transitions without leaking to unrelated motion components.
    <LayoutGroup>
      <AnimatePresence
        mode="popLayout"
        initial={false}
        custom={dir}
      >
        <AnimatedRoutes
          key={location.key}
          location={location}
          dir={dir}
        />
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
