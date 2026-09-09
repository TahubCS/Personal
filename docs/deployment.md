# Vercel production deployment

Production URL: https://tahub-portfolio.vercel.app

Project: tahubcs-projects/tahub-portfolio. GitHub repository: TahubCS/Personal, connected through Vercel during project linking. Production branch: main.

Deployed September 9, 2026 using Vercel CLI 59.14.0. Initial deployment ID: dpl_2V7QsuzWMfZQnP3eDHaniW45iYvf. Vercel reported READY and assigned the production alias. The initial deployment used application commit b16bc4e with the added deployment configuration.

Vercel's initial linking step did not detect Astro. vercel.json explicitly selects Astro, runs npm ci and npm run build, and publishes dist/. The remote dependency install reported zero vulnerabilities. No portfolio runtime secrets are required. CLI-generated local account metadata and environment files remain ignored. .vercelignore excludes local reports, documentation and generated files from CLI uploads.

## Executed production verification

- `vercel inspect`: production READY.
- `node scripts/review-pages.mjs deployed` with REVIEW_URL set to production: all four main routes at 390x844 and 1440x900 returned HTTP 200, with zero page errors, horizontal overflow or Axe WCAG A/AA findings. Captures saved under artifacts/deployed-*.png; desktop homepage visually reviewed.
- Live Edge smoke test: trace hydration, manual navigation, invalid-key and empty-result scenarios passed. No-JavaScript static transcript contained all five stages. Unknown route returned HTTP 404 and the custom recovery page.
- `vercel logs --level error --since 1h --limit 20`: no logs found. This static site has no application server functions; no continuous monitoring or drain configuration was added.

Local performance measurements in handoff.md are not reclassified as deployed performance measurements. Previously listed screen-reader and physical-device release checks remain outstanding.
