import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const directory = 'artifacts/motion-lab/opening/after';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport,
    recordVideo: { dir: directory, size: viewport },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/motion-lab', {
    waitUntil: 'networkidle',
  });
  await page.locator('.lab-stage[data-ready]').waitFor();
  await page.waitForTimeout(500);
  for (const [from, to, duration, pause] of [
    [0, 0.56, 6500, 2200],
    [0.56, 0, 4000, 500],
  ]) {
    await page.evaluate(
      async ({ from, to, duration }) => {
        const runway = document.querySelector('.lab-runway');
        if (!(runway instanceof window.HTMLElement))
          throw new Error('Missing runway');
        const distance = runway.clientHeight - window.innerHeight;
        const start = window.performance.now();
        await new Promise((resolve) => {
          function tick(now) {
            const progress = Math.min(1, (now - start) / duration);
            window.scrollTo(0, (from + (to - from) * progress) * distance);
            if (progress < 1) window.requestAnimationFrame(tick);
            else resolve();
          }
          window.requestAnimationFrame(tick);
        });
      },
      { from, to, duration },
    );
    await page.waitForTimeout(pause);
  }
  await page.close();
  await page.video().saveAs(`${directory}/opening-${viewport.width}.webm`);
  await context.close();
}
await browser.close();
console.log(
  'Recorded slow opening, exposed pause and reverse traversal at 1440px and 390px.',
);
