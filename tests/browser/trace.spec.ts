import { test, expect } from '@playwright/test';

test('manual navigation, outcome boundaries, and reset work', async ({
  page,
}) => {
  await page.goto('/#trace');
  const trace = page.locator('.trace');
  await expect(
    trace.getByRole('button', { name: 'Trace a request' }),
  ).toBeEnabled();
  await trace.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(trace.getByRole('heading')).toHaveText('Call the tool');
  await trace.getByLabel('Scenario').selectOption('invalid-key');
  await trace.getByRole('button', { name: /Application API/ }).click();
  await expect(trace.getByRole('heading')).toHaveText('Request rejected.');
  await expect(trace.getByRole('button', { name: /Python/ })).toBeDisabled();
  await trace.getByLabel('Scenario').selectOption('empty');
  await trace.getByRole('button', { name: /Agent context/ }).click();
  await expect(trace.getByRole('heading')).toHaveText('No indexed matches.');
  await trace.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(trace).toHaveAttribute('data-status', 'ready');
});

test('playback pauses offscreen and resumes without external requests', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4321'))
      external.push(request.url());
  });
  await page.goto('/#trace');
  const trace = page.locator('.trace');
  await trace.getByRole('button', { name: 'Trace a request' }).click();
  await expect(trace).toHaveAttribute('data-status', 'playing');
  await trace.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(trace).toHaveAttribute('data-status', 'paused');
  await trace.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.locator('#identity').scrollIntoViewIfNeeded();
  await expect(trace).toHaveAttribute('data-status', 'paused');
  expect(external).toEqual([]);
});

test('reduced motion uses manual stepping', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#trace');
  const trace = page.locator('.trace');
  await trace.getByRole('button', { name: 'Trace a request' }).click();
  await expect(trace).toHaveAttribute('data-status', 'paused');
  await expect(trace.getByRole('status')).toContainText('Manual stepping');
});

test('the complete transcript is available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/#trace');
  await page
    .getByText('Read the complete request flow', { exact: true })
    .click();
  await expect(page.locator('.transcript li')).toHaveCount(5);
  await expect(page.locator('.transcript li').last()).toBeVisible();
  await context.close();
});
