# Portfolio implementation handoff

Milestones A–F are implemented. Open the running [production preview](http://127.0.0.1:4322/). This is a local build, not a public deployment. Source uses consistent two-space formatting, descriptive component names and a separate trace state machine.

## Architecture

Astro produces the homepage, three source-linked case studies and a 404 page as static HTML. Only Context Compiler uses React, hydrated with client:visible. This keeps identity, work and connection links immediately available while deferring the interactive renderer. TraceTranscript.astro is rendered directly by index.astro as a static sibling of the island. JavaScript is not required to read the complete request explanation.

The trace uses curated local fixtures and a tested reducer. It has successful retrieval, invalid-key and empty-result scenarios, manual stage selection, reset, play/pause, and offscreen/hidden pause. It never contacts the project services or exposes credentials. Reduced motion requires manual stepping. Supo and CrowsNest use original static semantic architecture illustrations.

Typed metadata and schema-validated Markdown keep project summaries, contribution evidence and long-form case studies separate from presentation. Fonts are self-hosted Latin WOFF2 subsets with their licenses. No runtime secrets, backend, external font requests or fabricated product images are required. Native details navigation remains usable without JavaScript. The homepage has 439 narrative words under the recorded counting method.

## Final project structure

```text
personal/
├── .gitignore
├── .prettierrc.json
├── README.md
├── astro.config.mjs
├── eslint.config.js
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── docs/
│   ├── design-spec.md
│   ├── project-evidence.md
│   ├── verification.md
│   └── handoff.md
├── public/
│   ├── favicon.svg
│   └── fonts/
│       ├── space-grotesk-latin.woff2
│       ├── ibm-plex-mono-latin-regular.woff2
│       └── licenses/ (two font licenses)
├── src/
│   ├── content.config.ts
│   ├── data/
│   │   ├── profile.ts
│   │   └── projects.ts
│   ├── content/projects/
│   │   ├── context-compiler.md
│   │   ├── supo.md
│   │   └── crowsnest.md
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── CaseStudyLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── work/[slug].astro
│   ├── components/
│   │   ├── SiteHeader.astro
│   │   ├── Hero.astro
│   │   ├── ProjectIndex.astro
│   │   ├── ProjectStory.astro
│   │   ├── ArchitectureFigure.astro
│   │   └── ContactFooter.astro
│   ├── features/context-trace/
│   │   ├── ContextTrace.tsx
│   │   ├── TraceTranscript.astro
│   │   ├── trace-data.ts
│   │   ├── trace-state.ts
│   │   └── trace-state.test.ts
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       └── trace.css
├── tests/browser/
│   ├── navigation.spec.ts
│   ├── trace.spec.ts
│   └── accessibility.spec.ts
├── scripts/
│   ├── capture.mjs
│   ├── capture-details.mjs
│   ├── debug.mjs
│   ├── diagnose-layout.mjs
│   ├── review-pages.mjs
│   └── performance.mjs
├── artifacts/ (generated screenshots and reports; ignored)
└── dist/ (generated static output; ignored)
```

## Commands and outcomes

| Executed command                 | Result                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------ |
| npm install                      | Dependencies installed; initial audit reported zero vulnerabilities            |
| npm run dev                      | Local development server used for A–D verification                             |
| npm run check                    | Final: 32 files, zero errors/warnings/hints                                    |
| npm run build                    | Final: five static outputs, 1.38 seconds                                       |
| npm run preview -- --port 4322   | Production preview running for E–F checks                                      |
| npm run lint                     | Passed, exit 0                                                                 |
| npm run test                     | Four state-machine tests passed                                                |
| npm run test:browser             | 22 passed across Edge and Chrome, 8.9 seconds                                  |
| node scripts/review-pages.mjs F  | REVIEW_URL=http://127.0.0.1:4322; all 20 route/viewport audits passed          |
| node scripts/capture-details.mjs | Final captures saved; narrative count 439                                      |
| node scripts/performance.mjs     | Three completed Lighthouse runs; exit 0 with temporary-profile cleanup warning |

Prettier formatted source, tests, scripts, configuration and documentation. Verification history, corrected failures and limitations are recorded in verification.md. Browser test output included harmless NO_COLOR/FORCE_COLOR environment warnings. Lighthouse's Windows temporary-directory cleanup warning does not invalidate the saved reports; no cleanup success is claimed.

## Browser viewport results

| Viewport   | Homepage | Context Compiler | Supo | CrowsNest |
| ---------- | -------- | ---------------- | ---- | --------- |
| 320 × 844  | Pass     | Pass             | Pass | Pass      |
| 390 × 844  | Pass     | Pass             | Pass | Pass      |
| 768 × 900  | Pass     | Pass             | Pass | Pass      |
| 1024 × 900 | Pass     | Pass             | Pass | Pass      |
| 1440 × 900 | Pass     | Pass             | Pass | Pass      |

These 20 Edge audits checked HTTP status, page exceptions, horizontal overflow and Axe WCAG A/AA findings. All returned 200 with zero findings in those checks. Separate Chrome/Edge tests exercised navigation, trace states, keyboard access, no-JavaScript fallback, reduced motion and forced colors. These are automated results, not complete WCAG certification.

## Performance

Three cold-navigation Lighthouse runs against the local production preview, simulated mobile, 150 ms RTT, approximately 1.6 Mbps and 4× CPU slowdown. Every run scored 100 in performance, accessibility, best practices and SEO. LCP was 1208.50 / 1210.62 / 1207.75 ms, with a 1208.50 ms median. CLS and TBT were zero. No field INP was measured.

Budget sizes below use decimal KB. Calculated gzip sizes describe assets, not a promise about a future host's encoding.

| Measurement                                    | Actual       | Target             | Assessment                                                                  |
| ---------------------------------------------- | ------------ | ------------------ | --------------------------------------------------------------------------- |
| Homepage HTML, calculated gzip                 | 7.87 KB      | 60 KB              | Within target                                                               |
| All built CSS, calculated gzip                 | 3.66 KB      | 30 KB              | Within target                                                               |
| External JS during initial Lighthouse viewport | 0 KB         | 20 KB initial JS   | No external script requests; inline bootstrap/menu code is included in HTML |
| All built JS, calculated gzip                  | 62.88 KB     | 120 KB hydrated JS | Within target; includes React renderer                                      |
| Both WOFF2 files, raw                          | 37.00 KB     | 160 KB             | Within target                                                               |
| Initial measured transfer                      | 50.54 KB     | 650 KB             | Within target; before trace hydration                                       |
| LCP median                                     | 1.21 seconds | 2.5 seconds        | Within lab target                                                           |
| CLS                                            | 0            | 0.1                | Within lab target                                                           |
| INP                                            | Not measured | 200 ms             | Requires field or dedicated interaction measurement                         |

No measured budget deviation required a usability compromise. The deferred React cost remains real and is reported separately from initial transfer. See artifacts/performance.json and lighthouse-mobile-1.html through lighthouse-mobile-3.html for raw inventory and reports.

## Screenshots

These are actual captures of the implemented portfolio, not mock product screenshots. Full-page captures for each route and width are in artifacts/F-{home,context-compiler,supo,crowsnest}-{width}.png. Additional trace scenario and mobile captures are in artifacts/final-*.png.

Homepage, desktop:

![Homepage desktop](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/final-hero-1440.png>)

Homepage, mobile:

![Homepage mobile](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/final-hero-390.png>)

Context Compiler:

![Context Compiler case study](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/final-context-compiler-1440.png>)

Supo:

![Supo case study](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/final-supo-1440.png>)

CrowsNest:

![CrowsNest case study](<C:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/final-crowsnest-1440.png>)

## Remaining release work

NVDA, VoiceOver, physical-device Safari, WebKit, Firefox, real browser zoom and touch-device checks remain outstanding. Stock Firefox was installed but could not be automated through Playwright's required protocol. Field INP, real deployed-network measurements and a recruiter comprehension test are also unperformed.

GitHub is the real connection destination. Email/resume have not been supplied in the available publication details and were omitted. The name, internship intent, project URLs and user-reported CrowsNest hackathon win are confirmed. Specific award attribution, graduation date and fuller ownership statements were not invented. Choose a production domain before adding canonical/social URLs and publishing.
