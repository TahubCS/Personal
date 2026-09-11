import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const directory = 'artifacts/motion-lab/step-2-8';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const errors = [];
const viewports = [
  { width: 1440, height: 900, name: 'desktop-1440' },
  { width: 768, height: 1024, name: 'tablet-768' },
  { width: 390, height: 844, name: 'mobile-390' },
  { width: 320, height: 740, name: 'narrow-320' },
];

const contrastMeasurements = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on('pageerror', (error) => errors.push(vp.name + ': ' + error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(vp.name + ': ' + message.text());
  });

  await page.goto('http://127.0.0.1:4321/motion-lab', { waitUntil: 'networkidle' });
  await page.locator('.lab-stage[data-ready]').waitFor();

  // Scroll through transition points where wavefront cuts text
  for (const progress of [0.65, 0.68, 0.70, 0.72, 0.75, 0.80]) {
    await page.locator('.lab-runway').evaluate((element, p) => {
      window.scrollTo(0, p * (element.clientHeight - window.innerHeight));
    }, progress);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${directory}/${vp.name}-${Math.round(progress * 100)}.png`,
    });
  }

  // Measure text element computed styles and bounds
  const textAudit = await page.evaluate(() => {
    const header = document.querySelector('.lab-header');
    const intro = document.querySelector('.lab-intro');
    const h1 = document.querySelector('.lab-intro h1');
    const caption = document.querySelector('.lab-caption');

    return {
      h1Font: window.getComputedStyle(h1).fontFamily,
      h1Size: window.getComputedStyle(h1).fontSize,
      introBlend: window.getComputedStyle(intro).mixBlendMode,
      headerBlend: window.getComputedStyle(header).mixBlendMode,
      captionBlend: window.getComputedStyle(caption).mixBlendMode,
      h1BoundingBox: h1.getBoundingClientRect(),
    };
  });

  contrastMeasurements.push({
    viewport: vp.name,
    ...textAudit,
  });

  await page.close();
}

await browser.close();
await writeFile(`${directory}/errors.json`, JSON.stringify(errors, null, 2));
await writeFile(`${directory}/text-audit.json`, JSON.stringify(contrastMeasurements, null, 2));
console.log('Sub-step 2.8 typography captures completed; errors:', errors.length);
