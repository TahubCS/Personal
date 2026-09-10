import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'msedge' });
for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  const page = await browser.newPage({ viewport });
  await page.goto('http://127.0.0.1:4322/', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `artifacts/motion/final-hero-${viewport.width}.png`,
  });
  for (const [name, selector] of [
    ['artifact', '.system-artifact'],
    ['paper', '.paper-portal'],
    ['context', '#context-compiler'],
    ['supo', '#supo'],
    ['crowsnest', '#crowsnest'],
    ['footer', '#contact'],
  ]) {
    await page
      .locator(selector)
      .evaluate((e) =>
        window.scrollTo(
          0,
          e.getBoundingClientRect().top + window.scrollY - 100,
        ),
      );
    await page.waitForTimeout(150);
    await page.screenshot({
      path: `artifacts/motion/final-${name}-${viewport.width}.png`,
    });
  }
  await page.goto('http://127.0.0.1:4322/#trace');
  const trace = page.locator('.trace');
  for (const stage of [1, 2, 3, 4, 5]) {
    await trace
      .locator('.stage')
      .nth(stage - 1)
      .click();
    await page
      .locator('.request-artifact')
      .evaluate((e) =>
        window.scrollTo(
          0,
          e.getBoundingClientRect().top + window.scrollY - 120,
        ),
      );
    await page.waitForTimeout(360);
    await page.screenshot({
      path: `artifacts/motion/final-trace-${stage}-${viewport.width}.png`,
    });
  }
  for (const slug of ['context-compiler', 'supo', 'crowsnest']) {
    await page.goto(`http://127.0.0.1:4322/work/${slug}/`, {
      waitUntil: 'networkidle',
    });
    await page.screenshot({
      path: `artifacts/motion/final-case-${slug}-${viewport.width}.png`,
    });
  }
  await page.close();
}
await browser.close();
console.log('Final screenshots saved for all three major viewports.');
