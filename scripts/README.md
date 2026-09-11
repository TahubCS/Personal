# Motion-lab tools

Run commands from the repository root. Browser tools require `npm run dev` at http://127.0.0.1:4321 and installed Edge; the full verification also uses Chrome. Evidence is written beneath `artifacts/motion-lab/`.

| Task                  | Command                                 | Purpose                                                                    |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------- |
| All unit tests        | `npm test`                              | Trace tests followed by motion tests; fails when either suite fails        |
| Motion unit tests     | `npm run test:lab`                      | Pose, opening visibility and geometry regressions                          |
| Motion browser checks | `npm run test:lab:browser`              | Scroll, anchors, reduced motion, accessibility and disabled-WebGL fallback |
| Five progress frames  | `npm run capture:lab`                   | Desktop and mobile captures                                                |
| Opening recording     | `npm run record:lab`                    | Slow opening, exposed pause and reverse traversal                          |
| Performance sample    | `node scripts/lab-performance.mjs`      | Local browser measurements, not production guarantees                      |
| Production isolation  | `node scripts/lab-production-check.mjs` | Compare a built site against a previously saved baseline                   |

`lab-appearance-review.mjs` and `lab-opening-review.mjs` remain available for matched before/after reviews; each takes `before` or `after`. Preserve previous evidence before recapturing the same filenames. The production comparison requires its saved baseline; do not regenerate that baseline to hide a regression.

`archive/motion-lab/` holds the one-off Gemini drawing iterations, comparison sheets and duplicate mobile recorder. They are retained for provenance, not maintained commands. They assume the repository root as their working directory and often require historical artifacts. None are called by npm scripts. Use the maintained tools above for current work. Portfolio-wide tools remain unchanged.
