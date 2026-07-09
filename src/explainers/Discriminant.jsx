import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease, duration, nav } from "../motion.js";
import { AnimatedNumber } from "../AnimatedNumber.jsx";
import { RevealSection } from "../RevealSection.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// The Discriminant — one concept, one screen.
// Drag a, b, c. The algebra on the left and the parabola on the right move
// from the SAME state, so the sign of b²−4ac IS the picture of how many times
// the curve crosses zero.
//
// Math/interaction logic ported as-is from the reference (DiscriminantExplainer.jsx);
// only the visual layer below has changed (monochrome palette, Redaction
// typeface, placeholder copy).
// ─────────────────────────────────────────────────────────────────────────────

// graph window
const XR = 8; // x from -8..8
const YR = 12; // y from -12..12
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function Discriminant() {
  const slug = useLocation().pathname.split("/").pop();
  const [a, setA] = useState(1);
  const [b, setB] = useState(-8);
  const [c, setC] = useState(7);

  const isQuad = a !== 0;
  const D = b * b - 4 * a * c;

  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, margin: "-80px 0px" });
  const shouldReduce = useReducedMotion();

  // roots (real only)
  let roots = [];
  if (isQuad && D > 0) {
    const r = Math.sqrt(D);
    roots = [(-b - r) / (2 * a), (-b + r) / (2 * a)];
  } else if (isQuad && D === 0) {
    roots = [-b / (2 * a)];
  }

  // status
  let status, count;
  if (!isQuad) {
    status = "a = 0 — this is just a line; discriminant rule only works for quadratics";
    count = "—";
  } else if (D > 0) {
    status = "two real solutions";
    count = "2";
  } else if (D === 0) {
    status = "one repeated solution";
    count = "1";
  } else {
    status = "no real solutions";
    count = "0";
  }

  // curve points
  const pts = [];
  for (let i = 0; i <= 160; i++) {
    const x = -XR + (i / 160) * (2 * XR);
    const y = a * x * x + b * x + c;
    pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  const vx = isQuad ? -b / (2 * a) : null;
  const vy = isQuad ? c - (b * b) / (4 * a) : null;

  // ── fresh problem: client-side, instant, keeps roots in view ────────────
  function fresh() {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const type = pick(["two", "two", "one", "none"]); // weight toward two
    const lead = pick([1, 1, -1, 2]);
    if (type === "two") {
      let r1 = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      let r2 = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      while (r2 === r1) r2 = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      setA(lead);
      setB(-lead * (r1 + r2));
      setC(lead * r1 * r2);
    } else if (type === "one") {
      const r = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
      setA(lead);
      setB(-2 * lead * r);
      setC(lead * r * r);
    } else {
      const bb = pick([-4, -2, 0, 2, 4]);
      const cc = Math.ceil((bb * bb) / 4) + pick([1, 2, 3]);
      setA(1);
      setB(bb);
      setC(cc);
    }
  }

  // ── STUB: future word-problem generation ─────────────────────────────────
  // Not called anywhere yet. When wired up, this would replace (or sit
  // alongside) fresh() to turn the current a/b/c into a contextual word
  // problem instead of just new numbers. The graph/slider state stays the
  // single source of truth either way — this only generates prose around it.
  //
  // async function generateWordProblem(a, b, c) {
  //   const res = await fetch("/api/word-problem", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ a, b, c }),
  //   });
  //   // Server-side route would call the Anthropic API, model
  //   // "claude-sonnet-4-6", with a/b/c and ask for a short JSON word problem
  //   // ({ prompt, answerHint }) consistent with the current discriminant case.
  //   // Never call the Anthropic API directly from the client (API key).
  //   return res.json();
  // }

  const eqTerm = (coef, varStr, first) => {
    if (coef === 0) return null;
    const sign = coef < 0 ? "−" : first ? "" : "+";
    const mag = Math.abs(coef);
    const num = varStr && mag === 1 ? "" : mag;
    return ` ${sign} ${num}${varStr}`.replace("  ", " ");
  };

  return (
    <div className="dx-page">

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker"> Advanced Math · Quadratics </p>
            <motion.h1
              className="dx-title"
              layoutId={`concept-title-${slug}`}
              transition={{ layout: { duration: nav.layoutDur, ease: nav.easeOut } }}
            >
              The Discriminant
            </motion.h1>
            <p className="dx-dek"> Ignore all the bs. Discriminant just means whatever is under the square root. In the Quadratic Formula, it's the b² - 4ac and depending on its value, that will determine how many roots a quadratic has. </p>

            <p className="dx-label">Practice (move the sliders to see when solutions do/don't occur)</p>
            <div className="dx-eq">
              {a !== 0 ? `${a === 1 ? "" : a === -1 ? "−" : a}x²` : "0"}
              {eqTerm(b, "x", a === 0)}
              {eqTerm(c, "", a === 0 && b === 0)}
              {" = 0"}
            </div>

            <p className="dx-label">THE DISCRIMINANT &nbsp;b² − 4ac</p>
            <div className="dx-disc">
              {b}² − 4({a})({c}) = <AnimatedNumber value={D} />
            </div>

            <div className="dx-pill">
              {isQuad ? `${D} ${D > 0 ? ">" : D === 0 ? "=" : "<"} 0  →  ${status}` : status}
            </div>

            {roots.length > 0 && (
              <p style={{ fontSize: 15, color: "var(--mist)", marginTop: 14 }}>
                {roots.length === 2
                  ? `x = ${fmt(roots[0])}  or  x = ${fmt(roots[1])}`
                  : `x = ${fmt(roots[0])} (touches, doesn't cross)`}
              </p>
            )}

            <p className="dx-label">THE RULE TO REMEMBER</p>
            <div className={`dx-rule ${D > 0 && isQuad ? "is-active" : ""}`}>
              b²−4ac &gt; 0 → two roots
            </div>
            <div className={`dx-rule ${D === 0 && isQuad ? "is-active" : ""}`}>
              b²−4ac = 0 → one root
            </div>
            <div className={`dx-rule ${D < 0 && isQuad ? "is-active" : ""}`}>
              b²−4ac &lt; 0 → no real roots
            </div>

            <button className="dx-btn" onClick={fresh}>
              generate new problem
            </button>
            <p className="dx-note">not hard once you recognize the pattern</p>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel" ref={panelRef}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <clipPath id="disc-draw">
                <motion.rect
                  x={0} y={0} height={H}
                  initial={{ width: 0 }}
                  animate={{ width: isInView || shouldReduce ? W : 0 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: duration.slow, ease }}
                />
              </clipPath>
              <g clipPath="url(#box)">
                {/* grid */}
                {[-6, -4, -2, 2, 4, 6].map((g) => (
                  <line key={"v" + g} x1={sx(g)} y1="0" x2={sx(g)} y2={H} stroke="var(--line)" strokeWidth="1" />
                ))}
                {[-8, -4, 4, 8].map((g) => (
                  <line key={"h" + g} x1="0" y1={sy(g)} x2={W} y2={sy(g)} stroke="var(--line)" strokeWidth="1" />
                ))}
                {/* axes */}
                <line x1={sx(0)} y1="0" x2={sx(0)} y2={H} stroke="var(--faint)" strokeWidth="1.5" />
                <line x1="0" y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--mist)" strokeWidth="2" />
                {/* curve — clipPath fires draw-in once on scroll; thereafter stays open */}
                <polyline
                  clipPath="url(#disc-draw)"
                  points={pts.join(" ")}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* vertex */}
                {isQuad && Math.abs(vx) <= XR && Math.abs(vy) <= YR && (
                  <circle cx={sx(vx)} cy={sy(vy)} r="3.5" fill="var(--mist)" />
                )}
                {/* roots */}
                {roots
                  .filter((r) => Math.abs(r) <= XR)
                  .map((r, i) => (
                    <circle
                      key={i}
                      cx={sx(r)}
                      cy={sy(0)}
                      r="7"
                      fill="var(--accent)"
                      stroke="var(--bg)"
                      strokeWidth="2.5"
                    />
                  ))}
              </g>
            </svg>

            <div style={{ marginTop: 16 }}>
              <Slider label="a" val={a} min={-3} max={3} set={setA} />
              <Slider label="b" val={b} min={-9} max={9} set={setB} />
              <Slider label="c" val={c} min={-9} max={9} set={setC} />
            </div>
          </div>
        </div>

        <RevealSection className="dx-section" index={0}>
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT never says "discriminant" — it usually refers to it as roots, solutions, or x-intercepts. Just know that they all mean the same thing here.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — The count</p>
              <p className="dx-disguise-q">
                "How many distinct real solutions does the equation have?" / "How
                many x-intercepts does the graph have?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> any "how many solutions" question is a
                sign-of-D question.
              </p>
              <p className="dx-disguise-map">
                D &gt; 0 → two &nbsp;·&nbsp; D = 0 → one &nbsp;·&nbsp; D &lt; 0 → none
              </p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — Solve for the missing letter</p>
              <p className="dx-disguise-q">
                "x² + 6x + c = 0 has exactly one real solution. What is c?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> "exactly one solution" means D = 0 — set the
                discriminant to zero and solve for the unknown. ("No solution" →
                D &lt; 0, "two" → D &gt; 0.) This is the highest-value form above
                a 650.
              </p>
              <p className="dx-disguise-map">D = 0 → solve for the unknown</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 3 — Touch vs. cross / tangent</p>
              <p className="dx-disguise-q">
                "The graph touches the x-axis at one point." / "The line is
                tangent to the parabola."
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> tangent = one shared point; set the two equal,
                collapse to a quadratic — it's D = 0 again.
              </p>
              <p className="dx-disguise-map">D = 0</p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: x² + 6x + c = 0 has exactly one real solution. Find c.
            </p>
            <p className="dx-disguise-tell">
              "One solution" is the tell. From the rule above, one root
              happens only when the discriminant is zero — so this sentence
              is secretly saying b² − 4ac = 0.
            </p>
            <p className="dx-example-line">
              Read off the numbers: a = 1, b = 6, c is the unknown.
            </p>
            <p className="dx-example-line">Put them in: (6)² − 4(1)(c) = 0</p>
            <p className="dx-example-line">Simplify: 36 − 4c = 0</p>
            <p className="dx-example-line">Solve: 4c = 36, so c = 9</p>
            <p className="dx-example-link">
              What you really did: turned three English words — "exactly one
              solution" — into one equation. That translation is the whole
              skill.
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

function Slider({ label, val, min, max, set }) {
  return (
    <div className="dx-srow">
      <span className="dx-svar">{label}</span>
      <input
        className="dx-slider"
        type="range"
        min={min}
        max={max}
        step={1}
        value={val}
        onChange={(e) => set(parseInt(e.target.value, 10))}
      />
      <span className="dx-sval">{val}</span>
    </div>
  );
}

function fmt(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}
