import Discriminant from "./Discriminant.jsx";
import VietasFormulas from "./VietasFormulas.jsx";

// Add future explainers here: { slug, title, description, Component }.
// App.jsx and the index page both read from this list, so a new page is a
// one-line addition once its component file exists.
export const explainers = [
  {
    slug: "discriminant",
    title: "[Concept title]",
    description: "[one-line description]",
    Component: Discriminant,
  },
  {
    slug: "vietas-formulas",
    title: "[Concept title]",
    description: "[one-line description]",
    Component: VietasFormulas,
  },
];
