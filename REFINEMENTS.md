# Readability and intro reveal — preview pass

This update stays on `new` and adds no package dependencies.

## Typography and cursor

Navigation, filters, and project descriptions are now 16px; hero description is
19px on desktop / 17px on mobile. Project titles are 23px. Small labels and tags
are 13–14px instead of 8–12px. About-page body copy is 17–18px. The rules live in
`src/assets/refinements.css`, loaded after the original design stylesheet.

Buttons, links, tabs, preview cards and their descendants use the normal arrow,
including inside portalled dialogs. Editable text fields retain the text cursor.
Hover feedback and keyboard focus rings remain functional.

## Full-screen introduction

The header plus intro occupies the initial viewport. The first downward document
scroll past 24px starts a 720ms collapse into a compact, rounded panel. The title
shrinks and descriptive copy fades away as the projects move upward. Clicking
“Explore the work” runs the same collapse, then navigates to the selected category.
Project navigation waits for the actual CSS height transition before measuring
the scroll destination, including when navigating from About or a mobile menu.

The scroll listener is passive: it does not cancel wheel, touch, keyboard, or
zoom input. Subsequent scrolling is normal. Returning all the way to the top
restores the full intro. Ambient motion stops while compact. Reduced-motion
preferences remove the collapse animation, and direct `/#/#projects` links start
compact without an introductory transition. Very short windows and high zoom
use a safe minimum height rather than clipping enlarged copy or controls.

## Try it

```sh
git pull --ff-only origin new
bun run dev
```

The build destination remains `docs/`:

```sh
bun run build
bun run preview
```

The new Node unit tests cover reveal thresholds, reverse scrolling, cancellation,
and layout settling. `tests/e2e/hero-reveal.spec.js` adds production-browser checks
for full-screen sizing, scroll/CTA reveal, category selection, typography, cursor,
reduced motion, direct links, and 320px layouts. These run alongside the existing
portfolio tests in CI; run `npm run build` and `npm run test:e2e` to run them locally.
