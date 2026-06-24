# Devlog

## 2026-06-24

Built the first page of the math explainers site: an interactive lesson on the discriminant of a quadratic. You drag three sliders (a, b, c) and watch a graph of the parabola update live, with dots marking where it crosses the x-axis. The dots split into two, merge into one, or disappear as the math changes, and the page tells you in plain terms how many real solutions there are. There's also a "fresh problem" button that picks new random numbers instantly (no internet needed), and a special case for when a is 0, since then it's just a line and the rule doesn't apply.

What's still placeholder: all the titles and descriptive sentences (anything in `[brackets]`) are stand-ins for real writing later — the math itself is fully real and working. The visuals are intentionally black-and-white for now, with one gray "accent" color saved as a single setting so it's easy to add real color later. There's also a commented-out stub for eventually having an AI write custom word problems instead of just random numbers, but that's not hooked up yet.

The site is built so more concept pages can be added later without restructuring anything.
