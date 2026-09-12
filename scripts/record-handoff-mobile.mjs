import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/mobile-handoff-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir: outDir, size: { width: 390, height: 844 } }
});

const page = await context.newPage();
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const targetY = 1800;
const steps = 80;
for (let i = 1; i <= steps; i++) {
  const y = Math.round((targetY * i) / steps);
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(800);

for (let i = steps - 1; i >= 0; i--) {
  const y = Math.round((targetY * i) / steps);
  await page.evaluate((pos) => window.scrollTo(0, pos), y);
  await page.waitForTimeout(30);
}
await page.waitForTimeout(800);

await page.close();
await context.close();
await browser.close();

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
if (files.length > 0) {
  const latest = files.sort((a, b) => fs.statSync(path.join(outDir, b)).mtimeMs - fs.statSync(path.join(outDir, a)).mtimeMs)[0];
  const dest = path.join(outDir, 'mobile-handoff-scroll.webm');
  if (path.join(outDir, latest) !== dest) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    fs.renameSync(path.join(outDir, latest), dest);
  }
  console.log('Saved mobile video to', dest);
}
