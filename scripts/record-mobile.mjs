import { chromium } from '@playwright/test';

const directory = 'artifacts/motion-lab';
const base = 'http://127.0.0.1:4321/motion-lab';

async function animateScroll(page, from, to, duration) {
  await page.evaluate(
    async ({ from, to, duration }) => {
      const runway = document.querySelector('.lab-runway');
      const length = runway.clientHeight - window.innerHeight;
      const start = window.performance.now();
      await new Promise((resolve) => {
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          window.scrollTo(0, (from + (to - from) * p) * length);
          if (p < 1) window.requestAnimationFrame(tick);
          else resolve();
        }
        window.requestAnimationFrame(tick);
      });
    },
    { from, to, duration },
  );
  await page.waitForTimeout(100);
}

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir: directory, size: { width: 390, height: 844 } },
});
const page = await context.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.locator('.lab-stage[data-ready]').waitFor();
await page.waitForTimeout(500);
await animateScroll(page, 0, 0.5, 3000);
await page.waitForTimeout(700);
await animateScroll(page, 0.5, 1, 3000);
await page.waitForTimeout(900);
await animateScroll(page, 1, 0, 2500);
await page.waitForTimeout(500);
await page.close();
await page.video().saveAs(`${directory}/system-core-mobile.webm`);
await context.close();
await browser.close();
console.log('Recorded mobile video to system-core-mobile.webm');
