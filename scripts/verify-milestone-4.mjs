import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/milestone-4-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });

// 1. Desktop Journey
console.log('--- Verifying Desktop (1440x900) ---');
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Track CLS
await page.evaluate(() => {
  window.__cls = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        window.__cls += entry.value;
      }
    }
  }).observe({ type: 'layout-shift', buffered: true });
});

const desktopSteps = [
  { y: 0, label: '01-hero-assembled' },
  { y: 300, label: '02-hero-opening' },
  { y: 540, label: '03-hero-exposed-hold' },
  { y: 850, label: '04-handoff-to-trace' },
  { y: 1500, label: '05-trace-pipeline' },
  { y: 3200, label: '06-approaching-paper-portal' },
  { y: 3450, label: '07-portal-unfolding' },
  { y: 3650, label: '08-portal-full-paper' },
  { y: 4100, label: '09-stories-warm-paper' },
  { y: 6750, label: '10-return-portal-wipe' },
  { y: 7150, label: '11-about-dark-reflection' },
];

for (const step of desktopSteps) {
  await page.evaluate((pos) => window.scrollTo(0, pos), step.y);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, `${step.label}.png`) });
  console.log(`Captured ${step.label} at y=${step.y}`);
}

// Reverse scroll verification
console.log('Testing reverse scroll back up...');
await page.evaluate(() => window.scrollTo(0, 3650));
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, '12-reverse-portal-paper.png') });

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, '13-reverse-hero-top.png') });

const cls = await page.evaluate(() => window.__cls);
console.log('Desktop Cumulative Layout Shift (CLS):', cls);

await page.close();

// 2. Tablet Journey (768x1024)
console.log('--- Verifying Tablet (768x1024) ---');
const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
await tabletPage.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await tabletPage.evaluate(() => document.fonts.ready);

const tabletOverflow = await tabletPage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log('Tablet horizontal overflow (px):', tabletOverflow);

await tabletPage.evaluate(() => {
  const portal = document.querySelector('.paper-portal');
  if (portal) portal.scrollIntoView({ block: 'center' });
});
await tabletPage.waitForTimeout(300);
await tabletPage.screenshot({ path: path.join(outDir, 'tablet-portal.png') });

await tabletPage.evaluate(() => {
  const ret = document.querySelector('.return-portal');
  if (ret) ret.scrollIntoView({ block: 'center' });
});
await tabletPage.waitForTimeout(300);
await tabletPage.screenshot({ path: path.join(outDir, 'tablet-return.png') });
await tabletPage.close();

// 3. Mobile Journey (390x844)
console.log('--- Verifying Mobile (390x844) ---');
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await mobilePage.evaluate(() => document.fonts.ready);

const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log('Mobile 390px horizontal overflow (px):', mobileOverflow);

await mobilePage.evaluate(() => {
  const portal = document.querySelector('.paper-portal');
  if (portal) portal.scrollIntoView({ block: 'center' });
});
await mobilePage.waitForTimeout(300);
await mobilePage.screenshot({ path: path.join(outDir, 'mobile-390-portal.png') });

await mobilePage.evaluate(() => {
  const ret = document.querySelector('.return-portal');
  if (ret) ret.scrollIntoView({ block: 'center' });
});
await mobilePage.waitForTimeout(300);
await mobilePage.screenshot({ path: path.join(outDir, 'mobile-390-return.png') });
await mobilePage.close();

// 4. Ultra-Narrow Reflow (320x740)
console.log('--- Verifying Ultra-Narrow (320x740) ---');
const narrowPage = await browser.newPage({ viewport: { width: 320, height: 740 } });
await narrowPage.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await narrowPage.evaluate(() => document.fonts.ready);

const narrowOverflow = await narrowPage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log('Narrow 320px horizontal overflow (px):', narrowOverflow);

await narrowPage.evaluate(() => {
  const portal = document.querySelector('.paper-portal');
  if (portal) portal.scrollIntoView({ block: 'center' });
});
await narrowPage.waitForTimeout(300);
await narrowPage.screenshot({ path: path.join(outDir, 'narrow-320-portal.png') });
await narrowPage.close();

await browser.close();
console.log('All Milestone 4 captures and measurements complete!');

