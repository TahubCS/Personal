import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('artifacts/motion-lab', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:4321/motion-lab', {
    waitUntil: 'networkidle',
  });
  await page.locator('.lab-stage[data-ready]').waitFor();
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    await page.locator('.lab-runway').evaluate((element, progress) => {
      window.scrollTo(
        0,
        progress * (element.clientHeight - window.innerHeight),
      );
    }, progress);
    await page.waitForTimeout(160);
    await page.screenshot({
      path: `artifacts/motion-lab/frame-${viewport.width}-${progress * 100}.png`,
    });
  }
  await page.close();
}
await writeFile(
  'artifacts/motion-lab/capture-errors.json',
  JSON.stringify(errors, null, 2),
);
console.log({ errors });
await browser.close();
