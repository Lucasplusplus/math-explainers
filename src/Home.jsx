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
        .home-page { background: #0a0a0a; }
        .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f2f2f2;
          font-family: var(--font);
        }
        .hero-canvas, .hero-fallback {
          position: absolute;
          inset: 0;
          background: #0a0a0a;
        }
        .hero-canvas canvas { display: block; }
        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: var(--grain-url);
          background-size: 90px 90px;
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .hero-grain.is-animated {
          animation: grain-shift 0.6s steps(4) infinite;
        }
        @keyframes grain-shift {
          0% { background-position: 0 0; }
          25% { background-position: 17px 5px; }
          50% { background-position: 3px 21px; }
          75% { background-position: -13px 8px; }
          100% { background-position: 0 0; }
        }
        .hero-scanline {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.025) 0,
            rgba(255, 255, 255, 0.025) 1px,
            transparent 1px,
            transparent var(--space-4)
          );
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          min-height: 100vh;
          padding: var(--space-9) var(--space-8);
          gap: var(--space-6);
          pointer-events: none;
        }
        .hero-title {
          margin: 0;
          font-weight: 700;
          line-height: 1.02;
          font-size: var(--text-5);
          letter-spacing: -0.01em;
        }
        .hero-tagline {
          margin: 0;
          max-width: 34ch;
          font-size: var(--text-2);
          color: #b9b9b9;
          line-height: 1.4;
        }
        .hero-cta {
          pointer-events: auto;
          display: inline-block;
          margin-top: var(--space-5);
          padding: var(--space-5) var(--space-7);
          font-size: var(--text-1);
          color: #f2f2f2;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: var(--space-2);
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .hero-cta:hover {
          border-color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.06);
        }
        .sound-toggle {
          position: absolute;
          z-index: 2;
          right: var(--space-8);
          bottom: var(--space-8);
          pointer-events: auto;
          background: transparent;
          color: #b9b9b9;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: var(--space-2);
          padding: var(--space-4) var(--space-6);
          font-family: var(--font);
          font-size: var(--text-1);
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .sound-toggle:hover {
          border-color: rgba(255, 255, 255, 0.6);
          color: #f2f2f2;
        }
        @media (max-width: 760px) {
          .hero-content { padding: var(--space-7) var(--space-6); }
          .hero-title { font-size: var(--text-4); }
          .hero-tagline { font-size: var(--text-1); }
          .sound-toggle { right: var(--space-6); bottom: var(--space-6); }
        }
      `}</style>

      <section
        className="hero"
        style={{ "--grain-url": `url(${grainUrl})` }}
      >
        <div className="hero-canvas">
          <Suspense fallback={<div className="hero-fallback" />}>
            <FunctionField
              light={isMobile}
              still={reducedMotion}
              sampleRef={heightRef}
            />
          </Suspense>
        </div>

        <div className={`hero-grain${reducedMotion ? "" : " is-animated"}`} aria-hidden="true" />
        <div className="hero-scanline" aria-hidden="true" />

        <div className="hero-content">
          <h1 className="hero-title">Math Explainers</h1>
          <p className="hero-tagline">[what this site does, one line]</p>
          <Link className="hero-cta" to="/explainers">
            Explore the concepts →
          </Link>
        </div>

        {!reducedMotion && (
          <button
            type="button"
            className="sound-toggle"
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            {soundOn ? "Sound: on" : "Sound: off"}
          </button>
        )}
      </section>
    </div>
  );
}
