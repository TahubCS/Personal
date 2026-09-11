# Final isolated prototype review

Reviewed on 2026-09-11 from commit `c086f72`. This pass changes no application source, layout, motion, geometry, material or deployment configuration. Visual approval remains with the user.

## Evidence

All new review evidence is under `artifacts/motion-lab/final-review/`.

- `complete-1440.webm` and `complete-390.webm`: full desktop/mobile journeys with a 6.5-second opening, 2.2-second exposed pause, 4-second paper transition, 2-second drawing pause and 5.5-second reverse traversal. Startup and end framing add time. The recordings are 2,674,256 and 2,186,311 bytes respectively.
- `storyboard-1440.png`, `storyboard-768.png`, `storyboard-390.png`: five selected states from genuine browser captures; only arrangement and resizing were applied.
- `frame-*.png`: 27 captures at 0, 15, 25, 32, 40, 48, 56, 75 and 100 percent across 1440×900, 768×1024 and 390×844. Some filenames retain floating-point precision from the original capture tool.
- `recording-review.png` and `mobile-recording.png`: decoded frames from the actual videos, inspected alongside the still captures.
- `loading-*-before.png` / `loading-*-after.png`: delayed initialization comparison. The scripts were held for at least 1.5 seconds after the poster decoded.
- `reduced-mobile.png`, `verification.json`, `fallback.json`, `loading-results.json`, `performance.json`: current fallback, reduced-motion, accessibility and measurement evidence.

The initial storyboard assembly looked for an integer 56 filename and failed because the capture tool emitted floating-point precision. Selecting numerically equivalent filenames resolved it. The bundled FFmpeg lacked the requested fps filter; fixed-time frame extraction succeeded instead. Neither failed attempt was counted as verification.

## Executed checks

Fresh capture, full-recording, loading and performance harnesses were run from this artifact directory, followed by `npm run test:lab:browser`. Edge passed at 320×740, 390×844, 768×1024 and 1440×900; Chrome passed at 1440×900. The suite exercised slow, normal, rapid, reverse and interrupted scrolling, keyboard skip links, direct anchors, browser Back, reduced motion and JavaScript-disabled fallback. Twenty axe scans found zero violations. No application console/page errors were recorded; disabling WebGL produced the expected fallback warning.

Unit, lint, formatting, Astro diagnostics and production build passed in the preceding cleanup step. They were not rerun in this evidence-only pass; the source was unchanged. A browser suite pass is not full accessibility compliance or visual approval.

## Performance sample

Unthrottled desktop Edge against the development server, without simultaneous video capture:

| Measurement                      | Result    |
| -------------------------------- | --------- |
| Requested animation frames       | 241       |
| Median observed frame interval   | 6.1 ms    |
| p95 observed frame interval      | 6.3 ms    |
| Intervals above 50 ms            | 1         |
| Script time across traversal     | 479.94 ms |
| Total task time across traversal | 791.49 ms |
| Layout time                      | 41.27 ms  |
| Style recalculation time         | 108.98 ms |

These intervals are browser scheduling observations, not GPU presentation timing or a physical-device smoothness guarantee. One slow interval occurred, so no claim of consistently hitch-free playback is made. Development resources include an approximately 5.97 MB decoded Three.js module; this is not a production bundle measurement. Integration still requires its own bundle and physical-device performance assessment.

Observed non-input layout-shift totals during delayed initialization were 0.000122 desktop, 0.000282 tablet and 0.000705 mobile. These are short local observations, not field Core Web Vitals. The matching poster is 84,600 bytes. Fine raster edge sampling still differs slightly from the live canvas.

## Visual assessment and remaining weaknesses

The three states are visibly distinct, the major layers have readable gaps in the exposed hold, and the same geometry continues across the paper boundary. Desktop and mobile video frames, intermediate poses and the tablet drawing were inspected. The mobile assembly fits the viewport.

1. Mobile internal details are small and dense; the truss and conductor linework can merge at normal viewing scale.
2. The ceramic frame briefly occludes part of the amber core in the early reveal. The fully exposed hold is clear; this is not continuous unobstructed visibility.
3. The rear graphite enclosure is deliberately subdued but has less silhouette contrast on the dark surface than the ceramic frame.

Physical-device Safari, touch behavior on real hardware, GPU diversity, Firefox/WebKit, NVDA/VoiceOver and a dedicated text-zoom release pass remain outstanding. No integration or deployment was performed. Review the videos and approve the visual result before planning homepage integration.
