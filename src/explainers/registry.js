import Discriminant from "./Discriminant.jsx";
import VietasFormulas from "./VietasFormulas.jsx";
import ExponentialFunctions from "./ExponentialFunctions.jsx";
import CompletingTheSquare from "./CompletingTheSquare.jsx";
import QuadraticLinearSystems from "./QuadraticLinearSystems.jsx";
import FunctionTransformations from "./FunctionTransformations.jsx";
import Polynomials from "./Polynomials.jsx";

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
  {
    slug: "exponential-functions",
    domain: "advanced-math",
    title: "Exponential Functions",
    description: "How y = a·bˣ models percent change, and how to build b from a rate.",
    Component: ExponentialFunctions,
  },
  {
    slug: "completing-the-square",
    domain: "advanced-math",
    title: "Completing the Square",
    description: "Rewriting ax² + bx + c into vertex form a(x − h)² + k to expose the vertex directly.",
    Component: CompletingTheSquare,
  },
  {
    slug: "quadratic-linear-systems",
    domain: "advanced-math",
    title: "Quadratic-Linear Systems",
    description: "Finding where a line meets a parabola by combining them into one quadratic and reading the discriminant.",
    Component: QuadraticLinearSystems,
  },
  {
    slug: "function-transformations",
    domain: "advanced-math",
    title: "Function Transformations",
    description: "How shifts, stretches, and reflections change inside vs. outside f(x) — and why the directions differ.",
    Component: FunctionTransformations,
  },
  {
    slug: "polynomials",
    domain: "advanced-math",
    title: "Polynomials",
    description: "Reading roots, multiplicity (cross vs. bounce), and end behavior from a polynomial's factored form.",
    Component: Polynomials,
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
