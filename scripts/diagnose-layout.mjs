import { chromium, firefox } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 320, height: 844 } });
for (const route of [
  '/',
  '/work/context-compiler/',
  '/work/supo/',
  '/work/crowsnest/',
]) {
  await page.goto('http://127.0.0.1:4322' + route);
  console.log(
    route,
    await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.right > innerWidth + 1 && bounds.width > 0;
        })
        .slice(0, 15)
        .map((element) => ({
          tag: element.tagName,
          class: element.className,
          width: element.getBoundingClientRect().width,
          right: element.getBoundingClientRect().right,
        })),
    ),
  );
}
await browser.close();
try {
  const ff = await firefox.launch({
    executablePath: 'C:/Program Files/Mozilla Firefox/firefox.exe',
    timeout: 8000,
  });
  await ff.close();
  await writeFile(
    'artifacts/firefox-availability.txt',
    'Installed Firefox automation launch succeeded.',
  );
} catch (error) {
  await writeFile('artifacts/firefox-availability.txt', String(error));
  console.log('Firefox automation unavailable:', String(error).slice(0, 300));
}
