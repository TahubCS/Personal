# Motion lab: assembled appearance revision

Preview: http://127.0.0.1:4321/motion-lab

Scope: revise the existing object's geometry hierarchy, material identities, lighting and depth. The route, layout, pose model, scroll distances, camera code and paper wipe are unchanged. No idle animation, homepage integration, dependency installation or deployment was added.

## Three consequential changes

1. **Core before lattice.** The truss has 40 struts instead of 60; its radius is 0.014 instead of 0.025 world units. It sits 0.27 units behind its previous front plane and uses a dark, rough structural material rather than the ceramic frame's pale material. The central body and amber insets are larger, and the perimeter is subdued bronze rather than emissive amber.
2. **An enclosure that conceals.** The front aperture is 2.25 × 2.65 rather than 2.75 × 3.15. The front shell grows inward from 0.32 to 0.5 units deep, preserving the outer silhouette and front surface. The assembled shell conceals most of the ceramic frame and more of the outer routing; separation exposes them. The center aperture remains genuinely open, covered by the existing raycast regression test.
3. **Light defines the surface.** Uniform solid-scene outlines are disabled. The existing bevel geometry receives creased normals with a 30-degree threshold, calculated once at construction. A warm directional key casts shadows, with a restrained hemispheric fill and a weaker cool rim light. Graphite is satin and metallic, ceramic is rougher and nearly nonmetallic, and conductors are warmer and more metallic. The drawing still uses the original edge geometry and paper shader.

No bloom, blur, particles, noisy textures, decorative components, or post-processing were introduced.

## Matching and visual evidence

Before/after captures use Edge, identical 1440 × 900 and 390 × 844 viewports, and the same native scroll positions at 0%, 50%, and 100%. Fractional mobile pixel rounding is the same on both sides. A geometry comparison confirms the maximum framing-bound difference is 0.000000033 world units, attributable to floating-point rounding. No camera or pose code was changed.

All six final images were inspected, along with the desktop and mobile comparison sheets. The assembled comparison uses identical crops of the full screenshots; its colors and geometry have not been retouched.

- `artifacts/motion-lab/appearance/assembled-comparison.png`: prominent before/after assembled view.
- `artifacts/motion-lab/appearance/all-progress-comparison.png`: complete viewport comparisons at 0%, 50%, and 100%.
- `artifacts/motion-lab/appearance/mobile-comparison.png`: assembled view at 390px.
- `artifacts/motion-lab/appearance/before/` and `after/`: original full-resolution captures and measurements.
- `artifacts/motion-lab/appearance/after/system-core-scroll.webm`: newly recorded forward, interrupted, and reverse traversal.
- `artifacts/motion-lab/appearance/framing-check.json`: matching geometry bounds.

## Rendering cost

One 1024 × 1024 PCF shadow map adds a depth pass for six casting meshes. Fine ribs receive shadows but do not cast them. Shadow updates stop once the paper fully covers the scene; reverse scrolling restores them. Transparent outline draws are skipped in the dark scene. The shadow target is disposed with the renderer.

The scene decreases from 148 to 128 solid meshes and from 3,112 to 2,716 triangles. Creased normals add a one-time CPU preparation step and an existing Three.js utility import, not per-frame geometry work. The unminified development utility module is 111,552 bytes. Production assets remain byte-identical because this route is development-only.

Matched unthrottled Edge runs at 1440 × 900, 241 requested frames, with recording disabled:

| Measurement                  |    Before |     After |
| ---------------------------- | --------: | --------: |
| Median frame interval        |   6.10 ms |   6.10 ms |
| p95 frame interval           |   6.30 ms |   6.30 ms |
| Sampled intervals over 50 ms |         0 |         0 |
| Total script time            | 358.05 ms | 334.61 ms |
| Total task time              | 579.48 ms | 570.10 ms |

These individual development-machine runs show no observed interval regression. The small timing differences are not evidence of a general performance improvement. GPU timing, physical-device power use, and low-end mobile behavior were not measured.

## Checks executed in this revision

| Command/check                                                                                                    | Result                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/lab-appearance-review.mjs before` / `after`                                                        | Six matched captures per version, no console/page errors                                                                                                                     |
| `node scripts/lab-verify.mjs`                                                                                    | Passed across Edge at 320/390/768/1440 widths and Chrome at 1440; forward, rapid, reverse, stopped poses, keyboard anchors, reduced motion, and JavaScript-disabled fallback |
| axe through the lab verification script                                                                          | 20 scans, no violations; not a full accessibility certification                                                                                                              |
| Video recording through lab verification                                                                         | New forward/reverse recording saved successfully                                                                                                                             |
| `node scripts/lab-performance.mjs`                                                                               | Before/after measurements saved                                                                                                                                              |
| Prettier on all changed source and review-script files                                                           | Passed                                                                                                                                                                       |
| `npm run lint`                                                                                                   | Passed                                                                                                                                                                       |
| `npm test`                                                                                                       | 6 existing trace tests passed                                                                                                                                                |
| `node --experimental-strip-types --test src/labs/system-core/pose.test.ts src/labs/system-core/geometry.test.ts` | 4 existing lab tests passed                                                                                                                                                  |
| `npm run check`                                                                                                  | 59 files, zero errors, warnings or hints                                                                                                                                     |
| `npm run build`                                                                                                  | Passed, five production pages in 1.77 seconds                                                                                                                                |
| `node scripts/lab-production-check.mjs`                                                                          | No lab route emitted; seven production assets match baseline hashes                                                                                                          |

The first capture assertion was too strict about fractional mobile scroll rounding; it was corrected to a 0.0003 progress tolerance before the successful paired captures. An incorrect relative import in the local geometry-measurement harness was also fixed. These harness failures are not reported as successful checks.

Official references checked before implementation: [material parameters](https://threejs.org/docs/pages/MeshStandardMaterial.html), [directional light shadows](https://threejs.org/docs/pages/DirectionalLightShadow.html), and [creased normals](https://threejs.org/docs/pages/module-BufferGeometryUtils.html). The installed Three.js helper implementation was inspected as well.

## Remaining weakness and review boundary

The broad satin highlights still give the shell a slightly molded appearance; a more machined finish would need finer control of the face-to-bevel normal transition. The requested hierarchy is clearer in these captures, but that is an art-direction assessment, not visual approval.

Physical-device Safari, touch/GPU behavior, and screen-reader release checks remain outstanding from the initial prototype. No integration or deployment should follow without the user's visual approval.
