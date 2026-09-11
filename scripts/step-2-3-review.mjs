import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const directory = 'artifacts/motion-lab/step-2-3';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];

const viewports = [
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 390, height: 844, name: 'mobile-390' },
  { width: 320, height: 740, name: 'narrow-320' },
];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on('pageerror', (error) => errors.push(vp.name + ': ' + error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(vp.name + ': ' + message.text());
  });
  await page.goto('http://127.0.0.1:4321/motion-lab', { waitUntil: 'networkidle' });
  await page.locator('.lab-stage[data-ready]').waitFor();

  for (const progress of [0, 1]) {
    await page.locator('.lab-runway').evaluate((element, progress) => {
      window.scrollTo(0, progress * (element.clientHeight - window.innerHeight));
    }, progress);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: directory + '/' + vp.name + '-' + Math.round(progress * 100) + '.png',
    });
  }
  await page.close();
}

await browser.close();
await writeFile(directory + '/errors.json', JSON.stringify(errors, null, 2));
console.log('Captures completed for Step 2.3; errors:', errors.length);
