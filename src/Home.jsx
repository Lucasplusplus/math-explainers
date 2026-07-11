import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useFieldSound from "./hero/useFieldSound.js";

const FunctionField = lazy(() => import("./hero/FunctionField.jsx"));

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// A tiny tiled noise texture for the grain overlay — generated once, not an
// asset, so there's nothing to fetch before it can paint.
function useGrainDataUrl() {
  return useMemo(() => {
    const size = 48;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
  }, []);
}

export default function Home() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 760px)");
  const heightRef = useRef(0);
  const grainUrl = useGrainDataUrl();
  const [soundOn, toggleSound] = useFieldSound(heightRef, reducedMotion);

  return (
    <div className="home-page">
      <style>{`
        .home-page { background: var(--bg); min-height: 100vh; }
        .home {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--space-11) var(--space-5) var(--space-10);
          font-family: var(--font);
        }
        .home-hero { max-width: 640px; }
        .home-kicker {
          font-size: var(--fs-label);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 var(--space-3);
        }
        .home-title {
          font-size: var(--fs-display);
          font-weight: 650;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin: 0 0 var(--space-4);
        }
        .home-lede {
          font-size: var(--fs-passage);
          line-height: 1.7;
          color: var(--muted);
          max-width: 54ch;
          margin: 0 0 var(--space-7);
        }
        .home-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        /* Signature 3D field — a raised figure, same plane logic as concept
           panels: hairline border, 8px radius, dark interior (like video frames).
           The field and its grain are deliberate ambient hero artwork. */
        .home-figure {
          position: relative;
          margin: var(--space-9) 0 0;
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          overflow: hidden;
          background: var(--ink);
          aspect-ratio: 16 / 10;
        }
        .home-canvas, .home-fallback { position: absolute; inset: 0; }
        .home-fallback { background: var(--ink); }
        .home-canvas canvas { display: block; }

        .home-grain {
          position: absolute;
          inset: 0;
          background-image: var(--grain-url);
          background-size: 90px 90px;
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .home-grain.is-animated { animation: grain-shift 0.6s steps(4) infinite; }
        @keyframes grain-shift {
          0%   { background-position: 0 0; }
          25%  { background-position: 17px 5px; }
          50%  { background-position: 3px 21px; }
          75%  { background-position: -13px 8px; }
          100% { background-position: 0 0; }
        }

        /* Ghost control on the dark figure. */
        .home-sound {
          position: absolute;
          z-index: 2;
          right: var(--space-4);
          bottom: var(--space-4);
          background: rgba(0, 0, 0, 0.32);
          color: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.20);
          border-radius: var(--r-btn);
          padding: 6px 12px;
          font-family: var(--font);
          font-size: var(--fs-label);
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: border-color var(--dur-hover) var(--ease),
                      color var(--dur-hover) var(--ease);
        }
        .home-sound:hover { border-color: rgba(255, 255, 255, 0.45); color: #fff; }

        @media (max-width: 640px) {
          .home { padding: var(--space-9) var(--space-5) var(--space-8); }
          .home-figure { aspect-ratio: 4 / 3; margin-top: var(--space-7); }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-sound { transition: none; }
        }
      `}</style>

      <div className="home">
        <div className="home-hero">
          <p className="home-kicker">SAT Math</p>
          <h1 className="home-title">Math Explainers</h1>
          <p className="home-lede">
            The trickiest SAT math concepts — each on a single interactive screen.
            Drag the inputs and watch the rule become obvious.
          </p>
          <div className="home-actions">
            <Link className="site-btn" to="/explainers">
              Explore the concepts →
            </Link>
          </div>
        </div>

        <figure className="home-figure">
          <div className="home-canvas">
            <Suspense fallback={<div className="home-fallback" />}>
              <FunctionField
                light={isMobile}
                still={reducedMotion}
                sampleRef={heightRef}
              />
            </Suspense>
          </div>

          <div
            className={`home-grain${reducedMotion ? "" : " is-animated"}`}
            style={{ "--grain-url": `url(${grainUrl})` }}
            aria-hidden="true"
          />

          {!reducedMotion && (
            <button
              type="button"
              className="home-sound"
              onClick={toggleSound}
              aria-pressed={soundOn}
            >
              {soundOn ? "Sound: on" : "Sound: off"}
            </button>
          )}
        </figure>
      </div>
    </div>
  );
}
