import { useState } from "react";
import { Link } from "react-router-dom";

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
        .dx-disc { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
        .dx-pill { display: inline-block; padding: 9px 18px; border-radius: 4px; font-size: 14px; font-weight: 700; margin-top: 6px; background: var(--ink); color: var(--bg); }
        .dx-rule { font-size: 36px; font-weight: 700; margin: 6px 0; line-height: 1.15; font-variant-numeric: tabular-nums; color: var(--faint); }
        .dx-rule.is-active { color: var(--ink); }
        .dx-panel { background: var(--panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 18px; }
        .dx-slider { width: 100%; accent-color: var(--accent); height: 22px; }
        .dx-srow { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .dx-svar { font-size: 18px; width: 18px; font-style: italic; }
        .dx-sval { font-variant-numeric: tabular-nums; width: 34px; text-align: right; font-size: 15px; font-weight: 700; }
        .dx-btn { background: var(--ink); color: var(--bg); border: none; border-radius: 4px; padding: 12px 22px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; margin-top: 18px; }
        .dx-btn:hover { background: var(--mist); }
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
            <h1 className="dx-title"> The Discriminant </h1>
            <p className="dx-dek"> Ignore all the bs. Discriminant just means whatever is under the square root. In the Quadratic Formula, it's the b² - 4ac</p>

            <p className="dx-label">Practice (move the sliders to see when solutions do/don't occur)</p>
            <div className="dx-eq">
              {a !== 0 ? `${a === 1 ? "" : a === -1 ? "−" : a}x²` : "0"}
              {eqTerm(b, "x", a === 0)}
              {eqTerm(c, "", a === 0 && b === 0)}
              {" = 0"}
            </div>

            <p className="dx-label">THE DISCRIMINANT &nbsp;b² − 4ac</p>
            <div className="dx-disc">
              {b}² − 4({a})({c}) = {D}
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

function fmt(n) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}
