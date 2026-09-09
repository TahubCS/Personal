import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
page.on('pageerror', (error) => console.log('PAGEERROR', error.message));
page.on('console', (message) => {
  if (message.type() === 'error') console.log('CONSOLE', message.text());
});
await page.goto('http://127.0.0.1:4321/#trace', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'artifacts/D-debug.png', fullPage: true });
console.log(await page.locator('astro-island').getAttribute('component-url'));
await browser.close();
