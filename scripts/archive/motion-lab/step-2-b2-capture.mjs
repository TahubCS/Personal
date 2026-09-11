import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const directory = 'artifacts/motion-lab/step-2-b2';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];

for (const viewport of [
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 390, height: 844, name: 'mobile-390' },
]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  page.on('pageerror', (error) => errors.push(viewport.name + ': ' + error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(viewport.name + ': ' + message.text());
  });

  await page.goto('http://127.0.0.1:4321/motion-lab', { waitUntil: 'networkidle' });
  await page.locator('.lab-stage[data-ready]').waitFor();

  // Scroll to 100% technical drawing hold
  await page.locator('.lab-runway').evaluate((element) => {
    window.scrollTo(0, element.clientHeight - window.innerHeight);
  });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${directory}/${viewport.name}-100.png`,
  });

  await page.close();
}

await browser.close();
await writeFile(`${directory}/errors.json`, JSON.stringify(errors, null, 2));
console.log('Captures completed for Step 2.B2; errors:', errors.length);
