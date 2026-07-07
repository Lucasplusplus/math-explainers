import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Exponential Functions — same picture/slider pattern as Discriminant and
// Vieta's pages. Left panel reads off the starting value (a), growth/decay
// factor (b), and per-period percent change live from sliders. Right panel
// plots y = a·bˣ and highlights the horizontal asymptote at y = 0.
// ─────────────────────────────────────────────────────────────────────────────

const XR = 6;   // x from -6..6
const YR = 12;  // y from -12..12
const W = 400, H = 360;
const sx = (x) => ((x + XR) / (2 * XR)) * W;
const sy = (y) => ((YR - y) / (2 * YR)) * H;

export default function ExponentialFunctions() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2.0);

  const isGrowth = b > 1;
  const isDecay  = b < 1 && b > 0;
  const isFlat   = Math.abs(b - 1) < 0.001;
  const zeroA    = a === 0;

  // per-period percent change
  const pctChange = (b - 1) * 100;
  const pctText   = pctChange >= 0
    ? `+${pctChange.toFixed(1)}%`
    : `${pctChange.toFixed(1)}%`;

  // status pill
  let pillText;
  if (zeroA) {
    pillText = "a = 0 — function collapses to y = 0";
  } else if (isFlat) {
    pillText = "b = 1.00 — constant (not exponential)";
  } else if (isGrowth) {
    pillText = `b = ${b.toFixed(2)} → ${pctText} per period — exponential growth`;
  } else {
    pillText = `b = ${b.toFixed(2)} → ${pctText} per period — exponential decay`;
  }

  // curve — clamp y to ±YR*5 before converting to SVG coords so extreme
  // values at the edges of the x range don't produce astronomically large
  // pixel coordinates (the clipPath handles the actual visual clipping)
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x   = -XR + (i / 200) * (2 * XR);
    const raw = a * Math.pow(b, x);
    if (!isFinite(raw)) continue;
    const y = Math.max(-YR * 5, Math.min(YR * 5, raw));
    pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }

  // y-intercept (x = 0 → y = a)
  const yiVisible = Math.abs(a) <= YR;

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
        .dx-formula       { font-size: 36px; font-weight: 700; margin: 6px 0; line-height: 1.15; font-variant-numeric: tabular-nums; }
        .dx-formula-sub   { font-size: 13px; color: var(--mist); margin: 4px 0 0; }
        .dx-formula-value { font-size: 22px; font-weight: 700; margin: 8px 0 0; font-variant-numeric: tabular-nums; }
        .dx-pill   { display: inline-block; padding: 9px 18px; border-radius: 4px; font-size: 14px; font-weight: 700; margin-top: 6px; background: var(--ink); color: var(--bg); }
        .dx-rule   { font-size: 36px; font-weight: 700; margin: 6px 0; line-height: 1.15; color: var(--faint); }
        .dx-rule.is-active { color: var(--ink); }
        .dx-panel  { background: var(--panel); border: 1.5px solid var(--line); border-radius: 4px; padding: 18px; }
        .dx-slider { width: 100%; accent-color: var(--accent); height: 22px; }
        .dx-srow   { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .dx-svar   { font-size: 18px; width: 18px; font-style: italic; }
        .dx-sval   { font-variant-numeric: tabular-nums; width: 44px; text-align: right; font-size: 15px; font-weight: 700; }
        .dx-note   { font-size: 12px; color: var(--faint); margin: 10px 0 0; }

        .dx-section       { margin-top: 56px; padding-top: 32px; border-top: 1.5px solid var(--line); }
        .dx-section-title { font-size: 26px; font-weight: 700; margin: 0 0 10px; }
        .dx-section-intro { font-size: 15px; color: var(--mist); margin: 0 0 28px; line-height: 1.5; max-width: 680px; }
        .dx-disguises     { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
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
            <p className="dx-kicker">Advanced Math · Exponential Functions</p>
            <h1 className="dx-title">Exponential Functions</h1>
            <p className="dx-dek">[dek placeholder]</p>

            <p className="dx-label">THE FORMULA</p>
            <div className="dx-formula">
              y = a · b<sup>x</sup>
            </div>
            <p className="dx-formula-sub">
              a = starting value &nbsp;·&nbsp; b = growth/decay factor
            </p>

            <p className="dx-label">LIVE VALUES (a = {a}, b = {b.toFixed(2)})</p>
            <div className="dx-eq">
              y = {a} · {b.toFixed(2)}<sup>x</sup>
            </div>
            <div className="dx-formula-value">
              {zeroA
                ? "y = 0 everywhere"
                : `y-intercept = ${a}  ·  ${pctText} per period`}
            </div>

            <div className="dx-pill">{pillText}</div>

            <p className="dx-label">THE RULE TO REMEMBER</p>
            <div className={`dx-rule${isGrowth ? " is-active" : ""}`}>
              b &gt; 1 → exponential growth
            </div>
            <div className={`dx-rule${isDecay ? " is-active" : ""}`}>
              0 &lt; b &lt; 1 → exponential decay
            </div>

            <p className="dx-note">the base b is everything — learn to build it from a percent</p>
          </div>

          {/* RIGHT — the live picture */}
          <div className="dx-panel">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <g clipPath="url(#box)">
                {/* grid */}
                {[-4, -2, 2, 4].map((g) => (
                  <line key={"v" + g} x1={sx(g)} y1="0" x2={sx(g)} y2={H} stroke="var(--line)" strokeWidth="1" />
                ))}
                {[-8, -4, 4, 8].map((g) => (
                  <line key={"h" + g} x1="0" y1={sy(g)} x2={W} y2={sy(g)} stroke="var(--line)" strokeWidth="1" />
                ))}
                {/* y-axis */}
                <line x1={sx(0)} y1="0" x2={sx(0)} y2={H} stroke="var(--faint)" strokeWidth="1.5" />
                {/* x-axis — also the horizontal asymptote y = 0; dashed to distinguish */}
                <line
                  x1="0" y1={sy(0)} x2={W} y2={sy(0)}
                  stroke="var(--mist)" strokeWidth="2" strokeDasharray="6 3"
                />
                <text
                  x={W - 6} y={sy(0) - 7}
                  textAnchor="end" fontSize="10"
                  fill="var(--faint)" fontFamily="var(--font)"
                >
                  y = 0 (asymptote)
                </text>
                {/* curve */}
                {pts.length > 1 && (
                  <polyline
                    points={pts.join(" ")}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
                {/* y-intercept dot (x = 0, y = a) */}
                {yiVisible && !zeroA && (
                  <circle
                    cx={sx(0)}
                    cy={sy(a)}
                    r="7"
                    fill="var(--accent)"
                    stroke="var(--bg)"
                    strokeWidth="2.5"
                  />
                )}
              </g>
            </svg>

            <div style={{ marginTop: 16 }}>
              <Slider  label="a" val={a} min={-4} max={4} set={setA} />
              <SliderF label="b" val={b} min={0.10} max={3.00} step={0.05} set={setB} />
            </div>
          </div>
        </div>

        {/* ── How it shows up on the SAT ───────────────────────────────────── */}
        <section className="dx-section">
          <h2 className="dx-section-title">How it shows up on the SAT</h2>
          <p className="dx-section-intro">
            The SAT never says "exponential function." It shows up as population growth, radioactive decay, investment interest, depreciation — anything where a quantity is multiplied by the same factor every period.
          </p>

          <div className="dx-disguises">
            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 1 — Growth vs. decay</p>
              <p className="dx-disguise-q">
                "Which function represents exponential decay?" / "The value of the car decreases each year by a fixed percentage."
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> look at the base b. b &gt; 1 is growth; 0 &lt; b &lt; 1 is decay. That's the whole test — nothing else matters.
              </p>
              <p className="dx-disguise-map">
                b &gt; 1 → growth &nbsp;·&nbsp; 0 &lt; b &lt; 1 → decay
              </p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 2 — Percent to base</p>
              <p className="dx-disguise-q">
                "A town's population grows 5% per year." / "A car loses 12% of its value each year."
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> a percent change per period becomes the base b. Add the rate for growth, subtract for decay: +5% → b = 1.05, −12% → b = 0.88. This translation is the core skill the SAT tests.
              </p>
              <p className="dx-disguise-map">
                +r% per period → b = 1 + r/100 &nbsp;·&nbsp; −r% → b = 1 − r/100
              </p>
            </div>

            <div className="dx-disguise">
              <p className="dx-disguise-name">Disguise 3 — Linear vs. exponential</p>
              <p className="dx-disguise-q">
                "Each year the population grows by 200 people." vs. "Each year the population grows by 5%."
              </p>
              <p className="dx-disguise-tell">
                <b>Tell:</b> fixed amount per period = linear. Fixed percent per period = exponential. "By 200" is additive (linear); "by 5%" is multiplicative (exponential). They look nearly identical in word problems.
              </p>
              <p className="dx-disguise-map">
                fixed amount → linear &nbsp;·&nbsp; fixed % → exponential
              </p>
            </div>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: A town of 3,200 people grows at 6% per year. Write a function for the population P after t years. What is the population after 10 years?
            </p>
            <p className="dx-disguise-tell">
              "Grows at 6% per year" is the tell — percent change per period means the base of an exponential. The translation step: 6% growth means the population is multiplied by (1 + 0.06) = 1.06 each year, so b = 1.06. The starting population is the a value.
            </p>
            <p className="dx-example-line">
              Translate the percent: +6% per year → b = 1 + 0.06 = 1.06
            </p>
            <p className="dx-example-line">
              Read the starting value: a = 3,200
            </p>
            <p className="dx-example-line">
              Write the model: P = 3,200 · 1.06^t
            </p>
            <p className="dx-example-line">
              After 10 years: P = 3,200 · 1.06^10 ≈ 5,731
            </p>
            <p className="dx-example-link">
              What you really did: turned "grows 6% per year" into a base of 1.06, then plugged in. The arithmetic is secondary — getting b = 1.06 (not 0.06, not 6) is the entire translation.
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

function SliderF({ label, val, min, max, step, set }) {
  return (
    <div className="dx-srow">
      <span className="dx-svar">{label}</span>
      <input
        className="dx-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => set(Math.round(parseFloat(e.target.value) * 100) / 100)}
      />
      <span className="dx-sval">{val.toFixed(2)}</span>
    </div>
  );
}
