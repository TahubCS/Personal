# Motion redesign: question to contribution

Audit completed September 10, 2026 before application edits. Applicable instructions: Downloads/AGENTS.md (strict TypeScript, scoped modules, behavior tests, measured performance). Existing Astro static routes, source-backed copy, local fonts and React island remain.

## Live reference observations

- Davide Cattaneo: a large foreground system motif dominates the dark opening; scrolling introduces a broad light surface and spacious reading composition. Adapt scale continuity and the decisive change of surface, not its green wireframe object or signature motion.
- Checkpoint Research: continuous vertical/horizontal rules align large typography with small technical annotations; sections alternate dense and spacious compositions. Adapt structural alignment and pacing, not its branding, copy, graphics or counters.
- Inherited: oversized type is composed through cropped foreground portraits; adjacent views retain common color and image layers. Forward/reverse scroll changes the crop while preserving visual continuity. Adapt controlled overlap/cropping, not portraits, branding, letter animation or audio.

All three were opened and scrolled in a live in-app browser. These are observed design principles, not source-code analysis. Portfolio baseline: ten desktop/mobile captures in artifacts/motion/before-*.png, covering hero, trace, stories, contact and Context Compiler opening.

## Existing constraints and findings

The opening is clear but the small framed diagram never connects to the next section. The trace has a deterministic timer/manual reducer and no scroll ownership. Its tall stage controls delay the explanation on mobile. All projects repeat one 2×2 diagram. Case-study right sides are unused. Line-break text needs explicit whitespace and accessible-name regression coverage. There are no motion libraries. Static content and one client:visible React island are sound foundations. Previous 3-run local Lighthouse median LCP: 1208.50 ms; all JS gzip: 62,883 bytes. These historical measurements are preserved in artifacts/motion/performance-before.json.

## Implementation storyboard and gates

1. Hero: immediate identity/introduction; oversized layered repository artifact and one amber query. Native scroll separates the layers and extends an amber route toward the trace. Verify opening and handoff at 390/768/1440, reverse and fast scroll, no-JS and reduced motion.
2. Trace: CSS sticky composition on sufficiently wide/tall screens with a bounded runway. Query → MCP envelope → repository scope → illustrative vector → selected file fragments → context pack. A single reducer owns manual/timed/scroll state. Manual actions suspend scroll ownership; explicit Follow scroll reattaches at current progress. No production requests. Tablet/mobile are unpinned with a vertical text-first stage sequence. Reduced motion has all stage explanations plus manual controls.
3. Output/paper: a paper context sheet opens from an inset panel to the reading surface through a geometric reveal. Text stays fully visible; only decorative layers are masked. Reverse and rapid scroll derive the same geometry from position.
4. Projects: Context uses stacked source fragments and an assembled pack; Supo uses a conversation spine crossing the AI/human boundary; CrowsNest uses source sheets feeding a shared collection. Each remains an honest architecture illustration, not a screenshot. Static stories stay intact.
5. Case studies/closing: put the relevant artifact beside the case title; continue its edge into the paper surface. Conclude with the request motif, contribution and real GitHub destination. Email, resume and LinkedIn are release blockers for the requested four-destination contact set, not fabricated links.

## Motion architecture

No new runtime dependency. Native CSS sticky replaces imperative pinning. A scoped requestAnimationFrame controller subscribes to passive scroll, resize, visibility, IntersectionObserver and ResizeObserver; it writes transform/reveal progress only for active scenes and cleans up on page exit. Fonts trigger fresh measurements. No smoothing, wheel interception, global state store or continuous idle render loop. React owns trace state; Astro owns content and static transcript sibling. Declarative CSS handles reduced-motion/no-JS fallbacks.

## Final gate

Format, lint, Astro check, reducer tests, Chrome/Edge browser tests, production build, Axe, layout shift and animation main-thread measurements; compare gzip growth and loading metrics. Capture all major states at 390×844, 768×1024 and 1440×900; check 320px reflow and enlarged text. Screen readers, physical Safari and unavailable engines remain manual. Do not push or deploy: main is connected to automatic Vercel production builds.

## Section gates in progress

- Hero: 38-file Astro check passed after stopping the shared-cache dev process. Six viewport/motion combinations passed scroll/anchor/back/error/overflow checks. Desktop/tablet/mobile screenshots reviewed. A 4px mobile rotated-sheet overflow was corrected with a deliberate aperture crop.
- Trace: six reducer tests passed, including manual ownership and reverse scroll. Six viewport/motion checks passed. Direct desktop stage captures exposed a CSS sticky constraint caused by padding; replaced it with an in-flow spacer. All six stages then advanced and stayed visible at the same sticky position. Query, vector and final pack images visually reviewed. No-JS fallback moved to a small external CSS file after the Astro ESLint parser rejected nested style content in head/noscript. Lint passed after that fix.
