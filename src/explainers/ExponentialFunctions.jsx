import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease, duration, nav } from "../motion.js";
import { AnimatedNumber } from "../AnimatedNumber.jsx";
import { RevealSection } from "../RevealSection.jsx";

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
  const slug = useLocation().pathname.split("/").pop();
  const [a, setA] = useState(2);
  const [b, setB] = useState(2.0);

  const isGrowth = b > 1;
  const isDecay  = b < 1 && b > 0;

  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true, margin: "-80px 0px" });
  const shouldReduce = useReducedMotion();
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

      <div className="dx">
        <Link className="dx-back" to="/advanced-math">
          ← Advanced Math
        </Link>

        <div className="dx-grid">
          {/* LEFT — the concept */}
          <div>
            <p className="dx-kicker">Advanced Math · Exponential Functions</p>
            <motion.h1
              className="dx-title"
              layoutId={`concept-title-${slug}`}
              transition={{ layout: { duration: nav.layoutDur, ease: nav.easeOut } }}
            >
              Exponential Functions
            </motion.h1>
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
                : <>y-intercept = {a} &nbsp;·&nbsp; <AnimatedNumber
                    value={pctChange}
                    format={(v) => {
                      const r = Math.round(v * 10) / 10;
                      return r >= 0 ? `+${r.toFixed(1)}%` : `${r.toFixed(1)}%`;
                    }}
                  /> per period</>}
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
          <div className="dx-panel" ref={panelRef}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
              <clipPath id="exp-box">
                <rect x="0" y="0" width={W} height={H} />
              </clipPath>
              <clipPath id="exp-draw">
                <motion.rect
                  x={0} y={0} height={H}
                  initial={{ width: 0 }}
                  animate={{ width: isInView || shouldReduce ? W : 0 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: duration.slow, ease }}
                />
              </clipPath>
              <g clipPath="url(#exp-box)">
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
                  stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 3"
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
                    clipPath="url(#exp-draw)"
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
        <RevealSection className="dx-section" index={0}>
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
        </RevealSection>

        {/* ── Exponential Functions in Context ─────────────────────────────── */}
        <RevealSection className="dx-section" index={1}>
          <h2 className="dx-section-title">Exponential Functions in Context</h2>
          <p className="dx-section-intro">
            Word problems repackage y = a·bˣ under different names. Recognizing the template — and translating the percent to the base — is the whole skill.
          </p>

          <div className="dx-panel">
            <p className="dx-step-num" style={{ marginTop: 0 }}>Growth and decay templates</p>
            <p className="dx-example-line">Growth: A = P(1 + r)ᵗ</p>
            <p className="dx-example-line">Decay: &nbsp;A = P(1 − r)ᵗ</p>
            <p className="dx-disguise-tell">
              P is the starting amount, r is the rate per period as a decimal, t is the number of periods. These are exactly y = a·bˣ with a = P, b = (1 ± r), and x = t. Growth has b &gt; 1; decay has 0 &lt; b &lt; 1.
            </p>

            <p className="dx-step-num">Compound interest</p>
            <p className="dx-example-line">A = P(1 + r/n)^(nt)</p>
            <p className="dx-disguise-tell">
              r is the annual rate, n is the number of compounding periods per year, t is years. More frequent compounding yields slightly more: $1,000 at 5% annual rate compounded monthly for 1 year gives $1,051.16 — above the simple $1,050 from annual compounding.
            </p>

            <p className="dx-step-num">Half-life and decay</p>
            <p className="dx-example-line">A = A₀ · (½)^(t/h)</p>
            <p className="dx-disguise-tell">
              A₀ is the initial amount, h is the half-life, t is elapsed time. At t = h exactly half remains; at t = 2h one quarter remains. The base is ½, the exponent converts "how many half-lives have passed."
            </p>

            <p className="dx-step-num">The percent-to-base tell (the core trap)</p>
            <p className="dx-example-line">+8% growth → b = 1.08 · 8% decay → b = 0.92</p>
            <p className="dx-disguise-tell">
              A percent in the problem becomes (1 ± rate) in the base. Never use the raw percent (0.08) as the base — that would be decay below zero. Never use 8 as the base. The translation: add for growth, subtract for decay, always from 1.
            </p>
          </div>

          <p className="dx-label">WORKED EXAMPLE</p>
          <div className="dx-panel">
            <p className="dx-example-problem">
              Problem: $2,000 is invested at 3% annual growth. Write a function for the value A after t years.
            </p>
            <p className="dx-disguise-tell">
              "3% annual growth" is the tell — percent per period, so this is exponential with b = 1 + 0.03.
            </p>
            <p className="dx-example-line">Translate the percent: +3% growth → b = 1 + 0.03 = 1.03</p>
            <p className="dx-example-line">Starting amount: P = 2,000</p>
            <p className="dx-example-line">Model: A = 2,000 · (1.03)ᵗ</p>
            <p className="dx-example-line">After 10 years: A = 2,000 · (1.03)¹⁰ ≈ 2,688</p>
            <p className="dx-example-link">
              The only step that requires thought is the percent-to-base translation. Everything else is substituting into A = P · bᵗ.
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
