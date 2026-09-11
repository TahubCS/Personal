# Matching loading poster

The glowing SVG is replaced by an unretouched, transparent WebP capture of the actual assembled WebGL object (542 × 580, 84,600 bytes). The source asset lives inside the development-only lab. CSS matches the camera framing limits at wide and narrow viewports. The canvas stays hidden until scene.ts renders its first frame and sets data-ready; the poster is removed in that same state change. No fade, timer, rendering dependency, or motion change was added.

Executed: delayed cold-context browser loads at 1440×900, 768×1024, and 390×844, holding page scripts for at least 1.5 seconds after poster decoding. Confirmed poster visibility before initialization, canvas visibility afterwards, and no page errors. Paired captures were visually inspected. The first harness failed because its script URL filter did not intercept initialization; the corrected script-resource filter passed all three configurations.

No-JavaScript fallback and reduced-motion label bounds passed at 320, 390, 768, and 1440 pixels. ESLint and formatting passed. Astro diagnostics returned zero errors, zero warnings and one unused-import hint in the temporary capture harness; that import was subsequently removed.

Evidence: artifacts/motion-lab/loading/{width}-before.png and {width}-after.png, results.json, and verify.mjs. Fine edge sampling differs between a resized raster and live WebGL; loading at an already-scrolled location still hands over to the correct current pose. No claim of physical-device testing or production deployment.
