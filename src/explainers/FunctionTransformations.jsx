import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease, duration } from "../motion.js";
import { RevealSection } from "../RevealSection.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Function Transformations — base curve y = x² with four live controls:
// horizontal shift h (inside), vertical shift k (outside), vertical scale a
// (outside), and reflection toggle. Ghost curve shows the untransformed x²
// so the shift/stretch is visible against a fixed reference.
//
// KEY DIRECTION CHECK: positive h slider = f(x − h) = shifts RIGHT.
// This makes the counterintuitive sign flip explicit in the display.
// ─────────────────────────────────────────────────────────────────────────────

const XR = 8;
const YR = 12;
const W = 400,
  H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function FunctionTransformations() {
  // h > 0 → f(x − h) → shifts RIGHT (sign flip is the lesson)
  const [h, setH] = useState(3);
  const [k, setK] = useState(2);
  const [a, setA] = useState(1);
  const [reflect, setReflect] = useState(false);

  const sign = reflect ? -1 : 1;

  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, margin: "-80px 0px" });
  const shouldReduce = useReducedMotion();

  // ghost (original): y = x²
  const ghostPts = [];
  for (let i = 0; i <= 160; i++) {
    const x = -XR + (i / 160) * (2 * XR);
    const y = Math.max(-YR * 4, Math.min(YR * 4, x * x));
    ghostPts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  // transformed: y = sign · a · (x − h)² + k
  const transPts = [];
  for (let i = 0; i <= 160; i++) {
    const x = -XR + (i / 160) * (2 * XR);
    const raw = sign * a * (x - h) * (x - h) + k;
    const y = Math.max(-YR * 4, Math.min(YR * 4, raw));
    transPts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  // vertex of transformed curve
  const vx = h;
  const vy = k;
  const vertexVisible = Math.abs(vx) <= XR && Math.abs(vy) <= YR;

  // left-panel string builders
  const xArgInside =
    h === 0 ? "x" : h > 0 ? `x − ${h}` : `x + ${Math.abs(h)}`;
  const kSuffix =
    k === 0 ? "" : k > 0 ? ` + ${k}` : ` − ${Math.abs(k)}`;
  const aPrefix = a === 1 ? "" : `${a}·`;
  const negPrefix = reflect ? "−" : "";

  const fNotation = `y = ${negPrefix}${aPrefix}f(${xArgInside})${kSuffix}`;
  const expanded = `y = ${negPrefix}${a === 1 ? "" : a}${h === 0 ? "x²" : h > 0 ? `(x − ${h})²` : `(x + ${Math.abs(h)})²`}${kSuffix}`;

  // direction label for pill
  const dirs = [];
  if (h !== 0) dirs.push(h > 0 ? `right ${h}` : `left ${Math.abs(h)}`);
  if (k !== 0) dirs.push(k > 0 ? `up ${k}` : `down ${Math.abs(k)}`);
  if (a !== 1) dirs.push(`scaled ×${a}`);
  if (reflect) dirs.push("reflected");
  const pillText = dirs.length ? `vertex: (${h}, ${k})` : "vertex at origin (no shift)";

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
        .dx-eq     { font-size: 20px; font-variant-numeric: tabular-nums; }
        .dx-formula       { font-size: 36px; font-weight: 700; margin: 6px 0; line-height: 1.15; font-variant-numeric: tabular-nums; }
        .dx-formula-value { font-size: 18px; font-weight: 700; margin: 6px 0; font-variant-numeric: tabular-nums; color: var(--ink); }
        .dx-formula-note  { font-size: 13px; color: var(--mist); margin: 4px 0 0; }
        .dx-pill   { display: inline-block; padding: 9px 18px; border-radius: 4px; font-size: 14px; font-weight: 700; margin-top: 6px; background: var(--ink); color: var(--bg); }
        .dx-panel  { background: var(--panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 18px; }
        .dx-slider { width: 100%; accent-color: var(--accent); height: 22px; }
        .dx-srow   { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .dx-svar   { font-size: 18px; width: 18px; font-style: italic; }
        .dx-sval   { font-variant-numeric: tabular-nums; width: 34px; text-align: right; font-size: 15px; font-weight: 700; }
        .dx-check  { display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer; font-size: 15px; font-family: var(--font); }
        .dx-check input { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }
        .dx-note   { font-size: 12px; color: var(--faint); margin: 10px 0 0; }

        .dx-rule   { font-size: 20px; font-weight: 700; margin: 6px 0; line-height: 1.3; color: var(--ink); }
        .dx-rule-dim { font-size: 20px; font-weight: 700; margin: 6px 0; line-height: 1.3; color: var(--faint); }

        .dx-section       { margin-top: 56px; padding-top: 32px; border-top: 1.5px solid var(--line); }
        .dx-section-title { font-size: 26px; font-weight: 700; margin: 0 0 10px; }
        .dx-section-intro { font-size: 15px; color: var(--mist); margin: 0 0 28px; line-height: 1.5; max-width: 680px; }
        .dx-tgroups       { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media (max-width: 720px) { .dx-tgroups { grid-template-columns: 1fr; } }
        .dx-tgroup        { }
        .dx-tgroup-label  { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--mist); margin: 0 0 14px; }
        .dx-trow          { display: flex; align-items: baseline; gap: 12px; margin: 10px 0; font-size: 15px; }
        .dx-trow-form     { font-size: 18px; font-weight: 700; min-width: 120px; }
        .dx-trow-desc     { color: var(--mist); }
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
      `}</style>

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker">Advanced Math · Functions</p>
            <h1 className="dx-title">Function Transformations</h1>
            <p className="dx-dek">[dek placeholder]</p>

            <p className="dx-label">BASE FUNCTION (fixed)</p>
            <div className="dx-formula">f(x) = x²</div>

            <p className="dx-label">TRANSFORMATION (move the sliders)</p>
            <div className="dx-formula-value">{fNotation}</div>
            <div className="dx-formula-note">expanded: {expanded}</div>

            <div className="dx-pill">{pillText}</div>

            <p className="dx-label">THE ONE RULE TO REMEMBER</p>
            <div className="dx-rule">outside f(x) → vertical, as written</div>
            <div className="dx-rule">inside f(x) → horizontal, OPPOSITE sign</div>
            <p className="dx-note">
              f(x − 3) shifts the graph RIGHT 3, not left. The minus sign is counterintuitive.
            </p>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel" ref={panelRef}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="ft-box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <clipPath id="ft-draw">
                <motion.rect
                  x={0} y={0} height={H}
                  initial={{ width: 0 }}
                  animate={{ width: isInView || shouldReduce ? W : 0 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: duration.slow, ease }}
                />
              </clipPath>
              <g clipPath="url(#ft-box)">
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
                {/* ghost: y = x² (faint dashed) — shares the draw reveal */}
                <polyline
                  clipPath="url(#ft-draw)"
                  points={ghostPts.join(" ")}
                  fill="none"
                  stroke="var(--faint)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* ghost vertex dot at (0, 0) */}
                <circle cx={sx(0)} cy={sy(0)} r="4" fill="var(--faint)" stroke="var(--bg)" strokeWidth="2" />
                {/* transformed curve */}
                <polyline
                  clipPath="url(#ft-draw)"
                  points={transPts.join(" ")}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* transformed vertex */}
                {vertexVisible && (
                  <circle cx={sx(vx)} cy={sy(vy)} r="7" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2.5" />
                )}
              </g>
            </svg>

            <div style={{ marginTop: 16 }}>
              <Slider label="h" val={h} min={-6} max={6} set={setH} note="inside — horizontal shift right" />
              <Slider label="k" val={k} min={-6} max={6} set={setK} note="outside — vertical shift up" />
              <Slider label="a" val={a} min={1} max={3} set={setA} note="outside — vertical scale" />
              <label className="dx-check">
                <input type="checkbox" checked={reflect} onChange={(e) => setReflect(e.target.checked)} />
                reflect −f (outside — flip over x-axis)
              </label>
            </div>
            <p className="dx-note">
              Dashed ghost = original f(x) = x². Solid = transformed. Accent dot = vertex.
            </p>
          </div>
        </div>

        {/* ── Core Rules ───────────────────────────────────────────────────── */}
        <RevealSection className="dx-section">
          <h2 className="dx-section-title">The Six Transformations</h2>
          <p className="dx-section-intro">
            Every transformation is either outside the function (vertical, intuitive) or inside it (horizontal, counterintuitive). That single distinction resolves almost every transformation question on the SAT.
          </p>

          <div className="dx-tgroups">
            <div className="dx-tgroup">
              <p className="dx-tgroup-label">Outside f(x) — Vertical (behaves as written)</p>
              <div className="dx-trow">
                <span className="dx-trow-form">f(x) + k</span>
                <span className="dx-trow-desc">shifts UP k units</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">f(x) − k</span>
                <span className="dx-trow-desc">shifts DOWN k units</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">a·f(x)</span>
                <span className="dx-trow-desc">stretches vertically (|a| &gt; 1) or compresses (0 &lt; |a| &lt; 1)</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">−f(x)</span>
                <span className="dx-trow-desc">reflects over the x-axis</span>
              </div>
            </div>

            <div className="dx-tgroup">
              <p className="dx-tgroup-label">Inside f(x) — Horizontal (OPPOSITE of sign)</p>
              <div className="dx-trow">
                <span className="dx-trow-form">f(x + h)</span>
                <span className="dx-trow-desc">shifts LEFT h — positive h, leftward shift</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">f(x − h)</span>
                <span className="dx-trow-desc">shifts RIGHT h — minus sign, rightward shift</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">f(bx)</span>
                <span className="dx-trow-desc">compresses horizontally (b &gt; 1) or stretches (0 &lt; b &lt; 1) — reciprocal of vertical scale</span>
              </div>
              <div className="dx-trow">
                <span className="dx-trow-form">f(−x)</span>
                <span className="dx-trow-desc">reflects over the y-axis</span>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── How it shows up on the SAT ───────────────────────────────────── */}
        <RevealSection className="dx-section">
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT tests two transformation patterns: translating a description to an equation, and evaluating a transformed function from a table or graph.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — Words to equation</p>
              <p className="dx-disguise-q">
                "The graph of y = f(x) is shifted 3 units right and 2 units up. Which equation represents the result?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> classify each move as inside or outside. Right 3 → horizontal → inside → subtract 3 → f(x − 3). Up 2 → vertical → outside → add 2 → f(x − 3) + 2. The minus sign on the horizontal move is the trap — "right" becomes "minus."
              </p>
              <p className="dx-disguise-map">right h → f(x − h) · left h → f(x + h)</p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — Table or graph evaluation</p>
              <p className="dx-disguise-q">
                "The table shows values of f(x). What is f(x + 2) when x = 3?" / "If f(2) = 5, what is 2f(2)?"
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> for f(x + 2) at x = 3, the inside argument is 3 + 2 = 5, so look up f(5) in the table. For 2f(2): the 2 is outside, so compute 2 × f(2) = 2 × 5 = 10. Inside changes shift which row you look at; outside changes what you do with the value you find.
              </p>
              <p className="dx-disguise-map">f(x + 2) at x = 3 → f(5) · 2f(2) → 2 × f(2)</p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: f(x) = x². Describe and write the equation for the graph shifted right 3 and up 2.
            </p>
            <p className="dx-disguise-tell">
              Identify inside vs. outside for each move before writing anything.
            </p>
            <p className="dx-example-line">Right 3 → horizontal → inside the function → subtract 3</p>
            <p className="dx-example-line">Up 2 → vertical → outside the function → add 2</p>
            <p className="dx-example-line">Result: f(x − 3) + 2</p>
            <p className="dx-example-line">Expanded with f(x) = x²: y = (x − 3)² + 2</p>
            <p className="dx-example-line">Vertex moves (0, 0) → (3, 2)</p>
            <p className="dx-disguise-tell" style={{ marginTop: 12 }}>
              Sign trap: the shift is "right 3" but the equation says "minus 3." The rule: inside changes have the OPPOSITE sign of the shift direction. Set the slider to h = 3 above — the accent dot moves right to (3, 2).
            </p>
            <p className="dx-example-link">
              What you really did: classified each transformation as inside (→ horizontal, sign flips) or outside (→ vertical, sign stays). Everything else follows from that one classification.
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

function Slider({ label, val, min, max, set, note }) {
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
