import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/milestone-4-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: outDir,
    size: { width: 1440, height: 900 },
  },
});

const page = await context.newPage();
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

// Smooth scroll through entire page
const totalHeight = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);

// Forward journey through hero opening, trace, portal, stories, return, about
for (let y = 0; y <= totalHeight; y += 45) {
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(600);

// Reverse journey back to top
for (let y = totalHeight; y >= 0; y -= 75) {
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(600);

await page.close();
await context.close();

const videoFiles = fs.readdirSync(outDir).filter((f) => f.endsWith('.webm'));
if (videoFiles.length > 0) {
  const latestVideo = videoFiles[videoFiles.length - 1];
  const targetName = path.join(outDir, 'milestone-4-full-journey.webm');
  if (latestVideo !== 'milestone-4-full-journey.webm') {
    fs.renameSync(path.join(outDir, latestVideo), targetName);
  }
  console.log('Saved recording to:', targetName);
}

await browser.close();
console.log('Finished full journey recording.');

