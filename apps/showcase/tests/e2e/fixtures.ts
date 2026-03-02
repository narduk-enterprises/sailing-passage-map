import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const HYDRATION_PATTERNS = [
  /hydration/i,
  /mismatch/i,
  /hydration node mismatch/i,
  /data-server-rendered/i,
]

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

export { expect }
