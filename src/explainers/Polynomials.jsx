import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { nav } from "../motion.js";
import { RevealSection } from "../RevealSection.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Polynomials — factored form, roots, multiplicity, end behavior.
// Three toggleable factors: (x+2) at root −2 (mult 1, crosses), (x−1)² at
// root 1 (mult 2, bounces), (x−3) at root 3 (mult 1, crosses). Plus a sign
// toggle for the leading coefficient.
// Default all-on: (x+2)(x−1)²(x−3) — degree 4, positive → both ends up,
// with a crossing, a bounce, and a crossing showing all behaviors at once.
// ─────────────────────────────────────────────────────────────────────────────

const XR = 5;
const YR = 12;
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function Polynomials() {
  const slug = useLocation().pathname.split("/").pop();
  const [f1, setF1] = useState(true);   // (x + 2) — root at -2, mult 1
  const [f2, setF2] = useState(true);   // (x − 1)² — root at 1, mult 2
  const [f3, setF3] = useState(true);   // (x − 3) — root at 3, mult 1
  const [posSign, setPosSign] = useState(true);

  const sign = posSign ? 1 : -1;
  const degree = (f1 ? 1 : 0) + (f2 ? 2 : 0) + (f3 ? 1 : 0);


  function evalPoly(x) {
    let y = sign;
    if (f1) y *= x + 2;
    if (f2) y *= (x - 1) * (x - 1);
    if (f3) y *= x - 3;
    return y;
  }

  // curve points with heavy clamping
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = -XR + (i / 200) * (2 * XR);
    const raw = evalPoly(x);
    const y = Math.max(-YR * 3, Math.min(YR * 3, raw));
    pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  // end behavior
  const isEven = degree % 2 === 0;
  const isOdd = degree > 0 && !isEven;
  const bothUp = (isEven || degree === 0) && posSign;
  const bothDown = (isEven || degree === 0) && !posSign;
  const oddPos = isOdd && posSign;
  const oddNeg = isOdd && !posSign;

  // factored form string
  const factoredParts = [];
  if (f1) factoredParts.push("(x + 2)");
  if (f2) factoredParts.push("(x − 1)²");
  if (f3) factoredParts.push("(x − 3)");
  const factoredStr =
    factoredParts.length === 0
      ? sign > 0 ? "1" : "−1"
      : (sign < 0 ? "−" : "") + factoredParts.join("");

  // pill
  const rootCount = (f1 ? 1 : 0) + (f2 ? 1 : 0) + (f3 ? 1 : 0);
  const pillText =
    rootCount === 0
      ? "no roots (constant)"
      : `${rootCount} distinct root${rootCount > 1 ? "s" : ""} · degree ${degree}`;

  return (
    <div className="dx-page">

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker">Advanced Math · Polynomials</p>
            <motion.h1
              className="dx-title"
              layoutId={`concept-title-${slug}`}
              transition={{ layout: { duration: nav.layoutDur, ease: nav.easeOut } }}
            >
              Polynomials
            </motion.h1>
            <p className="dx-dek">Reading roots, multiplicity (cross vs. bounce), and end behavior from a polynomial's factored form.</p>

            <p className="dx-label">FACTORED FORM (toggle factors)</p>
            <div className="dx-formula">f(x) = {factoredStr}</div>

            <div className="dx-pill">{pillText}</div>

            <p className="dx-label">ROOTS</p>
            <div className="dx-root-list">
              {!f1 && !f2 && !f3 && (
                <div className="dx-root-item">
                  <span className="dx-root-coord">—</span>
                  <span className="dx-root-mult">no factors selected</span>
                </div>
              )}
              {f1 && (
                <div className="dx-root-item">
                  <span className="dx-root-coord">x = −2</span>
                  <span className="dx-root-mult">mult 1</span>
                  <span className="dx-root-bx">crosses</span>
                </div>
              )}
              {f2 && (
                <div className="dx-root-item">
                  <span className="dx-root-coord">x = 1</span>
                  <span className="dx-root-mult">mult 2</span>
                  <span className="dx-root-bx">bounces</span>
                </div>
              )}
              {f3 && (
                <div className="dx-root-item">
                  <span className="dx-root-coord">x = 3</span>
                  <span className="dx-root-mult">mult 1</span>
                  <span className="dx-root-bx">crosses</span>
                </div>
              )}
            </div>

            <p className="dx-label">END BEHAVIOR (degree {degree}, {posSign ? "positive" : "negative"} leading)</p>
            <div className={`dx-eb${bothUp ? " is-active" : ""}`}>even · positive → ↑ both ends up ↑</div>
            <div className={`dx-eb${bothDown ? " is-active" : ""}`}>even · negative → ↓ both ends down ↓</div>
            <div className={`dx-eb${oddPos ? " is-active" : ""}`}>odd · positive → ↓ left, ↑ right</div>
            <div className={`dx-eb${oddNeg ? " is-active" : ""}`}>odd · negative → ↑ left, ↓ right</div>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="poly-box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <clipPath id="poly-draw">
                <rect x={0} y={0} width={W} height={H} />
              </clipPath>
              <g clipPath="url(#poly-box)">
                {/* grid */}
                {[-4, -2, 2, 4].map((g) => (
                  <line key={"v" + g} x1={sx(g)} y1="0" x2={sx(g)} y2={H} stroke="var(--line)" strokeWidth="1" />
                ))}
                {[-8, -4, 4, 8].map((g) => (
                  <line key={"h" + g} x1="0" y1={sy(g)} x2={W} y2={sy(g)} stroke="var(--line)" strokeWidth="1" />
                ))}
                {/* axes */}
                <line x1={sx(0)} y1="0" x2={sx(0)} y2={H} stroke="var(--faint)" strokeWidth="1.5" />
                <line x1="0" y1={sy(0)} x2={W} y2={sy(0)} stroke="var(--muted)" strokeWidth="2" />
                {/* curve */}
                {pts.length > 1 && (
                  <polyline
                    clipPath="url(#poly-draw)"
                    points={pts.join(" ")}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {/* root markers — accent on the x-axis */}
                {f1 && (
                  <circle cx={sx(-2)} cy={sy(0)} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2.5" />
                )}
                {f2 && (
                  <circle cx={sx(1)} cy={sy(0)} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2.5" />
                )}
                {f3 && (
                  <circle cx={sx(3)} cy={sy(0)} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2.5" />
                )}
              </g>
            </svg>

            <div style={{ marginTop: 14 }}>
              <label className="dx-check">
                <input type="checkbox" checked={f1} onChange={(e) => setF1(e.target.checked)} />
                (x + 2) — root at x = −2, crosses
              </label>
              <label className="dx-check">
                <input type="checkbox" checked={f2} onChange={(e) => setF2(e.target.checked)} />
                (x − 1)² — root at x = 1, bounces
              </label>
              <label className="dx-check">
                <input type="checkbox" checked={f3} onChange={(e) => setF3(e.target.checked)} />
                (x − 3) — root at x = 3, crosses
              </label>
              <button className="dx-toggle" onClick={() => setPosSign((s) => !s)}>
                leading coefficient: {posSign ? "+ (positive)" : "− (negative)"}
              </button>
            </div>
            <p className="dx-note">Toggle factors to see roots appear/disappear. Uncheck (x−1)² to turn the bounce into nothing.</p>
          </div>
        </div>

        {/* ── Core Reading Rules ───────────────────────────────────────────── */}
        <RevealSection className="dx-section" index={0}>
          <h2 className="dx-section-title">Core Reading Rules</h2>
          <p className="dx-section-intro">
            A factored polynomial hides everything you need — roots, multiplicity, and end behavior — in plain sight. Here's how to read them off without expanding.
          </p>

          <div className="dx-panel">
            <p className="dx-step-num" style={{ marginTop: 0 }}>Rule 1 — Root from factor: opposite sign</p>
            <p className="dx-example-line">(x − r) gives a root at x = r</p>
            <p className="dx-step-note">
              The root is the OPPOSITE sign of what's written inside. (x + 2) has root at x = −2 because x + 2 = 0 → x = −2. Same sign trap as vertex form.
            </p>

            <p className="dx-step-num">Rule 2 — Multiplicity: crosses vs. bounces</p>
            <p className="dx-example-line">odd multiplicity → the curve CROSSES the axis</p>
            <p className="dx-example-line">even multiplicity → the curve BOUNCES (touches, turns back)</p>
            <p className="dx-step-note">
              Multiplicity 1 crosses cleanly. Multiplicity 3 crosses with a flattening. Multiplicity 2 bounces. Toggle (x−1)² above to see the bounce become a gap in the roots — the curve no longer reaches x = 1 when that factor is off.
            </p>

            <p className="dx-step-num">Rule 3 — Degree = sum of all multiplicities</p>
            <p className="dx-example-line">f(x) = (x+2)(x−1)²(x−3) → degree = 1 + 2 + 1 = 4</p>
            <p className="dx-step-note">
              Degree determines end behavior, not the number of distinct roots. This function has 3 distinct roots but degree 4.
            </p>
          </div>
        </RevealSection>

        {/* ── How it shows up on the SAT ───────────────────────────────────── */}
        <RevealSection className="dx-section" index={1}>
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT tests two polynomial patterns: matching a factored equation to a graph, and counting distinct real zeros.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — Match equation to graph</p>
              <p className="dx-disguise-q">
                "Which of the following could be the equation of the graph shown?" (Graph shows crossings and bounces.)
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> check three things in order — roots (which x-values touch the axis), then bounce-vs-cross at each (multiplicity odd or even), then end behavior (degree parity and sign). You rarely need to expand or compute anything; reading the factored form is enough.
              </p>
              <p className="dx-disguise-map">roots → bounce/cross → end behavior → match</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — Distinct real zeros</p>
              <p className="dx-disguise-q">
                "How many distinct real zeros does f(x) = (x−1)²(x+2)(x−3) have?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> count DISTINCT factors (ignoring multiplicity), not degree. (x−1)² counts as ONE distinct root, not two. The function above has 3 distinct zeros: x = 1, x = −2, x = 3. Degree 4, but only 3 distinct real zeros.
              </p>
              <p className="dx-disguise-map">distinct factors → distinct zeros · multiplicity ≠ extra zeros</p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: Read all features of f(x) = (x − 1)²(x + 2). State roots, cross vs. bounce, degree, and end behavior.
            </p>
            <p className="dx-example-line">Step 1: Identify roots (opposite sign of each factor).</p>
            <p className="dx-example-line">(x − 1)² → root at x = 1 &nbsp; (x + 2) → root at x = −2</p>
            <p className="dx-example-line">Step 2: Read multiplicity at each root.</p>
            <p className="dx-example-line">x = 1: multiplicity 2 → BOUNCES</p>
            <p className="dx-example-line">x = −2: multiplicity 1 → CROSSES</p>
            <p className="dx-example-line">Step 3: Degree = 2 + 1 = 3 (odd) · leading coefficient positive.</p>
            <p className="dx-example-line">End behavior: ↓ left, ↑ right (odd + positive)</p>
            <p className="dx-example-line">Distinct real zeros: 2 (x = 1 and x = −2)</p>
            <p className="dx-example-link">
              What you really did: read roots, bounce/cross, and end behavior directly from the factored form — no expanding, no graphing calculator needed.
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
