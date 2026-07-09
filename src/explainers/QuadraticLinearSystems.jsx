import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease, duration, nav } from "../motion.js";
import { AnimatedNumber } from "../AnimatedNumber.jsx";
import { RevealSection } from "../RevealSection.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Quadratic-Linear Systems — capstone of the quadratics cluster.
// Fixed parabola y = x²; sliders control the line y = mx + k.
// Combined equation: x² − mx − k = 0. Discriminant D = m² + 4k tells the
// intersection count: 2, 1 (tangent), or 0.
// ─────────────────────────────────────────────────────────────────────────────

const XR = 8;
const YR = 12;
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function QuadraticLinearSystems() {
  const slug = useLocation().pathname.split("/").pop();
  // m = slope, kLine = y-intercept of the line (kLine avoids collision with
  // vertex-form k used on other pages)
  const [m, setM] = useState(2);
  const [kLine, setKLine] = useState(-1);

  // Fixed parabola y = x² → a=1, b=0, c=0
  // Line y = mx + kLine
  // Setting equal: x² = mx + kLine → x² − mx − kLine = 0
  // In combined form Ax² + Bx + C = 0: A=1, B=−m, C=−kLine
  const A = 1;
  const B = -m;
  const C = -kLine;

  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, margin: "-80px 0px" });
  const shouldReduce = useReducedMotion();

  // Discriminant of the combined quadratic (exact integer since m, kLine ∈ ℤ)
  const D = B * B - 4 * A * C; // = m² + 4·kLine

  const count = D > 0 ? 2 : D === 0 ? 1 : 0;

  // intersection x-values (where x² = mx + kLine)
  let intersections = [];
  if (D > 0) {
    const r = Math.sqrt(D);
    intersections = [(-B - r) / (2 * A), (-B + r) / (2 * A)];
  } else if (D === 0) {
    intersections = [-B / (2 * A)];
  }

  // parabola points (fixed y = x²)
  const parabolaPts = [];
  for (let i = 0; i <= 160; i++) {
    const x = -XR + (i / 160) * (2 * XR);
    const y = x * x;
    const yC = Math.max(-YR * 5, Math.min(YR * 5, y));
    parabolaPts.push(`${sx(x).toFixed(1)},${sy(yC).toFixed(1)}`);
  }

  // line endpoints — SVG clip handles overflow
  const lx1 = -XR,
    ly1 = m * lx1 + kLine;
  const lx2 = XR,
    ly2 = m * lx2 + kLine;

  const countLabel =
    count === 2 ? "2 intersections" : count === 1 ? "tangent (1)" : "0 intersections";

  return (
    <div className="dx-page">

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker">Advanced Math · Quadratics</p>
            <motion.h1
              className="dx-title"
              layoutId={`concept-title-${slug}`}
              transition={{ layout: { duration: nav.layoutDur, ease: nav.easeOut } }}
            >
              Quadratic-Linear Systems
            </motion.h1>
            <p className="dx-dek">[dek placeholder]</p>

            <p className="dx-label">THE SYSTEM (move the sliders)</p>
            <div className="dx-eq">
              y = x²
              <br />
              {lineStr(m, kLine)}
            </div>

            <p className="dx-label">COMBINED QUADRATIC</p>
            <div className="dx-formula">{combinedEqStr(B, C)}</div>

            <p className="dx-label">DISCRIMINANT D = B² − 4A (B = −m, A = 1)</p>
            <div className="dx-formula-value">D = <AnimatedNumber value={D} /></div>
            <div className="dx-pill">{countLabel}</div>

            <p className="dx-label">THE RULE TO REMEMBER</p>
            <div className={`dx-rule${D > 0 ? " is-active" : ""}`}>D &gt; 0 → two intersections</div>
            <div className={`dx-rule${D === 0 ? " is-active" : ""}`}>D = 0 → tangent (one)</div>
            <div className={`dx-rule${D < 0 ? " is-active" : ""}`}>D &lt; 0 → no intersections</div>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel" ref={panelRef}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="ql-box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <clipPath id="ql-draw">
                <motion.rect
                  x={0} y={0} height={H}
                  initial={{ width: 0 }}
                  animate={{ width: isInView || shouldReduce ? W : 0 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: duration.slow, ease }}
                />
              </clipPath>
              <g clipPath="url(#ql-box)">
                {/* grid */}
                {[-6, -4, -2, 2, 4, 6].map((g) => (
                  <line key={"v" + g} x1={sx(g)} y1="0" x2={sx(g)} y2={H} stroke="var(--line)" strokeWidth="1" />
                ))}
                {[-8, -4, 4, 8].map((g) => (
                  <line key={"h" + g} x1="0" y1={sy(g)} x2={W} y2={sy(g)} stroke="var(--line)" strokeWidth="1" />
                ))}
                {/* axes */}
                <line x1={sx(0)} y1="0" x2={sx(0)} y2={H} stroke="var(--faint)" strokeWidth="1.5" />
                <line x1="0" y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--muted)" strokeWidth="2" />
                {/* parabola */}
                <polyline
                  clipPath="url(#ql-draw)"
                  points={parabolaPts.join(" ")}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* line y = mx + kLine — dashed, mist colored */}
                <line
                  x1={sx(lx1)}
                  y1={sy(Math.max(-YR * 5, Math.min(YR * 5, ly1)))}
                  x2={sx(lx2)}
                  y2={sy(Math.max(-YR * 5, Math.min(YR * 5, ly2)))}
                  stroke="var(--muted)"
                  strokeWidth="2.5"
                  strokeDasharray="8 5"
                />
                {/* intersection dots — primary visual: accent color */}
                {intersections
                  .filter((x) => Math.abs(x) <= XR + 0.5)
                  .map((x, i) => {
                    const y = x * x;
                    return Math.abs(y) <= YR ? (
                      <circle
                        key={i}
                        cx={sx(x)}
                        cy={sy(y)}
                        r="6"
                        fill="var(--accent)"
                        stroke="var(--bg)"
                        strokeWidth="2.5"
                      />
                    ) : null;
                  })}
              </g>
            </svg>

            <div style={{ marginTop: 16 }}>
              <Slider label="m" val={m} min={-4} max={4} set={setM} />
              <Slider label="k" val={kLine} min={-6} max={6} set={setKLine} />
            </div>
            <p className="dx-note">
              Parabola (solid): y = x² &nbsp;·&nbsp; Line (dashed): y = {m}x{" "}
              {kLine === 0 ? "" : kLine > 0 ? `+ ${kLine}` : `− ${Math.abs(kLine)}`}
            </p>
          </div>
        </div>

        {/* ── The Method ───────────────────────────────────────────────────── */}
        <RevealSection className="dx-section" index={0}>
          <h2 className="dx-section-title">The Method</h2>
          <p className="dx-section-intro">
            To find where a line meets a parabola, substitute the line into the parabola equation so both y's cancel. What remains is a single quadratic in x — solve it the usual way.
          </p>

          <div className="dx-panel">
            <p className="dx-step-num" style={{ marginTop: 0 }}>
              Step 1 — Write the system
            </p>
            <p className="dx-example-line">y = ax² + bx + c</p>
            <p className="dx-example-line">y = mx + k</p>
            <p className="dx-step-note">
              m is the slope and k is the y-intercept of the line. These are different from the parabola's b and c.
            </p>

            <p className="dx-step-num">Step 2 — Set the expressions equal</p>
            <p className="dx-example-line">ax² + bx + c = mx + k</p>
            <p className="dx-step-note">
              Both expressions equal y, so they equal each other at any intersection point.
            </p>

            <p className="dx-step-num">Step 3 — Move everything to one side</p>
            <p className="dx-example-line">ax² + (b − m)x + (c − k) = 0</p>
            <p className="dx-step-note">
              Let B = b − m and C = c − k. The combined equation is Ax² + Bx + C = 0.
            </p>

            <p className="dx-step-num">Step 4 — Solve the quadratic</p>
            <p className="dx-example-line">
              x = <Fraction num={<>−B ± √(B² − 4AC)</>} den="2A" />
            </p>
            <p className="dx-step-note">
              Each solution for x gives one intersection point. Substitute back into either equation to find the y-coordinate.
            </p>
          </div>
        </RevealSection>

        {/* ── Discriminant Connection ───────────────────────────────────────── */}
        <RevealSection className="dx-section" index={1}>
          <h2 className="dx-section-title">The Discriminant Connection</h2>
          <p className="dx-section-intro">
            The number of intersections is determined entirely by the discriminant D = B² − 4AC of the combined quadratic — the same rule you already know.
          </p>

          <div className="dx-panel">
            <p className="dx-example-line">D = B² − 4AC &nbsp; where B = b − m, C = c − k</p>
            <p className="dx-step-note" style={{ marginTop: 8, marginBottom: 16 }}>
              A is the leading coefficient of the parabola (A = a), not a new quantity.
            </p>
            <div className="dx-rule is-active" style={{ color: "var(--ink)", fontSize: 18, margin: "8px 0" }}>D &gt; 0 → two intersections</div>
            <div className="dx-rule is-active" style={{ color: "var(--ink)", fontSize: 18, margin: "8px 0" }}>D = 0 → line is tangent (touches at exactly one point)</div>
            <div className="dx-rule is-active" style={{ color: "var(--ink)", fontSize: 18, margin: "8px 0" }}>D &lt; 0 → line and parabola don't meet</div>
            <p className="dx-disc-link">
              The SAT uses "tangent to" as a disguise for D = 0. See the full discriminant rule on the{" "}
              <Link to="/advanced-math/discriminant">Discriminant page</Link>.
            </p>
          </div>
        </RevealSection>

        {/* ── How it shows up on the SAT ───────────────────────────────────── */}
        <RevealSection className="dx-section" index={2}>
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT tests two patterns for quadratic-linear systems: using D to count solutions, and using D = 0 to find a missing constant.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — "exactly one solution" → D = 0 and solve</p>
              <p className="dx-disguise-q">
                "For what value of k does the line y = 2x + k touch the parabola y = x² at exactly one point?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> "exactly one point" / "tangent to" means D = 0. Substitute to form the combined quadratic, set its discriminant to zero, and solve for the missing constant. The constant appears linearly in D, so one step of algebra gets it.
              </p>
              <p className="dx-disguise-map">exactly one → D = 0 → solve for k</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — "how many solutions" → sign of D</p>
              <p className="dx-disguise-q">
                "How many solutions does the system y = x² − 3, y = 2x + 1 have?" / "The system below has no real solutions. Which of the following must be true?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> substitute to get a combined quadratic, compute D. If D &gt; 0: two solutions; D = 0: one; D &lt; 0: none. You often don't need to find the actual intersection points — just the sign of D answers the question.
              </p>
              <p className="dx-disguise-map">count question → compute D → check sign</p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: For what value of k is the line y = 2x + k tangent to the parabola y = x²?
            </p>
            <p className="dx-disguise-tell">
              "Tangent" means the line touches the parabola at exactly one point — that's the D = 0 condition.
            </p>
            <p className="dx-example-line">Step 1: Set equal.</p>
            <p className="dx-example-line">x² = 2x + k</p>
            <p className="dx-example-line">Step 2: Rearrange.</p>
            <p className="dx-example-line">x² − 2x − k = 0</p>
            <p className="dx-example-line">Step 3: Identify A, B, C.</p>
            <p className="dx-example-line">A = 1, B = −2, C = −k</p>
            <p className="dx-example-line">Step 4: Discriminant D = B² − 4AC.</p>
            <p className="dx-example-line">D = (−2)² − 4(1)(−k) = 4 + 4k</p>
            <p className="dx-example-line">Step 5: Set D = 0 for tangency.</p>
            <p className="dx-example-line">4 + 4k = 0 → k = −1</p>
            <p className="dx-example-line">Tangent point: x² − 2x + 1 = 0 → (x − 1)² = 0 → x = 1, y = 1</p>
            <p className="dx-example-line">Answer: k = −1, tangent at (1, 1)</p>
            <p className="dx-disguise-tell" style={{ marginTop: 12 }}>
              Verify: the line y = 2x − 1 passes through (1, 1) since 2(1) − 1 = 1 ✓
            </p>
            <p className="dx-example-link">
              What you really did: turned a geometry question ("tangent") into an algebra condition (D = 0) using the discriminant. The slider above defaults to this exact case — drag k back to −1 to see the tangent point.
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

function Fraction({ num, den }) {
  return (
    <span className="dx-frac">
      <span className="dx-frac-num">{num}</span>
      <span className="dx-frac-den">{den}</span>
    </span>
  );
}

// Build a string like "x² − 3x + 2 = 0" from B and C in x² + Bx + C = 0
function combinedEqStr(B, C) {
  let s = "x²";
  if (B !== 0) {
    const bAbs = Math.abs(B);
    const bSign = B > 0 ? " + " : " − ";
    s += bAbs === 1 ? `${bSign}x` : `${bSign}${bAbs}x`;
  }
  if (C !== 0) {
    const cAbs = Math.abs(C);
    const cSign = C > 0 ? " + " : " − ";
    s += `${cSign}${cAbs}`;
  }
  return s + " = 0";
}

// Build a string like "y = 2x + 3" or "y = −x − 1" for the line
function lineStr(m, k) {
  let s = "y = ";
  if (m === 0) {
    s += k;
    return s;
  }
  if (m === 1) s += "x";
  else if (m === -1) s += "−x";
  else s += `${m}x`;
  if (k !== 0) {
    s += k > 0 ? ` + ${k}` : ` − ${Math.abs(k)}`;
  }
  return s;
}
