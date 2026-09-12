import { test, expect, type Page } from '@playwright/test';

test('the paper reveal follows position and returns to its previous shape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  const portal = page.locator('.paper-portal');
  const origin = await portal.evaluate(
    (e) => e.getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate((y) => window.scrollTo(0, y), origin - 800);
  await expect
    .poll(() =>
      portal.evaluate((e) => Number(e.style.getPropertyValue('--progress'))),
    )
    .toBeGreaterThan(0);
  const before = await page
    .locator('.portal-sheet')
    .evaluate((e) => getComputedStyle(e).clipPath);
  await page.evaluate((y) => window.scrollTo(0, y), origin - 100);
  await expect
    .poll(() =>
      page
        .locator('.portal-sheet')
        .evaluate((e) => getComputedStyle(e).clipPath),
    )
    .not.toBe(before);
  await page.evaluate((y) => window.scrollTo(0, y), origin - 800);
  await expect
    .poll(() =>
      page
        .locator('.portal-sheet')
        .evaluate((e) => getComputedStyle(e).clipPath),
    )
    .toBe(before);
});

test('mobile case-study artifacts follow a full-width introduction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['context-compiler', 'supo', 'crowsnest']) {
    await page.goto(`/work/${slug}/`);
    const intro = await page.locator('.case-intro').boundingBox();
    const artifact = await page.locator('.case-artifact').boundingBox();
    expect(intro!.width).toBeGreaterThan(330);
    expect(artifact!.y).toBeGreaterThanOrEqual(intro!.y + intro!.height);
  }
});

async function scrollTrace(page: Page, progress: number) {
  await page.locator('.trace-runway').evaluate((element, progress) => {
    const trace = element.querySelector<HTMLElement>('.trace');
    if (!trace) throw new Error('Trace missing');
    window.scrollTo(
      0,
      element.getBoundingClientRect().top +
        window.scrollY -
        100 +
        progress * (element.clientHeight - trace.offsetHeight),
    );
  }, progress);
}

test('desktop scroll transforms the request and reverses without leaving the sticky frame', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#trace');
  await expect(page.locator('.trace-runway')).toHaveAttribute(
    'data-fits',
    'true',
  );
  for (const [progress, step] of [
    [0, 0],
    [0.2, 1],
    [0.4, 2],
    [0.55, 3],
    [0.72, 4],
    [1, 5],
    [0.4, 2],
    [0, 0],
  ]) {
    await scrollTrace(page, progress!);
    await expect(page.locator('.trace')).toHaveAttribute(
      'data-step',
      String(step),
    );
    const bounds = await page.locator('.trace').boundingBox();
    expect(bounds?.y).toBeCloseTo(100, 0);
  }
});

test('manual selection freezes scroll ownership and Follow scroll reattaches', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#trace');
  await expect(page.locator('.trace-runway')).toHaveAttribute(
    'data-fits',
    'true',
  );
  await scrollTrace(page, 0.55);
  const trace = page.locator('.trace');
  await trace.getByRole('button', { name: /Application API/ }).click();
  await scrollTrace(page, 1);
  await expect(trace).toHaveAttribute('data-step', '2');
  await expect(trace).toHaveAttribute('data-source', 'manual');
  await trace
    .getByRole('button', { name: 'Follow scroll', exact: true })
    .click();
  await expect(trace).toHaveAttribute('data-step', '5');
  await trace.getByLabel('Scenario').selectOption('invalid-key');
  await trace
    .getByRole('button', { name: 'Follow scroll', exact: true })
    .click();
  await expect(trace).toHaveAttribute('data-step', '2');
  await expect(trace.getByRole('heading')).toHaveText('Request rejected.');
});

test('accessible headings retain complete words and stage selection is announced', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Muhammad Tahub Khatri', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Curious about what happens underneath',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: "Let's build something useful",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto('/#trace');
  const stage = page
    .locator('.trace')
    .getByRole('button', { name: /PostgreSQL/ });
  await stage.click();
  await expect(stage).toHaveAttribute('aria-current', 'step');
});

test('reduced motion has no runway and every stage explanation is visible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#trace');
  const details = page.locator('.stage-detail');
  await expect(details).toHaveCount(5);
  for (const detail of await details.all()) await expect(detail).toBeVisible();
  expect(
    await page.locator('.trace').evaluate((e) => getComputedStyle(e).position),
  ).toBe('static');
  await page.mouse.wheel(0, 1000);
  await expect(page.locator('.trace')).toHaveAttribute('data-step', '0');
});

test('mobile controls have 44px targets and large text disables unsafe pinning', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#trace');
  for (const control of await page
    .locator('.trace button, .trace select')
    .all()) {
    if (!(await control.isVisible())) continue;
    const bounds = await control.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#trace');
  await expect(page.locator('.trace-runway')).toHaveAttribute(
    'data-fits',
    'true',
  );
  // Emulate text-only enlargement of every rendered font, including px rules.
  await page.evaluate(() => {
    const sizes = [...document.querySelectorAll<HTMLElement>('body *')].map(
      (e) => [e, parseFloat(getComputedStyle(e).fontSize)] as const,
    );
    sizes.forEach(([e, size]) => (e.style.fontSize = `${size * 2}px`));
  });
  await expect(page.locator('.trace-runway')).toHaveAttribute(
    'data-fits',
    'false',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
