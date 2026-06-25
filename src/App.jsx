import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import ExplainerIndex from "./ExplainerIndex.jsx";
import { explainers } from "./explainers/registry.js";

// Adding a new explainer page later: drop the component in src/explainers/,
// register it in src/explainers/registry.js, and a route + index entry show
// up here automatically.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explainers" element={<ExplainerIndex />} />
        {explainers.map(({ slug, Component }) => (
          <Route key={slug} path={`/${slug}`} element={<Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
