import { test, expect } from '@playwright/test';

test('identity and real GitHub destination are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Muhammad',
  );
  await expect(
    page.getByRole('link', { name: 'Connect on GitHub' }),
  ).toHaveAttribute('href', 'https://github.com/TahubCS');
  await page.getByRole('link', { name: 'Explore my work' }).click();
  await expect(page).toHaveURL(/#work$/);
});

test('mobile menu supports Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.mobile-nav');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(menu.locator('summary')).toBeFocused();
});

test('essential content and native menu work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('.mobile-nav summary').click();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();
  await context.close();
});
