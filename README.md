# Muhammad Tahub Khatri — Systems Observatory

An Astro portfolio with one progressively hydrated React trace. All case studies and the trace transcript render as static HTML. Supo and CrowsNest use static, original architecture figures.

## Run

- `npm ci`
- `npm run dev` — local development on port 4321
- `npm run check` — Astro/TypeScript diagnostics
- `npm run lint` — ESLint
- `npm run test` — trace state-machine unit tests
- `npm run build` — static output in dist/
- `npm run preview -- --port 4322` — production verification server
- `npm run test:browser` — Edge and Chrome regression tests against port 4322
- `node scripts/review-pages.mjs F` — set REVIEW_URL to the production origin first
- `node scripts/performance.mjs` — three simulated-mobile Lighthouse runs using installed Edge
- `node scripts/capture-details.mjs` — final screenshot collection

On this environment Astro starts managed background servers. Use `npx astro dev stop` and `npx astro preview stop` when finished. Restart the development server with NODE_ENV=development if running a production build contaminated the dev JSX runtime cache.

## Content

Identity lives in src/data/profile.ts. Project metadata lives in src/data/projects.ts; source-linked case studies live in src/content/projects/. Frontmatter is schema-validated. Do not replace missing publication details with fake links. Email and resume are intentionally absent until supplied.

The trace is an illustrative fixture. It makes no calls to the project services, GitHub, or a model provider. Its reducer is separate from rendering; the Astro transcript is a static sibling of the React island.

## Verification

See docs/verification.md for executed checks and remaining manual release checks. Machine reports and screenshots are generated under artifacts/ and are not committed. The fonts are local Latin subsets with licenses in public/fonts/licenses/.

The build can be hosted as static files. A production domain and deployment were not requested; configure the canonical domain and social preview URL when publishing. No secrets or runtime environment variables are required for the portfolio itself.
