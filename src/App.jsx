import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import ExplainerIndex from "./ExplainerIndex.jsx";
import DomainIndex from "./DomainIndex.jsx";
import { explainers, domains } from "./explainers/registry.js";

// Adding a new explainer: drop the component in src/explainers/, register it in
// src/explainers/registry.js with a domain slug, and routes show up here automatically.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explainers" element={<ExplainerIndex />} />

        {/* Domain index pages: /advanced-math, /algebra, etc. */}
        {domains.map(({ slug }) => (
          <Route key={slug} path={`/${slug}`} element={<DomainIndex domainSlug={slug} />} />
        ))}

        {/* Concept pages: /advanced-math/discriminant, /advanced-math/vietas-formulas, etc. */}
        {explainers.map(({ slug, domain, Component }) => (
          <Route key={`${domain}/${slug}`} path={`/${domain}/${slug}`} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
