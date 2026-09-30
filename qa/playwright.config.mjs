import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 60000,
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: 'list',
});
