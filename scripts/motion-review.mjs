import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const gate = process.argv[2] ?? 'final';
const base = process.env.REVIEW_URL ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch({ channel: 'msedge' });
const results = [];
await mkdir('artifacts/motion', { recursive: true });
for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({ viewport, reducedMotion });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    const states =
      gate === 'hero'
        ? [['hero', '.hero']]
        : [
            ['hero', '.hero'],
            ['trace', '#trace'],
            ['paper', '#stories'],
            ['context', '#context-compiler'],
            ['supo', '#supo'],
            ['crowsnest', '#crowsnest'],
            ['footer', '#contact'],
          ];
    for (const [name, selector] of states) {
      const target = await page
        .locator(selector)
        .evaluate(
          (element) =>
            element.getBoundingClientRect().top + window.scrollY - 100,
        );
      await page.evaluate((y) => window.scrollTo(0, y), target);
      await page.waitForTimeout(120);
      await page.screenshot({
        path: `artifacts/motion/${gate}-${name}-${viewport.width}-${reducedMotion}.png`,
      });
      // Slow, normal, rapid, then reverse. Return to the same position.
      for (const delta of [32, 96, 400, 1200, -1200, -400, -96, -32]) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(70);
      }
      await page.evaluate((y) => window.scrollTo(0, y), target);
    }
    await page.goto(base + '/#trace');
    await page.goto(base + '/work/context-compiler/');
    await page.goBack();
    await page.waitForTimeout(100);
    results.push({
      viewport,
      reducedMotion,
      errors,
      anchorRestored: page.url().endsWith('#trace'),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
    await page.close();
  }
}
await browser.close();
await writeFile(
  `artifacts/motion/${gate}-review.json`,
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (result) =>
      result.errors.length || result.overflow || !result.anchorRestored,
  )
)
  process.exitCode = 1;
