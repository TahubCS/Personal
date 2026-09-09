# Verification log

Only executed checks are recorded as passed. Milestones A–F have passed their available engineering gates. Screenshots and machine-readable reports live under artifacts/. These results do not constitute a complete manual accessibility or physical-device certification.

Publication limitations: email and resume not supplied; omitted. CrowsNest's hackathon win is confirmed by the user; only event/category/date/results attribution remains unspecified. Complete ownership declarations are not assumed. GitHub remains an actual working destination.

## A — Foundation and tokens

Passed: npm run check (zero errors; initial deprecated config hint corrected), npm run build (one static route), npm run lint. Headless Edge at 1440x900 and 390x844: zero page errors, overflow, or Axe WCAG A/AA violations. Both rendered captures visually reviewed: legible hierarchy and clean reflow. Initial Astro config permission and Axe context setup failures were corrected before this gate. Fonts are local Latin subsets. Captures: artifacts/A-1440.png and A-390.png.

## B — Navigation and hero

Passed: astro check (0 errors/warnings/hints), ESLint, 3 Playwright navigation tests (identity/real GitHub link, anchor, mobile Escape/focus, no-JavaScript content/menu). Headless Edge desktop/mobile captures: no errors, overflow, or Axe violations. Both images visually reviewed; identity and connection link visible in initial mobile viewport. Project index follows in C.

## C — Selected-project index

Passed: astro check (zero diagnostics), 3 navigation browser tests, Edge desktop/mobile Axe and overflow checks. Both captures visually reviewed: all three projects visible within desktop opening; mobile index precedes architecture figure. Links use genuine project deployments until case-study routes are added in E.

## D — Context Compiler trace

Passed: Astro check (zero diagnostics), 4 state-machine tests, 7 browser tests, lint, and desktop/mobile Axe/overflow checks. Trace captures reviewed: readable stage labels and source evidence, mobile vertical sequence, static sibling transcript. Initial JSX dev runtime mismatch fixed by restarting development server with development NODE_ENV; development toolbar disabled after it interfered with a broad test locator. Native immediate anchor scrolling avoids no-JS scrolling instability. No external trace requests observed. Element-only mobile captures include sticky-header artifacts; use full-page captures for release review. No alternate project traces were built.

## E — Project stories and case studies

Passed: Astro check (zero errors; deprecated schema import subsequently changed to astro/zod), production build (four routes), lint. Production Edge audit across all four pages at 390x844 and 1440x900: all HTTP 200, zero page errors, overflow or Axe violations. All eight full-page images reviewed for content flow, contrast, typography and mobile wrapping. Static original architecture figures only; case studies cite source and contribution evidence. No authenticated screenshots fabricated.

## F — Contact, accessibility and responsive polish

Final gate executed September 9, 2026 against the production preview at http://127.0.0.1:4322/:

- `npm run check`: 32 files, zero errors, warnings or hints.
- `npm run build`: five static outputs, including the 404 page; completed in 1.38 seconds in this run.
- `npm run lint`: exit 0.
- `npx prettier --check src scripts tests docs README.md *.json *.mjs *.js`: all matched files passed. `git diff --check`: exit 0; Git reported only Windows line-ending conversion warnings.
- `npm run test`: all four state-machine tests passed.
- `npm run test:browser`: all 22 tests passed, 11 each in installed Chrome and Edge, in 8.9 seconds.
- `node scripts/review-pages.mjs F` with REVIEW_URL pointing at production: 20 audits, four pages at 320x844, 390x844, 768x900, 1024x900 and 1440x900. Every response 200; no page errors, horizontal overflow or Axe violations under the configured WCAG A/AA tags.
- `node scripts/capture-details.mjs`: 439 homepage narrative words under the documented selector-based count; technical controls, transcript, headings and navigation are excluded. Captures refreshed after the final build.
- `node scripts/performance.mjs`: three completed Lighthouse mobile runs, all scoring 100 for performance, accessibility, best practices and SEO. LCP 1208.50 / 1210.62 / 1207.75 ms; median 1208.50 ms. CLS and TBT both zero in all runs. Initial transfer 50,536 bytes. Reports saved successfully; Windows denied temporary browser-profile cleanup, explicitly recorded in artifacts/lighthouse-cleanup-warning.txt. Measurement command exited 0 with that warning.

Regression coverage includes local case-study navigation, native mobile menu and Escape focus restoration, no-JavaScript content and transcript, all three trace outcomes, bounded stepping/reset, pause/resume/offscreen pause, no external trace requests, reduced-motion manual controls, keyboard skip link/stage selection, forced colors, narrow reflow and simulated 200% body text. Enlarging body font size is not a claim of testing browser zoom.

The first expanded gate found a real 320px min-content overflow and closed-menu layout contribution; mobile grid minimums and closed-menu display were fixed. The keyboard test now waits for hydration before focusing a previously disabled control. All final tests were rerun after the fixes. Final visual review covered the hero at all five widths, desktop and mobile openings for all three case studies, the story region, contact section and mobile failure trace. Previously reviewed full-page E captures cover the unchanged long case-study text. Final full-page F captures are also retained for inspection.

Documentation was maintained on disk during the milestones. A docs/ ignore rule was found and removed during F; the documentation files enter Git in the F commit rather than rewriting earlier history.

## Outstanding manual release checks

- NVDA and VoiceOver reading order, announcements and control semantics.
- Physical-device Safari, automated WebKit and Firefox. Installed stock Firefox could not launch through Playwright's required automation protocol; the attempt is recorded in artifacts/firefox-availability.txt. No Firefox pass is claimed.
- Real browser zoom at 200%/400%, device text scaling, touch ergonomics, and OS-level high-contrast review. Automated forced-colors emulation and enlarged body text are narrower checks.
- Field INP and deployed-network performance. Lighthouse TBT does not establish INP. A real recruiter 30-second comprehension test remains unperformed.
- Hosting-domain canonical/social metadata and deployment behavior after a domain is selected. This work is local and has not been deployed.
- Optional publication additions: real email/resume, graduation date, detailed hackathon attribution and fuller ownership statements. Existing confirmed identity, internship intent, project URLs and user-reported win are not pending questions.
