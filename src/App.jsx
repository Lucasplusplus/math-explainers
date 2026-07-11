import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import Home from "./Home.jsx";
import ExplainerIndex from "./ExplainerIndex.jsx";
import DomainIndex from "./DomainIndex.jsx";
import { explainers, domains } from "./explainers/registry.js";

// Pages render instantly — no entrance/exit animation. The only cross-page
// motion is the shared-element (layoutId) title morph, which fires on click
// and is coordinated by LayoutGroup. A layoutId element only animates when a
// matching element existed in the previous route, so direct loads/refreshes
// have nothing to animate and appear fully at once.
function AppContent() {
  const location = useLocation();

  return (
    <LayoutGroup>
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
