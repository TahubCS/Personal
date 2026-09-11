# System core motion prototype

Local preview: http://127.0.0.1:4321/motion-lab

This route is injected only during Astro development. It remains outside the production homepage and case studies. Integration and deployment are separate decisions.

## Current behavior

One procedural object rotates to establish depth, opens along a shared mechanical axis, and becomes a technical drawing. The graphite enclosure, ceramic frame, quieter internal truss and warm conductors retain the amber core as the visual reference. No idle animation, scroll smoothing or new motion dependency is used.

| Scroll interval | Behavior                                                              |
| --------------- | --------------------------------------------------------------------- |
| 2–22%           | Depth-establishing rotation                                           |
| 18–35%          | Front shell clears the core                                           |
| 27–43%          | Ceramic frame separates                                               |
| 30–50%          | Rear enclosure opens                                                  |
| 34–52%          | Conductors separate                                                   |
| 52–61%          | Exposed assembly holds                                                |
| 61–88%          | Diagonal dark-to-paper wipe; the same surfaces become shaded linework |
| 88–100%         | Drawing pose holds; projected callouts appear from 88–96%             |

The pose is a deterministic function of native scroll position. Mobile uses a steeper shared axis and shorter scroll runway. Reduced motion removes extra scroll travel and presents the static drawing. Drawn callouts follow projected component anchors rather than fixed screen percentages. The drafting metadata states “Illustrative · not to scale”; no manufacturing dimensions or standards compliance are claimed.

## Loading and fallback

A transparent 542 × 580 lossless WebP capture of the real assembled object replaces the earlier glowing SVG. It is 84,600 bytes, stored in `src/labs/system-core/assets/assembled-core.webp`. Responsive sizing matches the camera framing. The image stays visible until the first WebGL render sets `data-ready`; the switch uses neither a fade nor a timer. It also remains usable with JavaScript or WebGL unavailable. See [loading verification](motion-lab-loading.md).

## Maintained files and commands

- `src/labs/system-core/MotionLab.astro`: semantic lab page, matching loading image and drawing annotations.
- `scene.ts`: camera, on-demand rendering, projected callouts, events and cleanup.
- `pose.ts`: reversible rotation, offsets, exposed hold and paper timing.
- `geometry.ts` / `materials.ts`: original procedural assembly and drawing treatment.
- `motion-lab.css`: responsive composition and fallbacks.
- `*.test.ts`: pose, visibility and geometry regressions.

`npm test` now runs both the Context Compiler and motion-lab unit suites. Use `npm run test:lab` for just the lab and `npm run test:lab:browser` for its browser verification (dev server required). `npm run capture:lab` and `npm run record:lab` are the maintained visual-evidence entry points. See [script guide](../scripts/README.md) for requirements and optional tools.

Nineteen one-off drawing/capture experiments are archived under `scripts/archive/motion-lab/`; they are not part of the standard workflow. No scripts or historical evidence were deleted.

## Evidence and limits

The loading pass verified delayed initialization at 1440×900, 768×1024 and 390×844, with paired captures in `artifacts/motion-lab/loading/`. Fallback and reduced-motion bounds were checked at 320, 390, 768 and 1440 pixels. Those results are scoped to that pass, not a full release certification.

Historical reports: [initial implementation](archive/motion-lab-initial.md), [assembled appearance](motion-lab-appearance.md), [opening sequence](motion-lab-opening.md). Their measurements describe those revisions. They must not be presented as fresh performance or full-sequence results for the current code.

The next visual approval pass still needs a complete current recording and refreshed performance measurements. Physical-device Safari, touch/GPU diversity and screen-reader release checks remain outstanding. Static images can differ slightly in edge sampling from live WebGL, and dense internal lines remain harder to distinguish at phone size. No full WCAG compliance claim is made.

## Prototype cleanup verification — 2026-09-11

- `npm test`: 14 passed (6 trace, 8 lab), zero failures. The default command now includes both suites.
- `npm run lint`: passed. `npm run check`: zero errors, warnings or hints.
- Targeted `prettier --check`: passed for changed source, package configuration, active fallback tool and documentation.
- `npm run test:lab:browser`: passed in Edge at 320×740, 390×844, 768×1024 and 1440×900, plus Chrome at 1440×900. Slow/normal/rapid/reverse/interrupted scrolling, keyboard anchors/Back, reduced motion and no-JavaScript fallback executed. Twenty axe scans reported no violations; no application errors were recorded.
- Disabled-WebGL check passed with expected fallback warnings. The active fallback tool now identifies the image correctly and creates its output directory on a fresh checkout.
- The browser suite generated a forward/reverse recording as part of its existing behavior. This does not replace the separately planned final visual approval pass.
- A separate Edge check verified “ILLUSTRATIVE · NOT TO SCALE” in the rendered drawing; `artifacts/motion-lab/cleanup-drawing.png` was visually inspected.
- `npm run build`: passed, five production pages emitted; motion lab remains development-only.

No integration or deployment. Physical-device and screen-reader release checks remain outstanding. Nineteen historical scripts were moved into the archive, preserving their contents and artifact paths.
