# Initial system core prototype � historical record

This records the first implementation, not the current appearance, fallback, timing, performance, or verification status. See [current status](../motion-lab.md).

Local preview: http://127.0.0.1:4321/motion-lab

This is an isolated development study on `codex/motion-lab`. No homepage components, project content, case-study routes, contact links, or deployment settings were redesigned. Nothing was pushed or deployed. The existing uncommitted `.gitignore` change is outside this work.

## Direct reference study and storyboard

The supplied `anime js visualisation.mp4` was opened in Edge and examined at 5, 7.5, 10, 12.5, and 15 seconds. The extracted principle is continuity of geometry: a front view becomes a deep assembly, then the same parts become linework. The reference's mechanical instrument, circular silhouette, rainbow accents, labels, assets, and animation code were not used.

The five-frame storyboard was presented before implementation:

| Progress | Intended composition                                                            |
| -------- | ------------------------------------------------------------------------------- |
| 0%       | Compact graphite envelope, near-front view, amber aperture                      |
| 25%      | Three-quarter rotation exposes deep sidewalls and the opening seam              |
| 50%      | Shell, ceramic frame, lattice, and conductors separate along the depth axis     |
| 75%      | Advancing paper surface turns the same exposed geometry into linework           |
| 100%     | Exploded technical drawing, short annotations, followed by the end of the study |

The original geometry comprises a beveled asymmetric octagonal envelope, deep side rails, copper comb conductors, a ceramic truss, an offset center, and a separate inner frame. It is an illustrative software metaphor, not a claim about real hardware construction. All geometry is procedural. No external model, texture, product screenshot, or paid asset is needed.

## Implementation

Astro injects `/motion-lab` only for the `dev` command. Its entry point lives outside `src/pages`. This prevents accidental production publishing. Three.js 0.186.0 and its types are development dependencies; no Anime.js, GSAP, scroll smoothing, or additional React island was added.

The pose function is independent of the renderer. Scroll position determines rotations, ordered layer offsets, scale, and the paper boundary. It has no elapsed-time state, easing catch-up, autoplay, or idle loop. Returning to a position returns to the same pose. Layer motion shares local Z; the object's rotation presents that axis diagonally.

Three.js supplies real volume, consistent occlusion, bevels, lighting, and shared surface/edge geometry. A generated room environment provides reflections without an image download. A shader changes material output at the same screen-space boundary as the paper wipe. This is one assembly, not two crossfaded poses. The light-side faces remain opaque to suppress hidden edges. Text uses difference blending so a moving boundary can cross a line without making it disappear.

Rendering runs on scroll or resize demand and pauses while hidden or offscreen. Pixel ratio is capped at 1.5. The scene disposes listeners, observers, geometry, materials, environment texture, and renderer on teardown. HMR teardown is supported. Context loss switches to the static drawing; recovery can restore rendering.

Desktop uses two viewport heights of scroll travel; mobile uses 1.45. Adaptive bounds preserve the complete silhouette. Reduced motion removes the extra travel and pinning and renders a stationary exploded drawing. An original simplified inline SVG remains visible without JavaScript or WebGL. The heading, figure description, end section, and navigation are semantic HTML.

Official APIs checked: [Astro route injection](https://v5.docs.astro.build/en/reference/integrations-reference/), [ExtrudeGeometry](https://threejs.org/docs/pages/ExtrudeGeometry.html), [EdgesGeometry](https://threejs.org/docs/pages/EdgesGeometry.html), [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), [RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html), [PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html). The installed Astro integration type was also checked for the `dev` command contract.

## Files

```text
astro.config.mjs                    development-only route injection
package.json / package-lock.json   Three.js and types, development dependencies
src/labs/system-core/
  MotionLab.astro                  isolated semantic page and SVG fallback
  motion-lab.css                   local layout, paper surface, reduced motion
  pose.ts                         deterministic scroll model
  pose.test.ts                    input bounds, order, reversibility
  geometry.ts                     original modeled assembly
  geometry.test.ts                regression test for the open aperture
  materials.ts                    physical materials and drawing shader
  scene.ts                        renderer, framing, scroll and cleanup
scripts/
  lab-captures.mjs                 five desktop/mobile progress captures
  lab-verify.mjs                   browser, accessibility and video verification
  lab-fallback-check.mjs           WebGL unavailable check
  lab-performance.mjs              development scroll measurements
  lab-production-check.mjs         production asset hashes and route exclusion
docs/motion-lab.md                 this handoff
artifacts/motion-lab/              local screenshots, recording, JSON reports
```

## Executed verification

| Command or check                                                                                                 | Result                                                                                                |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm install --save-dev three @types/three`                                                                      | Installed successfully; npm reported zero vulnerabilities                                             |
| `npx playwright install ffmpeg`                                                                                  | Installed the supported browser video encoder                                                         |
| `npx prettier --check astro.config.mjs package.json package-lock.json src/labs/system-core scripts/lab-*.mjs`    | Passed                                                                                                |
| `npm run lint`                                                                                                   | Passed after qualifying browser globals in the test harness                                           |
| `npm run check`                                                                                                  | 57 files; zero errors, warnings, or hints                                                             |
| `npm test`                                                                                                       | 6 existing unit tests passed                                                                          |
| `node --experimental-strip-types --test src/labs/system-core/pose.test.ts src/labs/system-core/geometry.test.ts` | 4 prototype unit tests passed                                                                         |
| `node scripts/lab-verify.mjs`                                                                                    | 5 browser/viewport configurations passed; 20 axe scans with zero violations; zero console/page errors |
| `node scripts/lab-fallback-check.mjs`                                                                            | WebGL disabled: SVG visible, no long runway, no console errors; one intentional fallback warning      |
| `npm run test:browser`                                                                                           | All 36 existing portfolio tests passed across Chrome and Edge                                         |
| `npm run build`                                                                                                  | Passed; five existing pages emitted in 1.86 seconds                                                   |
| `node scripts/lab-production-check.mjs`                                                                          | No prototype route; all 7 production assets byte-identical to the baseline, totaling 229,255 bytes    |
| agent-browser open / screenshot / snapshot / errors                                                              | Local route loaded and meaningful content rendered; no reported browser errors                        |

Early verification exposed and corrected a self-intersecting thin aperture, mobile clipping, and fragment navigation after runway enhancement. An aperture raycast regression test now prevents a filled front opening. Test harness whitespace and accessibility-context setup were corrected before the successful run. These early failures are not counted as passes.

### Browser coverage

| Browser | Viewport   | Evidence and checks                                             |
| ------- | ---------- | --------------------------------------------------------------- |
| Edge    | 320 × 740  | Five poses, reflow, keyboard, reduced motion, axe               |
| Edge    | 390 × 844  | Five poses, reflow, keyboard, reduced motion, axe, SVG fallback |
| Edge    | 768 × 1024 | Five poses, reflow, keyboard, reduced motion, axe               |
| Edge    | 1440 × 900 | Five poses, reflow, keyboard, reduced motion, axe, recording    |
| Chrome  | 1440 × 900 | Five poses, reflow, keyboard, reduced motion, axe               |

The automated driver exercised slow and normal scrolling, rapid wheel movement, reverse scrolling, and a stopped mid-sequence pose. Screenshot equality confirmed an interrupted frame stays unchanged and reverse traversal restores the exact frame. Direct anchors, skip links, and browser Back were executed. Desktop, tablet, mobile, narrow-width, and fallback screenshots were visually inspected. Automated axe results are not a full WCAG claim.

### Measurements

`artifacts/motion-lab/performance.json` records an unthrottled desktop Edge run against the development server at 1440 × 900. Across 241 requested frames, the measured median frame interval was 6.10 ms, p95 was 6.40 ms, with no sampled interval over 50 ms. Total script time was 537.7 ms, total task time 854.0 ms, layout 39.9 ms, and style recalculation 96.2 ms. These are development-machine measurements, not physical-device or production frame-rate guarantees.

The dev server serves approximately 6 MB for the unminified Three.js implementation module, plus development tooling. This is not an acceptable estimate of a future production bundle. Production growth in this isolated implementation is exactly zero bytes: all current production assets match their saved SHA-256 hashes. A production integration would require a separate bundle and device-performance review.

The evidence recording is a 13.04-second, 1440 × 900 WebM at 25 fps, approximately 1.63 MB. Its frame rate limits judgments about high-refresh-rate smoothness.

## Visual evidence

- `artifacts/motion-lab/five-frame-storyboard.png`: five desktop progress frames plus the final mobile view.
- `artifacts/motion-lab/msedge-1440-{0,25,50,75,100}.png`: full-resolution desktop frames.
- `artifacts/motion-lab/msedge-390-{0,25,50,75,100}.png`: full-resolution mobile frames.
- `artifacts/motion-lab/system-core-scroll.webm`: forward, stopped, and reverse traversal.
- `artifacts/motion-lab/msedge-390-reduced.png`: reduced-motion drawing.
- `artifacts/motion-lab/msedge-no-javascript.png` and `webgl-unavailable.png`: static fallbacks.
- `artifacts/motion-lab/verification.json`, `fallback.json`, `performance.json`, and `production-check.json`: machine-readable results.

## Three significant remaining weaknesses

1. The materials still read as a stylized CAD object. More nuanced surface finish and occlusion would give the assembled state greater physical richness.
2. The inner truss becomes dense at phone size; some fine detail merges in the final line drawing.
3. The paper boundary is a straight horizontal scan. It preserves geometry continuity, but a more object-specific boundary could make the final transformation less diagrammatic.

Manual release checks remain for Safari on physical devices, Firefox/WebKit, NVDA/VoiceOver, hardware GPU diversity, real touch scrolling, and text zoom on this isolated lab. Graphics-context restoration is implemented but has not been exercised with a real device reset. No production integration should proceed until the user visually approves this prototype.
