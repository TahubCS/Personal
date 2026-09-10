import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge' });
const results = [];
for (const reducedMotion of ['no-preference', 'reduce']) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion,
  });
  await page.goto('http://127.0.0.1:4322/', { waitUntil: 'networkidle' });
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  await page.locator('#trace').scrollIntoViewIfNeeded();
  await page
    .locator('.trace')
    .getByRole('button', { name: 'Trace a request' })
    .waitFor();
  const before = await session.send('Performance.getMetrics');
  const samples = await page.evaluate(async () => {
    let shift = 0;
    const shiftSources = [];
    const longFrames = [];
    const observers = [];
    if (
      window.PerformanceObserver.supportedEntryTypes.includes('layout-shift')
    ) {
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) {
            shift += entry.value;
            shiftSources.push({
              value: entry.value,
              sources: entry.sources.map((source) => ({
                element: source.node?.className,
                previous: source.previousRect,
                current: source.currentRect,
              })),
            });
          }
      });
      observer.observe({ type: 'layout-shift' });
      observers.push(observer);
    }
    if (
      window.PerformanceObserver.supportedEntryTypes.includes(
        'long-animation-frame',
      )
    ) {
      const observer = new window.PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          longFrames.push({
            duration: entry.duration,
            blockingDuration: entry.blockingDuration,
          });
      });
      observer.observe({ type: 'long-animation-frame' });
      observers.push(observer);
    }
    const frameDurations = [];
    const max = document.documentElement.scrollHeight - window.innerHeight;
    let previous = window.performance.now();
    const started = previous;
    for (let frame = 0; frame < 240; frame++) {
      const progress = frame < 120 ? frame / 119 : (239 - frame) / 119;
      window.scrollTo(0, max * progress);
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const now = window.performance.now();
      frameDurations.push(now - previous);
      previous = now;
    }
    observers.forEach((observer) => observer.disconnect());
    frameDurations.sort((a, b) => a - b);
    return {
      durationMs: window.performance.now() - started,
      frames: frameDurations.length,
      medianFrameMs: frameDurations[120],
      p95FrameMs: frameDurations[228],
      scrollLayoutShift: shift,
      shiftSources,
      longFrames,
      longFrameSupported:
        window.PerformanceObserver.supportedEntryTypes.includes(
          'long-animation-frame',
        ),
    };
  });
  const after = await session.send('Performance.getMetrics');
  const delta = (name) =>
    (after.metrics.find((m) => m.name === name)?.value ?? 0) -
    (before.metrics.find((m) => m.name === name)?.value ?? 0);
  results.push({
    reducedMotion,
    ...samples,
    taskDurationMs: delta('TaskDuration') * 1000,
    scriptDurationMs: delta('ScriptDuration') * 1000,
    layoutDurationMs: delta('LayoutDuration') * 1000,
  });
  await page.close();
}
await browser.close();
await writeFile(
  'artifacts/motion/animation-performance.json',
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
