import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/desktop-handoff-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('Navigating to live homepage...');
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const scrollPositions = [
  { y: 0, label: '01-hero-assembled' },
  { y: 300, label: '02-hero-opening' },
  { y: 540, label: '03-hero-exposed-hold' },
  { y: 700, label: '04-core-departing-projects' },
  { y: 850, label: '05-handoff-frame' },
  { y: 1050, label: '06-handoff-settling' },
  { y: 1250, label: '07-trace-request-001' },
  { y: 1500, label: '08-trace-stages-progressing' },
];

for (const step of scrollPositions) {
  await page.evaluate((pos) => window.scrollTo(0, pos), step.y);
  await page.waitForTimeout(400);
  const file = path.join(outDir, step.label + '.png');
  await page.screenshot({ path: file });
  console.log('Captured ' + step.label + ' at y=' + step.y);
}

console.log('Testing reverse scroll back to top...');
await page.evaluate(() => window.scrollTo(0, 540));
await page.waitForTimeout(300);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, '09-reverse-scroll-top.png') });

const handoffQuestion = await page.locator('.handoff-question').isVisible();
const thread = await page.locator('.handoff-question .thread').isVisible();
const heroCore = await page.locator('.hero-core').isVisible();
const trace = await page.locator('.trace').isVisible();

console.log('Verification checks:', {
  handoffQuestion,
  thread,
  heroCore,
  trace,
});

await browser.close();
console.log('Finished capturing desktop handoff verification images.');
