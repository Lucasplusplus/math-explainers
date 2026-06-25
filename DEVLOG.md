# Devlog

## 2026-06-24

Built the first page of the math explainers site: an interactive lesson on the discriminant of a quadratic. You drag three sliders (a, b, c) and watch a graph of the parabola update live, with dots marking where it crosses the x-axis. The dots split into two, merge into one, or disappear as the math changes, and the page tells you in plain terms how many real solutions there are. There's also a "fresh problem" button that picks new random numbers instantly (no internet needed), and a special case for when a is 0, since then it's just a line and the rule doesn't apply.

What's still placeholder: all the titles and descriptive sentences (anything in `[brackets]`) are stand-ins for real writing later — the math itself is fully real and working. The visuals are intentionally black-and-white for now, with one gray "accent" color saved as a single setting so it's easy to add real color later. There's also a commented-out stub for eventually having an AI write custom word problems instead of just random numbers, but that's not hooked up yet.

The site is built so more concept pages can be added later without restructuring anything.

Extended the Discriminant page with a new section below the grapher: "How it shows up on the SAT." The grapher itself is untouched. Added a small "Advanced Math · Quadratics" label near the title so readers know which SAT content domain this concept belongs to. The new section explains that the SAT never says "discriminant" out loud — it shows up disguised as three question types: (1) "how many solutions" questions, which are really just asking for the sign of the discriminant; (2) "solve for the missing letter" questions like "this equation has exactly one solution, find c," which are solved by setting the discriminant to zero; and (3) "touch/tangent" questions, where a line touching a parabola at one point is the same D = 0 condition in disguise. Closed with a fully worked example (x² + 6x + c = 0 has exactly one solution, so c = 9) and a line tying it back to the slider above: it's the parabola sliding up until its two roots merge into one.
