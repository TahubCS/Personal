# Motion lab: readable opening sequence

**Historical opening-pass report.** See [current prototype status](motion-lab.md) for subsequent drawing and loading revisions. The results below describe the original pass.

Local review: http://127.0.0.1:4321/motion-lab

Baseline: `716df41`. This pass changes the opening pose model and a restrained exposed-state fill adjustment. Geometry, materials, layout, fonts, route injection, native scroll distance, static SVG fallback, and paper-wipe shader are unchanged. No dependencies, lights, render passes, idle animation, homepage integration or deployment were added.

## Corrected overlaps

- The cover previously swept across the amber core for much of the middle opening. It now clears ahead of the other layers, with a larger final offset.
- The ceramic frame no longer trails immediately behind the cover. Its later departure and separate final position produce a visible gap.
- The rear enclosure moves clear before the conductors travel backward. The original layer-order test caught an initial ordering error in this revision; the corrected sequence passes without weakening that test.
- The conductor assembly and rear enclosure have a wider final gap. The core is readable between the ceramic frame and conductors.
- At 390px, the complete assembly uses a steeper diagonal axis so the exposed parts use more of the available height. Every part retains the same shared local depth axis; no radial scattering or independent component rotations were introduced.

## Current choreography

The later drawing revision shortened the original 61�91% wipe to 61�88%.

| Scroll interval | Action                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------- |
| 2–22%           | Establish depth through rotation; roughly 90% of this turn completes before the cover starts moving |
| 18–35%          | Front cover moves forward to +5.5 units                                                             |
| 27–43%          | Ceramic frame moves forward to +2.25 units                                                          |
| 30–50%          | Rear enclosure moves backward to −4.2 units                                                         |
| 34–52%          | Conductors move backward to −1.6 units                                                              |
| 52–61%          | Complete exposed pose holds; offsets, scale, rotation and fill are stationary                       |
| 61–91%          | Existing paper wipe proceeds with the exposed arrangement                                           |

The central core remains at its original assembly origin. Poses are deterministic functions of scroll position. Wide and narrow layouts begin at the exact same original rotation. Existing automatic framing accommodates the wider separation without changing page layout or scroll distance.

The existing hemispheric fill rises from 0.35 to 0.55 during exposure, starting at 22% and finishing at 48%. This clarifies dark exposed faces without changing assembled lighting or adding a rendering pass.

## Matched visual evidence

Before and after were captured at identical scroll positions: 0%, 15%, 25%, 32%, 40%, 48%, 56%, 60%, and 100%, at both 1440 × 900 and 390 × 844. Intermediate desktop/mobile poses and the drawing endpoint were visually inspected. The assembled before/after images are pixel-identical at both widths.

All evidence is local under `artifacts/motion-lab/opening/`:

- `exposed-comparison.png`: matched before/after at 56%, using the same crop of each desktop screenshot.
- `opening-poses.png`: six intermediate desktop poses.
- `mobile-comparison.png`: matched 390px exposed arrangement.
- `before/` and `after/`: all 36 full-resolution matched captures.
- `after/opening-1440.webm` and `after/opening-390.webm`: 6.5-second opening, 2.2-second exposed pause, and 4-second reverse traversal, with short framing pauses.
- `assembled-check.json`: pixel-equality checks at 0%.
- `visibility.json`: geometric visibility sampling throughout the opening.
- `after/verification.json`: browser results.

No screenshot colors or objects were retouched. Comparison sheets only crop, resize and arrange genuine browser captures.

## Visibility evidence and remaining overlap

The geometry check casts camera-aligned rays at 21 points across the seven amber bars. At the exposed 56% pose, the original sequence left 7/21 sampled points visible; the revised sequence exposes 21/21 in both layouts. A regression test checks every sampled point at 40%, 48%, 52%, 56%, and 60%.

Brief early crossings remain: the cover around 20–23% and the ceramic frame around 33–35% on desktop; approximately 19–22% and 32–34% on mobile. These ranges describe samples with fewer than half the tested points visible, not a claim about the entire visible pixel area. They are short portions of scroll travel, not fixed durations.

Fine truss lines still overlap some conductors in projection. Those supporting components remain mechanically related; the settled major silhouettes and amber reference are clear. The mobile core is smaller in the wider exploded assembly, trading close detail for separation and an unclipped overall form.

## Executed browser and model checks

- `node scripts/lab-opening-review.mjs before` and `after`: 18 captures each, no console/page errors.
- `node scripts/lab-verify.mjs`: passed at Edge 320 × 740, 390 × 844, 768 × 1024, 1440 × 900, plus Chrome 1440 × 900. Slow, rapid, reverse and interrupted scrolling, keyboard/anchor navigation, reduced motion and no-JavaScript fallback were exercised.
- The browser run executed 20 axe scans with no violations and recorded no application console errors. This does not establish full accessibility compliance.
- Seven lab unit tests passed, including the existing ordering and aperture tests plus assembled-pose preservation, pre-paper hold and amber-visibility regressions.

The initial capture tolerance was adjusted for native integer pixel scroll rounding. The first local unit invocation was prevented by the Windows child-process sandbox, then rerun with the required permission. An actual rear-layer ordering failure was corrected and the tests rerun successfully. Failed attempts are not counted as passes.

Physical-device Safari, touch/GPU behavior, Firefox/WebKit and screen-reader release checks remain unverified. This pass is ready for visual review only; it does not authorize integration or deployment.
