import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const directory = 'artifacts/motion-lab/step-2-7';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];
const verification = {
  hold3DDiffs: {},
  holdDrawingDiffs: {},
  reverseEquality: {},
};

for (const viewport of [
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 390, height: 844, name: 'mobile-390' },
]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  page.on('pageerror', (error) => errors.push(viewport.name + ': ' + error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(viewport.name + ': ' + message.text());
  });
  await page.goto('http://127.0.0.1:4321/motion-lab', { waitUntil: 'networkidle' });
  await page.locator('.lab-stage[data-ready]').waitFor();

  const scrollTo = async (progress) => {
    await page.locator('.lab-runway').evaluate((element, p) => {
      window.scrollTo(0, p * (element.clientHeight - window.innerHeight));
    }, progress);
    await page.waitForTimeout(300);
  };

  // 1. Forward sweep captures
  const forwardProgresses = [0.52, 0.56, 0.60, 0.61, 0.74, 0.88, 0.94, 1.00];
  const forwardBuffers = {};

  for (const p of forwardProgresses) {
    await scrollTo(p);
    const buf = await page.screenshot({
      path: `${directory}/${viewport.name}-fwd-${Math.round(p * 100)}.png`,
    });
    forwardBuffers[p] = buf;
  }

  // 2. Reverse sweep: scroll to 1.0, then back down through key sample points
  await scrollTo(1.0);
  await page.waitForTimeout(100);

  const reverseProgresses = [1.00, 0.94, 0.88, 0.74, 0.61, 0.60, 0.56, 0.52, 0.00];
  const reverseBuffers = {};

  for (const p of reverseProgresses) {
    await scrollTo(p);
    const buf = await page.screenshot({
      path: `${directory}/${viewport.name}-rev-${Math.round(p * 100)}.png`,
    });
    reverseBuffers[p] = buf;
  }

  // Measure reverse equality
  for (const p of [0.52, 0.60, 0.74, 0.88, 1.00]) {
    const fwd = forwardBuffers[p];
    const rev = reverseBuffers[p];
    const match = fwd && rev && fwd.equals(rev);
    verification.reverseEquality[`${viewport.name}-${Math.round(p * 100)}`] = {
      match,
      fwdSize: fwd?.length,
      revSize: rev?.length,
    };
  }

  await page.close();
}

await browser.close();
await writeFile(`${directory}/errors.json`, JSON.stringify(errors, null, 2));
await writeFile(`${directory}/verification.json`, JSON.stringify(verification, null, 2));
console.log('Captures and reversibility checks completed for Step 2.7; errors:', errors.length);

