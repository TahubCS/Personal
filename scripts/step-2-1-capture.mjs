import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const directory = 'c:/Users/muhammad tahub/Downloads/Projects/personal/artifacts/motion-lab/step-2-1';
await mkdir(directory, { recursive: true });
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

  for (const progress of [0, 1]) {
    await page.locator('.lab-runway').evaluate((element, progress) => {
      window.scrollTo(
        0,
        progress * (element.clientHeight - window.innerHeight),
      );
    }, progress);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${directory}/${viewport.width}-${Math.round(progress * 100)}.png`,
    });
  }
  await page.close();
}

await browser.close();
await writeFile(`${directory}/errors.json`, JSON.stringify(errors, null, 2));
console.log('Captures completed for Sub-step 2.1; errors:', errors.length);
