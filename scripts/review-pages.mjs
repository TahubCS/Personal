import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const milestone = process.argv[2] ?? 'E';
const base = process.env.REVIEW_URL ?? 'http://127.0.0.1:4321';
const widths = milestone.startsWith('motion')
  ? [320, 390, 768, 1440]
  : milestone === 'F'
    ? [320, 390, 768, 1024, 1440]
    : [390, 1440];
const paths = [
  '/',
  '/work/context-compiler/',
  '/work/supo/',
  '/work/crowsnest/',
];
const browser = await chromium.launch({ channel: 'msedge' });
const results = [];
await mkdir('artifacts', { recursive: true });

for (const path of paths) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: {
        width,
        height: width < 768 ? 844 : width === 768 ? 1024 : 900,
      },
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(base + path, { waitUntil: 'networkidle' });
    if (path === '/') {
      await page.locator('#trace').scrollIntoViewIfNeeded();
      await page
        .locator('.trace')
        .getByRole('button', { name: 'Trace a request' })
        .waitFor();
    }
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    await page.evaluate(() => window.scrollTo(0, 0));
    const slug = path === '/' ? 'home' : path.split('/')[2];
    await page.screenshot({
      path: `artifacts/${milestone}-${slug}-${width}.png`,
      fullPage: true,
    });
    results.push({
      path,
      width,
      status: response.status(),
      errors,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      violations: audit.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
    await context.close();
  }
}
await browser.close();
await writeFile(
  `artifacts/${milestone}-pages.json`,
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (r) =>
      r.status !== 200 || r.errors.length || r.overflow || r.violations.length,
  )
)
  process.exitCode = 1;
