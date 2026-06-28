# Devlog

## 2026-06-24

Built the first page of the math explainers site: an interactive lesson on the discriminant of a quadratic. You drag three sliders (a, b, c) and watch a graph of the parabola update live, with dots marking where it crosses the x-axis. The dots split into two, merge into one, or disappear as the math changes, and the page tells you in plain terms how many real solutions there are. There's also a "fresh problem" button that picks new random numbers instantly (no internet needed), and a special case for when a is 0, since then it's just a line and the rule doesn't apply.

What's still placeholder: all the titles and descriptive sentences (anything in `[brackets]`) are stand-ins for real writing later — the math itself is fully real and working. The visuals are intentionally black-and-white for now, with one gray "accent" color saved as a single setting so it's easy to add real color later. There's also a commented-out stub for eventually having an AI write custom word problems instead of just random numbers, but that's not hooked up yet.

The site is built so more concept pages can be added later without restructuring anything.

Extended the Discriminant page with a new section below the grapher: "How it shows up on the SAT." The grapher itself is untouched. Added a small "Advanced Math · Quadratics" label near the title so readers know which SAT content domain this concept belongs to. The new section explains that the SAT never says "discriminant" out loud — it shows up disguised as three question types: (1) "how many solutions" questions, which are really just asking for the sign of the discriminant; (2) "solve for the missing letter" questions like "this equation has exactly one solution, find c," which are solved by setting the discriminant to zero; and (3) "touch/tangent" questions, where a line touching a parabola at one point is the same D = 0 condition in disguise. Closed with a fully worked example (x² + 6x + c = 0 has exactly one solution, so c = 9) and a line tying it back to the slider above: it's the parabola sliding up until its two roots merge into one.

## 2026-06-24 (later)

Built the actual home page — the landing screen that now sits in front of the concept pages. The old index-of-concepts page didn't go away, it just moved to `/explainers`; the discriminant page and everything about how concepts work is untouched.

The centerpiece is a real-time 3D hero: a grid of dots forming an actual mathematical surface (height = sin(x)·cos(z), animated over time), drawn in perspective so it reads as a field of dots receding toward a horizon, on a black background. It's genuinely computed every frame, not a video or a canned animation. Moving the mouse over it pushes a ripple through the surface that's centered on a point which chases the cursor with spring physics (it overshoots slightly and settles, instead of snapping straight to the mouse), so the motion feels analog rather than mechanical. Dots get smaller and dimmer the farther back they are, so the field fades into the dark background instead of having a hard edge.

Two textures sit on top to keep the analog feel: a quiet film-grain layer (a tiny procedurally-generated noise tile, animated in small jumps) and a faint horizontal scanline pattern. Both are deliberately subtle — texture, not noise.

There's a small "Sound: off" button, bottom-right, off by default and never autoplaying. Turning it on starts a soft tone whose pitch literally tracks the height of the surface under your cursor — moving the mouse plays the function. Turning it off fades the tone out and tears down the audio node; nothing lingers in the background.

Accessibility and performance floors: if the OS-level "reduce motion" setting is on, the field renders once and freezes — no animation loop, no sound toggle shown, no grain animation. On narrow/mobile screens, the field uses a much lighter point grid so it never jank-loads. The whole 3D layer (three.js + react-three-fiber) is code-split into its own chunk and lazy-loaded, so the title, tagline, and "Explore the concepts" link paint immediately and the page is interactive before the WebGL chunk even finishes downloading — confirmed via a production build (the hero chunk built separately from the main bundle) and a Playwright pass over desktop, mobile-width, and reduced-motion variants.

New Fibonacci spacing/type scale (`--space-1` … `--space-12`, `--text-1` … `--text-6`) was added to `index.css` since the brief called for one and none existed yet; every margin/padding/gap/font-size on the new home page resolves to one of these.

One known follow-up: the discriminant page's "back to index" link still points at `/`, which is now the marketing home page instead of the concepts list — fixing it means touching the concept page itself, which was explicitly out of scope here.

## 2026-06-26

Expanded the Discriminant explainer's worked example to show the translation step from English to equation, not just the final arithmetic.

## 2026-06-27

Created a new Vieta's Formulas explainer page (`/vietas-formulas`), built as a structural replica of the current Discriminant page: same grapher, same sliders, same section layout (recognition section + worked example), same styling. It reuses the existing parabola/roots picture, but the left panel now reads off the sum (−b/a) and product (c/a) of the roots live from the sliders, and shows a check confirming those formula values match the actual roots drawn on the graph. All the human-written explanation copy (the lens, the three disguises, the worked example) is left as `[bracketed placeholders]` — only the math is real. Added to the explainer registry so it's routed and listed automatically, the same way the discriminant page is.

## 2026-06-27 (later)

Reworked the Vieta's Formulas page's left column, all in-place edits to that one page: (1) rebuilt the font hierarchy so the sum/product formulas are now the largest, most emphasized text, with live computed values, section labels, and check text stepping down from there; (2) replaced every "/" division in the formulas with a real stacked fraction (numerator over a horizontal bar over denominator), for both the symbolic formula and the live substituted instance; (3) deleted "The Rule to Remember" sign-of-c/a rules and put the two core formulas there instead, large and prominent, since those *are* the rule to remember; (4) added a new "The Full Explanation" section between the grapher and the SAT-recognition section, body text still a placeholder; (5) removed the "generate new problem" button (and its now-dead `fresh()` logic) since practice is moving to its own section later and the sliders already cover that role.

## 2026-06-28

Two more fixes to the Vieta's Formulas page. First, fixed the sum formula's stacked fraction so the negative sign sits in front of the whole fraction (−(b/a), minus outside the bar) instead of being baked into the numerator ((−b)/a) — applies to both the general formula and "The Rule to Remember" restatement. Second, filled in the real "How it shows up on the SAT" copy: an intro line plus three disguises (the sum, the product, and reverse-building the equation from a given sum/product), replacing the bracketed placeholders with the actual recognition content; the worked example and the new explanation section are still placeholders.

## 2026-06-28 (later)

Added the explanation video to the Vieta's Formulas page, inside "The Full Explanation" section, below the short written lens. It's a responsive 16:9 YouTube embed (no autoplay — the user has to press play) framed with the same muted border/panel treatment as the grapher, and its hover transition is disabled under `prefers-reduced-motion`. The short placeholder text above it stays as the fast version; the video is the deep version.

## 2026-06-28 (later still)

Swapped the Vieta's Formulas video from a YouTube embed to a self-hosted file — no more youtube.com references or third-party tracking on the page. The actual dropped file was a phone screen recording (`RPReplay_Final....mov`, not `vieta.mp4` as planned), renamed to `public/videos/vieta.mov` and confirmed it commits normally (not in `.gitignore`, no Git LFS rules apply). Installed ffmpeg locally to pull a poster frame from ~1s in (`public/videos/vieta-poster.jpg`) so the player shows a still frame instead of a black box before playback. Discovered along the way that the real footage is ~1.63:1, not 16:9 — sized the player to the video's actual aspect ratio instead of force-fitting 16:9, so nothing gets cropped or letterboxed. The `<video>` tag uses controls (no autoplay), `playsInline` for iOS, and `preload="metadata"`.

## 2026-06-28 (and again)

Filled in the Vieta's Formulas worked example (last placeholder block on the page): "x² − 7x + 12 = 0 has solutions p and q, find p + q" — read off a and b, apply the sum formula as a stacked fraction (−(−7) over 1), land on p + q = 7. The closing "what you really did" line uses the same muted takeaway style as the discriminant page's worked example.

## 2026-06-28 (one more)

Bumped "The Rule to Remember" on the Discriminant page (the three b²−4ac sign rules) up to 36px/bold, matching the size and weight of the hero formulas on the Vieta's page — they're now the visual anchor of the left column instead of a small footnote. The active/highlighted-rule mechanic is untouched: whichever rule matches the current slider state still switches to full ink color while the other two stay muted.
