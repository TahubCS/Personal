import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:4322' },
  projects: [
    { name: 'Edge', use: { channel: 'msedge' } },
    { name: 'Chrome', use: { channel: 'chrome' } },
  ],
  reporter: 'list',
});
