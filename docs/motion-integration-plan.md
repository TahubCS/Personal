# System core: staged portfolio integration plan

Status: plan only. The isolated motion prototype is visually approved. Homepage integration has not been approved or implemented.

## Objective

Integrate the approved system core into the portfolio while preserving immediate recruiter clarity: who Muhammad Tahub Khatri is, what he builds, his internship availability, and how to reach the available contact destinations.

The core represents curiosity about what happens underneath software. It is a visual metaphor, not a literal architecture diagram of Context Compiler. The project trace supplies the concrete, evidence-backed example.

## Working agreement

- Implement one milestone at a time. Stop after presenting its rendered result and verification evidence.
- Wait for explicit visual approval before starting the next milestone. Passing tests does not constitute visual approval.
- If a milestone needs revision, resolve it before proceeding. Do not accumulate visual defects.
- Preserve `/motion-lab` as the approved reference. Keep integration changes separate from its geometry, materials, and pose model wherever practical.
- Preserve Astro, native scrolling, semantic HTML, accurate project content, case-study routes, trace scenarios and controls, and existing accessibility fallbacks.
- Retain the existing palette and typography. Do not introduce a new animation library, scroll smoothing, or additional decorative effects without a concrete need and discussion.
- Use local previews. Do not push, integrate into production, or deploy without separate authorization.

## Milestone 1 — Establish the homepage composition

Place the assembled object, initially static, beside the existing hero content. This gate evaluates composition before animation.

### Work

- Preserve the name, internship availability, introduction, and important links in the opening experience.
- Replace the existing hero illustration rather than adding a competing visual.
- Use the genuine assembled-object capture for the initial composition; runtime rendering is not required for this gate.
- Design desktop and mobile placements separately.
- Keep the selected-project index easy to reach and preserve its navigation.
- Leave the trace, project stories, and subsequent transitions unchanged during this milestone.

### Verification and handoff

- Inspect the opening viewport at 1440×900, 768×1024, and 390×844; check 320px reflow.
- Check heading readability, contact/project access, image sizing, focus visibility, and layout stability.
- Provide screenshots and a short explanation of composition choices.

**Approval gate:** Does the object strengthen the portfolio without competing with the person's identity?

**Stop here until approved.**

## Milestone 2 — Introduce the opening motion

Connect native scrolling to the approved rotation and layer separation within the approved hero composition.

### Work

- Begin with a readable assembled hero. Do not add a loader or delay the introduction.
- Match the loading image and first live frame.
- Let rotation establish depth before the layers progressively separate.
- Give the exposed assembly a brief readable hold.
- Keep desktop scroll travel compact; determine its exact distance from the integrated viewport rather than copying the full lab runway.
- Use a shorter, intentional mobile sequence with predictable scrolling.
- Preserve a usable static fallback and reduced-motion presentation without prolonged pinning.
- Stop the integrated sequence at the exposed state for this gate; defer the handoff and paper treatment to their own milestones.

### Verification and handoff

- Record desktop and mobile slow openings, midpoint pauses, and reverse traversal.
- Inspect intermediate poses, rapid scrolling, viewport resizing, loading, and reduced motion.
- Check that projects remain quick to reach and that native anchors still work.
- Report console errors and relevant checks actually executed.

**Approval gate:** Does the movement feel substantial without delaying access to the work?

**Stop here until approved.**

## Milestone 3 — Design the handoff to Context Compiler

Make the transition from the abstract object to the real project understandable and visually continuous.

### Proposed sequence

1. The core opens, expressing an interest in understanding systems.
2. The existing project introduction shifts the narrative toward what the portfolio owner builds.
3. The core leaves the composition as the Context Compiler request becomes the focus.
4. The existing trace controls become available in a stable, readable section.

### Work

- First present key static handoff frames for approval within this milestone, before implementing the animated handoff.
- Use shared alignment and restrained connector language for continuity.
- Do not suggest the mechanical layers correspond directly to authentication, embeddings, or retrieval.
- Preserve successful-request, invalid-key, and no-matches scenarios.
- Preserve the existing state model: manual interaction appropriately overrides scroll progress.
- Keep the complete static transcript as an Astro sibling of the React island.
- Avoid adding a second, unrelated interactive flow or hiding controls behind animation.

### Verification and handoff

- Show the hero-to-trace passage in isolation, including reverse scrolling.
- Test manual controls, keyboard use, direct trace anchors, and reduced motion.
- Inspect all three primary viewports and check for overlapping content or layout jumps.

**Approval gate:** Does the transition feel connected, while clearly distinguishing metaphor from actual architecture?

**Stop here until approved.**

## Milestone 4 — Resolve the paper transition and full-page pacing

Create one major dark-to-paper moment rather than retaining two competing reveals.

### Recommended direction

Keep the hero and Context Compiler trace in the dark environment. Enter the warm-paper surface for the project stories. Use the prototype's drawing transformation as a design reference for this moment, without replaying the full core sequence or implying that it is Context Compiler hardware.

The exact role of the core at this boundary remains a design decision for this milestone. Approve static transition compositions before implementing them. Do not automatically relocate or duplicate the object.

### Work

- Reconcile the existing homepage paper portal with the integrated motion.
- Remove redundant transition elements only after the replacement composition is approved.
- Preserve accurate project content, distinct project artifacts, and case-study links.
- Review the complete journey through projects, about, and contact.
- Ensure the core does not become a second long interactive sequence alongside the trace.
- Keep supplied contact destinations clear; do not invent missing links.

### Verification and handoff

- Provide a full homepage recording and key section screenshots at desktop and mobile sizes.
- Inspect tablet composition, reverse and rapid scrolling, anchor navigation, and reduced motion.
- Check sectional pacing and how quickly a recruiter can reach projects and contact information.

**Approval gate:** Does the page feel like one coherent portfolio rather than a motion demo followed by a website?

**Stop here until approved.**

## Milestone 5 — Verify and prepare for release

Perform release preparation only after the integrated composition and pacing are visually approved.

### Work and verification

- Measure the actual production JavaScript cost, loading behavior, layout shift, and main-thread animation work. Do not use the development Three.js download as a production bundle estimate.
- Compare against a saved pre-integration baseline and explain regressions or tradeoffs.
- Verify responsive layout at 1440×900, 768×1024, and 390×844, plus 320px reflow and 200% text zoom.
- Test keyboard navigation, visible focus, skip links, mobile navigation, trace controls, anchors, and browser Back.
- Check reduced motion, JavaScript-disabled content, and graphics-unavailable fallback behavior.
- Verify cleanup of listeners, observers, and renderer resources; confirm expensive work pauses offscreen or when the tab is hidden.
- Run formatting, lint, Astro/TypeScript checks, unit tests, browser tests, available automated accessibility checks, and the production build.
- Inspect browser console output and fix material regressions before presenting the release candidate.
- List physical-device Safari, real touch/GPU behavior, screen readers, and any unavailable browser checks as outstanding when they have not actually been executed.

### Handoff

- Working local preview.
- Final desktop/mobile recordings and major-section screenshots.
- Commands run, actual results, performance measurements, and important architectural decisions.
- Remaining limitations and manual release checks.

**Approval gate:** Is the complete integrated portfolio visually and functionally ready for a separately authorized release?

**Stop here. Deployment requires a separate instruction.**

## Progress

- [x] Milestone 1: static hero composition visually approved.
- [x] Milestone 2: opening motion visually approved.
- [x] Milestone 3: Context Compiler handoff visually approved.
- [x] Milestone 4: paper transition and full-page pacing visually approved.
- [x] Milestone 5: release candidate reviewed with verification evidence.

Record the user's approval and any accepted tradeoffs as each gate is completed. Do not infer approval from silence, tool success, or approval of an earlier milestone.

## References

- [Current prototype documentation](motion-lab.md)
- [Final isolated prototype review](motion-lab-final-review.md)
- [Matching loading poster](motion-lab-loading.md)
- [Project evidence](project-evidence.md)
- [Maintained verification and capture tools](../scripts/README.md)

## Milestone 1 review — static hero composition

Status: implemented locally; awaiting explicit visual approval. Milestone 2 has not started.

The old hero illustration is replaced with `HeroCore.astro`, using an unchanged copy of the approved 84,600-byte assembled capture under `src/assets/system-core.webp`. The independent copy keeps homepage asset ownership separate from the development-only reference lab. No renderer or animation dependency is imported by the new component. Its intrinsic dimensions reserve space while loading.

Desktop places the core to the right of the existing identity and actions, with the project index below both. Mobile orders identity and actions first, then the 280px-tall object, then selected projects. The existing work CTA jumps directly to those links. At 320px, content naturally takes more than one viewport; there is no horizontal clipping. Existing header wrapping at that width remains outside this milestone.

No accurate hero copy, trace logic, project stories, case-study routes, downstream transitions or lab source was changed. No deployment was performed.

Executed verification:

- Edge screenshots at 1440×900, 768×1024, 390×844 and 320×740, plus full-hero captures; visually inspected.
- Four hero-scoped axe scans: zero violations. Zero page exceptions recorded.
- Project CTA anchor executed at all four widths; the index reaches the viewport.
- JavaScript-disabled mobile check: the object remains visible.
- Formatting applied to both changed components; ESLint passed; Astro diagnostics: zero errors, warnings and hints.
- Production build passed with five pages. Full browser regression suite and physical-device checks were not run for this static composition gate.

Evidence: `artifacts/integration-hero/after-{width}.png`, `hero-{width}.png`, and `results.json`. The first screenshot batch reflected stale development styles on mobile; fresh captures and computed grid inspection confirmed the final identity → object → index ordering.

Approval requested: does this opening composition strengthen the portfolio without competing with the identity? Do not proceed until the user approves or requests revisions.

## Milestone 2 review � opening motion

Status: implemented locally; awaiting visual approval. Milestones 3 and 4 have not started. No deployment or Git push was performed.

A homepage-specific renderer adapter in `src/features/hero-core/scene.ts` reuses the lab geometry, materials and deterministic pose without changing any lab source. The homepage maps native scroll to lab progress 0�0.6, so the exposed pose holds over the final portion and never reaches the paper phase. Desktop/tablet travel is capped at 540px; mobile is 42svh capped at 360px (354px at 390�844 and 311px at 320�740). The image and intro retain their initial composition; the project index follows the opening and remains directly reachable by the work CTA. Tablet's exposed object is smaller because it shares the viewport with the introduction.

The renderer is dynamically imported only when motion is allowed. Reduced motion shows the static capture and removes extra scroll travel. Geometry, material, observer, event and graphics resources are disposed on teardown. Rendering is event-driven and pauses offscreen or with the tab hidden. No idle animation, scroll interception, new dependency, React island, trace handoff or paper transition was added.

Verification executed:

- `npm test`: 16 passed (6 trace, 8 lab, 2 opening-range/hold tests).
- ESLint, formatting and final Astro diagnostics passed; zero type errors, warnings or hints.
- Production build passed, five pages. It reports the expected warning for a renderer chunk exceeding 500 KB.
- `npm run test:browser -- --workers=2`: 36 production-preview tests passed in Edge and Chrome, covering trace behavior, navigation, reflow, enlarged text, keyboard access, reduced motion and existing transitions.
- Custom opening review passed at 1440�900, 768�1024, 390�844 and 320�740. Midpoint pause and reverse captures are pixel-identical when captured without automatic scrolling. Four hero axe scans found no violations; no application console/page errors were recorded. Work anchors, Back navigation, JavaScript-disabled and WebGL-unavailable fallbacks were exercised.
- Reduced-motion toggling disposes the live canvas and remounts exactly one canvas when re-enabled.
- A final production check confirmed the 320px exposed stage clears the wrapped header at a 140px offset. This narrow-width adjustment does not change the 390px or desktop recordings.
- The agent-browser CLI could not launch its browser in this environment. Playwright with installed Edge/Chrome provided the executed browser verification instead.

The first sticky layout used padding that did not extend the sticky containing area; it was corrected to a sized grid row. Astro served stale compiled CSS until restarted. The initial mobile screenshot-equality failure came from element screenshots scrolling the page upward by 10px on each capture; non-scrolling clip captures resolved it without weakening the equality assertion. A hot reload interrupted one browser run; the final run completed against unchanged source.

Production JavaScript inventory grew from 204,842 to 787,940 bytes, an increase of 583,098 bytes. The new renderer chunk is 581,296 bytes raw / 145,282 bytes gzip; its loader is 1,802 bytes raw / 950 bytes gzip. These gzip sizes were computed locally, not measured network transfer. The roughly 146 KB compressed addition is a release tradeoff; physical-device frame timing and final loading budgets still need the milestone 5 assessment.

Evidence: `artifacts/integration-opening/opening-1440.webm`, `opening-390.webm`, `verified-{width}.png`, `reduced-{width}.png`, `verification.json`, and the before/after bundle inventories. The recordings include the opening, exposed pause, reverse traversal and verification interactions. Screenshot frames from the recordings were inspected.

Remaining visual tradeoffs: the object becomes smaller as its separated parts fit the hero column, particularly on tablet; fine mobile internals remain dense. Physical-device Safari, GPU diversity and screen readers remain manual release checks. Passing automated checks does not establish visual approval or full accessibility compliance.

Approval requested: does the integrated opening feel substantial without delaying access to the work? Stop here until approved.
