import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Completing the Square — sibling to Discriminant and Vieta's.
// Same parabola grapher, same sliders (a, b, c). The left panel shows the
// live transformation from standard form ax² + bx + c into vertex form
// a(x − h)² + k, with the vertex (h, k) marked on the curve. The goal:
// make visible that completing the square is just a rewrite — the parabola
// doesn't change, you're only exposing its vertex.
// ─────────────────────────────────────────────────────────────────────────────

// graph window — identical to Discriminant.jsx and VietasFormulas.jsx
const XR = 8;
const YR = 12;
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function CompletingTheSquare() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-8);
  const [c, setC] = useState(7);

  const isQuad = a !== 0;
  const D = b * b - 4 * a * c;

  // vertex — the h, k in a(x − h)² + k
  const h = isQuad ? -b / (2 * a) : null;
  const k = isQuad ? c - (b * b) / (4 * a) : null;

  // roots (real only) — shown as secondary markers behind the vertex dot
  let roots = [];
  if (isQuad && D > 0) {
    const r = Math.sqrt(D);
    roots = [(-b - r) / (2 * a), (-b + r) / (2 * a)];
  } else if (isQuad && D === 0) {
    roots = [-b / (2 * a)];
  }

  // curve points
  const pts = [];
  for (let i = 0; i <= 160; i++) {
    const x = -XR + (i / 160) * (2 * XR);
    const y = a * x * x + b * x + c;
    pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  const eqTerm = (coef, varStr, first) => {
    if (coef === 0) return null;
    const sign = coef < 0 ? "−" : first ? "" : "+";
    const mag = Math.abs(coef);
    const num = varStr && mag === 1 ? "" : mag;
    return ` ${sign} ${num}${varStr}`.replace("  ", " ");
  };

  // build the live vertex form string: a(x − h)² + k with actual numbers
  function vertexFormStr(a, h, k) {
    const hAbs = fmtV(Math.abs(h));
    const kAbs = fmtV(Math.abs(k));
    const aStr = a === 1 ? "" : a === -1 ? "−" : `${a}`;
    const xStr =
      Math.abs(h) < 0.001
        ? "x²"
        : h < 0
        ? `(x + ${hAbs})²`
        : `(x − ${hAbs})²`;
    const kStr =
      Math.abs(k) < 0.001 ? "" : k > 0 ? ` + ${kAbs}` : ` − ${kAbs}`;
    return `${aStr}${xStr}${kStr}`;
  }

  // pill text
  let pillText;
  if (!isQuad) {
    pillText = "a = 0 — this is a line, not a quadratic";
  } else {
    pillText = `Vertex: (${fmtV(h)}, ${fmtV(k)})`;
  }

  return (
    <div className="dx-page">
      <style>{`
        .dx-page   { background: var(--bg); min-height: 100vh; padding: 32px 20px; }
        .dx        { font-family: var(--font); color: var(--ink); max-width: 920px; margin: 0 auto; }
        .dx-back   { font-size: 12px; color: var(--mist); text-decoration: none; }
        .dx-back:hover { color: var(--ink); }
        .dx-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; margin-top: 18px; }
        @media (max-width: 720px) { .dx-grid { grid-template-columns: 1fr; gap: 28px; } }
        .dx-kicker { font-size: 12px; letter-spacing: 3px; color: var(--mist); font-weight: 700; margin: 0 0 10px; text-transform: uppercase; }
        .dx-title  { font-size: 44px; line-height: 1.05; margin: 0 0 12px; font-weight: 700; }
        .dx-dek    { font-size: 16px; color: var(--mist); margin: 0 0 28px; line-height: 1.45; }
        .dx-label  { font-size: 11px; letter-spacing: 2.5px; color: var(--faint); font-weight: 700; margin: 22px 0 8px; text-transform: uppercase; }
        .dx-eq     { font-size: 24px; font-variant-numeric: tabular-nums; }
        .dx-formula       { font-size: 36px; font-weight: 700; display: flex; align-items: center; gap: 10px; margin: 6px 0; font-variant-numeric: tabular-nums; }
        .dx-formula-sub   { font-size: 15px; color: var(--mist); margin: 4px 0 0; font-variant-numeric: tabular-nums; }
        .dx-formula-value { font-size: 22px; font-weight: 700; margin: 8px 0 0; font-variant-numeric: tabular-nums; }
        .dx-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; line-height: 1.15; }
        .dx-frac-num { padding: 0 6px 3px; }
        .dx-frac-den { padding: 3px 6px 0; border-top: 2px solid currentColor; }
        .dx-pill   { display: inline-block; padding: 9px 18px; border-radius: 4px; font-size: 14px; font-weight: 700; margin-top: 6px; background: var(--ink); color: var(--bg); }
        .dx-panel  { background: var(--panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 18px; }
        .dx-slider { width: 100%; accent-color: var(--accent); height: 22px; }
        .dx-srow   { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .dx-svar   { font-size: 18px; width: 18px; font-style: italic; }
        .dx-sval   { font-variant-numeric: tabular-nums; width: 34px; text-align: right; font-size: 15px; font-weight: 700; }
        .dx-note   { font-size: 12px; color: var(--faint); margin: 10px 0 0; }

        .dx-section       { margin-top: 56px; padding-top: 32px; border-top: 1.5px solid var(--line); }
        .dx-section-title { font-size: 26px; font-weight: 700; margin: 0 0 10px; }
        .dx-section-intro { font-size: 15px; color: var(--mist); margin: 0 0 28px; line-height: 1.5; max-width: 680px; }
        .dx-disguises     { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 880px) { .dx-disguises { grid-template-columns: 1fr; } }
        .dx-disguise      { border-left: 3px solid var(--ink); padding: 2px 0 2px 16px; }
        .dx-disguise-name { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--mist); margin: 0 0 10px; }
        .dx-disguise-q    { font-size: 15px; font-style: italic; margin: 0 0 10px; line-height: 1.4; }
        .dx-disguise-tell { font-size: 13.5px; color: var(--ink); margin: 0 0 10px; line-height: 1.45; }
        .dx-disguise-tell b { font-weight: 700; }
        .dx-disguise-map  { font-size: 13.5px; color: var(--faint); font-weight: 700; margin: 0; }
        .dx-example-problem { font-size: 16px; margin: 0 0 14px; line-height: 1.4; }
        .dx-example-line  { font-size: 17px; font-variant-numeric: tabular-nums; margin: 6px 0; font-weight: 700; }
        .dx-example-link  { font-size: 14px; color: var(--mist); margin: 16px 0 0; font-style: italic; line-height: 1.45; }

        .dx-step-num  { font-size: 11px; letter-spacing: 2px; color: var(--faint); font-weight: 700; text-transform: uppercase; margin: 20px 0 6px; }
        .dx-step-note { font-size: 13px; color: var(--mist); margin: 4px 0 0; line-height: 1.45; }
      `}</style>

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker">Advanced Math · Quadratics</p>
            <h1 className="dx-title">Completing the Square</h1>
            <p className="dx-dek">[dek placeholder]</p>

            <p className="dx-label">STANDARD FORM (move the sliders)</p>
            <div className="dx-eq">
              y ={" "}
              {a !== 0 ? `${a === 1 ? "" : a === -1 ? "−" : a}x²` : "0"}
              {eqTerm(b, "x", a === 0)}
              {eqTerm(c, "", a === 0 && b === 0)}
            </div>

            <p className="dx-label">VERTEX FORM</p>
            <div className="dx-formula">a(x − h)² + k</div>
            <p className="dx-formula-sub">
              h = −(<Fraction num="b" den="2a" />) &nbsp;·&nbsp; k = c −{" "}
              (<Fraction num={<>b<sup>2</sup></>} den="4a" />)
            </p>

            <p className="dx-label">LIVE (a = {a}, b = {b}, c = {c})</p>
            <div className="dx-formula-value">
              {isQuad
                ? `y = ${vertexFormStr(a, h, k)}`
                : "not a quadratic (a = 0)"}
            </div>

            <div className="dx-pill">{pillText}</div>

            <p className="dx-label">THE RULE TO REMEMBER</p>
            <div className="dx-formula">a(x − h)² + k → vertex (h, k)</div>
            <p className="dx-note">
              sign trap: (x − 3)² has vertex at x = +3, not −3
            </p>
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
                {/* roots — small secondary markers, show the x-intercepts */}
                {roots
                  .filter((r) => Math.abs(r) <= XR)
                  .map((r, i) => (
                    <circle
                      key={i}
                      cx={sx(r)}
                      cy={sy(0)}
                      r="4"
                      fill="var(--mist)"
                      stroke="var(--bg)"
                      strokeWidth="2"
                    />
                  ))}
                {/* vertex — the primary visual anchor on this page */}
                {isQuad && Math.abs(h) <= XR && Math.abs(k) <= YR && (
                  <circle
                    cx={sx(h)}
                    cy={sy(k)}
                    r="7"
                    fill="var(--accent)"
                    stroke="var(--bg)"
                    strokeWidth="2.5"
                  />
                )}
              </g>
            </svg>

            <div style={{ marginTop: 16 }}>
              <Slider label="a" val={a} min={-3} max={3} set={setA} />
              <Slider label="b" val={b} min={-9} max={9} set={setB} />
              <Slider label="c" val={c} min={-9} max={9} set={setC} />
            </div>
          </div>
        </div>

        {/* ── The Algebra ──────────────────────────────────────────────────── */}
        <section className="dx-section">
          <h2 className="dx-section-title">The Algebra</h2>
          <p className="dx-section-intro">
            Completing the square is a rewrite — the parabola doesn't change, you're only exposing its vertex. Here's the algebra on the general form ax² + bx + c.
          </p>

          <div className="dx-panel">
            <p className="dx-step-num" style={{ marginTop: 0 }}>
              Step 1 — Factor a out of the first two terms
            </p>
            <p className="dx-example-line">
              ax² + bx + c = a(x² + (<Fraction num="b" den="a" />)x) + c
            </p>
            <p className="dx-step-note">
              The constant c stays outside — it's not part of the square being completed.
            </p>

            <p className="dx-step-num">Step 2 — Find the completing term</p>
            <p className="dx-example-line">
              Half of <Fraction num="b" den="a" /> is <Fraction num="b" den="2a" />
              &nbsp;·&nbsp; squared:{" "}
              (<Fraction num="b" den="2a" />)²
            </p>
            <p className="dx-step-note">
              This is the number that turns x² + (b/a)x into a perfect square trinomial.
            </p>

            <p className="dx-step-num">Step 3 — Add and subtract it inside the parentheses</p>
            <p className="dx-example-line">
              a(x² + (<Fraction num="b" den="a" />)x + (<Fraction num="b" den="2a" />)² −
              (<Fraction num="b" den="2a" />)²) + c
            </p>
            <p className="dx-step-note">
              Adding and subtracting the same thing doesn't change the value — it just sets up the factoring.
            </p>

            <p className="dx-step-num">Step 4 — Factor the trinomial and simplify</p>
            <p className="dx-example-line">
              a(x + <Fraction num="b" den="2a" />)² − a·(<Fraction num="b" den="2a" />)² + c
            </p>
            <p className="dx-example-line">
              = a(x + <Fraction num="b" den="2a" />)² −{" "}
              <Fraction num={<>b<sup>2</sup></>} den="4a" /> + c
            </p>
            <p className="dx-step-note">
              The first three terms factor into (x + b/2a)². The remaining term −a·(b/2a)² is still multiplied by a, giving −a·b²/(4a²) — and one factor of a cancels: a/a² = 1/a, leaving −b²/(4a).
            </p>

            <p className="dx-step-num">Step 5 — Read off h and k (vertex form)</p>
            <p className="dx-example-line">
              h = −<Fraction num="b" den="2a" /> &nbsp;·&nbsp; k = c −{" "}
              <Fraction num={<>b<sup>2</sup></>} den="4a" />
            </p>
            <p className="dx-step-note">
              Note: step 4 gives (x + b/2a)². To match vertex form a(x − h)², we need h = −b/2a — the sign flips. This is exactly the sign trap in disguise 2 below.
            </p>
          </div>
        </section>

        {/* ── How it shows up on the SAT ───────────────────────────────────── */}
        <section className="dx-section">
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT doesn't say "complete the square." It asks for the vertex, minimum, or maximum of a parabola — and vertex form hands you those directly.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — The vertex, minimum, or maximum</p>
              <p className="dx-disguise-q">
                "What is the minimum value of f(x) = 2x² + 12x + 5?" / "At what x does the function reach its maximum?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> any question asking for vertex, minimum, or maximum wants vertex form. Complete the square (or use h = −b/2a directly), then read off (h, k). The minimum or maximum value is k.
              </p>
              <p className="dx-disguise-map">vertex form → vertex (h, k) · k is the min/max value</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — The sign trap</p>
              <p className="dx-disguise-q">
                "The function f(x) = 3(x − 5)² + 2 has a minimum at x = ___." / "Which vertex matches f(x) = (x + 4)²?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> in a(x − h)², the vertex is at x = +h — the opposite sign of what's inside the parentheses. (x − 5)² has vertex at x = +5; (x + 4)² = (x − (−4))² has vertex at x = −4. The SAT counts on this flip.
              </p>
              <p className="dx-disguise-map">(x − 5)² → x = +5 &nbsp;·&nbsp; (x + 4)² → x = −4</p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: Complete the square on 2x² + 12x + 5. Find the vertex.
            </p>
            <p className="dx-disguise-tell">
              The vertex is the minimum here (a = 2 &gt; 0, so it opens up). Completing the square gives it directly.
            </p>
            <p className="dx-example-line">Step 1: Factor 2 out of the first two terms.</p>
            <p className="dx-example-line">2x² + 12x + 5 = 2(x² + 6x) + 5</p>
            <p className="dx-example-line">Step 2: Half of 6 is 3 · 3² = 9</p>
            <p className="dx-example-line">Step 3: Add and subtract 9 inside.</p>
            <p className="dx-example-line">2(x² + 6x + 9 − 9) + 5</p>
            <p className="dx-example-line">Step 4: Factor and collect constants.</p>
            <p className="dx-example-line">2(x + 3)² − 2(9) + 5 = 2(x + 3)² − 18 + 5 = 2(x + 3)² − 13</p>
            <p className="dx-example-line">Vertex: (−3, −13)</p>
            <p className="dx-disguise-tell" style={{ marginTop: 12 }}>
              Sign trap: the +3 inside means h = −3, not +3. Compare with vertex form a(x − h)²: (x + 3) = (x − (−3)), so h = −3.
            </p>
            <p className="dx-example-link">
              What you really did: rewrote the same expression until the vertex was readable. The parabola on the graph didn't move — you just changed how you described it.
            </p>
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

function fmtV(n) {
  if (!isFinite(n)) return "—";
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}
