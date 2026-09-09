import { test, expect } from '@playwright/test';

test('case-study navigation and all local destinations resolve', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((elements) =>
      elements
        .map((element) => element.getAttribute('href'))
        .filter((href): href is string => href !== null),
    );
  for (const href of new Set(links)) {
    const response = await request.get(href.split('#')[0] || '/');
    expect(response.status()).toBe(200);
  }
  await page
    .getByRole('navigation', { name: 'Selected projects' })
    .getByRole('link', { name: /Supo/ })
    .click();
  await expect(page).toHaveURL(/\/work\/supo\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Supo.');
  await page.goBack();
  await expect(page.locator('#identity')).toBeVisible();
});

test('narrow reflow and enlarged text preserve content', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const route of [
    '/',
    '/work/context-compiler/',
    '/work/supo/',
    '/work/crowsnest/',
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.addStyleTag({ content: 'body { font-size: 200%; }' });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('skip link and keyboard stage selection work', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await page.goto('/#trace');
  const stage = page
    .locator('.trace')
    .getByRole('button', { name: /Application API/ });
  await expect(stage).toBeEnabled();
  await stage.focus();
  await page.keyboard.press('Enter');
  await expect(stage).toHaveAttribute('aria-current', 'step');
});

test('forced colors retains selected stage and visible focus', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#trace');
  const stage = page
    .locator('.trace')
    .getByRole('button', { name: /Application API/ });
  await expect(stage).toBeEnabled();
  await stage.focus();
  await page.keyboard.press('Enter');
  await expect(stage).toHaveAttribute('aria-current', 'step');
  expect(
    await stage.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe('none');
});
