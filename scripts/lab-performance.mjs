import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.performance.mark('lab-navigation');
});
await page.goto('http://127.0.0.1:4321/motion-lab', {
  waitUntil: 'networkidle',
});
await page.locator('.lab-stage[data-ready]').waitFor();
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
const before = await cdp.send('Performance.getMetrics');
const frameTiming = await page.evaluate(async () => {
  const section = document.querySelector('.lab-runway');
  if (!(section instanceof window.HTMLElement))
    throw new Error('Missing motion runway');
  const distance = section.clientHeight - window.innerHeight;
  const intervals = [];
  let previous = window.performance.now();
  for (let step = 0; step <= 240; step++) {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    const now = window.performance.now();
    intervals.push(now - previous);
    previous = now;
    const progress = step <= 120 ? step / 120 : (240 - step) / 120;
    window.scrollTo(0, progress * distance);
  }
  const sorted = intervals.slice(1).sort((a, b) => a - b);
  return {
    frames: intervals.length,
    medianIntervalMs: sorted[Math.floor(sorted.length * 0.5)],
    p95IntervalMs: sorted[Math.floor(sorted.length * 0.95)],
    over50ms: sorted.filter((time) => time > 50).length,
  };
});
const after = await cdp.send('Performance.getMetrics');
const timings = {};
for (const name of [
  'ScriptDuration',
  'TaskDuration',
  'LayoutDuration',
  'RecalcStyleDuration',
]) {
  timings[`${name}Ms`] =
    ((after.metrics.find((m) => m.name === name)?.value ?? 0) -
      (before.metrics.find((m) => m.name === name)?.value ?? 0)) *
    1000;
}
const resources = await page.evaluate(() =>
  window.performance
    .getEntriesByType('resource')
    .filter((e) => e instanceof window.PerformanceResourceTiming)
    .map((e) => ({
      name: e.name.split('/').slice(-1)[0],
      bytes: e.decodedBodySize,
    }))
    .filter((e) => e.bytes > 0),
);
const result = {
  environment:
    'Unthrottled desktop Edge, development server, 1440×900; not a production Lighthouse or physical GPU benchmark',
  frameTiming,
  timings,
  resources,
};
await writeFile(
  'artifacts/motion-lab/performance.json',
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
await browser.close();
