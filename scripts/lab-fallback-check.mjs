import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('artifacts/motion-lab', { recursive: true });

const browser = await chromium.launch({
  channel: 'msedge',
  args: ['--disable-webgl'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const messages = [];
page.on('console', (message) => {
  if (['warning', 'error'].includes(message.type()))
    messages.push({ type: message.type(), text: message.text() });
});
await page.goto('http://127.0.0.1:4321/motion-lab', {
  waitUntil: 'networkidle',
});
assert.ok(await page.locator('.lab-fallback').isVisible());
assert.equal(await page.locator('.lab-stage[data-ready]').count(), 0);
assert.equal(
  await page.locator('.lab-runway').evaluate((el) => el.clientHeight),
  844,
);
await page.screenshot({ path: 'artifacts/motion-lab/webgl-unavailable.png' });
await writeFile(
  'artifacts/motion-lab/fallback.json',
  JSON.stringify(
    { result: 'Assembled image remains visible; runway removed', messages },
    null,
    2,
  ),
);
console.log({ messages });
assert.ok(messages.every((message) => message.type !== 'error'));
await browser.close();
