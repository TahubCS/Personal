# Scroll narrative — implementation and review

Local production preview: http://127.0.0.1:4322/

Prepared on the local motion-narrative branch. Nothing was pushed or deployed. The live Vercel site remains unchanged. The repository's existing content, claims, project URLs and case-study Markdown are preserved.

## What changed

The opening pairs immediately readable recruiter information with layered repository sheets and the amber question “Where is access resolved?” Scrolling separates the sheets and extends a route toward Context Compiler. The same question and paper/amber visual language continue in the trace; this is a compositional handoff, not a single DOM element moved across the whole page.

The desktop trace uses a short native sticky composition and 850px of additional scroll travel. The question becomes an MCP call, repository access scope, illustrative embedding, selected source fragments and a context pack. The semantic labels and explanations remain HTML. All scenarios are deterministic fixtures, with no service requests. The pack's paper surface continues into a geometric paper reveal, oversized “Useful.” typography and the existing project stories.

Context Compiler assembles source sheets. Supo follows a conversation spine through an AI-to-human boundary. CrowsNest connects material sheets to a shared resource collection. The architecture artifacts are explicitly labeled illustrations; no product screenshots were fabricated. Case-study heroes now pair the title/metadata with their artifact, whose paper edge meets the reading section. The closing section returns to the request marker and contribution narrative.

## Architecture and dependencies

No runtime dependency was added. Astro still renders semantic content and static case studies. Context Compiler remains the only React island, loaded with client:visible. TraceTranscript.astro remains a static sibling rendered by index.astro.

- observe-progress.ts owns scoped passive scroll/resize/visibility subscriptions, IntersectionObserver, ResizeObserver and one scheduled animation frame per observer. It skips hidden/offscreen work, refreshes after fonts settle, and returns cleanup.
- page-motion.ts binds the small number of editorial scenes to CSS progress values and clears subscriptions on page exit. It restores them after browser Back through pageshow. Hot reload calls the returned cleanup.
- use-scroll-trace.ts measures the runway and dispatches quantized progress to the reducer. It enables sticky scrubbing only at widths of at least 1100px, heights of at least 800px, and when the trace actually fits below the header. Enlarged text disables unsafe pinning.
- trace-state.ts owns both scroll and manual state. Manual selection, scenario changes, reset and timed playback retain ownership until Follow scroll is explicitly selected. Scroll progress cannot overwrite manual state. Invalid keys stop at access resolution. Reverse scrolling deterministically restores earlier stages.
- RequestArtifact.tsx presents different information forms in a stable shared footprint. CSS transforms, visibility and opacity handle the brief representation changes. Typography/content is not split into animated characters.

Native scrolling is unchanged. There is no wheel interception, smooth-scroll replacement, global state manager, GSAP, canvas or WebGL. Simpler browser primitives cover the required behavior without their payload or lifecycle overhead.

## Responsive and accessibility behavior

Below the desktop sticky breakpoint the trace becomes an unpinned vertical sequence with each stage's complete explanation. Controls remain usable; the visual transformation can still be explored manually. Reduced motion removes scrubbing, sweeps, parallax, representation translations and extra sticky travel. It preserves the full text sequence and controls. No-JavaScript mode removes the runway through no-script.css and retains the static transcript.

Explicit whitespace and accessible names repair the name, About heading and closing heading. Stage controls expose aria-current="step". Visible focus, skip navigation, Escape/focus restoration in the mobile menu, native anchors, no-JavaScript navigation and forced-colors state were exercised. Mobile trace controls are at least 44×44 CSS pixels.

## Executed checks

| Command / check                                             | Final result                                                                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run dev                                                 | Used for iterative hero, trace, stories and closing browser review                                                                                            |
| npx prettier --check src scripts tests public/no-script.css | All matched files passed                                                                                                                                      |
| npm run lint                                                | Passed                                                                                                                                                        |
| npm run check                                               | 44 files; zero errors, warnings or hints                                                                                                                      |
| npm run test                                                | Six reducer tests passed                                                                                                                                      |
| npm run build                                               | Five static outputs; final measured build 1.15 seconds                                                                                                        |
| npm run preview -- --port 4322                              | Local production preview running                                                                                                                              |
| npm run test:browser                                        | 36 passed, 18 each in Chrome and Edge; final run 10.5 seconds                                                                                                 |
| node scripts/motion-review.mjs hero / trace / stories       | Each gate passed six viewport/motion combinations, slow/normal/rapid/reverse scrolling, direct anchors and browser Back checks; no console errors or overflow |
| node scripts/review-pages.mjs motion-final                  | Production: four routes × four widths = 16 passing audits; HTTP 200, no page errors, horizontal overflow or Axe A/AA findings                                 |
| node scripts/motion-captures.mjs                            | Final major-state screenshots captured at all three required viewports                                                                                        |
| node scripts/performance.mjs                                | Three completed mobile Lighthouse runs; full results below                                                                                                    |
| node scripts/motion-performance.mjs                         | 240-frame forward/reverse sampling in normal and reduced motion; zero scroll layout shift and no long animation frames                                        |

Route audit viewports: 320×844, 390×844, 768×1024 and 1440×900. Screenshot/scroll gates: 390×844, 768×1024 and 1440×900, each with normal and reduced motion. Mobile case-study geometry has its own regression test, beyond simply checking horizontal overflow. Text enlargement emulates 200% text-only sizing across computed font sizes, including pixel-based rules; it is not a claim of real browser zoom or OS text-scale testing.

## Defects found and corrected during the gates

1. A rotated hero sheet extended 4px beyond mobile width. The illustration now has an intentional bounded crop.
2. Padding below the trace did not extend its sticky containing block. An in-flow spacer fixes the actual visual pin, verified at all six request states.
3. A duplicated mobile case-study CSS rule produced two narrow columns despite passing overflow checks. It was removed; tests now require a full-width introduction followed by the artifact.
4. Playback labels, insertion of the evidence link and a separate trailing arrow text node created small shifts during automatic stage changes. Reserved control/evidence space and a stable link text node reduced the measured scroll shift to zero.
5. Astro's dev/type-check dependency cache conflicted once. Stopping the dev server for check/build resolved it. A restricted Node test spawn required the already-authorized elevated execution path. Neither is reported as an application test failure in the final gate.
6. The Astro ESLint parser rejected nested style content in head/noscript. The fallback is now an external CSS file. Browser-only globals in the performance harness were explicitly qualified with window, and lint passed afterward.

## Performance measurements and tradeoffs

Three local production Lighthouse cold navigations, simulated mobile, 150ms RTT, approximately 1.6Mbps and 4× CPU slowdown. No browser regression suite ran concurrently with these measurements. Other host activity was not controlled.

| Metric                         | Previous portfolio | Final redesign                                   |
| ------------------------------ | ------------------ | ------------------------------------------------ |
| Lighthouse performance         | 100 / 100 / 100    | 84 / 100 / 100                                   |
| LCP                            | Median 1208.50ms   | 2016.21 / 1209.66 / 1207.62ms; median 1209.66ms  |
| TBT                            | 0 / 0 / 0ms        | 533.5 / 0 / 0ms                                  |
| Loading CLS                    | 0                  | 0 in all three runs                              |
| Initial measured transfer      | 50,536 bytes       | 56,157 bytes (+5,621; 11.1%)                     |
| All built JS, calculated gzip  | 62,883 bytes       | 64,955 bytes (+2,072; 3.3%)                      |
| All built CSS, calculated gzip | 3,662 bytes        | 6,351 bytes (+2,689; 73.4%, small absolute base) |
| Self-hosted WOFF2              | 36,996 bytes       | Unchanged                                        |

Accessibility, best-practices and SEO Lighthouse scores were 100 in all three final runs. This does not establish full WCAG compliance. Initial transfer is measured before the deferred React island loads; the separate all-JS figure includes the renderer. The initial added external motion scripts total 845 bytes calculated gzip. Gzip sizes are calculated asset sizes, not a promise of a future host's encoding.

The slower cold run is retained, not discarded. Lighthouse attributed most of its time to style/layout (about 2.08 seconds), with about 29ms of script evaluation. Two subsequent cold runs did not reproduce the spike. The additional visual DOM and CSS have a real loading cost, but the evidence does not isolate the cause of that one spike from host variance. LCP remained within the 2.5s target even in that run. Recheck cold-start behavior on a low-end physical device before release. An earlier intermediate run set scored 99/100/100 at roughly 1.36s LCP; it is not substituted for the final results.

Animation sample: installed headless Edge at 1440×900, unthrottled, 240 requestAnimationFrame-paced positions down and back over approximately 1.45 seconds. Normal motion: 326.58ms total task time, 59.53ms script time (about 0.25ms per sampled frame), 5.82ms layout time; median frame interval 6.1ms and p95 6.3ms. Reduced motion: 84.58ms task time, 17.49ms script time, 0.34ms layout time. Both samples: zero scroll layout shift and zero reported long animation frames. These are local lab measurements, not a promise of device frame rate or field INP.

Windows again denied Lighthouse's temporary profile cleanup after reports were saved. The script recorded the warning and exited successfully; cleanup success is not claimed. Raw reports: artifacts/performance.json, artifacts/lighthouse-mobile-{1,2,3}.{html,json}, artifacts/motion/animation-performance.json.

## Screenshots for review

These are browser captures of the implemented portfolio. The complete set, including all three viewport widths and individual request representations, lives in artifacts/motion/. Full-page route captures live in artifacts/motion-final-*.png.

Hero:

![Hero](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-hero-1440.png>)

Trace — retrieved context:

![Trace](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-trace-4-1440.png>)

Paper transition:

![Paper](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-paper-1440.png>)

Context Compiler story:

![Context story](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-context-1440.png>)

Supo story:

![Supo story](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-supo-1440.png>)

CrowsNest story:

![CrowsNest story](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-crowsnest-1440.png>)

Case-study opening:

![Case study](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-case-context-compiler-1440.png>)

Mobile:

![Mobile](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-hero-390.png>)

Closing:

![Closing](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion/final-footer-1440.png>)

## Remaining release blockers and manual checks

- Email, resume and LinkedIn destinations have not been supplied. They remain omitted. GitHub is the only confirmed connection destination, so the requested four-destination contact set is not release-complete.
- NVDA, VoiceOver, physical-device Safari, low-end mobile performance and OS/browser-level zoom remain manual. Firefox/WebKit were unavailable for this verification; no pass is claimed. Automated text enlargement and forced-colors checks are narrower than those tests.
- Field INP, real recruiter comprehension testing and continuous monitoring are not measured/configured. The cold-layout spike above deserves a physical-device recheck.
- Production deployment is intentionally not performed. The local docs/ ignore-rule modification is left untouched; only the motion report and storyboard are explicitly included in the review commit.
