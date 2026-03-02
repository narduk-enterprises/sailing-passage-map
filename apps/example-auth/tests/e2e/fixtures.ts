import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const HYDRATION_PATTERNS = [
  /hydration/i,
  /mismatch/i,
  /hydration node mismatch/i,
  /data-server-rendered/i,
]

/**
 * Wait for Nuxt/Vue hydration to complete.
 * After SSR, the page renders HTML but Vue event handlers aren't attached
 * until the client bundle loads and hydrates. We wait for network idle
 * (all Vite module loads settled) then a brief tick for Vue to mount.
 */
async function waitForHydration(page: Page) {
  await page.waitForLoadState('networkidle')
}

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    const consoleLogs: string[] = []
    page.on('console', (msg) => {
      consoleLogs.push(msg.text())
    })
    await use(page)
    const hydrationErrors = consoleLogs.filter((log) =>
      HYDRATION_PATTERNS.some((p) => p.test(log)),
    )
    if (hydrationErrors.length > 0) {
      throw new Error(
        `Hydration errors detected in console:\n${hydrationErrors.join('\n')}`,
      )
    }
  },
})

export { expect, waitForHydration }
