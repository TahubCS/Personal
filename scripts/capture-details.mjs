import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge' });
const metrics = {};
for (const width of [320, 390, 768, 1024, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `artifacts/final-hero-${width}.png` });
  if (width === 1440) {
    metrics.homepageNarrativeWords = await page.evaluate(() => {
      const selectors = [
        '.intro',
        '.availability',
        '#trace > p:not(.eyebrow)',
        '#stories > div > p:not(.eyebrow)',
        '.story-summary',
        '.story-copy > p:not(.eyebrow):not(.story-summary)',
        '#about > p',
        '.contact-grid p',
      ];
      return [...document.querySelectorAll(selectors.join(','))]
        .map((element) => element.textContent)
        .join(' ')
        .trim()
        .split(/\s+/).length;
    });
    await page.locator('#stories').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'artifacts/final-stories.png' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'artifacts/final-contact.png' });
  }
  if (width === 390 || width === 1440) {
    await page.goto('http://127.0.0.1:4322/#trace');
    const trace = page.locator('.trace');
    for (const outcome of ['success', 'invalid-key', 'empty']) {
      await trace.getByLabel('Scenario').selectOption(outcome);
      await trace
        .getByRole('button', {
          name: outcome === 'invalid-key' ? /Application API/ : /Agent context/,
        })
        .click();
      await page.locator('.trace-inspector').scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `artifacts/final-trace-${outcome}-${width}.png`,
      });
    }
    for (const slug of ['context-compiler', 'supo', 'crowsnest']) {
      await page.goto(`http://127.0.0.1:4322/work/${slug}/`, {
        waitUntil: 'networkidle',
      });
      await page.screenshot({ path: `artifacts/final-${slug}-${width}.png` });
    }
  }
  await context.close();
}
await browser.close();
await writeFile(
  'artifacts/content-metrics.json',
  JSON.stringify(metrics, null, 2),
);
console.log(metrics);
