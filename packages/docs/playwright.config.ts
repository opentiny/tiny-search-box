import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const port = 4174
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  testDir: './search-box',
  testMatch: '*.spec.ts',
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL: `http://127.0.0.1:${port}/`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: `pnpm docs:dev --host 127.0.0.1 --port ${port}`,
    cwd: __dirname,
    port,
    timeout: 120_000,
    reuseExistingServer: false,
    env: {
      ...process.env,
      VITE_BASE_URL: '/'
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
