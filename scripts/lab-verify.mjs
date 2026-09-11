import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://127.0.0.1:4321/motion-lab';
const directory = 'artifacts/motion-lab';
await mkdir(directory, { recursive: true });
const results = [];
const errors = [];
const viewports = [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

async function moveTo(page, progress) {
  await page.locator('.lab-runway').evaluate((element, value) => {
    window.scrollTo(0, value * (element.clientHeight - window.innerHeight));
  }, progress);
  await page.waitForTimeout(90);
}

async function animateScroll(page, from, to, duration) {
  await page.evaluate(
    async ({ from, to, duration }) => {
      const runway = document.querySelector('.lab-runway');
      if (!(runway instanceof window.HTMLElement))
        throw new Error('Missing runway');
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

for (const channel of ['msedge', 'chrome']) {
  const browser = await chromium.launch({ channel });
  for (const viewport of channel === 'msedge' ? viewports : [viewports[3]]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('pageerror', (error) =>
      errors.push(`${channel}/${viewport.width}: ${error.message}`),
    );
    page.on('console', (message) => {
      if (message.type() === 'error')
        errors.push(`${channel}/${viewport.width}: ${message.text()}`);
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.lab-stage[data-ready]').waitFor();
    assert.equal(
      (await page.locator('h1').innerText()).replace(/\s+/g, ' '),
      'What happens underneath.',
    );
    const axe = [];
    for (const p of [0, 0.25, 0.5, 0.75, 1]) {
      await moveTo(page, p);
      const actual = Number(
        await page.locator('.lab-stage').getAttribute('data-progress'),
      );
      assert.ok(
        Math.abs(actual - p) < 0.002,
        `Progress mismatch ${actual}/${p}`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
      );
      await page.screenshot({
        path: `${directory}/${channel}-${viewport.width}-${p * 100}.png`,
      });
      if ([0, 0.75, 1].includes(p)) {
        const report = await new AxeBuilder({ page }).analyze();
        axe.push({
          progress: p,
          violations: report.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
    }
    await animateScroll(page, 0, 0.55, 1800);
    const interrupted = await page.screenshot();
    await page.waitForTimeout(350);
    assert.ok(
      interrupted.equals(await page.screenshot()),
      'Stopped pose changed without scrolling',
    );
    await animateScroll(page, 0.55, 1, 450);
    await animateScroll(page, 1, 0.55, 600);
    assert.ok(
      interrupted.equals(await page.screenshot()),
      'Reverse scroll did not restore the same pose',
    );
    await moveTo(page, 0);
    await page.mouse.wheel(0, 9000);
    await page.waitForTimeout(250);
    assert.ok(await page.locator('#after-core').isVisible());
    await page.keyboard.press('Control+Home');
    await page.waitForTimeout(100);
    await page.keyboard.press('Tab');
    assert.equal(
      await page.locator(':focus').innerText(),
      'Skip the motion study',
    );
    await page.keyboard.press('Enter');
    assert.ok(page.url().endsWith('#after-core'));
    await page.goBack();
    await page.waitForTimeout(120);
    await page.goto(`${base}#after-core`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    console.log(
      'anchor',
      viewport.width,
      await page.locator('#after-core').evaluate((el) => ({
        top: el.getBoundingClientRect().top,
        scroll: window.scrollY,
        height: window.innerHeight,
        hash: window.location.hash,
      })),
    );
    assert.ok(
      await page
        .locator('#after-core')
        .evaluate((el) => el.getBoundingClientRect().top < window.innerHeight),
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.lab-stage[data-ready]').waitFor();
    assert.equal(
      await page.locator('.lab-stage').getAttribute('data-progress'),
      '1.0000',
    );
    assert.equal(
      await page
        .locator('.lab-stage')
        .evaluate((el) => window.getComputedStyle(el).position),
      'relative',
    );
    assert.ok(
      await page
        .locator('.lab-runway')
        .evaluate((el) => el.clientHeight <= window.innerHeight + 1),
    );
    await page.screenshot({
      path: `${directory}/${channel}-${viewport.width}-reduced.png`,
    });
    const reducedAxe = await new AxeBuilder({ page }).analyze();
    axe.push({
      mode: 'reduced',
      violations: reducedAxe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
      })),
    });
    results.push({
      channel,
      viewport,
      axe,
      scroll: 'slow / normal / fast / reverse / interrupted passed',
      keyboard: 'skip / direct anchor / Back executed',
      reduced: 'static drawing; no long runway',
    });
    await context.close();
  }
  const fallback = await browser.newPage({
    viewport: viewports[1],
    javaScriptEnabled: false,
  });
  await fallback.goto(base);
  assert.ok(await fallback.locator('.lab-fallback').isVisible());
  assert.equal(await fallback.locator('canvas').count(), 0);
  await fallback.screenshot({
    path: `${directory}/${channel}-no-javascript.png`,
  });
  await fallback.close();
  await browser.close();
}
await writeFile(
  `${directory}/verification.json`,
  JSON.stringify({ results, errors }, null, 2),
);
console.log(JSON.stringify({ results, errors }, null, 2));
assert.deepEqual(errors, []);
assert.ok(
  results.every((result) =>
    result.axe.every((audit) => audit.violations.length === 0),
  ),
  'Accessibility violations found',
);

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: directory, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.locator('.lab-stage[data-ready]').waitFor();
await page.waitForTimeout(500);
await animateScroll(page, 0, 0.5, 3200);
await page.waitForTimeout(700);
await animateScroll(page, 0.5, 1, 3200);
await page.waitForTimeout(800);
await animateScroll(page, 1, 0, 2300);
await page.waitForTimeout(500);
await page.close();
await page.video().saveAs(`${directory}/system-core-scroll.webm`);
await context.close();
await browser.close();
console.log(
  'Recorded forward, interrupted, and reverse scroll to system-core-scroll.webm',
);
