import Discriminant from "./Discriminant.jsx";
import VietasFormulas from "./VietasFormulas.jsx";

// Add future explainers here: { slug, domain, title, description, Component }.
// The domain slug must match one of the entries in `domains` below.
// App.jsx generates routes as /{domain}/{slug} automatically.
export const explainers = [
  {
    slug: "discriminant",
    domain: "advanced-math",
    title: "The Discriminant",
    description: "How the sign of b²−4ac tells you how many real solutions a quadratic has.",
    Component: Discriminant,
  },
  {
    slug: "vietas-formulas",
    domain: "advanced-math",
    title: "Vieta's Formulas",
    description: "How to read the sum and product of a quadratic's roots straight from its coefficients.",
    Component: VietasFormulas,
  },
];

export const domains = [
  {
    slug: "advanced-math",
    title: "Advanced Math",
    description: "Quadratics, polynomials, functions, and non-linear equations.",
  },
  {
    slug: "algebra",
    title: "Algebra",
    description: "Linear equations, systems, inequalities, and linear functions.",
  },
  {
    slug: "problem-solving-and-data-analysis",
    title: "Problem-Solving and Data Analysis",
    description: "Ratios, percentages, data interpretation, and statistics.",
  },
  {
    slug: "geometry-and-trigonometry",
    title: "Geometry and Trigonometry",
    description: "Area, volume, angle relationships, and right triangle trigonometry.",
  },
];
