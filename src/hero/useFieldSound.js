import { useEffect, useRef, useState } from "react";

// Opt-in only — never created or started until the user clicks the toggle,
// so there is no autoplay. While on, oscillator pitch tracks the field's
// height under the cursor (heightRef), so moving the mouse audibly "plays"
// the function instead of triggering an unrelated ambient tone.
export default function useFieldSound(heightRef, disabled) {
  const [enabled, setEnabled] = useState(false);
  const nodesRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.4);
    nodesRef.current = { ctx, osc, gain };

    const tick = () => {
      const h = heightRef?.current ?? 0;
      const norm = Math.min(Math.max((h + 1.05) / 2.1, 0), 1);
      const freq = 220 + norm * 220; // 220–440Hz, soft low range
      osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.08);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      const { gain: g, osc: o, ctx: c } = nodesRef.current;
      g.gain.linearRampToValueAtTime(0, c.currentTime + 0.15);
      setTimeout(() => {
        o.stop();
        c.close();
      }, 200);
      nodesRef.current = null;
    };
  }, [enabled, heightRef]);

  useEffect(() => {
    if (disabled) setEnabled(false);
  }, [disabled]);

  return [enabled && !disabled, () => setEnabled((v) => !v)];
}
