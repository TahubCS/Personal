import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'artifacts/handoff-review-captures';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. Review the Handoff Storyboard frames
await page.goto('http://127.0.0.1:4321/handoff-review', { waitUntil: 'networkidle' });

// Frame 1
const frame1 = page.locator('#held');
await frame1.scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(outDir, 'frame-01-held.png') });

// Frame 2
const frame2 = page.locator('#handoff');
await frame2.scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(outDir, 'frame-02-handoff.png') });

// Frame 3
const frame3 = page.locator('#trace-frame');
await frame3.scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(outDir, 'frame-03-trace.png') });

// 2. Review the live Homepage Hero
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'homepage-hero-scroll-0.png') });

// Scroll halfway down hero
await page.evaluate(() => window.scrollTo(0, 300));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, 'homepage-hero-scroll-300.png') });

// Scroll to exposed hold
await page.evaluate(() => window.scrollTo(0, 540));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, 'homepage-hero-scroll-540.png') });

await browser.close();
console.log('Saved handoff review and homepage hero captures to', outDir);

