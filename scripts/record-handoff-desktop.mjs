import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/desktop-handoff-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outDir, size: { width: 1440, height: 900 } }
});

const page = await context.newPage();
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

// Smooth scroll forward: 0 -> 1600 in increments
const targetY = 1600;
const steps = 80;
for (let i = 1; i <= steps; i++) {
  const y = Math.round((targetY * i) / steps);
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(800);

// Smooth scroll backward: 1600 -> 0 in increments
for (let i = steps - 1; i >= 0; i--) {
  const y = Math.round((targetY * i) / steps);
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(30);
}
await page.waitForTimeout(800);

await page.close();
await context.close();
await browser.close();

// Find recorded video file and rename
const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
if (files.length > 0) {
  const latest = files.sort((a, b) => fs.statSync(path.join(outDir, b)).mtimeMs - fs.statSync(path.join(outDir, a)).mtimeMs)[0];
  const dest = path.join(outDir, 'desktop-handoff-scroll.webm');
  if (path.join(outDir, latest) !== dest) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    fs.renameSync(path.join(outDir, latest), dest);
  }
  console.log('Saved video to', dest);
}
