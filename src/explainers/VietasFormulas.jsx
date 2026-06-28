import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Vieta's Formulas — same picture as the Discriminant page (parabola + roots
// on the x-axis), but the left panel reads off the SUM and PRODUCT of the
// roots straight from a/b/c instead of the discriminant.
//
// Structural replica of Discriminant.jsx: same grapher, same sliders, same
// section layout, same CSS classes/spacing/typeface. Only the math being
// surfaced (and the prose, which is placeholder) differs.
// ─────────────────────────────────────────────────────────────────────────────

// graph window
const XR = 8; // x from -8..8
const YR = 12; // y from -12..12
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function VietasFormulas() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-8);
  const [c, setC] = useState(7);

  const isQuad = a !== 0;
  const D = b * b - 4 * a * c;

  // roots (real only)
  let roots = [];
  if (isQuad && D > 0) {
    const r = Math.sqrt(D);
    roots = [(-b - r) / (2 * a), (-b + r) / (2 * a)];
  } else if (isQuad && D === 0) {
    roots = [-b / (2 * a)];
  }

  // Vieta's: sum and product straight from the coefficients
  const sum = isQuad ? -b / a : null;
  const product = isQuad ? c / a : null;

  // the same two quantities, computed instead from the actual roots on the
  // graph — this is the "confirm they match" check
  const actualSum =
    roots.length === 2 ? roots[0] + roots[1] : roots.length === 1 ? roots[0] * 2 : null;
  const actualProduct =
    roots.length === 2 ? roots[0] * roots[1] : roots.length === 1 ? roots[0] * roots[0] : null;

  // status
  let pillText;
  if (!isQuad) {
    pillText = "a = 0 — this is just a line; Vieta's only works for quadratics";
  } else if (roots.length > 0) {
    pillText = "✓ formulas match the roots below";
  } else {
    pillText = "no real roots — the formulas still hold for the complex pair";
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

  const eqTerm = (coef, varStr, first) => {
    if (coef === 0) return null;
    const sign = coef < 0 ? "−" : first ? "" : "+";
    const mag = Math.abs(coef);
    const num = varStr && mag === 1 ? "" : mag;
    return ` ${sign} ${num}${varStr}`.replace("  ", " ");
  };

  return (
    <div className="dx-page">
      <style>{`
        .dx-page { background: var(--bg); min-height: 100vh; padding: 32px 20px; }
        .dx { font-family: var(--font); color: var(--ink); max-width: 920px; margin: 0 auto; }
        .dx-back { font-size: 12px; color: var(--mist); text-decoration: none; }
        .dx-back:hover { color: var(--ink); }
        .dx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; margin-top: 18px; }
        @media (max-width: 720px) { .dx-grid { grid-template-columns: 1fr; gap: 28px; } }
        .dx-domain { font-size: 11px; letter-spacing: 1.5px; color: var(--faint); font-weight: 400; margin: 0 0 6px; text-transform: uppercase; }
        .dx-kicker { font-size: 12px; letter-spacing: 3px; color: var(--mist); font-weight: 700; margin: 0 0 10px; text-transform: uppercase; }
        .dx-title { font-size: 44px; line-height: 1.05; margin: 0 0 12px; font-weight: 700; }
        .dx-dek { font-size: 16px; color: var(--mist); margin: 0 0 28px; line-height: 1.45; }
        .dx-label { font-size: 11px; letter-spacing: 2.5px; color: var(--faint); font-weight: 700; margin: 22px 0 8px; text-transform: uppercase; }
        .dx-eq { font-size: 24px; font-variant-numeric: tabular-nums; }
        .dx-formula { font-size: 36px; font-weight: 700; display: flex; align-items: center; gap: 10px; margin: 6px 0; font-variant-numeric: tabular-nums; }
        .dx-formula-value { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; margin: 8px 0 0; font-variant-numeric: tabular-nums; }
        .dx-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1.15; }
        .dx-frac-num { padding: 0 6px 3px; }
        .dx-frac-den { padding: 3px 6px 0; border-top: 2px solid currentColor; }
        .dx-pill { display: inline-block; padding: 9px 18px; border-radius: 4px; font-size: 14px; font-weight: 700; margin-top: 6px; background: var(--ink); color: var(--bg); }
        .dx-panel { background: var(--panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 18px; }
        .dx-slider { width: 100%; accent-color: var(--accent); height: 22px; }
        .dx-srow { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .dx-svar { font-size: 18px; width: 18px; font-style: italic; }
        .dx-sval { font-variant-numeric: tabular-nums; width: 34px; text-align: right; font-size: 15px; font-weight: 700; }
        .dx-note { font-size: 12px; color: var(--faint); margin: 10px 0 0; }

        .dx-section { margin-top: 56px; padding-top: 32px; border-top: 1.5px solid var(--line); }
        .dx-section-title { font-size: 26px; font-weight: 700; margin: 0 0 10px; }
        .dx-section-intro { font-size: 15px; color: var(--mist); margin: 0 0 28px; line-height: 1.5; max-width: 680px; }
        .dx-disguises { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        @media (max-width: 880px) { .dx-disguises { grid-template-columns: 1fr; } }
        .dx-disguise { border-left: 3px solid var(--ink); padding: 2px 0 2px 16px; }
        .dx-disguise-name { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--mist); margin: 0 0 10px; }
        .dx-disguise-q { font-size: 15px; font-style: italic; margin: 0 0 10px; line-height: 1.4; }
        .dx-disguise-tell { font-size: 13.5px; color: var(--ink); margin: 0 0 10px; line-height: 1.45; }
        .dx-disguise-tell b { font-weight: 700; }
        .dx-disguise-map { font-size: 13.5px; font-variant-numeric: tabular-nums; color: var(--faint); font-weight: 700; margin: 0; }
        .dx-example-problem { font-size: 16px; margin: 0 0 14px; line-height: 1.4; }
        .dx-example-line { font-size: 17px; font-variant-numeric: tabular-nums; margin: 6px 0; font-weight: 700; }
        .dx-example-link { font-size: 14px; color: var(--mist); margin: 16px 0 0; font-style: italic; line-height: 1.45; }
      `}</style>

      <div className="dx">
        <Link className="dx-back" to="/">
          ← [back to index]
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker"> Advanced Math · Quadratics </p>
            <h1 className="dx-title"> Vieta's Formulas </h1>
            <p className="dx-dek">These 2 rules may come in handy when testing</p>

            <p className="dx-label">Practice</p>
            <div className="dx-eq">
              {a !== 0 ? `${a === 1 ? "" : a === -1 ? "−" : a}x²` : "0"}
              {eqTerm(b, "x", a === 0)}
              {eqTerm(c, "", a === 0 && b === 0)}
              {" = 0"}
            </div>

            <p className="dx-label">SUM OF THE ROOTS</p>
            <div className="dx-formula">
              r + s = −(<Fraction num="b" den="a" />)
            </div>
            <div className="dx-formula-value">
              {isQuad ? (
                <>
                  −(<Fraction num={b} den={a} />) = {fmt(sum)}
                </>
              ) : (
                "undefined when a = 0"
              )}
            </div>

            <p className="dx-label">PRODUCT OF THE ROOTS</p>
            <div className="dx-formula">
              r · s = <Fraction num="c" den="a" />
            </div>
            <div className="dx-formula-value">
              {isQuad ? (
                <>
                  (<Fraction num={c} den={a} />) = {fmt(product)}
                </>
              ) : (
                "undefined when a = 0"
              )}
            </div>

            <div className="dx-pill">{pillText}</div>

            {roots.length > 0 && (
              <>
                <p style={{ fontSize: 15, color: "var(--mist)", marginTop: 14 }}>
                  {roots.length === 2
                    ? `x = ${fmt(roots[0])}  or  x = ${fmt(roots[1])}`
                    : `x = ${fmt(roots[0])} (touches, doesn't cross)`}
                </p>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "var(--faint)",
                    marginTop: 6,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  check: r + s = {fmt(actualSum)} (formula says {fmt(sum)}) &nbsp;·&nbsp; r·s ={" "}
                  {fmt(actualProduct)} (formula says {fmt(product)})
                </p>
              </>
            )}

            <p className="dx-label">THE RULE TO REMEMBER</p>
            <div className="dx-formula">
              r + s = −(<Fraction num="b" den="a" />)
            </div>
            <div className="dx-formula">
              r · s = <Fraction num="c" den="a" />
            </div>

            <p className="dx-note">just remember these 2 and you'll be fine</p>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="box">
                <rect x="0" y="0" width={W} height={H} />
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
                {/* curve */}
                <polyline
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

        <section className="dx-section">
          <h2 className="dx-section-title">The Full Explanation</h2>
          <p className="dx-section-intro">You can skip this; this section just proves why it works.</p>
        </section>

        <section className="dx-section">
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT never says "Vieta's." It asks about the sum or product of the
            solutions directly, expecting you to find them WITHOUT solving the
            quadratic.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — The sum</p>
              <p className="dx-disguise-q">
                "What is the sum of the solutions to the equation above?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> they want r + s. Don't solve — read off −b/a.
              </p>
              <p className="dx-disguise-map">Sum = −b over a</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — The product</p>
              <p className="dx-disguise-q">
                "The solutions to the equation are p and q. What is the value of
                pq?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> they want the product. Read off c/a directly.
              </p>
              <p className="dx-disguise-map">Product = c over a</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 3 — Reverse / build the equation</p>
              <p className="dx-disguise-q">
                "A quadratic has solutions that sum to 5 and multiply to 6. Which
                equation could this be?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> run it backwards — the equation is
                x² − (sum)x + (product) = 0, so x² − 5x + 6 = 0.
              </p>
              <p className="dx-disguise-map">
                Sum becomes the middle coefficient (negated), product becomes the
                constant.
              </p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">[worked example problem]</p>
            <p className="dx-disguise-tell">[worked example step]</p>
            <p className="dx-example-line">[worked example step]</p>
            <p className="dx-example-line">[worked example step]</p>
            <p className="dx-example-line">[worked example step]</p>
            <p className="dx-example-line">[worked example step]</p>
            <p className="dx-example-link">[worked example step]</p>
          </div>
        </section>
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

function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}
