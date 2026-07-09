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
        .home-page { background: #090909; }
        .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f2f2f0;
          font-family: var(--font);
        }
        .hero-canvas, .hero-fallback {
          position: absolute;
          inset: 0;
          background: #090909;
        }
        .hero-canvas canvas { display: block; }
        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: var(--grain-url);
          background-size: 90px 90px;
          opacity: 0.04;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .hero-grain.is-animated {
          animation: grain-shift 0.6s steps(4) infinite;
        }
        @keyframes grain-shift {
          0%   { background-position: 0 0; }
          25%  { background-position: 17px 5px; }
          50%  { background-position: 3px 21px; }
          75%  { background-position: -13px 8px; }
          100% { background-position: 0 0; }
        }
        .hero-scanline {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.018) 0,
            rgba(255,255,255,0.018) 1px,
            transparent 1px,
            transparent 5px
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
          padding: 56px 48px;
          gap: 0;
          pointer-events: none;
        }
        .hero-title {
          margin: 0 0 14px;
          font-weight: 800;
          line-height: 1.0;
          font-size: clamp(48px, 8vw, 88px);
          letter-spacing: -0.04em;
          color: #f2f2f0;
        }
        .hero-tagline {
          margin: 0 0 28px;
          max-width: 36ch;
          font-size: 17px;
          font-weight: 400;
          color: #a0a09c;
          line-height: 1.55;
        }
        .hero-cta {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font);
          letter-spacing: 0.02em;
          color: #f2f2f0;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 6px;
          transition: border-color var(--dur-hover) var(--ease),
                      background-color var(--dur-hover) var(--ease);
        }
        .hero-cta:hover {
          border-color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.06);
        }
        .sound-toggle {
          position: absolute;
          z-index: 2;
          right: 40px;
          bottom: 40px;
          pointer-events: auto;
          background: transparent;
          color: #888885;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 6px;
          padding: 7px 14px;
          font-family: var(--font);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: border-color var(--dur-hover) var(--ease),
                      color var(--dur-hover) var(--ease);
        }
        .sound-toggle:hover {
          border-color: rgba(255,255,255,0.45);
          color: #f2f2f0;
        }
        @media (max-width: 760px) {
          .hero-content { padding: 40px 28px; }
          .hero-title { font-size: clamp(40px, 10vw, 64px); }
          .hero-tagline { font-size: 15px; }
          .sound-toggle { right: 24px; bottom: 24px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-cta, .sound-toggle { transition: none; }
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
