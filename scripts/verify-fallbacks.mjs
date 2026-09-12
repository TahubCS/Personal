import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'fs';

const outDir = 'artifacts/milestone-5-fallbacks';
fs.mkdirSync(outDir, { recursive: true });

console.log('--- 1. Testing WebGL Disabled ---');
{
  const browser = await chromium.launch({
    channel: 'msedge',
    args: ['--disable-webgl'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const messages = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') messages.push(msg.text());
  });

  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  
  const fallback = page.locator('.hero-core img');
  assert.ok(await fallback.isVisible(), 'Static WebP poster must be visible when WebGL is disabled');
  
  const canvasCount = await page.locator('.hero-core canvas').count();
  assert.equal(canvasCount, 0, 'Canvas must not exist when WebGL is unavailable');
  
  await page.screenshot({ path: `${outDir}/webgl-disabled.png` });
  console.log('WebGL-disabled check passed! Errors:', messages.length);
  await browser.close();
}

console.log('--- 2. Testing JavaScript Disabled ---');
{
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });

  assert.ok(await page.locator('#identity').isVisible(), 'Identity must be visible without JS');
  assert.ok(await page.locator('.hero-core img').isVisible(), 'Poster must be visible without JS');
  assert.ok(await page.locator('details.transcript').isVisible(), 'Static transcript details must be visible without JS');
  assert.ok(await page.locator('#stories').isVisible(), 'Project stories must be visible without JS');

  await page.screenshot({ path: `${outDir}/no-javascript.png`, fullPage: true });
  console.log('No-JS check passed!');
  await browser.close();
}

console.log('--- 3. Testing Reduced Motion ---');
{
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });

  const canvasCount = await page.locator('.hero-core canvas').count();
  assert.equal(canvasCount, 0, 'Canvas must not be created under prefers-reduced-motion: reduce');

  const portalSheetClip = await page.locator('.portal-sheet').evaluate((e) => window.getComputedStyle(e).clipPath);
  assert.equal(portalSheetClip, 'none', 'Portal sheet clip-path must be none under reduced motion');

  await page.screenshot({ path: `${outDir}/reduced-motion.png` });
  console.log('Reduced motion check passed!');
  await browser.close();
}

console.log('All fallback resilience checks passed successfully!');
